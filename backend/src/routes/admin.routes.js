import express from 'express';
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  upgradeToSuperAdmin,
  syncAdminUser,
} from '../controllers/admin.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// CRUD de admins
router.get('/', getAdmins);
router.post('/', createAdmin);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

// Acciones especiales
router.post('/upgrade-super-admin', upgradeToSuperAdmin);
router.post('/sync', syncAdminUser);

export default router;
