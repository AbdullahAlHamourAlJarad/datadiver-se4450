import React, { ReactNode, useState } from 'react';

type IUser = { email: string, isAuthenticated: boolean, isAdmin: boolean };

interface IAuthContext {
    user: IUser,
    login: (email: string, password: string) => Promise<string>;
    logout: () => void;
}

export const AuthContext = React.createContext<IAuthContext>({
    user: { email: "", isAuthenticated: false, isAdmin: false },
    login: (email, password) => new Promise(() => { }),
    logout: () => { }
});

export default function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [user, setUser] = useState<IUser>({ email: "", isAuthenticated: false, isAdmin: false });

    const login = async (userName: string, password: string) => {
        console.log("Entered Username:", userName);
        console.log("Entered Password:", password);

        // Hardcoded values for testing
        const storedUsername = "test@example.com";
        const storedPassword = "password";

        return new Promise<string>((resolve, reject) => {
            if (userName === storedUsername && password === storedPassword) {
                setUser({ email: userName, isAuthenticated: true, isAdmin: false });
                resolve("success");
            } else {
                reject("Sorry, the username or password is incorrect.");
            }
        });
    };

    const logout = () => {
        setUser({ email: "", isAuthenticated: false, isAdmin: false });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
