import express from 'express';
import { chat, getHistory } from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Chat con IA requiere autenticación
router.post('/chat', protect, chat);
router.get('/history', protect, getHistory);

export default router;
