import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  guestInfo: {
    email: {
      type: String,
      required: function() {
        return !this.user;
      },
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    }
  },
  items: [{
    productId: {
      type: String,
      required: true,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    variant: {
      type: String,
      enum: ['5kg', '20kg'],
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  shippingAddress: {
    fullName: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  },
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryOption: {
    deliveryOptionId: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      required: true
    },
    estimatedDeliveryDate: {
      type: Date,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['order_received', 'packing', 'shipping', 'out_for_delivery', 'delivered', 'failed'],
    default: 'order_received'
  },
  paymentMethod: {
    type: String,
    enum: ['cod'],
    default: 'cod'
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['order_received', 'packing', 'shipping', 'out_for_delivery', 'delivered', 'failed']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Add initial status to history
orderSchema.pre('save', function(next) {
  if (this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

// Update status history when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order; 