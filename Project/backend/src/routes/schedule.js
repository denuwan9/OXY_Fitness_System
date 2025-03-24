const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Schedule = require('../models/Schedule');
const User = require('../models/User');
const scheduleController = require('../controllers/scheduleController');

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     summary: Get all schedules
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', auth, async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate('trainer', 'name email')
      .populate('member', 'name email');
    res.json(schedules);
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/schedules/{id}:
 *   get:
 *     summary: Get schedule by ID
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Schedule details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Server error
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate('trainer', 'name email')
      .populate('member', 'name email');
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    res.json(schedule);
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/schedules:
 *   post:
 *     summary: Create a new schedule
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - membershipType
 *               - scheduleType
 *               - sessions
 *             properties:
 *               userId:
 *                 type: string
 *               membershipType:
 *                 type: string
 *               scheduleType:
 *                 type: string
 *               sessions:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', auth, (req, res, next) => {
  console.log('POST /api/schedules/ route hit');
  console.log('Request body:', req.body);
  console.log('User from auth:', req.user);
  scheduleController.createSchedule(req, res, next);
});

/**
 * @swagger
 * /api/schedules/{id}:
 *   put:
 *     summary: Update schedule
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *                 format: time
 *               duration:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Server error
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Check if user is authorized to update
    const user = await User.findById(req.user.userId);
    if (!['trainer', 'admin'].includes(user.role) && schedule.trainer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this schedule' });
    }

    const { date, time, duration, notes } = req.body;
    schedule.date = date || schedule.date;
    schedule.time = time || schedule.time;
    schedule.duration = duration || schedule.duration;
    schedule.notes = notes || schedule.notes;

    await schedule.save();
    res.json(schedule);
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/schedules/{id}:
 *   delete:
 *     summary: Delete schedule
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Check if user is authorized to delete
    const user = await User.findById(req.user.userId);
    if (!['trainer', 'admin'].includes(user.role) && schedule.trainer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this schedule' });
    }

    await schedule.remove();
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's schedule
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: req.params.userId })
      .populate('coachId', 'name email')
      .populate('mealPlan')
      .sort({ 'sessions.date': 1 }); // Sort by session date
    
    if (!schedules || schedules.length === 0) {
      return res.status(404).json({ message: 'No schedules found for this user' });
    }
    
    res.json(schedules);
  } catch (error) {
    console.error('Get user schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 