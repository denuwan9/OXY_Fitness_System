const Exercise = require('../models/Exercise');
const User = require('../models/User');

// Get all exercises
exports.getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find()
      .populate('createdBy', 'name')
      .populate('assignedTo', 'name');
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get exercises by instructor
exports.getInstructorExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find({ createdBy: req.user._id })
      .populate('assignedTo', 'name');
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get exercises assigned to a member
exports.getMemberExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find({ assignedTo: req.params.memberId })
      .populate('createdBy', 'name');
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new exercise
exports.createExercise = async (req, res) => {
  try {
    const exercise = new Exercise({
      ...req.body,
      createdBy: req.user._id
    });
    const savedExercise = await exercise.save();
    res.status(201).json(savedExercise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an exercise
exports.updateExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    if (exercise.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this exercise' });
    }
    Object.assign(exercise, req.body);
    const updatedExercise = await exercise.save();
    res.json(updatedExercise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an exercise
exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    if (exercise.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this exercise' });
    }
    await exercise.remove();
    res.json({ message: 'Exercise deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign exercises to members
exports.assignExercises = async (req, res) => {
  try {
    const { exerciseIds, memberIds } = req.body;
    
    // Verify all members exist
    const members = await User.find({ _id: { $in: memberIds } });
    if (members.length !== memberIds.length) {
      return res.status(400).json({ message: 'One or more members not found' });
    }

    // Update exercises with assigned members
    await Exercise.updateMany(
      { _id: { $in: exerciseIds } },
      { $addToSet: { assignedTo: { $each: memberIds } } }
    );

    res.json({ message: 'Exercises assigned successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove exercise assignment from members
exports.removeExerciseAssignment = async (req, res) => {
  try {
    const { exerciseId, memberId } = req.params;
    
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    exercise.assignedTo = exercise.assignedTo.filter(
      id => id.toString() !== memberId
    );
    await exercise.save();

    res.json({ message: 'Exercise assignment removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 