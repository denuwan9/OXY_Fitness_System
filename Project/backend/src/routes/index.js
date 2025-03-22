const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const userRoutes = require('./users');
const scheduleRoutes = require('./schedules');
const coachAvailabilityRoutes = require('./coachAvailability');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/coach-availability', coachAvailabilityRoutes);

module.exports = router; 