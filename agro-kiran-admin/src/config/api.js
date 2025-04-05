const node_environment = "production";
export const API_CONFIG = {
  BASE_URL: node_environment === 'production'
    ? 'https://agro-kiran-backend.onrender.com/api'
    : 'http://localhost:8080/api',
  ENDPOINTS: {
    PRODUCTS: '/products',
    ADMIN: {
      LOGIN: '/admin/login',
      PRODUCTS: '/admin/products',
      ORDERS: '/admin/orders',
      STATS: {
        ORDERS: '/admin/stats/orders',
        PRODUCTS: '/admin/stats/products',
        ACTIVITY: '/admin/stats/activity'
      }
    }
  }
}; 