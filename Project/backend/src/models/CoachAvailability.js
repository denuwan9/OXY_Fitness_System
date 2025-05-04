import mongoose from 'mongoose';

const timeRangeSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format validation
  },
  endTime: {
    type: String,
    required: true,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
    validate: {
      validator: function(endTime) {
        return endTime > this.startTime;
      },
      message: 'End time must be after start time'
    }
  },
  capacity: {
    type: Number,
    default: 1,
    min: [1, 'Capacity must be at least 1']
  }
}, { _id: false, versionKey: false });

const availabilityDaySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: {
      values: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      message: '{VALUE} is not a valid day'
    },
    required: [true, 'Day is required']
  },
  timeRanges: {
    type: [timeRangeSchema],
    validate: {
      validator: function(ranges) {
        // Check for overlapping time ranges
        for (let i = 0; i < ranges.length; i++) {
          for (let j = i + 1; j < ranges.length; j++) {
            if (ranges[i].startTime < ranges[j].endTime && 
                ranges[i].endTime > ranges[j].startTime) {
              return false;
            }
          }
        }
        return true;
      },
      message: 'Time ranges cannot overlap'
    }
  }
}, { _id: false, versionKey: false });

const coachAvailabilitySchema = new mongoose.Schema({
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Coach ID is required'],
    unique: true,
    immutable: true
  },
  availability: {
    type: [availabilityDaySchema],
    validate: {
      validator: function(days) {
        const daySet = new Set(days.map(d => d.day));
        return daySet.size === days.length; // No duplicate days
      },
      message: 'Duplicate days are not allowed'
    }
  },
  assignedMembers: [{
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Member ID is required']
    },
    assignedDate: {
      type: Date,
      default: Date.now,
      immutable: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  versionKey: false,
  timestamps: false // We're handling timestamps manually
});

// Update the updatedAt timestamp before saving
coachAvailabilitySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});



// Create the model
const CoachAvailability = mongoose.model('CoachAvailability', coachAvailabilitySchema);

export default CoachAvailability;