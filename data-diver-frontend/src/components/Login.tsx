// Login.tsx

import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Login.module.css';
import { ErrorBoundary } from 'react-error-boundary';
import Error from './Error';

const Login = () => {
    const navigate = useNavigate(); // Access the navigate function
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            login(formData.email, formData.password)
                .then(() => {
                    // If login is successful, navigate to the conversation page
                    navigate('/');
                })
                .catch(error => {
                    console.log(error)
                    setErrorMessage(error);
                });
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('Failed to login. Please try again later.');
        }
    };

    return (
        <ErrorBoundary fallback={<div>Failed to Login</div>}>
            <div className={styles.loginContainer}>
                <form onSubmit={handleSubmit} method="POST" className={styles.loginForm}>
                    <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage}/>
                    <h1 className={styles.loginTitle}>Login to Your Account</h1>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.inputLabel}>Email address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={styles.inputField}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.inputLabel}>Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className={styles.inputField}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.submitBtn}>Login</button>
                    <p className={styles.signupLink}>
                        Don't have an account? <a href="/signup" className={styles.signupLink}>Sign up here</a>
                    </p>
                </form>
            </div>
        </ErrorBoundary>
    );
};

export default Login;
