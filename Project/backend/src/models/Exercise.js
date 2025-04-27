const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Exercise description is required']
  },
  category: {
    type: String,
    required: [true, 'Exercise category is required'],
    enum: ['Strength', 'Cardio', 'Core', 'Flexibility']
  },
  imageUrl: {
    type: String,
    required: [true, 'Exercise image URL is required']
  },
  difficulty: {
    type: String,
    required: [true, 'Exercise difficulty is required'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  sets: {
    type: Number,
    required: [true, 'Number of sets is required'],
    min: [1, 'Sets must be at least 1']
  },
  reps: {
    type: String,
    required: [true, 'Number of reps is required']
  },
  workoutType: {
    type: String,
    required: [true, 'Workout type is required'],
    enum: ['Personal Training', 'Group Class', 'Cardio Session', 'Strength Training', 'HIIT Training', 'Yoga Session']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator ID is required']
  },
  assignedTo: [{
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Add indexes for better query performance
exerciseSchema.index({ name: 1 });
exerciseSchema.index({ category: 1 });
exerciseSchema.index({ difficulty: 1 });
exerciseSchema.index({ createdBy: 1 });
exerciseSchema.index({ workoutType: 1 });

module.exports = mongoose.model('Exercise', exerciseSchema); 