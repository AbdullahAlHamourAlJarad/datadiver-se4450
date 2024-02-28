// authenticationRoutes.ts
import express from 'express';
import { generatePasswordHash, verifyPassword } from '../utils/passwordUtil'
import * as sql from 'mssql';
import { createNewDBConnection } from '../connectDB';
import dotenv from 'dotenv';

dotenv.config();

const authenticationRoutes = express.Router();

authenticationRoutes.post('/signup', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Create a new DB connection
    const connection = await createNewDBConnection(
        process.env.DB_URL as string, 
        process.env.DB_NAME as string, 
        process.env.DB_USER as string, 
        process.env.DB_PASSWORD as string
    );

    // Check if user already exists
    const existingUser = await connection.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM [Users] WHERE email = @email');

    if (existingUser.recordset.length > 0) {
      res.status(409).send('Email already in use.');
    } else {
        // Salt and hash the password
        let { hashedPass , salt } = generatePasswordHash(password)

        // Insert the new user in Users table
        await connection.request()
            .input('email', sql.VarChar, email)
            .query('INSERT INTO [Users] (email) VALUES (@email)');

        // Insert the new user password info in PasswordHash table
        await connection.request()
            .input('email', sql.VarChar, email)
            .input('passwordHash', sql.VarChar, hashedPass)
            .input('salt', sql.VarChar, salt)
            .query('INSERT INTO [PasswordHash] (email, passwordHash, salt) VALUES (@email, @passwordHash, @salt)');

        res.status(201).send('User created successfully.');
    }
  } catch (error: any) {
    console.error(error)
    next(new Error("Failed to Create Account"))
  }
});

authenticationRoutes.get('/login', async (req, res, next) => { 

});



export default authenticationRoutes;