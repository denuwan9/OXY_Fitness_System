import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import scheduleRoutes from './schedules.js';
import coachAvailabilityRoutes from './coachAvailability.js';

const router = express.Router();

// API route mounting
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/coach-availability', coachAvailabilityRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// 404 handler for API routes
router.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

export default router;