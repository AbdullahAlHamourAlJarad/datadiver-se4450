import React from 'react';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';

const TypoCorrection = (props: {typoFix: string}) => {
    const TypoChatLine = styled(Typography)({
        maxWidth: '100%',
        color: '#DCDCDF',
        overflowWrap: 'break-word',
        padding: '7px',
        marginBottom: '10px' 
    });


    return <TypoChatLine>
        <b>Showing results for:</b> "<i>{props.typoFix}</i>"
    </TypoChatLine>
}

export default TypoCorrection;