import express from 'express';
import { getNews, getNewsById, getLocalNews } from '../controllers/news.controller.js';

const router = express.Router();

// Rutas públicas
router.get('/', getNews);
router.get('/local', getLocalNews);
router.get('/:id', getNewsById);

export default router;
