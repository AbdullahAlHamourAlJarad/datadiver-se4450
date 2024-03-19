import express from 'express';
import { verifyPassword } from '../utils/passwordUtil';
import * as sql from 'mssql';
import { createNewDBConnection } from '../connectDB';
import dotenv from 'dotenv';

dotenv.config();

const authenticationLogin = express.Router();

authenticationLogin.post('/login', async (req, res) => {
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
      .query('SELECT passwordHash, salt FROM [PasswordHash] WHERE email = @email');

    if (existingUser.recordset.length === 0) {
      return res.status(404).send({ message: 'User not found.' });
    }

    const { passwordHash, salt } = existingUser.recordset[0];

    if (!passwordHash || !salt) {
      return res.status(500).send({ message: 'Missing password hash or salt.' });
    }

    if (!verifyPassword(password, passwordHash, salt)) {
      return res.status(401).send({ message: 'Incorrect password.' });
    }

    return res.status(200).send({ message: 'Login successful.' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Failed to login. Please try again later.' });
  }
});

export default authenticationLogin;