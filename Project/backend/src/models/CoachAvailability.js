const mongoose = require('mongoose');

const timeRangeSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    default: 1,
    min: 1
  }
}, { _id: false });

const availabilityDaySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  timeRanges: [timeRangeSchema]
}, { _id: false });

const coachAvailabilitySchema = new mongoose.Schema({
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  availability: [availabilityDaySchema],
  assignedMembers: [{
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedDate: {
      type: Date,
      default: Date.now
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
coachAvailabilitySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CoachAvailability', coachAvailabilitySchema); 