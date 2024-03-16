import { Alert } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';

// Updated type definition to include className
type ErrorProps = {
    errorMessage: null | string;
    setErrorMessage: Dispatch<SetStateAction<string | null>>;
    className?: string; // Optional className prop
};

const Error: React.FC<ErrorProps> = ({ errorMessage, setErrorMessage, className }) => {
    return (
        <>
            {errorMessage && 
                // Apply the className prop to the Alert component
                <Alert className={className} severity="error" onClose={() => {setErrorMessage(null)}}>
                    {errorMessage}
                </Alert>
            }
        </>
    );
}

export default Error;
