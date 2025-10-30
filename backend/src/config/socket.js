import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { redisPubClient, redisSubClient } from './redis.js';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Usar Redis adapter para escalabilidad (solo si Redis está habilitado)
  if (redisPubClient && redisSubClient) {
    io.adapter(createAdapter(redisPubClient, redisSubClient));
    console.log('🔌 Socket.IO using Redis adapter');
  } else {
    console.log('🔌 Socket.IO using default adapter (no Redis)');
  }

  // Middleware de autenticación
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    // TODO: Verificar JWT token
    // Por ahora permitimos la conexión
    next();
  });

  // Eventos de conexión
  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Join room por user ID
    socket.on('join', (data) => {
      const { userId, userType } = data;
      socket.join(`user:${userId}`);
      socket.join(`type:${userType}`);
      console.log(`User ${userId} joined rooms`);
    });

    // Leave room
    socket.on('leave', (data) => {
      const { userId } = data;
      socket.leave(`user:${userId}`);
      console.log(`User ${userId} left room`);
    });

    // Update location (para conductores)
    socket.on('updateLocation', (data) => {
      const { providerId, location } = data;
      // Broadcast location to relevant users
      socket.to(`provider:${providerId}`).emit('locationUpdate', {
        providerId,
        location,
        timestamp: new Date(),
      });
    });

    // Trip events
    socket.on('tripUpdate', (data) => {
      const { tripId, status, userId, providerId } = data;
      
      // Notify user
      if (userId) {
        io.to(`user:${userId}`).emit('tripStatusUpdate', {
          tripId,
          status,
          timestamp: new Date(),
        });
      }
      
      // Notify provider
      if (providerId) {
        io.to(`user:${providerId}`).emit('tripStatusUpdate', {
          tripId,
          status,
          timestamp: new Date(),
        });
      }
    });

    // Chat messages
    socket.on('chatMessage', (data) => {
      const { tripId, senderId, receiverId, message } = data;
      
      io.to(`user:${receiverId}`).emit('newMessage', {
        tripId,
        senderId,
        message,
        timestamp: new Date(),
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  console.log('🚀 Socket.IO initialized');
  return io;
};

// Helper para emitir eventos desde cualquier parte del código
export const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

export const emitToRoom = (room, event, data) => {
  if (io) {
    io.to(room).emit(event, data);
  }
};

export const getIO = () => io;

export default { initializeSocket, emitToUser, emitToRoom, getIO };
