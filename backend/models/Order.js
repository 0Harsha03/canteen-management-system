const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  name: {
    type: String,
    required: true // Store name for historical purposes
  },
  price: {
    type: Number,
    required: true // Store price at time of order
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  subtotal: {
    type: Number,
    required: true
  },
  specialInstructions: {
    type: String,
    maxlength: [200, 'Special instructions cannot exceed 200 characters']
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  orderSummary: {
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: [
      'pending',       // Order placed, waiting for confirmation
      'confirmed',     // Order confirmed by staff
      'preparing',     // Order is being prepared
      'ready',         // Order is ready for pickup
      'completed',     // Order has been picked up
      'cancelled'      // Order was cancelled
    ],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'digital-wallet', 'student-credit'],
    required: [true, 'Payment method is required']
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  estimatedPickupTime: {
    type: Date
  },
  actualPickupTime: {
    type: Date
  },
  preparationTime: {
    type: Number // in minutes
  },
  assignedStaff: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Rating comment cannot exceed 500 characters']
    },
    ratedAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Add to status history if status changed
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      updatedBy: this.assignedStaff
    });
  }
  
  next();
});

// Generate unique order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const today = new Date();
    const dateString = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Find the last order number for today
    const lastOrder = await this.constructor.findOne({
      orderNumber: { $regex: `^ORD-${dateString}` }
    }).sort({ orderNumber: -1 });

    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }

    this.orderNumber = `ORD-${dateString}-${sequence.toString().padStart(3, '0')}`;
  }
  next();
});

// Calculate estimated pickup time based on preparation times
orderSchema.methods.calculateEstimatedPickupTime = function() {
  const baseTime = new Date();
  let totalPrepTime = 0;
  
  // Add preparation time for each item
  this.items.forEach(item => {
    totalPrepTime += (item.preparationTime || 15) * item.quantity; // Default 15 mins if not specified
  });
  
  // Add buffer time (5 minutes) and round up to nearest 5 minutes
  const bufferTime = 5;
  totalPrepTime = Math.ceil((totalPrepTime + bufferTime) / 5) * 5;
  
  this.estimatedPickupTime = new Date(baseTime.getTime() + totalPrepTime * 60000);
  this.preparationTime = totalPrepTime;
};

// Check if order is overdue
orderSchema.methods.isOverdue = function() {
  if (!this.estimatedPickupTime || this.status === 'completed' || this.status === 'cancelled') {
    return false;
  }
  return new Date() > this.estimatedPickupTime;
};

// Update status with history tracking
orderSchema.methods.updateStatus = function(newStatus, updatedBy, notes = '') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    updatedBy: updatedBy,
    notes: notes
  });

  // Set actual pickup time when completed
  if (newStatus === 'completed' && !this.actualPickupTime) {
    this.actualPickupTime = new Date();
  }

  return this.save();
};

// Static method to get orders by status
orderSchema.statics.getByStatus = function(status) {
  return this.find({ status })
    .populate('customer', 'name email phone studentId')
    .populate('assignedStaff', 'name email')
    .populate('items.menuItem', 'name category')
    .sort({ createdAt: -1 });
};

// Static method to get today's orders
orderSchema.statics.getTodaysOrders = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return this.find({
    createdAt: {
      $gte: today,
      $lt: tomorrow
    }
  })
    .populate('customer', 'name email phone studentId')
    .populate('assignedStaff', 'name email')
    .populate('items.menuItem', 'name category')
    .sort({ createdAt: -1 });
};

// Index for better query performance
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);