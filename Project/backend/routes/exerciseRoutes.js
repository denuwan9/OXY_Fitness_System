import express from 'express';
const router = express.Router();
import exerciseController from '../controllers/exerciseController.js';
import { protect, authorize } from '../middleware/auth.js';

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

export default router;