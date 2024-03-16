import React, { useState } from 'react'
import { Grid } from '@mui/material';
import Chat from './Chat';
import Drawer from './Drawer';
import Conversations from './Conversations';
import Error from './Error';

type DataDiverProps = {
    drawerOpen: boolean
}

function DataDiver({drawerOpen} : Readonly<DataDiverProps>) {
    const [dbURL, setDbURL] = useState('datadiverserver.database.windows.net')
    const [dbName, setDbName] = useState('DemoDB')
    const [dbUsername, setDbUsername] = useState('datadiveradmin')
    const [dbPassword, setDbPassword] = useState('ouda2023!')
    const [errorMesssage, setErrorMessage] = useState<null | string>(null);

    return (
        <>
            <Grid item sx={{ height: '90vh' }} xs={2}>
                <Conversations setErrorMessage={setErrorMessage}/>
            </Grid>
            <Grid item sx={{ height: '90vh' }} xs={drawerOpen ? 7 : 10}>
                <Error errorMessage={errorMesssage} setErrorMessage={setErrorMessage}/>
                <Chat dbURL={dbURL} dbName={dbName} dbUsername={dbUsername} dbPassword={dbPassword} />
            </Grid>
            <Grid item sx={{ height: '90vh' }} xs={3} hidden={!drawerOpen}>
                <Drawer dbURL={dbURL} dbName={dbName} dbUsername={dbUsername} dbPassword={dbPassword} setDbURL={setDbURL} setDbName={setDbName} setDbUsername={setDbUsername} setDbPassword={setDbPassword}/>
            </Grid>
        </>
    );
}

export default DataDiver;