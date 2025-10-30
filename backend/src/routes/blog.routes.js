import express from 'express';
import { getPosts, getPost } from '../controllers/blog.controller.js';

const router = express.Router();

// Rutas públicas
router.get('/posts', getPosts);
router.get('/posts/:id', getPost);

export default router;
