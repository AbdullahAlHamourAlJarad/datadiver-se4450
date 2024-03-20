import axios from 'axios';
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

    const login = async (email: string, password: string) => {
        console.log("Entered Email:", email);
        console.log("Entered Password:", password);

        return new Promise<string>((resolve, reject) => {
            axios.post("/auth/login", {email: email, password: password})
                .then(response => {
                    if (response.status === 200) {
                        setUser({ email: email, isAuthenticated: true, isAdmin: false });
                        resolve("success");
                    } else {
                        reject("Sorry, the username or password is incorrect.");
                    }
                })
                .catch(error => {
                    reject(error.response.data.message);
                })
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
