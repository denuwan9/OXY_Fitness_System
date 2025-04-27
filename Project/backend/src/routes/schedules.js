const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const PDFDocument = require('pdfkit');
const Schedule = require('../models/Schedule');
const RescheduleRequest = require('../models/RescheduleRequest');
const User = require('../models/User');

// Create a new schedule
router.post('/', auth, checkRole(['coach', 'trainer']), scheduleController.createSchedule);

// Generate schedule for a new member
router.post('/generate', auth, scheduleController.generateSchedule);

// Get user's schedule
router.get('/user/:userId', auth, async (req, res) => {
  try {
    // Check if user is requesting their own schedule or has admin/manager/coach/trainer role
    if (req.params.userId !== req.user.userId && !['admin', 'manager', 'coach', 'trainer'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to view this schedule' });
    }

    const schedules = await Schedule.find({ userId: req.params.userId })
      .populate('coachId', 'name email phone specialization profileImage')
      .populate('mealPlan')
      .sort({ 'sessions.date': 1 });
    
    if (!schedules || schedules.length === 0) {
      return res.status(404).json({ message: 'No schedules found for this user' });
    }
    
    res.json(schedules);
  } catch (error) {
    console.error('Get user schedule error:', error);
    console.error('Error details:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Request schedule change
router.post('/change-request/:userId', auth, scheduleController.requestScheduleChange);

// Approve schedule change (Operation Manager only)
router.put('/approve-change/:scheduleId/:sessionId', auth, checkRole(['manager']), scheduleController.approveScheduleChange);

// Reject schedule change (Operation Manager only)
router.put('/reject-change/:scheduleId/:sessionId', auth, checkRole(['manager']), scheduleController.rejectScheduleChange);

// Update schedule (Coach/Trainer only)
router.put('/:id', auth, checkRole(['coach', 'trainer']), scheduleController.updateSchedule);

// Delete schedule (Coach/Trainer only)
router.delete('/:id', auth, checkRole(['coach', 'trainer']), scheduleController.deleteSchedule);

// Exercise plan routes (Coach only)
router.post('/exercise-plan', auth, checkRole(['coach', 'trainer']), scheduleController.updateExercisePlan);
router.get('/exercise-plan/:scheduleId/:day', auth, checkRole(['coach', 'trainer']), scheduleController.getExercisePlan);

// Meal plan routes
router.post('/meal-plan', auth, checkRole(['coach', 'trainer']), scheduleController.assignMealPlan);
router.get('/meal-plan/:scheduleId', auth, async (req, res) => {
  try {
    console.log('Getting meal plan for schedule:', req.params.scheduleId);
    const schedule = await Schedule.findById(req.params.scheduleId)
      .populate('mealPlan');
    
    if (!schedule || !schedule.mealPlan) {
      console.log('No meal plan found for schedule:', req.params.scheduleId);
      return res.status(404).json({ message: 'No meal plan found for this schedule' });
    }
    
    console.log('Found meal plan:', schedule.mealPlan);
    res.json(schedule.mealPlan);
  } catch (error) {
    console.error('Get meal plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Request reschedule
router.post('/reschedule', auth, async (req, res) => {
  try {
    const { scheduleId, sessionId, newDate, newTime, reason } = req.body;
    
    console.log('Reschedule request received:', {
      scheduleId,
      sessionId,
      newDate,
      newTime,
      reason,
      userId: req.user.userId
    });
    
    const schedule = await Schedule.findById(scheduleId);
    console.log('Found schedule:', schedule);
    
    if (!schedule) {
      console.log('Schedule not found with ID:', scheduleId);
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Find the session in the schedule
    const session = schedule.sessions.id(sessionId);
    if (!session) {
      console.log('Session not found with ID:', sessionId);
      return res.status(404).json({ message: 'Session not found' });
    }

    // Update the session with reschedule information
    session.status = 'pending_reschedule';
    session.rescheduled = true;
    session.newDate = newDate;
    session.newTime = newTime;
    session.reason = reason;

    // Save the updated schedule
    await schedule.save();
    
    // Create reschedule request for tracking
    const rescheduleRequest = new RescheduleRequest({
      scheduleId,
      sessionId,
      userId: req.user.userId,
      newDate,
      newTime,
      reason,
      status: 'pending'
    });
    
    console.log('Creating reschedule request:', rescheduleRequest);
    await rescheduleRequest.save();
    
    res.status(201).json({ 
      message: 'Reschedule request submitted successfully',
      schedule
    });
  } catch (error) {
    console.error('Reschedule request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate report
router.get('/report/:userId', auth, scheduleController.generatePDFReport);

// Get all change requests (Manager only)
router.get('/change-requests', auth, checkRole(['manager']), async (req, res) => {
  try {
    console.log('Getting all change requests');
    console.log('User making request:', req.user);

    const requests = await RescheduleRequest.find()
      .populate('userId', 'name email membershipType')
      .populate('scheduleId')
      .sort({ createdAt: -1 });
    
    console.log('Found requests count:', requests.length);
    console.log('Request details:', requests.map(req => ({
      id: req._id,
      userId: req.userId?._id,
      userName: req.userId?.name,
      scheduleId: req.scheduleId?._id,
      status: req.status,
      newDate: req.newDate,
      newTime: req.newTime
    })));

    res.json(requests);
  } catch (error) {
    console.error('Error getting change requests:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get all reschedule requests (Manager only)
router.get('/reschedule-requests', auth, checkRole(['manager']), scheduleController.getAllRescheduleRequests);

// Get meal plan preferences
router.get('/meal-plan-preferences/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const preferences = {
      dietaryRestrictions: user.dietType ? [user.dietType] : [],
      allergies: user.allergies || [],
      specialGuidelines: user.specialGuidelines ? [user.specialGuidelines] : [],
      specialScheduleRequest: user.specialScheduleRequest || ''
    };
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update meal plan preferences
router.put('/meal-plan-preferences/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.body.dietaryRestrictions && req.body.dietaryRestrictions.length > 0) {
      user.dietType = req.body.dietaryRestrictions[0];
    }
    if (req.body.allergies) {
      user.allergies = req.body.allergies;
    }
    if (req.body.specialGuidelines && req.body.specialGuidelines.length > 0) {
      user.specialGuidelines = req.body.specialGuidelines[0];
    }
    if (typeof req.body.specialScheduleRequest === 'string') {
      user.specialScheduleRequest = req.body.specialScheduleRequest;
    }
    await user.save();

    res.json({
      dietaryRestrictions: user.dietType ? [user.dietType] : [],
      allergies: user.allergies || [],
      specialGuidelines: user.specialGuidelines ? [user.specialGuidelines] : [],
      specialScheduleRequest: user.specialScheduleRequest || ''
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 