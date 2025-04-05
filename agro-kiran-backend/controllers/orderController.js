import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { cacheService } from '../config/cache.js';

// Create a new order
export const createOrder = catchAsync(async (req, res) => {
  const { items, shippingAddress, deliveryOptionId, guestEmail, userId } = req.body;

  // Get delivery options
  const deliveryOptions = [
    {
      deliveryOptionId: '1',
      name: 'Standard Delivery',
      cost: 0,
      deliveryTime: 7
    },
    {
      deliveryOptionId: '2',
      name: 'Express Delivery',
      cost: 40,
      deliveryTime: 3
    },
    {
      deliveryOptionId: '3',
      name: 'Priority Delivery',
      cost: 100,
      deliveryTime: 1
    }
  ];

  // Find selected delivery option
  const selectedDeliveryOption = deliveryOptions.find(opt => opt.deliveryOptionId === deliveryOptionId);
  if (!selectedDeliveryOption) {
    throw new AppError('Invalid delivery option', 400);
  }

  // Get all products
  const productIds = items.map(item => item.productId);
  const products = await Product.find({ id: { $in: productIds } });

  // Validate all products exist and calculate total amount
  const transformedItems = items.map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) {
      throw new AppError(`Product not found: ${item.productId}`, 400);
    }

    const price = product.price[item.variant];
    if (!price) {
      throw new AppError(`Invalid variant ${item.variant} for product ${item.productId}`, 400);
    }

    return {
      productId: item.productId,
      quantity: item.quantity,
      variant: item.variant,
      price: price
    };
  });

  // Calculate total amount
  const itemsCost = transformedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalAmount = itemsCost + selectedDeliveryOption.cost;

  // Create order data
  const orderData = {
    items: transformedItems,
    shippingAddress,
    deliveryOption: {
      deliveryOptionId: selectedDeliveryOption.deliveryOptionId,
      cost: selectedDeliveryOption.cost,
      estimatedDeliveryDate: new Date(Date.now() + (selectedDeliveryOption.deliveryTime * 24 * 60 * 60 * 1000))
    },
    totalAmount
  };

  // Handle user or guest info
  if (userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    orderData.user = userId;
    // Clear user's cart after successful order
    await User.findByIdAndUpdate(userId, { cart: [] });
  } else {
    orderData.guestInfo = {
      email: guestEmail
    };
  }

  // Create the order
  const order = await Order.create(orderData);

  res.status(201).json({
    status: 'success',
    data: order
  });
});

// Get user's orders
export const getUserOrders = catchAsync(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate({
      path: 'items.productId',
      model: 'Product',
      select: 'title img id',
      localField: 'items.productId',
      foreignField: 'id'
    })
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    data: orders
  });
});

// Get order details
export const getOrderDetails = catchAsync(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    $or: [
      { user: req.user?._id },
      { 'guestInfo.email': req.query.email }
    ]
  }).populate({
    path: 'items.productId',
    model: 'Product',
    select: 'title img price id',
    localField: 'items.productId',
    foreignField: 'id'
  });
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Transform the order to include only necessary fields
  const transformedOrder = {
    _id: order._id,
    createdAt: order.createdAt,
    items: order.items.map(item => ({
      product: {
        title: item.productId.title
      },
      variant: item.variant,
      quantity: item.quantity,
      price: item.price
    })),
    shippingAddress: {
      fullName: order.shippingAddress.fullName,
      phoneNumber: order.shippingAddress.phoneNumber,
      street: order.shippingAddress.street,
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      pincode: order.shippingAddress.pincode
    },
    totalAmount: order.totalAmount,
    deliveryOption: {
      cost: order.deliveryOption.cost,
      estimatedDeliveryDate: order.deliveryOption.estimatedDeliveryDate
    },
    status: order.status || 'order_received',
    statusHistory: order.statusHistory || [{
      status: order.status || 'order_received',
      timestamp: order.createdAt
    }]
  };

  res.status(200).json({
    status: 'success',
    data: transformedOrder
  });
});

// Update order status (admin only)
export const updateOrderStatus = catchAsync(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Update status and add to history
  order.status = status;
  if (!order.statusHistory) {
    order.statusHistory = [];
  }
  order.statusHistory.push({
    status,
    timestamp: new Date()
  });

  await order.save();

  res.status(200).json({
    status: 'success',
    data: order
  });
});

// Get delivery options with caching
export const getDeliveryOptions = catchAsync(async (req, res) => {
  const CACHE_KEY = 'delivery_options';
  
  // Try to get from cache first
  let deliveryOptions = await cacheService.get(CACHE_KEY);
  
  if (!deliveryOptions) {
    // If not in cache, get from database
    deliveryOptions = [
      {
        deliveryOptionId: '1',
        name: 'Standard Delivery',
        cost: 0,
        deliveryTime: 7
      },
      {
        deliveryOptionId: '2',
        name: 'Express Delivery',
        cost: 40,
        deliveryTime: 3
      },
      {
        deliveryOptionId: '3',
        name: 'Priority Delivery',
        cost: 100,
        deliveryTime: 1
      }
    ];
    
    // Cache the result
    await cacheService.set(CACHE_KEY, deliveryOptions);
  }
  
  res.status(200).json({
    status: 'success',
    data: deliveryOptions
  });
});

// Get all orders (admin only)
export const getAllOrders = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const status = req.query.status;
  const search = req.query.search;

  // Build query
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

  // Execute query with pagination
  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate({
        path: 'user',
        select: 'name email'
      })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Order.countDocuments(query)
  ]);

  res.status(200).json({
    status: 'success',
    total,
    page,
    pages: Math.ceil(total / limit),
    data: orders
  });
}); 