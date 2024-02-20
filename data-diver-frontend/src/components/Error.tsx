import { Alert } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';

const Error: React.FC<{
    errorMessage: null | string, 
    setErrorMessage: Dispatch<SetStateAction<string | null>>
}> = ({errorMessage, setErrorMessage}) => {

    return (
        <>
            {errorMessage && 
                <Alert severity="error" onClose={() => {setErrorMessage(null)}}>{errorMessage}</Alert>
            }
        </>
    );
}

export default Error;
