import React, { useContext, useState } from 'react'
import { Paper } from '@mui/material'
import { ConversationContext } from '../Provider'
import axios from 'axios'

export type IConversationTitle = {
    title: string,
    conversationId: number,
    setErrorMessage: (error: string) => void
}

export type IMessage = {
    messageId: number,
    chatString: string,
    rating: boolean,
    isUserMessage: boolean
}


const ConversationTitle = ({title, conversationId, setErrorMessage}: IConversationTitle) => {
    const [hovered, setHovered] = useState(false);
    const { currentConversationId, setIsChatLoading, setUserMessagesList, setSystemMessagesList, setCurrentConversationId } = useContext(ConversationContext)

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    const handleOnClick = () => {
        setCurrentConversationId(conversationId)
        setIsChatLoading(true);
        axios.get("/conversation/messages", { params: { conversationId: conversationId } })
            .then((response) => {
                setUserMessagesList(response.data.userMessages);
                setSystemMessagesList(response.data.systemMessages)
            })
            .catch(error => {
                console.error("Error:", error);
                setErrorMessage("Failed To Retrieve Messages");
            })
            .finally(() => {
                setIsChatLoading(false);
            });
    }

    return (
        <Paper 
            style={{
                backgroundColor: currentConversationId === conversationId || hovered ? '#555' : '#333',
                color: '#fff',
                padding: '10px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleOnClick}
        >
            {title}
        </Paper>
    )
}

export default ConversationTitle;