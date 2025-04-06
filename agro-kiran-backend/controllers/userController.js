import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { cacheService } from '../config/cache.js';

const CACHE_KEYS = {
  CART: 'cart',
  CART_TIMESTAMP: 'cart_timestamp'
};

// Wishlist related operations
const WISHLIST_CACHE_KEYS = {
  WISHLIST: 'wishlist',
  WISHLIST_TIMESTAMP: 'wishlist_timestamp'
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

// Get wishlist timestamp
export const getWishlistTimestamp = catchAsync(async (req, res) => {
  const cacheKey = `${WISHLIST_CACHE_KEYS.WISHLIST_TIMESTAMP}:${req.user._id}`;
  let timestamp = await cacheService.get(cacheKey);

  if (!timestamp) {
    const user = await User.findById(req.user._id);
    timestamp = user.updatedAt.getTime();
    await cacheService.set(cacheKey, timestamp);
  }

  res.status(200).json({ timestamp });
});

// Get user wishlist with caching
export const getWishlist = catchAsync(async (req, res) => {
  const cacheKey = `${WISHLIST_CACHE_KEYS.WISHLIST}:${req.user._id}`;
  let wishlist = await cacheService.get(cacheKey);

  if (!wishlist) {
    const user = await User.findById(req.user._id);
    wishlist = user.wishlist;
    await cacheService.set(cacheKey, wishlist);
  }

  res.status(200).json({
    status: 'success',
    data: wishlist
  });
});

// Add product to wishlist
export const addToWishlist = catchAsync(async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    throw new AppError('Product ID is required', 400);
  }

  try {
    // Check if product exists
    const product = await Product.findOne({ id: productId });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Check if product is already in wishlist
    const user = await User.findById(req.user._id);
    const existingItem = user.wishlist.find(item => item.productId === productId);

    if (existingItem) {
      throw new AppError('Product already in wishlist', 400);
    }

    // Add to wishlist with addedAt timestamp
    user.wishlist.push({
      productId,
      addedAt: new Date()
    });

    await user.save();

    // Update cache
    const wishlistCacheKey = `${WISHLIST_CACHE_KEYS.WISHLIST}:${req.user._id}`;
    const timestampCacheKey = `${WISHLIST_CACHE_KEYS.WISHLIST_TIMESTAMP}:${req.user._id}`;
    await cacheService.set(wishlistCacheKey, user.wishlist);
    await cacheService.set(timestampCacheKey, Date.now());

    res.status(200).json({
      status: 'success',
      data: user.wishlist
    });
  } catch (error) {
    console.error('Error in addToWishlist:', error);
    throw new AppError(error.message || 'Error adding product to wishlist', error.status || 500);
  }
});

// Remove product from wishlist
export const removeFromWishlist = catchAsync(async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    throw new AppError('Product ID is required', 400);
  }

  // Remove from wishlist
  const user = await User.findById(req.user._id);
  const itemIndex = user.wishlist.findIndex(item => item.productId === productId);

  if (itemIndex === -1) {
    throw new AppError('Product not found in wishlist', 404);
  }

  user.wishlist.splice(itemIndex, 1);
  await user.save();

  // Update cache
  const wishlistCacheKey = `${WISHLIST_CACHE_KEYS.WISHLIST}:${req.user._id}`;
  const timestampCacheKey = `${WISHLIST_CACHE_KEYS.WISHLIST_TIMESTAMP}:${req.user._id}`;
  await cacheService.set(wishlistCacheKey, user.wishlist);
  await cacheService.set(timestampCacheKey, Date.now());

  res.status(200).json({
    status: 'success',
    data: user.wishlist
  });
}); 