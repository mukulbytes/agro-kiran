import axios from 'axios';
import { API_CONFIG } from '../config/api.js';
import { getAuthToken } from '../utils/auth.js';
import { cacheService } from './cacheService.js';

class OrderService {
  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add auth token to requests if available
    this.api.interceptors.request.use(config => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async createOrder(orderData) {
    try {
      const response = await this.api.post('/orders', orderData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getOrders() {
    try {
      const response = await this.api.get('/orders');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async getOrderDetails(orderId) {
    try {
      const response = await this.api.get(`/orders/${orderId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }

  async getDeliveryOptions() {
    try {
      // Try to get from cache first
      const cachedOptions = await cacheService.get('delivery_options');
      if (cachedOptions) {
        return cachedOptions;
      }

      // If not in cache, fetch from API
      const response = await this.api.get('/orders/delivery-options');
      const options = response.data.data;

      // Cache the result
      await cacheService.set('delivery_options', options);

      return options;
    } catch (error) {
      console.error('Error fetching delivery options:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService(); 