import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Login.module.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const responseData = await response.json();

            if (response.ok) {
                navigate('/');
            } else {
                setErrorMessage(responseData.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('Failed to login. Please try again later.');
        }
    };

    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
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
                {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            </form>
        </div>
    );
};

export default Login;
