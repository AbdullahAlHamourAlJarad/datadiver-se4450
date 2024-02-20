// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from './AuthProvider'

//@ts-ignore
const PrivateRoute = ({ element: Component, ...rest }) => {
    const {user} = useContext(AuthContext);

    console.log(user.isAuthenticated)

    return user.isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" replace />;
}

export default PrivateRoute