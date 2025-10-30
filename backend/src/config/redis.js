import Redis from 'ioredis';

let redisClient = null;
let redisPubClient = null;
let redisSubClient = null;

// Solo inicializar Redis si está habilitado
if (process.env.USE_REDIS === 'true') {
  const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  };

  // Cliente principal de Redis
  redisClient = new Redis(redisConfig);
  
  // Cliente para pub/sub
  redisPubClient = new Redis(redisConfig);
  redisSubClient = new Redis(redisConfig);

  // Manejo de eventos
  redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  redisClient.on('error', (err) => {
    console.warn('⚠️  Redis error:', err.message);
  });

  redisClient.on('ready', () => {
    console.log('🚀 Redis is ready');
  });
  
  // Conectar
  redisClient.connect().catch(err => {
    console.warn('⚠️  Redis connection failed:', err.message);
  });
} else {
  console.log('⚠️  Redis not enabled (USE_REDIS=false)');
}

export { redisClient, redisPubClient, redisSubClient };

// Helper functions para cache
export const cache = {
  // Get from cache
  async get(key) {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  // Set to cache with expiration (in seconds)
  async set(key, value, expirationInSeconds = 3600) {
    try {
      await redisClient.setex(key, expirationInSeconds, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  },

  // Delete from cache
  async del(key) {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  },

  // Delete multiple keys by pattern
  async delPattern(pattern) {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
      return true;
    } catch (error) {
      console.error('Cache delete pattern error:', error);
      return false;
    }
  },

  // Check if key exists
  async exists(key) {
    try {
      const exists = await redisClient.exists(key);
      return exists === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  },

  // Get TTL of a key
  async ttl(key) {
    try {
      return await redisClient.ttl(key);
    } catch (error) {
      console.error('Cache TTL error:', error);
      return -1;
    }
  },
};

export default redisClient;
