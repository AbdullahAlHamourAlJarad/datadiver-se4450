import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';
import Error from './Error';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState<null | string>(null);


    return (
        <div>
            <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
            Login Page
            <button onClick={async () => {
                try{ 
                    await login("", "");
                    navigate("/")
                } catch(error) {
                    setErrorMessage(error as string)
                }

            }}>Login</button>
        </div>
    );
}

export default Login;
