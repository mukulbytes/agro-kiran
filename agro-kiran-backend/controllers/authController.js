import User from '../models/userModel.js';
import { createToken } from '../utils/jwt.js';
import { catchAsync } from '../utils/catchAsync.js';

export const signup = catchAsync(async (req, res) => {
  const { email, password, name } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      status: 'error',
      message: 'Email already registered'
    });
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password
  });

  // Create JWT token
  const token = createToken(user._id);

  res.status(201).json({
    status: 'success',
    message: 'Registration successful!',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid email or password'
    });
  }

  // Update last login
  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  // Create token
  const token = createToken(user._id);

  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
}); 