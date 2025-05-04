import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import DbCon from './utlis/db.js';


// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log('=== Incoming Request ===');
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('=====================');
  next();
});

// Connect to MongoDB
DbCon()

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/userRoutes.js';
import classRoutes from './routes/classes.js';
import trainerRoutes from './routes/trainers.js';
import scheduleRoutes from './routes/schedules.js';
import coachAvailabilityRoutes from './routes/coachAvailability.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/coach-availability', coachAvailabilityRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/build/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 7004;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;