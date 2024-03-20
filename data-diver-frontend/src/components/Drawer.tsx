import { Button, Stack, TextField, Typography, styled } from '@mui/material'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../AuthProvider'

type DrawerProps = {
    dbURL: string
    dbName: string
    dbUsername: string
    dbPassword: string
    setDbURL: React.Dispatch<React.SetStateAction<string>>
    setDbName: React.Dispatch<React.SetStateAction<string>>
    setDbUsername: React.Dispatch<React.SetStateAction<string>>
    setDbPassword: React.Dispatch<React.SetStateAction<string>>
}

const DrawerBox = styled(Stack)({
    backgroundColor: '#161616',
    borderLeft: '2px solid #1E1E1E',
    textAlign: 'center',
    height: '100%'
})

const DBInput = styled(TextField)({
    marginRight: '15%',
    marginLeft: '15%',
    marginBottom: '20px',
    '& .MuiInputBase-root': {
        borderRadius: '10px'
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#383838',
            borderWidth: '1.5px',
        },
        '&:hover fieldset': {
            borderColor: '#383838',
            borderWidth: '2px',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#DCDCDF',
            borderWidth: '2px',
        },
        '& .MuiOutlinedInput-input': {
            color: '#383838',
        },
        '&.Mui-focused .MuiOutlinedInput-input': {
            color: '#DCDCDF',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#383838',
    },
    '&:hover .MuiInputLabel-root': {
        color: '#DCDCDF',
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#DCDCDF',
        fontWeight: '900',
    },
})

const Drawer = ({ dbURL, dbName, dbUsername, dbPassword, setDbURL, setDbName, setDbUsername, setDbPassword }: DrawerProps) => {
    const { logout } = useContext(AuthContext);

    return (
        <DrawerBox>
            <Typography variant={'overline'} sx={{ color: '#DCDCDF', marginTop: '15px', marginBottom: '15px' }}>
                Database Settings
            </Typography>
            <DBInput value={dbURL} onChange={(e) => setDbURL(e.target.value)} InputLabelProps={{ shrink: true }} size='small' label='DB URL' />
            <DBInput value={dbName} onChange={(e) => setDbName(e.target.value)} InputLabelProps={{ shrink: true }} size='small' label='DB NAME' />
            <DBInput value={dbUsername} onChange={(e) => setDbUsername(e.target.value)} InputLabelProps={{ shrink: true }} size='small' label='DB USERNAME' />
            <DBInput value={dbPassword} onChange={(e) => setDbPassword(e.target.value)} InputLabelProps={{ shrink: true }} size='small' label='DB PASSWORD' />
            <Button><Link to={'#'} onClick={logout}>Log out</Link></Button>
        </DrawerBox >
    )
}

export default Drawer