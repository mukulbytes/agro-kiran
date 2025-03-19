import Product from '../models/Product.js';
import { catchAsync } from '../utils/catchAsync.js';
import { cacheService } from '../config/cache.js';

const CACHE_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  LAST_UPDATED: 'products_last_updated'
};

// Get last updated timestamp
export const getLastUpdated = catchAsync(async (req, res) => {
  let timestamp = await cacheService.get(CACHE_KEYS.LAST_UPDATED);

  if (!timestamp) {
    // If no timestamp (after ttl for set function in cache.js), get latest product update time from DB
    const latestProduct = await Product.findOne()
      .sort({ updatedAt: -1 })
      .select('updatedAt');

    timestamp = latestProduct ? latestProduct.updatedAt.getTime() : Date.now();
    await cacheService.set(CACHE_KEYS.LAST_UPDATED, timestamp);
  }

  res.status(200).json({ timestamp });
});

// Get all products with caching
export const getProducts = catchAsync(async (req, res) => {
  // Try to get products from cache
  let products = await cacheService.get(CACHE_KEYS.PRODUCTS);

  if (!products) {
    // If not in cache, get from database
    products = await Product.find({ status: 'active' });

    // Update cache
    await cacheService.set(CACHE_KEYS.PRODUCTS, JSON.parse(JSON.stringify(products)));
    await cacheService.set(CACHE_KEYS.LAST_UPDATED, Date.now());
  }
  // Send response to client
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: products
  });
});

// Get single product with caching
export const getProduct = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const cacheKey = `${CACHE_KEYS.PRODUCT || 'product'}:${productId}`; // Ensure cache key is valid

  // Try to get the product from Redis
  let product = await cacheService.get(cacheKey);

  if (!product) {
    // If not found in cache, fetch from MongoDB
    product = await Product.findOne({ id: productId, status: 'active' });

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Cache the product data
    await cacheService.set(cacheKey, JSON.parse(JSON.stringify(product)));
  }

  res.status(200).json({
    status: 'success',
    data: product
  });
});

// Create new product
export const createProduct = catchAsync(async (req, res) => {
  const product = await Product.create(req.body);

  // Invalidate cache when products change
  await cacheService.delete(CACHE_KEYS.PRODUCTS);
  await cacheService.set(CACHE_KEYS.LAST_UPDATED, Date.now());

  res.status(201).json({
    status: 'success',
    data: product
  });
});