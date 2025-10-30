import express from 'express';
import {
  seedRoles,
  getRoles,
  updateRole,
} from '../controllers/role.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

router.post('/seed', seedRoles);
router.get('/', getRoles);
router.put('/:id', updateRole);

export default router;
