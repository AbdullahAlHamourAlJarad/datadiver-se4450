import React, { useContext, useState } from 'react'
import { Grid, Paper, Typography } from '@mui/material'
import { ConversationContext } from '../Provider'
import axios from 'axios'
import DeleteIcon from '@mui/icons-material/Delete';
import "../css/ConversationTitle.css"

export type IConversationTitle = {
    title: string,
    conversationId: number,
    setErrorMessage: (error: string) => void
    setConversationList: React.Dispatch<React.SetStateAction<IConversationTitle[]>>
}


const ConversationTitle = ({ title, conversationId, setErrorMessage, setConversationList }: IConversationTitle) => {
    const [hovered, setHovered] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
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
                setSystemMessagesList(response.data.systemMessages);
            })
            .catch(error => {
                console.error("Error:", error);
                setErrorMessage("Failed To Retrieve Messages");
            })
            .finally(() => {
                setIsChatLoading(false);
            });
    }

    const handleDeleteConversation = () => {
        if(isDeleteLoading)
            return;

        setIsDeleteLoading(true);
        axios.delete("/conversation/conversation", {data: { conversationId: conversationId } })
            .then(() => {
                if(currentConversationId === conversationId) {
                    setCurrentConversationId(undefined);
                    setUserMessagesList([]);
                    setSystemMessagesList([]);
                }

                // Update conversation list by filtering out the conversation with matching conversationId
                setConversationList(prevList => prevList.filter(conversation => conversation.conversationId !== conversationId));
            })
            .catch(error => {
                console.error(error);
                setErrorMessage("Failed To Delete Conversation");
            })
            .finally(() => setIsDeleteLoading(false));
    }

    return (
        <Paper
            style={{
                backgroundColor: currentConversationId === conversationId || hovered ? '#262626' : '#161616',
                color: '#DCDCDF',
                padding: '3px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                margin: '5px',
                boxShadow: 'none'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Grid container>
                <Grid item xs={10} onClick={handleOnClick}>
                    <Typography variant='overline'>
                        {title}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <DeleteIcon 
                        fontSize='small' 
                        style={{ verticalAlign: "middle", cursor: "pointer" }} 
                        onClick={handleDeleteConversation}
                        className="delete-icon"
                    />
                </Grid>
            </Grid>

        </Paper>
    )
}

export default ConversationTitle;