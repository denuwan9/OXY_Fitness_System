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
router.put('/approve/:scheduleId/:sessionId', auth, checkRole('operation_manager'), scheduleController.approveScheduleChange);

// Assign meal plan (Coach only)
router.post('/assign-meal-plan', auth, checkRole('coach'), scheduleController.assignMealPlan);

// Generate PDF report
router.get('/report/:userId', auth, scheduleController.generatePDFReport);

module.exports = router; 