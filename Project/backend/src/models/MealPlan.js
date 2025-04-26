const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  membershipType: {
    type: String,
    enum: ['Platinum', 'Gold', 'Silver'],
    required: true
  },
  meals: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    breakfast: {
      type: String,
      default: ''
    },
    lunch: {
      type: String,
      default: ''
    },
    dinner: {
      type: String,
      default: ''
    },
    snacks: [String],
    nutritionalInfo: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fats: Number
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
mealPlanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('MealPlan', mealPlanSchema); 