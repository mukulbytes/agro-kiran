import express from 'express';
import { sendMessage, getChatHistory } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected chat routes
router.use(protect);

// Send message to AI and get response
router.post('/message', sendMessage);

// Get chat history for a user
router.get('/history', getChatHistory);

export default router; 