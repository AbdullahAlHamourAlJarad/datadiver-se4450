import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Login.module.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await login(formData.email, formData.password);
            // Redirect to home page or any other page on successful login
            navigate('/');
        } catch (error) {
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
            </form>
        </div>
    );
};

export default Login;
