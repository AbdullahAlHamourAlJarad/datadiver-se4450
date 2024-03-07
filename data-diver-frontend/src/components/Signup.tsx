// Signup.tsx
import React, { useState } from 'react';
import axios from 'axios';
import styles from '../css/Signup.module.css';

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
    } catch (error: any) { // Notice the use of `any` here to broadly type the error object
      if (axios.isAxiosError(error)) {
        // The error is an Axios error, and we can access `error.response`
        console.error('Signup error:', error.response?.data);
      } else {
        // The error is not from Axios, it might be a network error or something else
        console.error('Signup error:', error.message);
      }
      // Handle error, possibly display an error message to the user
    }
  };

  return (
    <div className={styles.signupContainer}>
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
    </div>
  );
};

export default Signup;