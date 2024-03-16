import express from 'express';
import { createNewDBConnection, createDataDiverDBConnection } from '../connectDB';
import { IRecordSet } from 'mssql';
import { makeOpenAIRequest } from '../connOpenAI';
import * as sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const conversationRoutes = express.Router();

export interface IServerResponse {
    message?: string,
    data?: { [key: string]: any },
    interpreted_question?: string,
    query: string,
    messageId: number, 
    hasData: boolean
}

export type IMessage = {
    messageID: number,
    chatString: string,
    timestamp: Date,
    rating: boolean | null,
    isUserMessage: boolean,
    conversationID: number
}

conversationRoutes.get('/conversations', async (req, res, next) => {
    const email = req.query.email as string;

    try {
        // Create a new DB connection
        const connection = await createDataDiverDBConnection();
       
        //Get list of conversations by email
        let conversationList = await retrieveConversationList(connection, email);
        
        res.send(conversationList);
        connection.close();
    } catch (error: any) {
        console.error(error)
        next(new Error("Failed to Create New Conversation"))
    }

});

conversationRoutes.post('/new-conversation', async (req, res, next) => {
    const { email, title } = req.body;

    try {
        // Create a new DB connection
        const connection = await createDataDiverDBConnection();
       
        //Insert new convesation into DB
        await connection.request()
            .input('email', sql.VarChar, email)
            .input('title', sql.VarChar, title)
            .input('created', sql.DateTime, new Date())
            .query('INSERT INTO [Conversations] (email, chatTitle, created) VALUES (@email, @title, @created)');


        //Get list of conversations by email
        let conversationList = await retrieveConversationList(connection, email);

        res.send(conversationList);
        connection.close();
    } catch (error: any) {
        console.error(error)
        next(new Error("Failed to Create New Conversation"))
    }
})

let retrieveConversationList = async (connection: sql.ConnectionPool, email: string) => {
    //Get list of conversations by email
    let conversationList = await connection.request()
        .input('email', sql.VarChar, email)
        .query('SELECT * FROM [Conversations] WHERE email = @email ORDER BY created DESC');

    return conversationList.recordset;
}

conversationRoutes.get('/answer', async (req, res, next) => { 
    let dbURL = req.query.dbURL as string;
    let dbName = req.query.dbName as string;
    let dbUserName = req.query.dbUserName as string;
    let dbPass = req.query.dbPass as string;
    let question = req.query.question as string;
    let conversationId = req.query.conversationId as string;
  
    try {
        const clientDBConn = await createNewDBConnection(dbURL, dbName, dbUserName, dbPass);
        // Create a new DB connection to datadiver DB
        const dataDiverDBConn = await createDataDiverDBConnection();

        //Get schema of client database
        let result = await clientDBConn.request().query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS");
        let systemPrompt = createOpenAISystemRolePrompt(parseDatabaseSchema(result.recordset));

        //Get Previous messages
        let prevMessages = await dataDiverDBConn.request()
            .input('conversationID', sql.VarChar, conversationId)
            .query('SELECT * FROM [Messages] WHERE conversationID = @conversationID');

        //Convert english to sql statement
        let openAIResponse = await makeOpenAIRequest(
            systemPrompt, 
            question, 
            prevMessages.recordset.filter(msg => msg.isUserMessage).map(msg => msg.chatString),
            prevMessages.recordset.filter(msg => !msg.isUserMessage).map(msg => msg.chatString), 
        );
        console.log("OpenAI query: ", openAIResponse.query);

        //Query client DB
        let answer = await clientDBConn.request().query(openAIResponse.query);

        //Insert messages to database
        // Insert user question to messages
        await dataDiverDBConn.request()
            .input('conversationID', sql.VarChar, conversationId)
            .input('chatString', sql.NVarChar, question)
            .input('isUserMessage', sql.Bit, 1)
            .input('timestamp', sql.DateTime, new Date())
            .query('INSERT INTO [Messages] (conversationID, chatString, isUserMessage, timestamp) VALUES (@conversationID, @chatString, @isUserMessage, @timestamp)');

        // Insert system answer to messages
        const answerMessage = await dataDiverDBConn.request()
            .input('conversationID', sql.VarChar, conversationId)
            .input('chatString', sql.NVarChar, openAIResponse.query)
            .input('isUserMessage', sql.Bit, 0)
            .input('timestamp', sql.DateTime, new Date())
            .query('INSERT INTO [Messages] (conversationID, chatString, isUserMessage, timestamp) VALUES (@conversationID, @chatString, @isUserMessage, @timestamp);SELECT @@IDENTITY AS ID;')

            // return response to user
        if(!answer.recordset || answer.recordset.length === 0) {
            res.status(404).send({message: "No results found", query: openAIResponse.query, messageId: answerMessage.recordset[0].ID})
        } else {
            let response: IServerResponse = {data: answer.recordset, query: openAIResponse.query, messageId: answerMessage.recordset[0].ID, hasData: true}

            if(openAIResponse.interpreted_question && question.toLowerCase() !== openAIResponse.interpreted_question.toLowerCase()) {
                response = {...response, interpreted_question: openAIResponse.interpreted_question}
            }

            res.send(response)
        }

        clientDBConn.close();
        dataDiverDBConn.close();
    } catch(error: any) {
        console.error(error)
        if(error.message)
            next(new Error(error.message))
        else 
            next(new Error("Failed to retrieve information from the given database"))
    }
});

