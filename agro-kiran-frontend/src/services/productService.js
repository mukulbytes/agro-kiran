import axios from 'axios';
import dayjs from 'dayjs';
import { API_CONFIG } from '../config/api.js';

const CACHE_KEYS = {
  PRODUCTS: 'cached_products',
  TIMESTAMP: 'products_timestamp'
};

class ProductService {
  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    this.memoryCache = null;
  }

  async getLastUpdated() {
    try {
      const response = await this.api.get('/products/timestamp');
      return response.data.timestamp;
    } catch (error) {
      console.error('Error getting last updated timestamp:', error);
      throw error;
    }
  }

  validateProductData(products) {
    if (!Array.isArray(products)) return false;

    return products.every(product => {
      return (
        product &&
        typeof product === 'object' &&
        product.id &&
        product.title &&
        product.img &&
        typeof product.img === 'object' &&
        product.img['5kg'] &&
        product.img['20kg'] &&
        product.price &&
        typeof product.price === 'object' &&
        typeof product.price['5kg'] === 'number' &&
        typeof product.price['20kg'] === 'number' &&
        product.highlights &&
        product.highlights.li1 &&
        product.highlights.li2 &&
        product.highlights.li3
      );
    });
  }

  async getCachedProducts() {
    // First check memory cache
    if (this.memoryCache) {
      return this.memoryCache;
    }

    // Then check localStorage
    const cachedData = localStorage.getItem(CACHE_KEYS.PRODUCTS);
    const cachedTimestamp = localStorage.getItem(CACHE_KEYS.TIMESTAMP);

    if (!cachedData || !cachedTimestamp) {
      return null;
    }

    try {
      // Check if cache is still valid
      const serverTimestamp = await this.getLastUpdated();
      if (dayjs(Number(cachedTimestamp)).isBefore(dayjs(serverTimestamp))) {
        return null;
      }

      const parsedData = JSON.parse(cachedData);
      if (this.validateProductData(parsedData)) {
        this.memoryCache = parsedData; // Update memory cache
        return parsedData;
      }

      // If validation fails, clear invalid cache
      this.clearCache();
      return null;
    } catch (error) {
      console.error('Error checking cache validity:', error);
      return null;
    }
  }

  async fetchProducts() {
    try {
      // Try to get from cache first
      const cachedProducts = await this.getCachedProducts();
      if (cachedProducts) {
        return cachedProducts;
      }

      // If not in cache or invalid, fetch from API
      const response = await this.api.get(API_CONFIG.ENDPOINTS.PRODUCTS);

      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to fetch products');
      }

      const products = response.data.data;

      // Validate API response data before caching
      if (this.validateProductData(products)) {
        // Update both memory and localStorage cache
        this.memoryCache = products;
        localStorage.setItem(CACHE_KEYS.PRODUCTS, JSON.stringify(products));
        localStorage.setItem(CACHE_KEYS.TIMESTAMP, Date.now().toString());
        return products;
      }

      throw new Error('Invalid product data structure received from API');
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server responded with error:', error.response.data);
        throw new Error(error.response.data.message || 'Server error');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
        throw error;
      }
    }
  }

  clearCache() {
    this.memoryCache = null;
    localStorage.removeItem(CACHE_KEYS.PRODUCTS);
    localStorage.removeItem(CACHE_KEYS.TIMESTAMP);
  }
}

export const productService = new ProductService();