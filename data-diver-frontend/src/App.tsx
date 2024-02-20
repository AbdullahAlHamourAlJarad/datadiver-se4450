import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from 'react-error-boundary';
import DataDiver from './components/DataDiver';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import PrivateRoute from './PrivateRoute';
import Login from './components/Login';
import Signup from './components/Signup';

const theme = createTheme({});

function App() {

  const router = createBrowserRouter([
    { path: "/", element: <PrivateRoute element={DataDiver}/> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup />}
  ]);

  return (
    <ErrorBoundary fallback={<div>Error Occurred</div>}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
