import express from 'express';
import { createNewDBConnection } from '../connectDB';
import { IRecordSet } from 'mssql';
import { makeOpenAIRequest } from '../connOpenAI';

const conversationRoutes = express.Router();

conversationRoutes.get('/answer', async (req, res, next) => { 
    let dbURL = req.query.dbURL as string;
    let dbName = req.query.dbName as string;
    let dbUserName = req.query.dbUserName as string;
    let dbPass = req.query.dbPass as string;
    let question = req.query.question as string;
  
    try {
        const connection = await createNewDBConnection(dbURL, dbName, dbUserName, dbPass);

        /*TODO This will be done in a different api call when user first connects and 
        the result will be stored somewhere for whenever they call the /answer api it doesn't need to redo this logic*/ 
        let result = await connection!.request().query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS");
        let systemPrompt = createOpenAISystemRolePrompt(parseDatabaseSchema(result.recordset));

        let openAIResponse = await makeOpenAIRequest(systemPrompt, question);
        console.log(openAIResponse.query);

        let answer = await connection!.request().query(openAIResponse.query);
        console.log(answer)

        if(!answer.recordset || answer.recordset.length === 0) {
            res.status(404).send("No results found")
        } else {
            res.send({data: answer.recordset, query: openAIResponse.query})
        }

        connection!.close();
    } catch(error: any) {
        console.error(error)
        if(error.message)
            next(new Error(error.message))
        else 
            next(new Error("Failed to retrieve information from the given database"))
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
    let prompt = "Given the following SQL tables, your job is to write queries given a user's request and output as JSON.\n";

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