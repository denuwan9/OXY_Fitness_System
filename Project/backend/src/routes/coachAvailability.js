import express from 'express';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/checkRole.js';
import {
  getAssignedMembers,
  assignMember,
  removeMember,
  updateCoachAvailability,
  getCoachAvailability
} from '../controllers/coachAvailabilityController.js';

const router = express.Router();

/**
 * Logs request details for debugging
 * @param {string} method - HTTP method
 * @param {string} path - Request path
 */
const logRequest = (method, path) => (req, res, next) => {
  console.log(`${method} ${path} - Request received`);
  console.log('Authenticated User:', {
    id: req.user?.userId,
    role: req.user?.role
  });
  console.log('Params:', req.params);
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    console.log('Body:', req.body);
  }
  next();
};

// Get all assigned members (coach only)
router.get(
  '/assigned-members/:coachId',
  auth,
  checkRole(['coach', 'instructor', 'trainer']),
  logRequest('GET', '/assigned-members/:coachId'),
  getAssignedMembers
);

// Assign member to coach (coach or manager only)
router.post(
  '/assign-member',
  auth,
  checkRole(['coach', 'instructor', 'trainer', 'manager']),
  logRequest('POST', '/assign-member'),
  assignMember
);

// Remove member from coach (coach or manager only)
router.delete(
  '/remove-member/:memberId',
  auth,
  checkRole(['coach', 'instructor', 'trainer', 'manager']),
  logRequest('DELETE', '/remove-member/:memberId'),
  removeMember
);

// Update coach availability (coach only)
router.put(
  '/',
  auth,
  checkRole(['coach', 'instructor', 'trainer']),
  logRequest('PUT', '/'),
  updateCoachAvailability
);

// Get coach availability
router.get(
  '/:coachId',
  auth,
  logRequest('GET', '/:coachId'),
  getCoachAvailability
);

export default router;