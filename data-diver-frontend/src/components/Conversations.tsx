import React, { useState, useRef, useContext, useEffect } from 'react'
import { IconButton, InputAdornment, Stack, TextField, styled } from '@mui/material'
import ConversationTitle, { IConversationTitle } from './ConversationTitle'
import axios from 'axios'
import { AuthContext } from '../AuthProvider'
import Error from './Error';
import { AddCircle } from '@mui/icons-material'

type ConversationProps = {
    setErrorMessage: (error: string) => void
}

const TitleInput = styled(TextField)({
    '& input': {
        color: '#DCDCDF',
        height: '1px',
    },
    '& .MuiInputBase-root': {
        borderRadius: '5px'
    },
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: '#DCDCDF',
            borderWidth: '2px'
        },
        '& fieldset': {
            borderColor: '#383838',
            borderWidth: '1.5px'
        }
    },
    '& .MuiInputBase-root:hover': {
        '& fieldset': {
            borderColor: '#383838',
            borderWidth: '2px'
        }
    },
    '& .Mui-focused.MuiInputBase-root:hover': {
        '& fieldset': {
            borderColor: '#FFFFFF',
            borderWidth: '2px'
        }
    },
})

const DrawerBox = styled(Stack)({
    backgroundColor: '#161616',
    textAlign: 'center',
    height: '100%',
    borderRight: '2px solid #1E1E1E',
    padding: '5px'
})

const AddButton = styled(IconButton)({
    color: '#383838',
    padding: '0px',
    '&:hover': {
        color: '#DCDCDF'
    }
})

const Conversations = ({ setErrorMessage }: ConversationProps) => {
    const { user } = useContext(AuthContext);
    const newConversationTitleRef = useRef<HTMLInputElement>(null);
    const [conversationList, setConversationList] = useState<IConversationTitle[]>([])

    const [isLoading, setIsLoading] = useState(false);
    const [conversationListErrorMessage, setConversationListErrorMessage] = useState<null | string>(null);

    const handleAddConversation = async () => {
        const newTitle = newConversationTitleRef.current?.value;
        if (newTitle) {
            setIsLoading(true);

            // Clear the input field after adding conversation
            if (newConversationTitleRef.current) {
                newConversationTitleRef.current.value = '';
            }

            //TODO change email
            await axios.post('/conversation/new-conversation', { email: "kmeawad@uwo.ca", title: newTitle })
                .then((response) => {
                    if (response.data) {
                        setConversationList(
                            response.data.map((conv: any) => {
                                return { title: conv.chatTitle, conversationId: conv.conversationID }
                            })
                        )
                    }
                }).catch(error => {
                    console.error("Error:", error);
                    setConversationListErrorMessage("Error Creating New Chat");
                }).finally(() => {
                    setIsLoading(false);
                });

        }
    };

    useEffect(() => {
        setIsLoading(true);
        //TODO change email
        axios.get("/conversation/conversations", { params: { email: "kmeawad@uwo.ca" } })
            .then((response) => {
                setConversationList(
                    response.data.map((conv: any) => {
                        return { title: conv.chatTitle, conversationId: conv.conversationID }
                    })
                )
            })
            .catch(error => {
                console.error("Error:", error);
                setConversationListErrorMessage("Failed To Retrieve Chats");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [])

    return (
        <DrawerBox>
            <Error errorMessage={conversationListErrorMessage} setErrorMessage={setConversationListErrorMessage} />

            {conversationList.map(conv => <ConversationTitle key={conv.conversationId} title={conv.title} conversationId={conv.conversationId} setErrorMessage={setErrorMessage} />)}

            <div style={{ padding: "5px" }}>
                <TitleInput placeholder="New chat title..." autoComplete='off' inputRef={newConversationTitleRef} disabled={isLoading} InputProps={{
                    endAdornment: (
                        <InputAdornment position='end' sx={{margin: '0px'}}>
                            <AddButton onClick={handleAddConversation} disabled={isLoading}>
                                <AddCircle />
                            </AddButton>
                        </InputAdornment>
                    ),
                    sx: {
                        '& input': {
                            typography: 'overline',
                        },
                    },
                }}
                />
            </div>
        </DrawerBox>
    )
}

export default Conversations;