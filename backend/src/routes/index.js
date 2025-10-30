import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import aiRoutes from './ai.routes.js';
import eventRoutes from './event.routes.js';
import newsRoutes from './news.routes.js';
import blogRoutes from './blog.routes.js';
import notificationRoutes from './notification.routes.js';
import tripRoutes from './trip.routes.js';
import statsRoutes from './stats.routes.js';
import adminRoutes from './admin.routes.js';
import setupRoutes from './setup.routes.js';
import roleRoutes from './role.routes.js';
import settingsRoutes from './settings.routes.js';

const router = express.Router();

// Rutas de la API
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admins', adminRoutes);
router.use('/setup', setupRoutes);
router.use('/roles', roleRoutes);
router.use('/settings', settingsRoutes);
router.use('/trips', tripRoutes);
router.use('/ai', aiRoutes);
router.use('/events', eventRoutes);
router.use('/calendar', eventRoutes); // Alias para eventos
router.use('/news', newsRoutes);
router.use('/blog', blogRoutes);
router.use('/notifications', notificationRoutes);
router.use('/stats', statsRoutes);

// Ruta de información de la API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'JoltCab REST API',
    version: process.env.API_VERSION || 'v1',
    endpoints: {
      auth: '/auth',
      users: '/users',
      ai: '/ai',
      events: '/events',
      calendar: '/calendar',
      news: '/news',
      blog: '/blog',
      notifications: '/notifications',
    },
    documentation: 'https://docs.joltcab.com',
  });
});

export default router;
