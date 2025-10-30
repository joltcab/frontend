import express from 'express';
import {
  getSettings,
  updateSettings,
  getConstants,
  initializeSettings,
} from '../controllers/settings.controller.js';
import { protect } from '../middleware/auth.js';
import { getConfigStatus } from '../middleware/validateConfig.js';

const router = express.Router();

// Public routes
router.get('/constants', getConstants);
router.get('/config-status', getConfigStatus);

// Protected routes
router.use(protect);
router.get('/', getSettings);
router.put('/', updateSettings);
router.post('/initialize', initializeSettings);

export default router;
