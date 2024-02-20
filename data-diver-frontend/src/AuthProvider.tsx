import React, { ReactNode, useState } from 'react'

type IUser = {name: string, isAuthenticated: boolean}

interface IAuthContext {
    user: IUser,
    login: (userName: string, password: string) => Promise<unknown>
    logout: () => void
}

export const AuthContext = React.createContext<IAuthContext>({
    user: {name: "", isAuthenticated: false},
    login: (userName, password) => new Promise(() => {}),
    logout: () => {}
});

export default function AuthProvider({ children }: Readonly<{children: ReactNode}>) {
    const [user, setUser] = useState<IUser>({name: "", isAuthenticated: false});

    const login = (userName: string, password: string) => {
        // Make a call to the authentication API to check the username
        return new Promise((resolve, reject) => {
            const remove = true
            if (remove) {
                setUser({name: userName, isAuthenticated: true});
                resolve("success");
            } else {
                reject("Incorrect Password")
            }
        })     
    }

    const logout = () => {
        setUser({...user, isAuthenticated: false})
    }

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}