import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'http';
import { connectDB } from './config/database.js';
import { checkPostgresConnection } from './config/postgres.js';
import { redisClient } from './config/redis.js';
import { initializeSocket } from './config/socket.js';
import { initializeFirebase } from './config/firebase.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import routes from './routes/index.js';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 4000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Crear servidor HTTP para Socket.IO
const server = http.createServer(app);

// Conectar a MongoDB
connectDB();

// Conectar a PostgreSQL (opcional)
if (process.env.DATABASE_URL) {
  checkPostgresConnection();
}

// Inicializar Redis (opcional)
if (process.env.USE_REDIS === 'true') {
  // Redis ya se inicializa automáticamente al importar
  console.log('📦 Redis enabled');
}

// Inicializar Socket.IO
const io = initializeSocket(server);

// Inicializar Firebase (opcional)
if (process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_SERVICE_ACCOUNT) {
  initializeFirebase();
}

// Middlewares de seguridad
app.use(helmet());
app.use(compression());

// CORS - Permitir frontend
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('⚠️  CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'JoltCab REST API',
    status: 'healthy',
    version: API_VERSION,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use(`/api/${API_VERSION}`, routes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Iniciar servidor
server.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 JoltCab REST API');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📋 API Version: ${API_VERSION}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api/${API_VERSION}`);
  console.log(`🔌 Socket.IO ready for real-time connections`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

export default app;
