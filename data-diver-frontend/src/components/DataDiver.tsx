import React, { useState } from 'react'
import { Grid } from '@mui/material';
import Header from './Header';
import Chat from './Chat';
import Drawer from './Drawer';

function DataDiver() {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [dbURL, setDbURL] = useState('datadiverserver.database.windows.net')
    const [dbName, setDbName] = useState('DataDiverDB')
    const [dbUsername, setDbUsername] = useState('datadiveradmin')
    const [dbPassword, setDbPassword] = useState('ouda2023!')

    return (
        <Grid container>
            <Grid item sx={{ height: '10vh' }} xs={12}>
                <Header drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
            </Grid>
            <Grid item sx={{ height: '90vh' }} xs={drawerOpen ? 9 : 12}>
                <Chat dbURL={dbURL} dbName={dbName} dbUsername={dbUsername} dbPassword={dbPassword} />
            </Grid>
            <Grid item sx={{ height: '90vh' }} xs={3} hidden={!drawerOpen}>
                <Drawer dbURL={dbURL} dbName={dbName} dbUsername={dbUsername} dbPassword={dbPassword} setDbURL={setDbURL} setDbName={setDbName} setDbUsername={setDbUsername} setDbPassword={setDbPassword}/>
            </Grid>
        </Grid>
    );
}

export default DataDiver;