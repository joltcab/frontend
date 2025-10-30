import express from 'express';
import { estimateFare, createTrip, getUserTrips } from '../controllers/trip.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Ruta pública para estimar tarifa
router.post('/estimate', estimateFare);

// Rutas protegidas
router.post('/', protect, createTrip);
router.get('/', protect, getUserTrips);

export default router;
