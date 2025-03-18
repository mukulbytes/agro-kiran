import express from "express";
import { getProducts, getProduct, createProduct, getLastUpdated } from '../controllers/productController.js';

const router = express.Router();

// Get last updated timestamp
router.get("/timestamp", getLastUpdated);

// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getProduct);

// Create new product
router.post("/", createProduct);

export default router;
