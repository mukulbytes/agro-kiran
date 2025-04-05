import Product from '../models/productModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import { cacheService } from '../config/cache.js';
import AppError from '../utils/appError.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';

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
    products = await Product.find();

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
  const cacheKey = `${CACHE_KEYS.PRODUCT}:${productId}`;

  // Try to get the product from Redis
  let product = await cacheService.get(cacheKey);

  if (!product) {
    // If not found in cache, fetch from MongoDB
    product = await Product.findOne({ id: productId });

    if (!product) {
      throw new AppError('Product not found', 404);
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
  // Parse the data if it's sent as FormData
  let productData = req.body;
  if (req.body.data) {
    productData = JSON.parse(req.body.data);
  }

  // Validate required fields
  const requiredFields = ['id', 'title', 'shortDesc', 'highlights', 'price', 'stock', 'category'];
  const missingFields = requiredFields.filter(field => !productData[field]);
  
  if (missingFields.length > 0) {
    throw new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400);
  }

  // Handle image uploads if provided
  if (req.files) {
    const img = {};
    
    if (req.files.image5kg) {
      img['5kg'] = await uploadImage(req.files.image5kg[0].path, '5kg');
    }
    if (req.files.image20kg) {
      img['20kg'] = await uploadImage(req.files.image20kg[0].path, '20kg');
    }
    
    productData.img = img;
  }

  // Create product
  const product = await Product.create(productData);

  // Invalidate cache
  await cacheService.delete(CACHE_KEYS.PRODUCTS);
  await cacheService.delete(`${CACHE_KEYS.PRODUCT}:${product.id}`);
  await cacheService.set(CACHE_KEYS.LAST_UPDATED, Date.now());

  res.status(201).json({
    status: 'success',
    data: product
  });
});

// Update product
export const updateProduct = catchAsync(async (req, res) => {
  const productId = req.params.id;

  // Get existing product
  const existingProduct = await Product.findOne({ id: productId });
  if (!existingProduct) {
    throw new AppError('Product not found', 404);
  }

  // Handle image uploads if provided
  if (req.files) {
    const img = { ...existingProduct.img };
    
    if (req.files.image5kg) {
      // Delete old image if exists
      if (img['5kg']) {
        await deleteImage(img['5kg']);
      }
      img['5kg'] = await uploadImage(req.files.image5kg[0].path, '5kg');
    }
    
    if (req.files.image20kg) {
      // Delete old image if exists
      if (img['20kg']) {
        await deleteImage(img['20kg']);
      }
      img['20kg'] = await uploadImage(req.files.image20kg[0].path, '20kg');
    }
    
    req.body.img = img;
  }

  // Update product
  const product = await Product.findOneAndUpdate(
    { id: productId },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  // Invalidate cache
  await cacheService.delete(CACHE_KEYS.PRODUCTS);
  await cacheService.delete(`${CACHE_KEYS.PRODUCT}:${productId}`);
  await cacheService.set(CACHE_KEYS.LAST_UPDATED, Date.now());

  res.status(200).json({
    status: 'success',
    data: product
  });
});

// Delete product
export const deleteProduct = catchAsync(async (req, res) => {
  const productId = req.params.id;

  // Get product before deletion
  const product = await Product.findOne({ id: productId });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Delete images from Cloudinary
  if (product.img) {
    if (product.img['5kg']) {
      await deleteImage(product.img['5kg']);
    }
    if (product.img['20kg']) {
      await deleteImage(product.img['20kg']);
    }
  }

  // Delete product from database
  await Product.findOneAndDelete({ id: productId });

  // Invalidate cache
  await cacheService.delete(CACHE_KEYS.PRODUCTS);
  await cacheService.delete(`${CACHE_KEYS.PRODUCT}:${productId}`);
  await cacheService.set(CACHE_KEYS.LAST_UPDATED, Date.now());

  res.status(204).json({
    status: 'success',
    data: null
  });
});