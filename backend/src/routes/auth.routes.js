import express from 'express';
import { 
  register, 
  login, 
  logout, 
  getMe, 
  refreshToken,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller.js';
<<<<<<< HEAD
=======
import { googleAuth, googleCallback } from '../controllers/oauth.controller.js';
>>>>>>> e1db439 (feat: Implementar Google OAuth para panel de administración)
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// Rutas públicas (con rate limiting)
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

<<<<<<< HEAD
=======
// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

>>>>>>> e1db439 (feat: Implementar Google OAuth para panel de administración)
// Rutas protegidas
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/refresh', protect, refreshToken);

export default router;
