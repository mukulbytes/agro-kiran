import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getProfile,
  updateProfile,
  updatePassword,
  deleteAccount,
  softDeleteAccount,
  getCart,
  updateCart,
  mergeCart,
  getCartTimestamp
} from '../controllers/userController.js';

const router = express.Router();

// Profile routes
router.use(protect); // All routes require authentication
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.patch('/password', updatePassword);
router.delete('/account', deleteAccount);
router.patch('/account/deactivate', softDeleteAccount);

// Cart routes
router.get('/cart', getCart);
router.get('/cart/timestamp', getCartTimestamp);
router.patch('/cart', updateCart);
router.post('/cart/merge', mergeCart);

export default router; 