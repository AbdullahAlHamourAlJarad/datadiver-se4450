import express from 'express';
import { generatePasswordHash, verifyPassword } from '../utils/passwordUtil'

const authenticationRoutes = express.Router();


authenticationRoutes.post('/signup', async (req, res, next) => { 

});

authenticationRoutes.get('/login', async (req, res, next) => { 

});



export default authenticationRoutes;