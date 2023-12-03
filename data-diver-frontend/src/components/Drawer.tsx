import { Stack, Typography, styled } from '@mui/material'
import React, { RefObject, useState } from 'react'

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
    backgroundColor: '#262A38',
    justifyContent: 'center',
    textAlign: 'center',
    height: '100%'
})

const Drawer = ({ dbURL, dbName, dbUsername, dbPassword, setDbURL, setDbName, setDbUsername, setDbPassword }: DrawerProps) => {
    return (
        <DrawerBox>
            <Typography sx={{ color: '#5A6C83' }}>
                WIP...
            </Typography>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label>
                    DB URL:
                    <input value={dbURL} onChange={(e) => setDbURL(e.target.value)} />
                </label>
                <label>
                    DB Name:
                    <input value={dbName} onChange={(e) => setDbName(e.target.value)} />
                </label>
                <label>
                    DB UserName:
                    <input value={dbUsername} onChange={(e) => setDbUsername(e.target.value)} />
                </label>
                <label>
                    DB Password:
                    <input value={dbPassword} onChange={(e) => setDbPassword(e.target.value)} />
                </label>
            </div>
        </DrawerBox>
    )
}

export default Drawer