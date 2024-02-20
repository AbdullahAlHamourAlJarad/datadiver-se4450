import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState<null | string>(null);


    return (
        <div>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            Login Page
            <button onClick={async () => {
                try{ 
                    await login("", "");
                    navigate("/")
                } catch(error) {
                    //@ts-ignore
                    setErrorMessage(error)
                }

            }}>Login</button>
        </div>
    );
}

export default Login;
