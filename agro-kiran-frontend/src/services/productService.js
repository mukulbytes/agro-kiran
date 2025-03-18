import axios from 'axios';
import dayjs from 'dayjs';
import { API_CONFIG } from '../config/api';

const CACHE_KEYS = {
  PRODUCTS: 'cached_products',
  TIMESTAMP: 'products_timestamp'
};

class ProductService {
  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL
    });
  }

  async getLastUpdated() {
    const response = await this.api.get('/products/timestamp');
    return response.data.timestamp;
  }

  async getCachedProducts() {
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
      return JSON.parse(cachedData);
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
        // Validate cached data structure
        if (this.validateProductData(cachedProducts)) {
          return cachedProducts;
        }
        // If validation fails, clear invalid cache
        localStorage.removeItem(CACHE_KEYS.PRODUCTS);
        localStorage.removeItem(CACHE_KEYS.TIMESTAMP);
      }

      // If not in cache or invalid, fetch from API
      const response = await this.api.get('/products');
      const products = response.data.data;

      // Validate API response data before caching
      if (this.validateProductData(products)) {
        // Update cache
        localStorage.setItem(CACHE_KEYS.PRODUCTS, JSON.stringify(products));
        localStorage.setItem(CACHE_KEYS.TIMESTAMP, dayjs().valueOf().toString());

        return products;
      }
      throw new Error('Invalid product data structure received from API');
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Validate product data structure
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
}

export const productService = new ProductService(); 