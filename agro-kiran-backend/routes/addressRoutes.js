import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/addressController.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.route('/')
  .get(getUserAddresses)
  .post(addAddress);

router.route('/:id')
  .patch(updateAddress)
  .delete(deleteAddress);

router.patch('/:id/default', setDefaultAddress);

export default router; 