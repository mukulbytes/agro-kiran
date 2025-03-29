class CacheService {
  constructor() {
    this.memoryCache = new Map();
  }

  async get(key) {
    // First check memory cache
    if (this.memoryCache.has(key)) {
      const { value, expiry } = this.memoryCache.get(key);
      if (expiry > Date.now()) {
        return value;
      }
      // Remove expired item
      this.memoryCache.delete(key);
    }

    // Then check localStorage
    const item = localStorage.getItem(key);
    if (item) {
      const { value, expiry } = JSON.parse(item);
      if (expiry > Date.now()) {
        // Update memory cache
        this.memoryCache.set(key, { value, expiry });
        return value;
      }
      // Remove expired item
      localStorage.removeItem(key);
    }

    return null;
  }

  async set(key, value, ttl = 7200) { // default 2 hours in seconds
    const expiry = Date.now() + (ttl * 1000);
    const item = { value, expiry };

    // Set in memory cache
    this.memoryCache.set(key, item);

    // Set in localStorage
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error setting cache in localStorage:', error);
      // If localStorage fails (e.g., quota exceeded), just keep in memory
    }
  }

  async delete(key) {
    // Remove from memory cache
    this.memoryCache.delete(key);

    // Remove from localStorage
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing cache from localStorage:', error);
    }
  }

  async clear() {
    // Clear memory cache
    this.memoryCache.clear();

    // Clear localStorage
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

export const cacheService = new CacheService(); 