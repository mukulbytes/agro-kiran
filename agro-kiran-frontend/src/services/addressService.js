import axios from 'axios';
import { API_CONFIG } from '../config/api.js';
import { getAuthToken } from '../utils/auth.js';

class AddressService {
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
  }

  async getAddresses() {
    try {
      const response = await this.api.get('/addresses');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  }

  async addAddress(addressData) {
    try {
      const response = await this.api.post('/addresses', addressData);
      return response.data.data;
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  }

  async updateAddress(addressId, addressData) {
    try {
      const response = await this.api.patch(`/addresses/${addressId}`, addressData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  }
  
  async deleteAddress(addressId) {
    try {
      await this.api.delete(`/addresses/${addressId}`);
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  }

  async setDefaultAddress(addressId) {
    try {
      const response = await this.api.patch(`/addresses/${addressId}/default`);
      return response.data.data;
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  }

  getDummyAddress() {
    return {
      title: 'Home',
      fullName: 'John Doe',
      phoneNumber: '9876543210',
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    };
  }
}

export const addressService = new AddressService(); 