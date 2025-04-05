import express from "express";
import multer from 'multer';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getLastUpdated } from '../controllers/productController.js';

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

// Get last updated timestamp
router.get("/timestamp", getLastUpdated);

// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getProduct);

// Create new product with image upload
router.post("/", upload.fields([
  { name: 'image5kg', maxCount: 1 },
  { name: 'image20kg', maxCount: 1 }
]), createProduct);

// Update product with image upload
router.patch("/:id", upload.fields([
  { name: 'image5kg', maxCount: 1 },
  { name: 'image20kg', maxCount: 1 }
]), updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

export default router;
