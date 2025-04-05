import express from 'express';
import multer from 'multer';
import { protect, restrictToAdmin, restrictTo } from '../middleware/adminMiddleware.js';
import {
  login,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  getOrderStats,
  getProductStats,
  getRecentActivity,
  getAllOrders,
  updateOrderStatus,
  getOrderDetails
} from '../controllers/adminController.js';
import { 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Public routes (no authentication required)
router.post('/login', login);

// Protected admin routes
router.use(protect);
router.use(restrictToAdmin);

// Dashboard stats
router.get('/stats/orders', getOrderStats);
router.get('/stats/products', getProductStats);
router.get('/stats/activity', getRecentActivity);

// Order management
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderDetails);
router.patch('/orders/:id/status', updateOrderStatus);

// Admin management
router.route('/:id')
  .get(getAdmin)
  .patch(updateAdmin)
  .delete(deleteAdmin);

// Product management (protected versions of existing routes)
router.use('/products', restrictTo('manageProducts'));
router.post('/products', upload.fields([
  { name: 'image5kg', maxCount: 1 },
  { name: 'image20kg', maxCount: 1 }
]), createProduct);
router.route('/products/:id')
  .patch(upload.fields([
    { name: 'image5kg', maxCount: 1 },
    { name: 'image20kg', maxCount: 1 }
  ]), updateProduct)
  .delete(deleteProduct);

export default router; 