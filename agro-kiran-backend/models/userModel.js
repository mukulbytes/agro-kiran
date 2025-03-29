import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxLength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  cart: [{
    productId: {
      type: String,
      required: true,
      ref: 'Product'
    },
    variant: {
      type: String,
      enum: ['5kg', '20kg'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    deliveryOptionId: {
      type: String,
      default: '1'
    }
  }],
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS));
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to merge guest cart with user cart
userSchema.methods.mergeCart = async function (guestCart) {
  if (!guestCart || !guestCart.length) return;

  for (const item of guestCart) {
    const existingItem = this.cart.find(
      cartItem =>
        cartItem.productId === item.productId &&
        cartItem.variant === item.variant
    );

    if (existingItem) {
      existingItem.quantity = item.quantity;
    } else {
      this.cart.push(item);
    }
  }

  await this.save();
};

// Method to soft delete user
userSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  await this.save();
};

const User = mongoose.model('User', userSchema);

export default User; 