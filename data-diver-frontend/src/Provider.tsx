import React, { ReactNode, useState } from 'react'


export interface IServerResponse {
    message?: string,
    data?: { [key: string]: any },
    interpreted_question?: string,
    query: string,
    messageId: number
}

export const ConversationContext = React.createContext<{
    userMessagesList: string[], 
    setUserMessagesList: React.Dispatch<React.SetStateAction<string[]>>,
    systemMessagesList: IServerResponse[],
    setSystemMessagesList: React.Dispatch<React.SetStateAction<IServerResponse[]>>,
    currentConversationId?: number,
    setCurrentConversationId: React.Dispatch<React.SetStateAction<number | undefined>>,
    isChatLoading: boolean, 
    setIsChatLoading: React.Dispatch<React.SetStateAction<boolean>>
}>({  
    userMessagesList: [],
    setUserMessagesList: (state) => {},
    systemMessagesList: [],
    setSystemMessagesList: (state) => {},
    currentConversationId: undefined,
    setCurrentConversationId: (state) => {},
    isChatLoading: false,
    setIsChatLoading: (state) => {},
});

export default function Provider({ children }: Readonly<{children: ReactNode}>) {
    const [userMessagesList, setUserMessagesList] = useState<string[]>([]);
    const [systemMessagesList, setSystemMessagesList] = useState<IServerResponse[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<number | undefined>(undefined);
    const [isChatLoading, setIsChatLoading] = useState(false);

    return (
        <ConversationContext.Provider value={{ 
            userMessagesList, setUserMessagesList, 
            systemMessagesList, setSystemMessagesList, 
            currentConversationId, setCurrentConversationId, 
            isChatLoading, setIsChatLoading
        }}>
            {children}
        </ConversationContext.Provider>
    )
}