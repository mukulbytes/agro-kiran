import Admin from '../models/adminModel.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import jwt from 'jsonwebtoken';

// Generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Admin Authentication
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Check if admin exists and password is correct
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin || !(await admin.correctPassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // Check if admin is active
  if (!admin.isActive) {
    return next(new AppError('Your account has been deactivated', 401));
  }

  // Update last login
  admin.lastLogin = new Date();
  await admin.save({ validateBeforeSave: false });

  // Generate token
  const token = signToken(admin._id);

  // Remove password from output
  admin.password = undefined;

  res.status(200).json({
    status: 'success',
    token,
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions
    }
  });
});

// Admin Management
export const getAdmin = catchAsync(async (req, res) => {
  const admin = await Admin.findById(req.params.id).select('-password');
  
  if (!admin) {
    throw new AppError('No admin found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: admin
  });
});

export const updateAdmin = catchAsync(async (req, res) => {
  const admin = await Admin.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      permissions: req.body.permissions,
      isActive: req.body.isActive
    },
    {
      new: true,
      runValidators: true
    }
  ).select('-password');

  if (!admin) {
    throw new AppError('No admin found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: admin
  });
});

export const deleteAdmin = catchAsync(async (req, res) => {
  const admin = await Admin.findByIdAndDelete(req.params.id);

  if (!admin) {
    throw new AppError('No admin found with that ID', 404);
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Stats and Dashboard
export const getOrderStats = catchAsync(async (req, res) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' },
        avgOrderValue: { $avg: '$totalAmount' }
      }
    }
  ]);

  const recentOrders = await Order.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  });

  res.status(200).json({
    status: 'success',
    data: {
      totalOrders: stats[0]?.totalOrders || 0,
      totalRevenue: stats[0]?.totalRevenue || 0,
      avgOrderValue: stats[0]?.avgOrderValue || 0,
      recentOrders
    }
  });
});

export const getProductStats = catchAsync(async (req, res) => {
  const stats = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    }
  ]);

  const lowStockCount = await Product.countDocuments({
    'stock.5kg': { $lt: 10 },
    'stock.20kg': { $lt: 10 }
  });

  res.status(200).json({
    status: 'success',
    data: {
      ...stats[0],
      lowStockCount
    }
  });
});

export const getRecentActivity = catchAsync(async (req, res) => {
  const recentOrders = await Order.find()
    .sort('-createdAt')
    .limit(5)
    .populate('user', 'name email');

  const recentProducts = await Product.find()
    .sort('-createdAt')
    .limit(5);

  const activities = [
    ...recentOrders.map(order => ({
      type: 'order',
      description: `New order #${order._id} by ${order.user?.name || 'Guest'}`,
      timestamp: order.createdAt
    })),
    ...recentProducts.map(product => ({
      type: 'product',
      description: `New product added: ${product.title}`,
      timestamp: product.createdAt
    }))
  ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

  res.status(200).json({
    status: 'success',
    data: {
      activities
    }
  });
});

// Admin Order Management
export const getAllOrders = catchAsync(async (req, res) => {
  const { status, search } = req.query;
  let query = {};

  // Add status filter if provided
  if (status) {
    query.status = status;
  }

  // Add search filter if provided
  if (search) {
    query.$or = [
      { '_id': { $regex: search, $options: 'i' } },
      { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
      { 'guestInfo.email': { $regex: search, $options: 'i' } }
    ];
  }

  const orders = await Order.find(query)
    .populate({
      path: 'user',
      select: 'name email'
    })
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: orders
  });
});

export const updateOrderStatus = catchAsync(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: order
  });
});

export const getOrderDetails = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate({
      path: 'user',
      select: 'name email'
    })
    .populate({
      path: 'items.productId',
      model: 'Product',
      select: 'title img price id'
    });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: order
  });
}); 