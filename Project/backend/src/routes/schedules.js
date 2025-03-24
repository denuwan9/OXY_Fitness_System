const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

// Generate schedule for a new member
router.post('/generate', auth, scheduleController.generateSchedule);

// Get user's schedule
router.get('/user/:userId', auth, scheduleController.getUserSchedule);

// Request schedule change
router.post('/change-request/:userId', auth, scheduleController.requestScheduleChange);

// Approve schedule change (Operation Manager only)
router.put('/approve-change/:scheduleId/:sessionId', auth, checkRole(['manager']), scheduleController.approveScheduleChange);

// Update schedule (Coach/Trainer only)
router.put('/:id', auth, checkRole(['coach', 'trainer']), scheduleController.updateSchedule);

// Exercise plan routes (Coach only)
router.post('/exercise-plan', auth, checkRole(['coach', 'trainer']), scheduleController.updateExercisePlan);
router.get('/exercise-plan/:scheduleId/:day', auth, checkRole(['coach', 'trainer']), scheduleController.getExercisePlan);

// Meal plan routes
router.post('/meal-plan', auth, checkRole(['coach', 'trainer']), scheduleController.assignMealPlan);
router.get('/meal-plan/:scheduleId', auth, checkRole(['coach', 'trainer']), scheduleController.getMealPlan);

// Generate PDF report
router.get('/report/:userId', auth, scheduleController.generatePDFReport);

module.exports = router; 