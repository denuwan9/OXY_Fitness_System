const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', exerciseController.getAllExercises);

// Protected routes
router.use(protect);

// Instructor routes
router.get('/instructor', authorize('instructor'), exerciseController.getInstructorExercises);
router.post('/', authorize('instructor'), exerciseController.createExercise);
router.put('/:id', authorize('instructor'), exerciseController.updateExercise);
router.delete('/:id', authorize('instructor'), exerciseController.deleteExercise);
router.post('/assign', authorize('instructor'), exerciseController.assignExercises);
router.delete('/:exerciseId/member/:memberId', authorize('instructor'), exerciseController.removeExerciseAssignment);

// Member routes
router.get('/member/:memberId', authorize('member'), exerciseController.getMemberExercises);

module.exports = router; 