const node_environment = "development";
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
    },
    USER: {
      PASSWORD: '/users/password',
      DEACTIVATE: '/users/account/deactivate',
      DELETE: '/users/account/delete',
      PROFILE: '/users/profile',
      CART: '/users/cart',
      CART_TIMESTAMP: '/users/cart/timestamp',
      CART_MERGE: '/users/cart/merge',
      WISHLIST: '/users/wishlist',
      WISHLIST_TIMESTAMP: '/users/wishlist/timestamp'
    }
  }
}; 