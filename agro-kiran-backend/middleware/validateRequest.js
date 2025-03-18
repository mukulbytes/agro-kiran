import Joi from 'joi';

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));
      
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

export const schemas = {
  signup: Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]{2,50}$/)
      .required()
      .messages({
        'string.pattern.base': 'Name should only contain letters and spaces',
        'string.min': 'Name should be at least 2 characters',
        'string.max': 'Name cannot exceed 50 characters',
        'any.required': 'Name is required'
      }),
      
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
      
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/)
      .required()
      .messages({
        'string.pattern.base': 'Password must include uppercase, lowercase, number and special character',
        'string.min': 'Password must be at least 8 characters',
        'any.required': 'Password is required'
      })
  }),
  
  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
      
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  })
};

export default validateRequest; 