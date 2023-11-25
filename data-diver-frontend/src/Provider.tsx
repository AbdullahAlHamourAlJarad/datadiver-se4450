import React, { ReactNode, useState } from 'react'

export const AnswerContext = React.createContext<{receivedAnswer: string | null, setReceivedAnswer: (ans: any) => any}>({  
    receivedAnswer: null,
    setReceivedAnswer: (ans) => {}
});

export default function Provider({ children }: Readonly<{children: ReactNode}>) {
    const [receivedAnswer, setReceivedAnswer] = useState<string | null>(null);

    return (
        <AnswerContext.Provider value={{ receivedAnswer, setReceivedAnswer }}>
            {children}
        </AnswerContext.Provider>
    )
}