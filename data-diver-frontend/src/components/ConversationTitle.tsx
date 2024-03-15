import React, { useState } from 'react'
import { Paper } from '@mui/material'

export type IConversationTitle = {
    title: string,
    conversationId: number
}


const ConversationTitle = ({title, conversationId}: IConversationTitle) => {
    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    return (
        <Paper 
            style={{
                backgroundColor: hovered ? '#555' : '#333',
                color: '#fff',
                padding: '10px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {title}
        </Paper>
    )
}

export default ConversationTitle;