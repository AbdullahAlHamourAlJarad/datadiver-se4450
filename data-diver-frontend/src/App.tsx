import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import DataDiver from './components/DataDiver';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({});

function App() {
  return (
    <ErrorBoundary fallback={<div>Error Occurred</div>}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DataDiver />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
