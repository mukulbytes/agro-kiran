import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';
import AppError from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const protect = catchAsync(async (req, res, next) => {
  // 1) Get token and check if it exists
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  // 3) Check if admin still exists
  const admin = await Admin.findById(decoded.id);
  if (!admin) {
    return next(new AppError('The admin belonging to this token no longer exists.', 401));
  }

  // 4) Check if admin is still active
  if (!admin.isActive) {
    return next(new AppError('Your account has been deactivated. Please contact support.', 401));
  }

  // Grant access to protected route
  req.admin = admin;
  next();
});

export const restrictToAdmin = catchAsync(async (req, res, next) => {
  // Check if user exists and is an admin
  if (!req.admin) {
    return next(new AppError('You do not have permission to perform this action', 403));
  }
  next();
});

export const restrictTo = (...permissions) => {
  return (req, res, next) => {
    // Super admin has all permissions
    if (req.admin.role === 'super_admin') {
      return next();
    }

    // Check if admin has required permissions
    const hasRequiredPermissions = permissions.every(permission => 
      req.admin.permissions[permission]
    );

    if (!hasRequiredPermissions) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
}; 