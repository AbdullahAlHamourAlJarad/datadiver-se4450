import { Grid, IconButton, Paper, Stack, TextField, Typography, styled } from '@mui/material'
import React, { useContext, useState } from 'react'
import { AnswerContext } from '../Provider'
import axios from 'axios'
import Typing from './Typing'

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
        marginRight: 'auto'
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
    })

    const [isLoading, setIsLoading] = useState(false)
    const [userMessage, setUserMessage] = useState('')
    const { receivedAnswer, setReceivedAnswer } = useContext(AnswerContext)

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
        }).then((data) => {
            console.log(data.data)
            setReceivedAnswer(JSON.stringify(data.data.data));
            /*TODO put values as a table. data.data.data will return a list. data.data.query will contain the query used 
            Create a for loop that loops over keys of the any element to get column names and then populate the table with 
            all the elements in the list*/
        }).catch(err => {
            console.log(err);
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
        if(isLoading) {
            return (
                <SystemChatBubble>
                    <ChatLine>
                        <Typing />
                    </ChatLine>
                </SystemChatBubble>
            );
        } else if(receivedAnswer) {
            return (
                <SystemChatBubble>
                    <ChatLine>
                        {receivedAnswer}
                    </ChatLine>
                </SystemChatBubble>
            );
        } 

        return(<></>);
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
                    { renderSystemChat() }
                </ChatBox>
            </Grid>

            <Grid item xs={12} sx={{ height: '15vh' }}>
                <ChatFooter sx={{ height: '100%' }}>
                    <form onSubmit={handleSubmit}>
                        <ChatButton onClick={handleRetry}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="30px"
                                width="30px"
                                viewBox="-3 -3 28 28"
                                fill="#5A6C83">
                                <path d="M18.885 3.515c-4.617-4.618-12.056-4.676-16.756-.195l-2.129-2.258v7.938h7.484l-2.066-2.191c2.82-2.706 7.297-2.676 10.073.1 4.341 4.341 1.737 12.291-5.491 12.291v4.8c3.708 0 6.614-1.244 8.885-3.515 4.686-4.686 4.686-12.284 0-16.97z" />
                            </svg>
                        </ChatButton>
                        <UserInput disabled={isLoading} placeholder='Ask DataDiver a question...' />
                        <ChatButton type='submit' disabled={isLoading}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="30px"
                                width="30px"
                                viewBox="0 0 23 23"
                                fill="#5A6C83">
                                <path d="M3.4 20.4l17.45-7.48c.81-.35.81-1.49 0-1.84L3.4 3.6c-.66-.29-1.39.2-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
                            </svg>
                        </ChatButton>
                    </form>
                </ChatFooter>
            </Grid>
        </Grid>
    )
}

export default Chat