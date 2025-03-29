import Address from '../models/addressModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// Get all addresses for a user
export const getUserAddresses = catchAsync(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id });
  res.status(200).json({
    status: 'success',
    data: addresses
  });
});

// Add a new address
export const addAddress = catchAsync(async (req, res) => {
  const address = await Address.create({
    ...req.body,
    user: req.user._id
  });

  res.status(201).json({
    status: 'success',
    data: address
  });
});

// Update an address
export const updateAddress = catchAsync(async (req, res) => {
  // First check for duplicates
  const duplicateAddress = await Address.findOne({
    fullName: req.body.fullName,
    user: req.user._id,
    phoneNumber: req.body.phoneNumber,
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    pincode: req.body.pincode,
    _id: { $ne: req.params.id }
  });

  if (duplicateAddress) {
    throw new AppError('This address already exists', 400);
  }

  // If no duplicate found, proceed with update
  const address = await Address.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!address) {
    throw new AppError('Address not found', 404);
  }

  // If setting as default, unset other default addresses
  if (req.body.isDefault) {
    await Address.updateMany(
      { user: req.user._id, _id: { $ne: req.params.id } },
      { isDefault: false }
    );
  }

  res.status(200).json({
    status: 'success',
    data: address
  });
});

// Delete an address
export const deleteAddress = catchAsync(async (req, res) => {
  const address = await Address.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!address) {
    throw new AppError('Address not found', 404);
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Set default address
export const setDefaultAddress = catchAsync(async (req, res) => {
  // First, unset any existing default address
  await Address.updateMany(
    { user: req.user._id },
    { isDefault: false }
  );

  // Then set the new default address
  const address = await Address.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isDefault: true },
    { new: true }
  );

  if (!address) {
    throw new AppError('Address not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: address
  });
}); 