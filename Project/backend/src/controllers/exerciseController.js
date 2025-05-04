import Exercise from '../models/Exercise.js';
import User from '../models/userModel.js';

// Get all exercises
export const getAllExercises = async (req, res) => {
  try {
    console.log('Getting all exercises');
    const exercises = await Exercise.find()
      .populate('createdBy', 'name')
      .populate('assignedTo.memberId', 'name email');
    
    console.log(`Found ${exercises.length} exercises`);
    res.json(exercises);
  } catch (error) {
    console.error('Error in getAllExercises:', error);
    res.status(500).json({ 
      message: 'Error fetching exercises',
      error: error.message 
    });
  }
};

// Get exercises by instructor
export const getInstructorExercises = async (req, res) => {
  try {
    console.log('Getting exercises for instructor:', req.user.userId);
    const exercises = await Exercise.find({ createdBy: req.user.userId })
      .populate('assignedTo.memberId', 'name email');
    
    console.log(`Found ${exercises.length} exercises for instructor`);
    res.json(exercises);
  } catch (error) {
    console.error('Error in getInstructorExercises:', error);
    res.status(500).json({ 
      message: 'Error fetching instructor exercises',
      error: error.message 
    });
  }
};

// Get exercises assigned to a member
export const getMemberExercises = async (req, res) => {
  try {
    console.log('Getting exercises for member:', req.params.memberId);
    
    // Find exercises assigned to the member
    const exercises = await Exercise.find({ 
      'assignedTo.memberId': req.params.memberId 
    }).populate('createdBy', 'name');
    
    console.log(`Found ${exercises.length} exercises for member`);
    
    // Group exercises by workout type
    const exercisesByWorkoutType = exercises.reduce((acc, exercise) => {
      if (!acc[exercise.workoutType]) {
        acc[exercise.workoutType] = [];
      }
      acc[exercise.workoutType].push(exercise);
      return acc;
    }, {});
    
    console.log('Exercises grouped by workout type:', exercisesByWorkoutType);
    
    res.json(exercises);
  } catch (error) {
    console.error('Error in getMemberExercises:', error);
    res.status(500).json({ 
      message: 'Error fetching member exercises',
      error: error.message 
    });
  }
};

// Create a new exercise
export const createExercise = async (req, res) => {
  try {
    console.log('Creating new exercise:', req.body);
    
    const exercise = new Exercise({
      ...req.body,
      createdBy: req.user.userId
    });

    const savedExercise = await exercise.save();
    console.log('Exercise created successfully:', savedExercise._id);
    
    res.status(201).json(savedExercise);
  } catch (error) {
    console.error('Error in createExercise:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Error creating exercise',
      error: error.message 
    });
  }
};

// Update an exercise
export const updateExercise = async (req, res) => {
  try {
    console.log('Updating exercise:', req.params.id);
    
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    if (exercise.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this exercise' });
    }

    Object.assign(exercise, req.body);
    const updatedExercise = await exercise.save();
    
    console.log('Exercise updated successfully:', updatedExercise._id);
    res.json(updatedExercise);
  } catch (error) {
    console.error('Error in updateExercise:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Error updating exercise',
      error: error.message 
    });
  }
};

// Delete an exercise
export const deleteExercise = async (req, res) => {
  try {
    console.log('Deleting exercise:', req.params.id);
    
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    if (exercise.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this exercise' });
    }

    await exercise.deleteOne();
    console.log('Exercise deleted successfully:', req.params.id);
    
    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    console.error('Error in deleteExercise:', error);
    res.status(500).json({ 
      message: 'Error deleting exercise',
      error: error.message 
    });
  }
};

// Assign exercises to members
export const assignExercises = async (req, res) => {
  try {
    console.log('Assigning exercises to members:', req.body);
    const { exerciseIds, memberIds, workoutType } = req.body;
    
    if (!Array.isArray(exerciseIds) || !Array.isArray(memberIds)) {
      return res.status(400).json({ 
        message: 'exerciseIds and memberIds must be arrays' 
      });
    }

    // Verify all members exist
    const members = await User.find({ 
      _id: { $in: memberIds },
      role: 'user'
    });
    
    if (members.length !== memberIds.length) {
      return res.status(400).json({ 
        message: 'One or more members not found or not valid users' 
      });
    }

    // Update exercises with assigned members
    const updatePromises = exerciseIds.map(exerciseId => 
      Exercise.findByIdAndUpdate(
        exerciseId,
        { 
          $addToSet: { 
            assignedTo: memberIds.map(memberId => ({ 
              memberId,
              assignedAt: new Date()
            }))
          },
          workoutType: workoutType // Set the workout type for the exercise
        },
        { new: true }
      )
    );

    const updatedExercises = await Promise.all(updatePromises);
    console.log('Exercises assigned successfully');
    
    res.json({ 
      message: 'Exercises assigned successfully',
      exercises: updatedExercises
    });
  } catch (error) {
    console.error('Error in assignExercises:', error);
    res.status(500).json({ 
      message: 'Error assigning exercises',
      error: error.message 
    });
  }
};

// Remove exercise assignment from members
export const removeExerciseAssignment = async (req, res) => {
  try {
    console.log('Removing exercise assignment:', req.params);
    const { exerciseId, memberId } = req.params;
    
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    exercise.assignedTo = exercise.assignedTo.filter(
      assignment => assignment.memberId.toString() !== memberId
    );
    
    await exercise.save();
    console.log('Exercise assignment removed successfully');
    
    res.json({ message: 'Exercise assignment removed successfully' });
  } catch (error) {
    console.error('Error in removeExerciseAssignment:', error);
    res.status(500).json({ 
      message: 'Error removing exercise assignment',
      error: error.message 
    });
  }
};