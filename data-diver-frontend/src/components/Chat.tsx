import { Grid, IconButton, Paper, Stack, TextField, Typography, styled } from '@mui/material';
import React, { useContext, useMemo, useState } from 'react'
import { AnswerContext } from '../Provider'
import axios from 'axios'
import Typing from './Typing'
import InspectQuery from './InspectQuery';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import DataTable from './DataTable';


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
    })

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
    const [userMessage, setUserMessage] = useState('');
    const [receivedAnswerQuery, setReceivedAnswerQuery] = useState("");
    const { receivedAnswer, setReceivedAnswer } = useContext(AnswerContext); //TODO Refactor

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
            }
        }).then((response) => {
            if (response.data.data.length > 0) {
                setReceivedAnswer(response.data.data);
            } else {
                setReceivedAnswer("No data available");
            }

            setReceivedAnswerQuery(response.data.query)
        }).catch(error => {
            console.error("Error fetching data:", error);
            setReceivedAnswer("Error Fetching Data!");
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
        } else if (receivedAnswer && typeof(receivedAnswer) !== "string") {
            const columns: GridColDef[] = Object.keys(receivedAnswer[0])
                .map(col => {return {field: col, headerName: col }});
            const rows: GridRowsProp = receivedAnswer.map((row: any, index: number) => {
                return {...row, id: index}
            });

            return (
                <SystemChatBubble>
                    <DataTable columns={columns} rows={rows} />
                    <InspectQuery query={receivedAnswerQuery}/>
                </SystemChatBubble>
            );
        } else if(receivedAnswer && typeof(receivedAnswer) === "string") {
            return (
                <SystemChatBubble>
                    <ChatLine>
                        {receivedAnswer}
                        <InspectQuery query={receivedAnswerQuery}/>
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
                        <UserInput disabled={isLoading} placeholder='Ask DataDiver a question...' />
                        <ChatButton type='submit' disabled={isLoading}>
                            <SendRoundedIcon fontSize='large' htmlColor='#5A6C83'/>
                        </ChatButton>
                    </form>
                </ChatFooter>
            </Grid>
        </Grid>
    )
}

export default Chat