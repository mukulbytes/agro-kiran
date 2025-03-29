import mongoose from 'mongoose';

const deliveryOptionSchema = new mongoose.Schema({
  deliveryOptionId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryTime: {
    type: Number,
    required: true,
    min: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const DeliveryOption = mongoose.model('DeliveryOption', deliveryOptionSchema);

export default DeliveryOption; 