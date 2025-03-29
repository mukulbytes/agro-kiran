import Joi from 'joi';
import AppError from '../utils/appError.js';

const orderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      variant: Joi.string().valid('5kg', '20kg').required()
    })
  ).min(1).required(),
  
  shippingAddress: Joi.object({
    fullName: Joi.string().required(),
    phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().pattern(/^[0-9]{6}$/).required()
  }).required(),
  
  deliveryOptionId: Joi.string().valid('1', '2', '3').required(),
  
  guestEmail: Joi.string().email().when('userId', {
    is: Joi.exist(),
    then: Joi.forbidden(),
    otherwise: Joi.required()
  }),
  
  userId: Joi.string().optional()
});

export const validateOrderData = (req, res, next) => {
  const { error } = orderSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }
  
  next();
}; 