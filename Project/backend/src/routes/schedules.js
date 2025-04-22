const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const PDFDocument = require('pdfkit');
const Schedule = require('../models/Schedule');
const RescheduleRequest = require('../models/RescheduleRequest');

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
    const schedule = await Schedule.findById(req.params.scheduleId)
      .populate('mealPlan');
    
    if (!schedule || !schedule.mealPlan) {
      return res.status(404).json({ message: 'No meal plan found for this schedule' });
    }
    
    res.json(schedule.mealPlan);
  } catch (error) {
    console.error('Get meal plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Request reschedule
router.post('/reschedule', auth, async (req, res) => {
  try {
    const { scheduleId, newDate, newTime, reason } = req.body;
    
    console.log('Reschedule request received:', {
      scheduleId,
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
    
    // Create reschedule request
    const rescheduleRequest = new RescheduleRequest({
      scheduleId,
      userId: req.user.userId,
      newDate,
      newTime,
      reason,
      status: 'pending'
    });
    
    console.log('Creating reschedule request:', rescheduleRequest);
    await rescheduleRequest.save();
    
    res.status(201).json({ message: 'Reschedule request submitted successfully' });
  } catch (error) {
    console.error('Reschedule request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate report
router.get('/report/:userId', auth, async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: req.params.userId })
      .populate('coachId', 'name')
      .populate('mealPlan')
      .sort({ 'sessions.date': 1 });
    
    if (!schedules || schedules.length === 0) {
      return res.status(404).json({ message: 'No schedules found for this user' });
    }
    
    // Create PDF document
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=fitness-report-${req.params.userId}.pdf`);
    
    doc.pipe(res);
    
    // Add content to PDF
    doc.fontSize(20).text('Fitness Report', { align: 'center' });
    doc.moveDown();
    
    // Add schedule information
    schedules.forEach(schedule => {
      doc.fontSize(16).text(`Schedule for ${new Date(schedule.sessions[0].date).toLocaleDateString()}`);
      doc.moveDown();
      
      schedule.sessions.forEach(session => {
        doc.fontSize(12).text(`Time: ${session.time}`);
        doc.text(`Type: ${session.workoutType}`);
        doc.text(`Duration: ${session.duration}`);
        doc.moveDown();
      });
      
      // Add meal plan if exists
      if (schedule.mealPlan) {
        doc.fontSize(14).text('Meal Plan');
        schedule.mealPlan.meals.forEach(meal => {
          doc.fontSize(12).text(`Day: ${meal.day}`);
          doc.text(`Breakfast: ${meal.breakfast}`);
          doc.text(`Lunch: ${meal.lunch}`);
          doc.text(`Dinner: ${meal.dinner}`);
          if (meal.snacks && meal.snacks.length > 0) {
            doc.text(`Snacks: ${meal.snacks.join(', ')}`);
          }
          doc.moveDown();
        });
      }
      
      doc.moveDown();
    });
    
    doc.end();
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

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

module.exports = router; 