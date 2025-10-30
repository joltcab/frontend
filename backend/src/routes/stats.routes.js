import express from 'express';
import {
  getDashboardStats,
  getUsers,
  getDrivers,
  getRides,
} from '../controllers/stats.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas de estadísticas
router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/drivers', getDrivers);
router.get('/rides', getRides);

export default router;
