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
    endTime: {
      type: String,
      default: function() {
        // If time is in format "HH:MM", add 1 hour
        const time = this.time;
        if (time && time.includes(':')) {
          const [hours, minutes] = time.split(':');
          const endHour = (parseInt(hours) + 1) % 24;
          return `${endHour.toString().padStart(2, '0')}:${minutes}`;
        }
        return '';
      }
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

module.exports = mongoose.model('Schedule', scheduleSchema); //creating a model for the schedule schema