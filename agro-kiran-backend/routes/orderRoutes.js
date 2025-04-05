import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { restrictToAdmin } from '../middleware/adminMiddleware.js';
import {
  createOrder,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus,
  getDeliveryOptions,
  getAllOrders
} from '../controllers/orderController.js';
import { validateOrderData } from '../middleware/orderValidation.js';

const router = express.Router();

// Public routes
router.get('/delivery-options', getDeliveryOptions);
router.post('/', validateOrderData, createOrder);

// Protected routes (require authentication)
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrderDetails);

// Admin routes (require authentication and admin role)
router.get('/', protect, restrictToAdmin, getAllOrders);
router.patch('/:id/status', protect, restrictToAdmin, updateOrderStatus);

export default router; 