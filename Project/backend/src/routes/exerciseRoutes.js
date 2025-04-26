const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Public routes
router.get('/', exerciseController.getAllExercises);

// Protected routes
router.use(auth);

// Instructor routes
router.get('/instructor', checkRole(['instructor', 'trainer']), exerciseController.getInstructorExercises);
router.post('/', checkRole(['instructor', 'trainer']), exerciseController.createExercise);
router.put('/:id', checkRole(['instructor', 'trainer']), exerciseController.updateExercise);
router.delete('/:id', checkRole(['instructor', 'trainer']), exerciseController.deleteExercise);
router.post('/assign', checkRole(['instructor', 'trainer']), exerciseController.assignExercises);
router.delete('/:exerciseId/member/:memberId', checkRole(['instructor', 'trainer']), exerciseController.removeExerciseAssignment);

// Member routes
router.get('/member/:memberId', checkRole(['user', 'trainer', 'instructor']), exerciseController.getMemberExercises);

module.exports = router; 