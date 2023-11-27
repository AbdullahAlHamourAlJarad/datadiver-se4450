import express from 'express';
import conversationRoutes from './conversationRoutes';


const router = express.Router();

// Add all routes here
router.use("/conversation", conversationRoutes)
//TODO sprint 2
router.use("/login", () => {})


export default router;