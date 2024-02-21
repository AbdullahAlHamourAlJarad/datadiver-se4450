import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from 'react-error-boundary';
import DataDiver from './components/DataDiver';
import { CssBaseline, Grid, ThemeProvider, createTheme } from '@mui/material';
import PrivateRoute from './PrivateRoute';
import Login from './components/Login';
import Signup from './components/Signup';
import Header from './components/Header';

const theme = createTheme({});

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const router = createBrowserRouter([
    { path: "/", element: <PrivateRoute element={DataDiver} drawerOpen={drawerOpen}/> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup />}
  ]);

  return (
    <ErrorBoundary fallback={<div>Error Occurred</div>}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
            <Grid container>
              <Grid item xs={12}>
                  <Header setDrawerOpen={setDrawerOpen} />
              </Grid>
              <RouterProvider router={router} />
            </Grid>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
