import React, { useState, useRef, useContext, useEffect } from 'react'
import { Stack, styled } from '@mui/material'
import ConversationTitle, { IConversationTitle } from './ConversationTitle'
import axios from 'axios'
import { AuthContext } from '../AuthProvider'
import Error from './Error';

type ConversationProps = {
}

const DrawerBox = styled(Stack)({
    backgroundColor: '#000000',
    textAlign: 'center',
    height: '100%'
})

const Conversations = ({ }: ConversationProps) => {
    const {user} = useContext(AuthContext);
    const newConversationTitleRef = useRef<HTMLInputElement>(null);
    const [ conversationList, setConversationList ] = useState<IConversationTitle[]>([])

    const [ isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<null | string>(null);

    const handleAddConversation = async () => {
        const newTitle = newConversationTitleRef.current?.value;
        if (newTitle) {
            setIsLoading(true); 

            // Clear the input field after adding conversation
            if (newConversationTitleRef.current) {
                newConversationTitleRef.current.value = '';
            }

            //TODO change email
            await axios.post('/conversation/new-conversation', {email: "kmeawad@uwo.ca", title: newTitle})
                .then((response) => {
                    if (response.data) {
                        setConversationList(
                            response.data.map((conv: any) => {
                                return {title: conv.chatTitle, conversationId: conv.conversationID}
                            })
                        )
                    }
                }).catch(error => {
                    console.error("Error:", error);
                    setErrorMessage("Error Creating New Chat");
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
                        return {title: conv.chatTitle, conversationId: conv.conversationID}
                    })
                )
            })
            .catch(error => {
                console.error("Error:", error);
                setErrorMessage("Failed To Retrieve Chats");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [])

    return (
        <DrawerBox>
            <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />

            <div style={{ padding: "5px"}}>
                <input 
                    type="text" 
                    placeholder="Enter chat title" 
                    ref={newConversationTitleRef}
                />
                <button onClick={handleAddConversation} disabled={isLoading}>Add Chat</button>
            </div>

            {conversationList.map(conv => <ConversationTitle key={conv.conversationId} title={conv.title} conversationId={conv.conversationId}/> )}
        </DrawerBox>
    )
}

export default Conversations;