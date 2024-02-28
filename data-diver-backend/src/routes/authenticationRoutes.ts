// authenticationRoutes.ts
import express from 'express';
import { generatePasswordHash, verifyPassword } from '../utils/passwordUtil'
import * as sql from 'mssql';
import { createNewDBConnection } from '../connectDB';

const authenticationRoutes = express.Router();

authenticationRoutes.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  // Salt and hash the password
  let hashedPassword = generatePasswordHash(password)

  try {
    // Create a new DB connection using the provided function
    const connection = await createNewDBConnection('datadiverserver.database.windows.net', 'DataDiverDB', 'datadiveradmin', 'ouda2023!');

    // Check if user already exists
    const existingUser = await connection.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM [User] WHERE email = @email');

    if (existingUser.recordset.length > 0) {
      return res.status(409).send('Email already in use.');
    }

    // Insert the new user
    await connection.request()
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, hashedPassword)
      .query('INSERT INTO [User] (email, password) VALUES (@email, @password)');

    res.status(201).send('User created successfully.');
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

authenticationRoutes.get('/login', async (req, res, next) => { 

});



export default authenticationRoutes;