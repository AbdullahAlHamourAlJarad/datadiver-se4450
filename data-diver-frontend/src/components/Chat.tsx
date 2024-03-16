import { Grid, IconButton, Paper, Stack, TextField, Typography, styled } from '@mui/material';
import React, { useContext, useState } from 'react'
import { AnswerContext } from '../Provider'
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
        backgroundColor: '#161616',
        height: '100%',
        alignItems: 'center',
        overflowY: 'scroll',
    })

    const UserChatBubble = styled(Paper)({
        maxWidth: '50%',
        backgroundColor: '#262626',
        marginTop: '15px',
        marginLeft: 'auto',
        marginRight: '15px'
    })

    const SystemChatBubble = styled(Paper)({
        maxWidth: '50%',
        backgroundColor: '#383838',
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
        backgroundColor: '#161616'
    })

    const UserInput = styled(TextField)({
        '& input': {
            color: '#DCDCDF',
        },
        '& .MuiInputBase-root': {
            borderRadius: '20px'
        },
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: '#DCDCDF',
                borderWidth: '3px'
            },
            '& fieldset': {
                borderColor: '#383838',
                borderWidth: '1.5px'
            }
        },
        '& .MuiInputBase-root:hover': {
            '& fieldset': {
                borderColor: '#383838',
                borderWidth: '3px'
            }
        },
        '& .Mui-focused.MuiInputBase-root:hover': {
            '& fieldset': {
                borderColor: '#FFFFFF',
                borderWidth: '3px'
            }
        },
        width: '70%',
        margin: '15px'
    })

    const ChatButton = styled(IconButton)({
        marginTop: '20px',
        color: 'rgba(255, 255, 255, 1)',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const [receivedAnswerQuery, setReceivedAnswerQuery] = useState("");
    const [receivedInterpretedQuestion, setReceivedInterpretedQuestion] = useState<string | undefined>(undefined);
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

            setReceivedAnswerQuery(response.data.query);
            setReceivedInterpretedQuestion(response.data.interpreted_question);
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
                    {receivedInterpretedQuestion && <TypoCorrection typoFix={receivedInterpretedQuestion} />}
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
            <Grid item xs={12} sx={{ height: '74.2vh' }}>
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
                            <ReplayRoundedIcon fontSize='large' htmlColor='#DCDCDF'/>
                        </ChatButton>
                        <UserInput disabled={isLoading} placeholder='Ask DataDiver a question...' />
                        <ChatButton type='submit' disabled={isLoading}>
                            <SendRoundedIcon fontSize='large' htmlColor='#DCDCDF'/>
                        </ChatButton>
                    </form>
                </ChatFooter>
            </Grid>
        </Grid>
    )
}

export default Chat