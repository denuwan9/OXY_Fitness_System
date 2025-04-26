const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  membershipType: {
    type: String,
    enum: ['Platinum', 'Gold', 'Silver'],
    required: true
  },
  scheduleType: {
    type: String,
    enum: ['weekday', 'weekend'],
    required: true
  },
  sessions: [{
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'pending_reschedule', 'rescheduled'],
      default: 'scheduled'
    },
    workoutType: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true,
      default: '60 minutes'
    },
    notes: String,
    rescheduled: {
      type: Boolean,
      default: false
    },
    newDate: Date,
    newTime: String,
    reason: String
  }],
  mealPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MealPlan'
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

// Update the updatedAt timestamp before saving
scheduleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Schedule', scheduleSchema); 