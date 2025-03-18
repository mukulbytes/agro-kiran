import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

const redisClient = createClient({
  url: process.env.REDIS_URL
});

// Handle Redis connection
redisClient.on('error', err => console.error('❌ Redis Client Error:', err));
redisClient.on('connect', () => console.log('✅ Redis Client Connected'));

// Add error handling for the initial connection
const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    // Optionally implement retry logic here
  }
};

connectRedis();

class CacheService {
  async get(key) {
    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('❌ Redis GET Error:', error);
      return null;
    }
  }

  async set(key, value, ttl = 7200) { // default 2 hours in seconds
    try {
      const stringValue = JSON.stringify(value);
      await redisClient.set(key, stringValue);
      if (ttl) {
        await redisClient.expire(key, ttl);
      }
      return true;
    } catch (error) {
      console.error('Redis SET Error:', error);
      return false;
    }
  }

  async delete(key) {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Redis DELETE Error:', error);
      return false;
    }
  }

  async clear() {
    try {
      await redisClient.flushAll();
      return true;
    } catch (error) {
      console.error('Redis CLEAR Error:', error);
      return false;
    }
  }

}

export const cacheService = new CacheService(); 
