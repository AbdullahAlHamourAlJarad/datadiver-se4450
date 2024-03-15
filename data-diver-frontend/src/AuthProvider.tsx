import React, { ReactNode, useState } from 'react'

type IUser = {email: string, isAuthenticated: boolean, isAdmin: boolean}

interface IAuthContext {
    user: IUser,
    login: (email: string, password: string) => Promise<unknown>
    logout: () => void
}

export const AuthContext = React.createContext<IAuthContext>({
    user: {email: "", isAuthenticated: false, isAdmin: false},
    login: (email, password) => new Promise(() => {}),
    logout: () => {}
});

export default function AuthProvider({ children }: Readonly<{children: ReactNode}>) {
    const [user, setUser] = useState<IUser>({email: "", isAuthenticated: false, isAdmin: false});

    const login = (userName: string, password: string) => {
        // Make a call to the authentication API to check the username
        return new Promise((resolve, reject) => {
            //TODO remove
            const test = true
            if (test) {
                setUser({email: userName, isAuthenticated: true, isAdmin: false});
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