conversationRoutes.get('/messages', async (req, res, next) => {
    const conversationID = req.query.conversationId as string;

    try {
        // Create a new DB connection
        const connection = await createDataDiverDBConnection();
       
        //Get list of messages by conversation ID
        let messageList = await connection.request()
            .input('conversationID', sql.Int, conversationID)
            .query('SELECT * FROM [Messages] WHERE conversationID = @conversationID ORDER BY timestamp');

        let userMessages = messageList.recordset.filter(msg => msg.isUserMessage).map(msg => msg.chatString);
        let systemMessages: IServerResponse[] = (messageList.recordset.filter(msg => !msg.isUserMessage) as IMessage[]).map(msg => {
            return {
                messageId: msg.messageID,
                query: msg.chatString,
                hasData: true
            }
        });


        res.send({userMessages: userMessages, systemMessages: systemMessages});
        connection.close();
    } catch (error: any) {
        console.error(error)
        next(new Error("Failed to Create New Conversation"))
    }

});


/**
 * 
 * @param recordSet 
 * @returns ITableSchema[]
 * 
 * Takes the record set of "SELECT * FROM INFORMATION_SCHEMA.COLUMNS" and puts it into ITableSchema form
 */
const parseDatabaseSchema = (
    recordSet: IRecordSet<{TABLE_NAME: string, COLUMN_NAME: string, DATA_TYPE: string}>
): ITableSchema[] => {
    let databaseSchema: ITableSchema[] = []
    for(let record of recordSet) {
        if(databaseSchema.length > 0 && databaseSchema[databaseSchema.length - 1].tableName === record.TABLE_NAME) {
            databaseSchema[databaseSchema.length - 1].columnNames.push({
                columnName: record.COLUMN_NAME, dataType: record.DATA_TYPE
            });
        } else {
            databaseSchema.push({
                tableName: record.TABLE_NAME, 
                columnNames: [{columnName: record.COLUMN_NAME, dataType: record.DATA_TYPE}]
            });
        }
    }

    return databaseSchema;
}

interface ITableSchema {
    tableName: string, 
    columnNames: {columnName: string, dataType: string}[]
}

/**
 * 
 * @param databaseSchema
 * @returns string for OpenAI prompt for system role  
 * 
 * Creates the start of the prompt text that includes database information. Includes information about 
 * table names, column names and their types.
 */
const createOpenAISystemRolePrompt = (databaseSchema: ITableSchema[]): string => {
    let prompt = "Given the following MSSQL tables, your job is to write queries given a user's request." +
        "The output should be presented in JSON format, including a 'query' attribute and an 'interpreted_question' attribute." + 
        "The 'interpreted_question' should mirror the original question but account for any typos through appropriate corrections.\n";

    for(let tableSchema of databaseSchema) {
        prompt += `CREATE TABLE ${tableSchema.tableName} (\n`;
        for(let column of tableSchema.columnNames) {
            prompt += " " + column.columnName + " " + column.dataType + ",\n";
        }
        prompt += ");\n\n"
    }

    return prompt;
}

export default conversationRoutes;