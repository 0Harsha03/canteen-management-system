const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide item name'],
    trim: true,
    maxlength: [100, 'Item name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide item description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Please specify category'],
    enum: [
      'breakfast',
      'lunch', 
      'dinner',
      'snacks',
      'beverages',
      'desserts',
      'combo-meals'
    ]
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    default: 'default-food.jpg'
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  nutritionalInfo: {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    fat: { type: Number, min: 0 }
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'spicy', 'very-spicy', 'none'],
    default: 'none'
  },
  preparationTime: {
    type: Number, // in minutes
    required: [true, 'Please specify preparation time'],
    min: [1, 'Preparation time must be at least 1 minute']
  },
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    availableFrom: {
      type: String, // Time format: "09:00"
      required: [true, 'Please specify availability start time']
    },
    availableTo: {
      type: String, // Time format: "17:00"
      required: [true, 'Please specify availability end time']
    },
    daysOfWeek: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  stock: {
    quantity: {
      type: Number,
      required: [true, 'Please specify stock quantity'],
      min: [0, 'Stock cannot be negative']
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    }
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
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
menuItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Check if item is currently available based on time and day
menuItemSchema.methods.isCurrentlyAvailable = function() {
  if (!this.availability.isAvailable || !this.isActive) {
    return false;
  }

  const now = new Date();
  const currentDay = now.toLocaleLowerCase().substring(0, 3); // "mon", "tue", etc.
  const currentTime = now.toTimeString().substring(0, 5); // "14:30"

  // Check if current day is in available days
  const dayMap = {
    'sun': 'sunday', 'mon': 'monday', 'tue': 'tuesday', 'wed': 'wednesday',
    'thu': 'thursday', 'fri': 'friday', 'sat': 'saturday'
  };
  
  const fullDayName = dayMap[currentDay];
  if (!this.availability.daysOfWeek.includes(fullDayName)) {
    return false;
  }

  // Check if current time is within availability window
  return currentTime >= this.availability.availableFrom && 
         currentTime <= this.availability.availableTo;
};

// Check if item is low in stock
menuItemSchema.methods.isLowStock = function() {
  return this.stock.quantity <= this.stock.lowStockThreshold;
};

// Static method to get items by category
menuItemSchema.statics.getByCategory = function(category) {
  return this.find({ 
    category, 
    isActive: true,
    'availability.isAvailable': true 
  });
};

// Index for better query performance
menuItemSchema.index({ category: 1, isActive: 1 });
menuItemSchema.index({ 'availability.isAvailable': 1 });
menuItemSchema.index({ createdAt: -1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);