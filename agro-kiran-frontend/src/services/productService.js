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
 
    if (this.memoryCache) {
      return this.memoryCache;
    }


    const cachedData = localStorage.getItem(CACHE_KEYS.PRODUCTS);
    const cachedTimestamp = localStorage.getItem(CACHE_KEYS.TIMESTAMP);

    if (!cachedData || !cachedTimestamp) {
      return null;
    }

    try {
  
      const serverTimestamp = await this.getLastUpdated();
      if (dayjs(Number(cachedTimestamp)).isBefore(dayjs(serverTimestamp))) {
        return null;
      }

      const parsedData = JSON.parse(cachedData);
      if (this.validateProductData(parsedData)) {
        this.memoryCache = parsedData; 
        return parsedData;
      }

  
      this.clearCache();
      return null;
    } catch (error) {
      console.error('Error checking cache validity:', error);
      return null;
    }
  }

  async fetchProducts() {
    try {

      const cachedProducts = await this.getCachedProducts();
      if (cachedProducts) {
        return cachedProducts;
      }


      const response = await this.api.get(API_CONFIG.ENDPOINTS.PRODUCTS);

      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to fetch products');
      }

      const products = response.data.data;


      if (this.validateProductData(products)) {

        this.memoryCache = products;
        localStorage.setItem(CACHE_KEYS.PRODUCTS, JSON.stringify(products));
        localStorage.setItem(CACHE_KEYS.TIMESTAMP, Date.now().toString());
        return products;
      }

      throw new Error('Invalid product data structure received from API');
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.response) {
        console.error('Server responded with error:', error.response.data);
        throw new Error(error.response.data.message || 'Server error');
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check your internet connection.');
      } else {
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