import express from 'express';
import { getDashboardMetrics } from '../controllers/dashboardController.js';

const router = express.Router();

// Get dashboard metrics
router.get('/', getDashboardMetrics);

export default router;  