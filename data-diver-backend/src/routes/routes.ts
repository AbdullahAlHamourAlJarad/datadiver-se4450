import express from 'express';
import conversationRoutes from './conversationRoutes';
import authenticationRoutes from './authenticationRoutes';
import authenticationLogin from './authenticationLogin';


const router = express.Router();

// Add all routes here
router.use("/conversation", conversationRoutes);
router.use("/auth", authenticationRoutes);
router.use("/auth", authenticationLogin);


export default router;