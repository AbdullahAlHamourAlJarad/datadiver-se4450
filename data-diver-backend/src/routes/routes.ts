import express from 'express';
import conversationRoutes from './conversationRoutes';
import authenticationRoutes from './authenticationRoutes';


const router = express.Router();

// Add all routes here
router.use("/conversation", conversationRoutes);
router.use("/auth", authenticationRoutes);


export default router;