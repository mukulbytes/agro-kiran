const node_environment = "production";
export const API_CONFIG = {
  BASE_URL: node_environment === 'production'
    ? 'https://agro-kiran-backend.onrender.com/api'
    : 'http://localhost:8080/api',
  ENDPOINTS: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    PRODUCTS: '/products',
    CHAT: {
      SEND_MESSAGE: '/chat/message',
      GET_HISTORY: '/chat/history'
    }
  }
}; 