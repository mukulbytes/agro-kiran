import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { cacheService } from '../config/cache.js';

const CACHE_KEYS = {
  CART: 'cart',
  CART_TIMESTAMP: 'cart_timestamp'
};

// Get cart last updated timestamp
export const getCartTimestamp = catchAsync(async (req, res) => {
  const cacheKey = `${CACHE_KEYS.CART_TIMESTAMP}:${req.user._id}`;
  let timestamp = await cacheService.get(cacheKey);

  if (!timestamp) {
    // If no timestamp in cache, get user's updatedAt time
    const user = await User.findById(req.user._id);
    timestamp = user.updatedAt.getTime();
    await cacheService.set(cacheKey, timestamp);
  }

  res.status(200).json({ timestamp });
});

// Get user profile
export const getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  res.status(200).json({
    status: 'success',
    data: user
  });
});

// Update user profile
export const updateProfile = catchAsync(async (req, res) => {
  const { name, email } = req.body;

  // Check if email is already taken
  if (email && email !== req.user.email) {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true }
  ).select('-password');

  res.status(200).json({
    status: 'success',
    data: user
  });
});

// Update password
export const updatePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  const isCorrect = await user.comparePassword(currentPassword);
  if (!isCorrect) {
    throw new AppError('Current password is incorrect', 401);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully'
  });
});

// Delete account
export const deleteAccount = catchAsync(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Soft delete account
export const softDeleteAccount = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  await user.softDelete();

  res.status(200).json({
    status: 'success',
    message: 'Account deactivated successfully'
  });
});

// Get user cart with caching
export const getCart = catchAsync(async (req, res) => {
  const cacheKey = `${CACHE_KEYS.CART}:${req.user._id}`;
  let cart = await cacheService.get(cacheKey);

  if (!cart) {
    const user = await User.findById(req.user._id);

    // Transform cart data to match frontend structure
    cart = user.cart.map(item => ({
      productId: item.productId,
      variant: item.variant,
      quantity: item.quantity,
      deliveryOptionId: item.deliveryOptionId,
    }));

    // Cache the cart data
    await cacheService.set(cacheKey, cart);
  }

  res.status(200).json({
    status: 'success',
    data: cart
  });
});

// Update cart
export const updateCart = catchAsync(async (req, res) => {
  const { cart } = req.body;
  
  // Validate cart items
  if (!Array.isArray(cart)) {
    throw new AppError('Invalid cart data', 400);
  }

  // Validate that all products exist
  const productIds = cart.map(item => item.productId);
  const products = await Product.find({ id: { $in: productIds } });
  
  if (products.length !== new Set(productIds).size) {
    throw new AppError('One or more products not found', 400);
  }

  // Update user's cart
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { cart },
    { new: true }
  );

  // Transform cart data
  const transformedCart = user.cart.map(item => ({
    productId: item.productId,
    variant: item.variant,
    quantity: item.quantity,
    deliveryOptionId: item.deliveryOptionId,
  }));

  // Update cache
  const cartCacheKey = `${CACHE_KEYS.CART}:${req.user._id}`;
  const timestampCacheKey = `${CACHE_KEYS.CART_TIMESTAMP}:${req.user._id}`;
  await cacheService.set(cartCacheKey, transformedCart);
  await cacheService.set(timestampCacheKey, Date.now());

  res.status(200).json({
    status: 'success',
    data: transformedCart
  });
});

// Merge guest cart with user cart
export const mergeCart = catchAsync(async (req, res) => {
  const { guestCart } = req.body;

  // Validate guest cart
  if (!Array.isArray(guestCart)) {
    throw new AppError('Invalid guest cart data', 400);
  }

  // Validate that all products exist
  const productIds = guestCart.map(item => item.productId);
  const products = await Product.find({ id: { $in: productIds } });

  if (products.length !== new Set(productIds).size) {
    throw new AppError('One or more products not found', 400);
  }

  const user = await User.findById(req.user._id);
  await user.mergeCart(guestCart);

  // Get updated user with merged cart
  const updatedUser = await User.findById(req.user._id);

  // Transform cart data
  const transformedCart = updatedUser.cart.map(item => ({
    productId: item.productId,
    variant: item.variant,
    quantity: item.quantity,
    deliveryOptionId: item.deliveryOptionId,
  }));

  // Update cache
  const cartCacheKey = `${CACHE_KEYS.CART}:${req.user._id}`;
  const timestampCacheKey = `${CACHE_KEYS.CART_TIMESTAMP}:${req.user._id}`;
  await cacheService.set(cartCacheKey, transformedCart);
  await cacheService.set(timestampCacheKey, Date.now());

  res.status(200).json({
    status: 'success',
    data: transformedCart
  });
}); 