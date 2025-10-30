import express from 'express';
import {
  seedSystemConfig,
  saveConfiguration,
  getConfigurations,
} from '../controllers/setup.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

router.post('/seed-system-config', seedSystemConfig);
router.post('/configuration', saveConfiguration);
router.get('/configurations', getConfigurations);

export default router;
