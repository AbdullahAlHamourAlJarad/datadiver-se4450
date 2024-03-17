import React, { useContext, useState } from 'react';
import { ConversationContext, IServerResponse } from '../Provider';
import styled from '@emotion/styled';
import { Paper } from '@mui/material';
import DataTable from './DataTable';
import InspectQuery from './InspectQuery';
import TypoCorrection from './TypoCorrection';
import Typing from './Typing';
import { ChatLine, StyledButton } from './Chat';
import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import axios from 'axios';


interface SystemChatMessageProps {
    systemMessage: IServerResponse,
    isLoading: boolean,
    error?: string,
    dbURL: string,
    dbName: string,
    dbUsername: string,
    dbPassword: string,
}

const SystemChatBubble = styled(Paper)({
    maxWidth: '50%',
    backgroundColor: '#383838',
    marginTop: '15px',
    marginLeft: '15px',
    marginRight: 'auto',
    padding: '15px',
    color: '#DCDCDF',
});

const SystemChatMessage = ({ systemMessage, isLoading, error, dbURL, dbName, dbUsername, dbPassword }: SystemChatMessageProps) => {
    const [hasRegenerateData, setHasRegenerateData] = useState(systemMessage && !systemMessage.data && systemMessage.query);
    const [regenerateDataError, setRegenerateDataError] = useState<string | undefined>();
    const [isRegenerateDataLoading, setIsRegenerateDataLoading] = useState(false);
    const {setSystemMessagesList} = useContext(ConversationContext);

    const handleRegenerateDataOnClick = () => {
        setIsRegenerateDataLoading(true);
        setHasRegenerateData(false);

        axios.get("/conversation/regenerate-data", {
            params: {
                dbURL: dbURL,
                dbName: dbName,
                dbUserName: dbUsername,
                dbPass: dbPassword,
                query: systemMessage.query,
            }
        }).then((response) => {
            let serverResponse = response.data;
            setSystemMessagesList(prev => {
                const index = prev.findIndex(data => data.messageId === systemMessage.messageId);
                if (index !== -1) {
                    const updatedMessages = [...prev];
                    updatedMessages[index] = { ...updatedMessages[index], data: serverResponse };
                    return updatedMessages;
                }
                return prev; // If messageId is not found, return previous state unchanged
            });
        }).catch(error => {
            console.error("Error fetching data:", error);
            setRegenerateDataError("Error Fetching Data!");
        }).finally(() => {
            setIsRegenerateDataLoading(false);
        });
    }

    if (isLoading || isRegenerateDataLoading) {
        return (
            <SystemChatBubble>
                <ChatLine>
                    <Typing />
                </ChatLine>
            </SystemChatBubble>
        );
    } else if (error) {
        return (
            <SystemChatBubble>
                <ChatLine>
                    {error ?? "Unexpected Error"}
                </ChatLine>
            </SystemChatBubble>
        );
    } else if(systemMessage) {
        let columns: GridColDef[];
        let rows: GridRowsProp;

        if(systemMessage.data && systemMessage.data!.length > 0) {
            columns = Object.keys(systemMessage.data![0])
                .map(col => {return {field: col, headerName: col }});
            rows = systemMessage.data!.map((row: any, index: number) => {
                return {...row, id: index}
            });
        }

        return (
            <SystemChatBubble>
                {systemMessage.interpreted_question && <TypoCorrection typoFix={systemMessage.interpreted_question!} />}
                {regenerateDataError && regenerateDataError}
                {systemMessage.message}
                {systemMessage.data && systemMessage.data!.length > 0 && <DataTable columns={columns!} rows={rows!} />}
                {hasRegenerateData && 
                    <StyledButton onClick={handleRegenerateDataOnClick}>
                        <ReplayRoundedIcon fontSize='small' style={{ verticalAlign: "middle" }} htmlColor='#DCDCDF' /*or D3D3D3*//>
                        Regenerate Data
                    </StyledButton>
                }
                {systemMessage.query && <InspectQuery query={systemMessage.query}/>}
            </SystemChatBubble>
        );
    } else {
        return <></>
    }

}

export default SystemChatMessage;