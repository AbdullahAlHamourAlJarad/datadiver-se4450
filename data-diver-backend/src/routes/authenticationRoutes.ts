// authenticationRoutes.ts
import express from 'express';
import { generatePasswordHash } from '../utils/passwordUtil';
import * as sql from 'mssql';
import { createNewDBConnection } from '../connectDB';
import dotenv from 'dotenv';

dotenv.config();

const authenticationRoutes = express.Router();

authenticationRoutes.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await createNewDBConnection(
        process.env.DB_URL as string,
        process.env.DB_NAME as string,
        process.env.DB_USER as string,
        process.env.DB_PASSWORD as string
    );

    const existingUser = await connection.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM [Users] WHERE email = @email');

    if (existingUser.recordset.length > 0) {
      return res.status(409).send({ message: 'Email already in use.' });
    }

    const { hashedPass, salt } = generatePasswordHash(password);

    await connection.request()
      .input('email', sql.VarChar, email)
      .query('INSERT INTO [Users] (email) VALUES (@email)');

    await connection.request()
      .input('email', sql.VarChar, email)
      .input('passwordHash', sql.VarChar, hashedPass)
      .input('salt', sql.VarChar, salt)
      .query('INSERT INTO [PasswordHash] (email, passwordHash, salt) VALUES (@email, @passwordHash, @salt)');

    return res.status(201).send({ message: 'User created successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Failed to create account. Please try again later.' });
  }
});

authenticationRoutes.get('/login', async (req, res, next) => { 

});



export default authenticationRoutes;