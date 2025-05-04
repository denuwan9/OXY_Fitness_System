import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { createUser, getUsers, getUserById, getMembers } from '../controllers/userController.js';
import User from '../models/User.js';

const router = express.Router();

// Only admin can access this router
router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "welcome Admin" });
});

// Both admin and manager can access this router
router.get("/manager", verifyToken, authorizeRoles("admin", "manager"), (req, res) => {
    res.json({ message: "welcome Manager" });
});

// All can access this router
router.get("/user", verifyToken, authorizeRoles("admin", "manager", "user"), (req, res) => {
    res.json({ message: "welcome User" });
});

// Create user (accessible by admin and manager)
router.post(
  '/create',
  verifyToken,
  authorizeRoles('admin', 'manager'),
  createUser
);

// Get all users (accessible by admin and manager)
router.get(
  '/',
  verifyToken,
  authorizeRoles('admin', 'manager'),
  getUsers
);

/**
 * @swagger
 * /api/users/members:
 *   get:
 *     summary: Get all members
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of members retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Members retrieved successfully
 *                 members:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                         enum: [user]
 *                       membershipType:
 *                         type: string
 *                         enum: [basic, premium, vip]
 *                       phone:
 *                         type: string
 *                       address:
 *                         type: object
 *                       isActive:
 *                         type: boolean
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied - User does not have required role
 *       500:
 *         description: Server error
 */
// Get all members (accessible by coach, instructor, trainer, and manager)
router.get(
  '/members',
  verifyToken,
  authorizeRoles('coach', 'instructor', 'trainer', 'manager'),
  getMembers
);

// Get all coaches (accessible by manager)
router.get(
  '/coaches',
  verifyToken,
  authorizeRoles('manager'),
  async (req, res) => {
    try {
      console.log('Fetching coaches...');
      const coaches = await User.find({ 
        role: { $in: ['coach', 'trainer'] },
        isActive: true 
      }).select('name email phone specialization profileImage role');
      
      console.log(`Found ${coaches.length} coaches`);
      res.json({ 
        message: 'Coaches retrieved successfully',
        coaches 
      });
    } catch (error) {
      console.error('Error fetching coaches:', error);
      res.status(500).json({ 
        message: 'Error retrieving coaches', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
);

// Get user by ID (accessible by admin, manager, and the user themselves)
router.get(
  '/:id',
  verifyToken,
  authorizeRoles('admin', 'manager', 'user', 'trainer', 'supplier'),
  getUserById
);

export default router;