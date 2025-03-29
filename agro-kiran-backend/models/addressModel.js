import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: false,
    trim: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  street: {
    type: String,
    required: [true, 'Street address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required'],
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Auto-generate title if not provided
addressSchema.pre('save', async function(next) {
  if (!this.title) {
    const count = await this.constructor.countDocuments({ user: this.user });
    this.title = count === 0 ? 'My Address' : `My Address ${count + 1}`;
  }
  next();
});

// Check address limit and duplicates before saving
addressSchema.pre('save', async function(next) {
  // Check address limit (max 4 addresses per user) for new addresses
  if (this.isNew) {
    const addressCount = await this.constructor.countDocuments({ user: this.user });
    if (addressCount >= 4) {
      throw new Error('Maximum limit of 4 addresses reached');
    }
  }

  // Check for duplicate addresses (both new and updates)
  const duplicateQuery = {
    fullName: this.fullName,
    user: this.user,
    phoneNumber: this.phoneNumber,
    street: this.street,
    city: this.city,
    state: this.state,
    pincode: this.pincode,
    _id: { $ne: this._id } // Exclude current address when updating
  };

  const existingAddress = await this.constructor.findOne(duplicateQuery);

  if (existingAddress) {
    throw new Error('This address already exists');
  }

  next();
});

// Ensure only one default address per user
addressSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

const Address = mongoose.model('Address', addressSchema);

export default Address; 