import { Grid, IconButton, Paper, Stack, TextField, Typography, styled } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ConversationContext, IServerResponse } from '../Provider';
import axios from 'axios';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SystemChatMessage from './SystemChatMessage';


type ChatProps = {
    dbURL: string
    dbName: string
    dbUsername: string
    dbPassword: string
}

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

export const ChatLine = styled(Typography)({
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

export const StyledButton = styled("button")({
    backgroundColor: "inherit", 
    color: "#D3D3D3", 
    margin: "0 auto", 
    marginTop: "10px", 
    display: "block"
});

const Chat = ({ dbURL, dbName, dbUsername, dbPassword }: ChatProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const {userMessagesList, setUserMessagesList, systemMessagesList, setSystemMessagesList, isChatLoading, currentConversationId} = useContext(ConversationContext);
    const chatContainerRef = useRef<HTMLInputElement>(null);

    const [ error, setError ] = useState<string | undefined>(undefined);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const textField = e.currentTarget.querySelector('input') as HTMLInputElement;
        setUserMessagesList(prev => {
            let temp = prev;
            temp.push(textField.value);
            return temp;
        });
        setIsLoading(true)
        setError(undefined)

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
            setSystemMessagesList(prev => {
                let temp = prev;
                temp.push(serverResponse);
                return temp;
            });
        }).catch(error => {
            console.log(error.response.data)
            if(error.response.data.query) {
                setSystemMessagesList(prev => {
                    let temp = prev;
                    temp.push(error.response.data);
                    return temp;
                });
            } else {
                setSystemMessagesList(prev => {
                    let temp = prev;
                    temp.push({messageId: -1, message: "Error Fetching Data!"});
                    return temp;
                });
                console.error("Error fetching data:", error);
                setError("Error Fetching Data!");
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

    const renderChat = () => {
        let chat = [];
        
        for(let i = 0; i < userMessagesList.length; i++) {
            chat.push(
                <>
                    {userMessagesList[i] !== '' &&
                        <UserChatBubble>
                            <ChatLine>
                                {userMessagesList[i]}
                            </ChatLine>
                        </UserChatBubble>
                    }
                    <SystemChatMessage key={i} 
                        isLoading={i === systemMessagesList.length && isLoading} 
                        systemMessage={systemMessagesList[i]} 
                        error={error}
                        dbURL={dbURL}
                        dbName={dbName}
                        dbUsername={dbUsername}
                        dbPassword={dbPassword}
                    /> 
                </>
            )
        }

        return chat;
    }


    //scroll to bottom when new messages are added
    useEffect(() => {
        if (chatContainerRef) {
            chatContainerRef.current!.addEventListener('DOMNodeInserted', event => {
                const { currentTarget: target } = event;
                //@ts-ignore
                target!.scroll({ top: target!.scrollHeight });
          });
        }
    })

    return (
        <Grid container>
            <Grid item xs={12} sx={{ height: '74.2vh' }}>
                <ChatBox ref={chatContainerRef}>
                    {renderChat()}
                </ChatBox>
            </Grid>

            <Grid item xs={12} sx={{ height: '15vh' }}>
                <ChatFooter sx={{ height: '100%' }}>
                    <form onSubmit={handleSubmit}>
                        <ChatButton onClick={handleRetry}>
                            <ReplayRoundedIcon fontSize='large' htmlColor='#DCDCDF'/>
                        </ChatButton>
                        <UserInput disabled={isLoading || isChatLoading || !currentConversationId} placeholder='Ask DataDiver a question...' autoComplete='off' />
                        <ChatButton type='submit' disabled={isLoading || isChatLoading || !currentConversationId}>
                            <SendRoundedIcon fontSize='large' htmlColor='#DCDCDF'/>
                        </ChatButton>
                    </form>
                </ChatFooter>
            </Grid>
        </Grid>
    )
}

export default Chat