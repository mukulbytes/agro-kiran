export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://agro-kiran-backend.onrender.com/api'
    : 'http://localhost:8080/api',
  ENDPOINTS: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    PRODUCTS: '/products'
  }
}; 