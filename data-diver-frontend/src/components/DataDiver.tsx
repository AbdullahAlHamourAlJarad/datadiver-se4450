import React, { useState } from 'react'
import { Grid } from '@mui/material';
import Chat from './Chat';
import Drawer from './Drawer';

type DataDiverProps = {
    drawerOpen: boolean
}

function DataDiver({drawerOpen} : Readonly<DataDiverProps>) {
    const [dbURL, setDbURL] = useState('datadiverserver.database.windows.net')
    const [dbName, setDbName] = useState('DataDiverDB')
    const [dbUsername, setDbUsername] = useState('datadiveradmin')
    const [dbPassword, setDbPassword] = useState('ouda2023!')

    return (
        <>
            <Grid item sx={{ height: '90vh' }} xs={drawerOpen ? 9 : 12}>
                <Chat dbURL={dbURL} dbName={dbName} dbUsername={dbUsername} dbPassword={dbPassword} />
            </Grid>
            <Grid item sx={{ height: '90vh' }} xs={3} hidden={!drawerOpen}>
                <Drawer dbURL={dbURL} dbName={dbName} dbUsername={dbUsername} dbPassword={dbPassword} setDbURL={setDbURL} setDbName={setDbName} setDbUsername={setDbUsername} setDbPassword={setDbPassword}/>
            </Grid>
        </>
    );
}

export default DataDiver;