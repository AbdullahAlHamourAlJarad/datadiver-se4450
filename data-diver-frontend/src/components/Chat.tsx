import { Grid, IconButton, Paper, Stack, TextField, Typography, styled } from '@mui/material';
import React, { useContext, useState } from 'react'
import { ConversationContext, IServerResponse } from '../Provider'
import axios from 'axios'
import Typing from './Typing'
import InspectQuery from './InspectQuery';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import DataTable from './DataTable';
import TypoCorrection from './TypoCorrection';


type ChatProps = {
    dbURL: string
    dbName: string
    dbUsername: string
    dbPassword: string
}

const Chat = ({ dbURL, dbName, dbUsername, dbPassword }: ChatProps) => {
    const ChatBox = styled(Stack)({
        backgroundColor: '#262A38',
        height: '100%',
        alignItems: 'center',
        overflowY: 'scroll',
    })

    const UserChatBubble = styled(Paper)({
        maxWidth: '50%',
        backgroundColor: '#5A6C83',
        marginTop: '15px',
        marginLeft: 'auto',
        marginRight: '15px'
    })

    const SystemChatBubble = styled(Paper)({
        maxWidth: '50%',
        backgroundColor: '#51545F',
        marginTop: '15px',
        marginLeft: '15px',
        marginRight: 'auto',
        padding: '15px'
    })

    const ChatLine = styled(Typography)({
        maxWidth: '100%',
        color: '#DCDCDF',
        overflowWrap: 'break-word',
        padding: '7px'
    });

    const ChatFooter = styled('div')({
        textAlign: 'center',
        backgroundColor: '#262A38',
        height: '15%',
    })

    const UserInput = styled(TextField)({
        '& input': {
            color: '#DCDCDF'
        },
        '& fieldset': {
            borderColor: '#5A6C83'
        },
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: '#DCDCDF',
                borderWidth: '3px'
            },
            '& fieldset': {
                borderWidth: '2px'
            }
        },
        '& .MuiInputBase-root': {
            borderRadius: '25px',
            color: 'white'
        },
        '& .MuiInputBase-root:hover': {
            '& fieldset': {
                borderColor: '#5A6C83'
            }
        },
        '& .Mui-focused.MuiInputBase-root:hover': {
            '& fieldset': {
                borderColor: '#DCDCDF',
                borderWidth: '3px'
            }
        },
        width: '75%',
        margin: '15px'
    })

    const ChatButton = styled(IconButton)({
        marginTop: '20px',
        color: '#DCDCDF',
        '&:hover': {
            backgroundColor: '#3E4B5B'
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const {isChatLoading, currentConversationId} = useContext(ConversationContext);
    const [userMessage, setUserMessage] = useState('');
    
    const [ receivedAnswer, setReceivedAnswer ] = useState<IServerResponse | null>(null);
    const [ error, setError ] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const textField = e.currentTarget.querySelector('input') as HTMLInputElement;
        setUserMessage(textField.value)
        setIsLoading(true)

        axios.get("/conversation/answer", {
            params: {
                dbURL: dbURL,
                dbName: dbName,
                dbUserName: dbUsername,
                dbPass: dbPassword,
                question: textField.value,
                conversationId: currentConversationId,
            }
        }).then((response) => {
            console.log("Response", response)
            let serverResponse: IServerResponse = response.data;
            setReceivedAnswer(serverResponse);
        }).catch(error => {
            console.log(error.response.data)
            if(error.response.data.query) {
                setReceivedAnswer(error.response.data);
            } else {
                console.error("Error fetching data:", error);
                setError("Error Fetching Data!");
                setReceivedAnswer(null);
            }
        }).finally(() => {
            textField.value = ''
            textField.blur()
            setIsLoading(false);
        });
    }

    const handleRetry = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log("Retry")
    }

    const renderSystemChat = () => {
        if (isLoading) {
            return (
                <SystemChatBubble>
                    <ChatLine>
                        <Typing />
                    </ChatLine>
                </SystemChatBubble>
            );
        } else if (receivedAnswer) {
            let columns: GridColDef[];
            let rows: GridRowsProp;

            if(receivedAnswer.data && receivedAnswer.data.length > 0) {
                columns = Object.keys(receivedAnswer.data![0])
                    .map(col => {return {field: col, headerName: col }});
                rows = receivedAnswer.data!.map((row: any, index: number) => {
                    return {...row, id: index}
                });
            }

            return (
                <SystemChatBubble>
                    {receivedAnswer.interpreted_question && <TypoCorrection typoFix={receivedAnswer.interpreted_question} />}
                    {receivedAnswer.message}
                    {receivedAnswer.data && receivedAnswer.data.length > 0 && <DataTable columns={columns!} rows={rows!} />}
                    {receivedAnswer.query && <InspectQuery query={receivedAnswer.query}/>}
                </SystemChatBubble>
            );
        } else if(error) {
            return (
                <SystemChatBubble>
                    <ChatLine>
                        {error}
                    </ChatLine>
                </SystemChatBubble>
            );

        }

    }

    return (
        <Grid container>
            <Grid item xs={12} sx={{ height: '75vh' }}>
                <ChatBox>
                    {userMessage !== '' &&
                        <UserChatBubble>
                            <ChatLine>
                                {userMessage}
                            </ChatLine>
                        </UserChatBubble>
                    }
                    {renderSystemChat()}
                </ChatBox>
            </Grid>

            <Grid item xs={12} sx={{ height: '15vh' }}>
                <ChatFooter sx={{ height: '100%' }}>
                    <form onSubmit={handleSubmit}>
                        <ChatButton onClick={handleRetry}>
                            <ReplayRoundedIcon fontSize='large' htmlColor='#5A6C83'/>
                        </ChatButton>
                        <UserInput disabled={isLoading || isChatLoading || !currentConversationId} placeholder='Ask DataDiver a question...' />
                        <ChatButton type='submit' disabled={isLoading || isChatLoading || !currentConversationId}>
                            <SendRoundedIcon fontSize='large' htmlColor='#5A6C83'/>
                        </ChatButton>
                    </form>
                </ChatFooter>
            </Grid>
        </Grid>
    )
}

export default Chat