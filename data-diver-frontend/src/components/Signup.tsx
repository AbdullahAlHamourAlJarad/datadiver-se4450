import React, { useState } from 'react';
import axios from 'axios';
import styles from '../css/Signup.module.css';
import Grid from '@mui/material/Grid'; // Importing Grid from MUI

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try { 
      const response = await axios.post('/auth/signup', formData);
      console.log('Account created:', response.data);
      // Handle success, maybe redirect to the login page or display a success message
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Signup error:', error.response?.data);
      } else {
        console.error('Signup error:', error.message);
      }
      // Handle error, possibly display an error message to the user
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh', backgroundColor: '#262A38' }}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <div className={styles.signupForm}>
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
  );
};

export default Signup;
