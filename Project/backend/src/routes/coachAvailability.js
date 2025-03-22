const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const coachAvailabilityController = require('../controllers/coachAvailabilityController');

// Get coach availability
router.get('/:coachId', auth, (req, res, next) => {
  console.log('GET /coach-availability/:coachId - Request received');
  console.log('Coach ID:', req.params.coachId);
  console.log('User:', req.user);
  next();
}, coachAvailabilityController.getCoachAvailability);

// Update coach availability (coach only)
router.put('/', auth, checkRole(['coach', 'instructor', 'trainer']), (req, res, next) => {
  console.log('PUT /coach-availability - Request received');
  console.log('User:', req.user);
  console.log('Body:', req.body);
  next();
}, coachAvailabilityController.updateCoachAvailability);

// Assign member to coach (coach only)
router.post('/assign-member', auth, checkRole(['coach', 'instructor', 'trainer']), (req, res, next) => {
  console.log('POST /coach-availability/assign-member - Request received');
  console.log('User:', req.user);
  console.log('Body:', req.body);
  next();
}, coachAvailabilityController.assignMember);

// Remove member from coach (coach only)
router.delete('/remove-member/:memberId', auth, checkRole(['coach', 'instructor', 'trainer']), (req, res, next) => {
  console.log('DELETE /coach-availability/remove-member/:memberId - Request received');
  console.log('User:', req.user);
  console.log('Member ID:', req.params.memberId);
  next();
}, coachAvailabilityController.removeMember);

// Get all assigned members (coach only)
router.get('/assigned-members', auth, checkRole(['coach', 'instructor', 'trainer']), (req, res, next) => {
  console.log('GET /coach-availability/assigned-members - Request received');
  console.log('User:', req.user);
  next();
}, coachAvailabilityController.getAssignedMembers);

module.exports = router; 