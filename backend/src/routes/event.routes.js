import express from 'express';
import { getEvents, getEvent, getCalendar } from '../controllers/event.controller.js';

const router = express.Router();

// Rutas públicas
router.get('/', getEvents);
router.get('/:id', getEvent);
router.get('/calendar/shows', getCalendar);

export default router;
