// Signup.tsx
import React, { useState } from 'react';
import axios from 'axios';
import styles from '../css/Signup.module.css';
import Grid from '@mui/material/Grid';
import Error from './Error'; // Make sure the path to this component is correct
import { ErrorBoundary } from 'react-error-boundary';

const Signup = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('/auth/signup', formData);
      console.log('Account created:', response.data);
      // Redirect to login on successful signup
      window.location.href = '/login';
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data.message || 'An error occurred during signup.');
        console.error('Signup error:', error.response?.data);
      } else {
        setErrorMessage('An unexpected error occurred.');
        console.error('Signup error:', error.message);
      }
    }
  };

  return (
    <ErrorBoundary fallback={<div>Failed to Signup</div>}>
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh', backgroundColor: '#262A38' }}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.signupForm}>
          <Error className={styles.errorContainer} errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
            <h1 className={styles.signupTitle}>Create My Account</h1>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <input
                  type="email"
                  name="email"
                  className={styles.inputField}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type="password"
                  name="password"
                  className={styles.inputField}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
              </div>
              <button type="submit" className={styles.submitBtn}>Create My Account</button>
            </form>
            <p className={styles.loginLink}>
              Already have an account? <a href="/login">Login instead</a>
            </p>
          </div>
        </Grid>
      </Grid>
    </ErrorBoundary>
  );
};

export default Signup;
