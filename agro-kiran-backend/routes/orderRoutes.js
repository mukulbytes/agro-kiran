import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createOrder,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus,
  getDeliveryOptions
} from '../controllers/orderController.js';
import { validateOrderData } from '../middleware/orderValidation.js';

const router = express.Router();

// Public routes
router.get('/delivery-options', getDeliveryOptions);
router.post('/', validateOrderData, createOrder);

// Protected routes (require authentication)
router.get('/', protect, getUserOrders);
router.get('/:id', getOrderDetails);
router.patch('/:id', protect, updateOrderStatus);

export default router; 