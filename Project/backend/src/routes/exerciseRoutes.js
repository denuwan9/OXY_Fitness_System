import express from 'express';
import {
  getAllExercises,
  getInstructorExercises,
  createExercise,
  updateExercise,
  deleteExercise,
  assignExercises,
  removeExerciseAssignment,
  getMemberExercises
} from '../controllers/exerciseController.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// Public routes
router.get('/', getAllExercises);

// Apply authentication middleware to all following routes
router.use(auth);

// Instructor/Trainer routes
router.route('/instructor')
  .get(checkRole(['instructor', 'trainer']), getInstructorExercises);

router.route('/')
  .post(checkRole(['instructor', 'trainer']), createExercise);

router.route('/:id')
  .put(checkRole(['instructor', 'trainer']), updateExercise)
  .delete(checkRole(['instructor', 'trainer']), deleteExercise);

router.post('/assign', checkRole(['instructor', 'trainer']), assignExercises);

router.delete('/:exerciseId/member/:memberId', 
  checkRole(['instructor', 'trainer']), 
  removeExerciseAssignment);

// Member routes
router.get('/member/:memberId', 
  checkRole(['user', 'trainer', 'instructor']), 
  getMemberExercises);

export default router;