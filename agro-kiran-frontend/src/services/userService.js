import axios from 'axios';
import { API_CONFIG } from '../config/api.js';
import { getAuthToken, clearAuthToken, isAuthenticated } from '../utils/auth.js';
import dayjs from 'dayjs';

const CACHE_KEYS = {
  CART: 'cart',
  CART_TIMESTAMP: 'cart_timestamp'
};

class UserService {
  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add auth token to requests
    this.api.interceptors.request.use(config => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.memoryCache = null;
    this.lastTimestampCheck = 0;
    this.timestampCheckInterval = 30000; // 30 seconds
  }

  // Get last updated timestamp from server with throttling
  async getLastCartUpdate() {
    const now = Date.now();
    
    // If we checked timestamp recently, return cached value
    if (now - this.lastTimestampCheck < this.timestampCheckInterval) {
      return localStorage.getItem(CACHE_KEYS.CART_TIMESTAMP);
    }

    try {
      const response = await this.api.get('/users/cart/timestamp');
      this.lastTimestampCheck = now;
      return response.data.timestamp;
    } catch (error) {
      console.error('Error getting cart timestamp:', error);
      // On error, extend the current timestamp's validity
      return localStorage.getItem(CACHE_KEYS.CART_TIMESTAMP);
    }
  }

  // Validate cart data structure
  validateCartData(cart) {
    if (!Array.isArray(cart)) return false;

    return cart.every(item => {
      return (
        item &&
        typeof item === 'object' &&
        item.productId &&
        typeof item.quantity === 'number' &&
        item.quantity > 0 &&
        ['5kg', '20kg'].includes(item.variant) &&
        typeof item.deliveryOptionId === 'string'
      );
    });
  }

  // Get cart with optimized timestamp validation
  async getCart() {
    // Return memory cache if available
    if (this.memoryCache) {
      return this.memoryCache;
    }

    // For guest users, just return local cart
    if (!isAuthenticated()) {
      const localCart = JSON.parse(localStorage.getItem(CACHE_KEYS.CART)) || [];
      this.memoryCache = localCart;
      return localCart;
    }

    try {
      const cachedCart = localStorage.getItem(CACHE_KEYS.CART);
      const cachedTimestamp = localStorage.getItem(CACHE_KEYS.CART_TIMESTAMP);

      // If we have a cached cart and it's less than 30 seconds old, use it
      if (cachedCart && cachedTimestamp) {
        const age = Date.now() - Number(cachedTimestamp);
        if (age < this.timestampCheckInterval) {
          const parsedCart = JSON.parse(cachedCart);
          this.memoryCache = parsedCart;
          return parsedCart;
        }
      }

      // Fetch cart from server
      const response = await this.api.get('/users/cart');
      const serverCart = response.data.data || [];

      // Update local storage and memory cache
      localStorage.setItem(CACHE_KEYS.CART, JSON.stringify(serverCart));
      localStorage.setItem(CACHE_KEYS.CART_TIMESTAMP, Date.now().toString());
      this.memoryCache = serverCart;

      return serverCart;
    } catch (error) {
      console.error('Error fetching cart:', error);
      // On error, return cached cart if available, otherwise empty array
      return JSON.parse(localStorage.getItem(CACHE_KEYS.CART)) || [];
    }
  }

  // Clear cart from localStorage and backend if authenticated
  async clearCart() {
    this.memoryCache = null;
    localStorage.removeItem(CACHE_KEYS.CART);
    localStorage.removeItem(CACHE_KEYS.CART_TIMESTAMP);
    
    if (isAuthenticated()) {
      try {
        await this.updateCart([]);
      } catch (error) {
        console.error('Error clearing cart on server:', error);
        throw error;
      }
    }
  }

  async getProfile() {
    try {
      const response = await this.api.get('/users/profile');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await this.api.patch('/users/profile', profileData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async updatePassword(passwordData) {
    try {
      const response = await this.api.patch('/users/password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  async deactivateAccount() {
    try {
      await this.api.patch('/users/account/deactivate');
      clearAuthToken();
    } catch (error) {
      console.error('Error deactivating account:', error);
      throw error;
    }
  }

  async deleteAccount() {
    try {
      await this.api.delete('/users/account');
      clearAuthToken();
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }

  async updateCart(cartData) {
    try {
      if (isAuthenticated()) {
        const response = await this.api.patch('/users/cart', { cart: cartData });
        this.memoryCache = response.data.data;
        localStorage.setItem(CACHE_KEYS.CART, JSON.stringify(response.data.data));
        localStorage.setItem(CACHE_KEYS.CART_TIMESTAMP, Date.now().toString());
        return response.data.data;
      } else {
        // For guest users, just update localStorage
        this.memoryCache = cartData;
        localStorage.setItem(CACHE_KEYS.CART, JSON.stringify(cartData));
        return cartData;
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  }

  async mergeCart(guestCart) {
    try {
      const response = await this.api.post('/users/cart/merge', { guestCart });
      this.memoryCache = response.data.data;
      localStorage.setItem(CACHE_KEYS.CART, JSON.stringify(response.data.data));
      localStorage.setItem(CACHE_KEYS.CART_TIMESTAMP, Date.now().toString());
      return response.data.data;
    } catch (error) {
      console.error('Error merging cart:', error);
      throw error;
    }
  }

  // Handle cart after login
  async handleCartAfterLogin() {
    try {
      // Get guest cart from localStorage
      const guestCart = JSON.parse(localStorage.getItem(CACHE_KEYS.CART)) || [];
      
      if (guestCart.length > 0) {
        // Merge guest cart with user's cart
        return await this.mergeCart(guestCart);
      }
      
      // If no guest cart, get user's cart from server
      const response = await this.api.get('/users/cart');
      const userCart = response.data.data;
      
      this.memoryCache = userCart;
      localStorage.setItem(CACHE_KEYS.CART, JSON.stringify(userCart));
      localStorage.setItem(CACHE_KEYS.CART_TIMESTAMP, Date.now().toString());
      return userCart;
    } catch (error) {
      console.error('Error handling cart after login:', error);
      throw error;
    }
  }
}

export const userService = new UserService(); 