import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';

// Protect routes - verify token and attach user to request
export const protect = catchAsync(async (req, res, next) => {
  // 1) Get token from Authorization header
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('You are not logged in. Please log in to get access.', 401);
  }

  try {
    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new AppError('The user belonging to this token no longer exists.', 401);
    }

    // 4) Check if user is active
    if (!user.isActive) {
      throw new AppError('Your account has been deactivated. Please contact support.', 401);
    }

    // 5) Check if user is deleted
    if (user.isDeleted) {
      throw new AppError('This account has been deleted.', 401);
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token. Please log in again.', 401);
    }
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Your token has expired. Please log in again.', 401);
    }
    throw error;
  }
}); 