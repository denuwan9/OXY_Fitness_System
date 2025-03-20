const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const router = express.Router();
const { createUser, getUsers, getUserById } = require('../controllers/userController');

//Only admin can access this router
router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "welcome Admin" });
});
//Both admin and manager can access this router
router.get("/manager", verifyToken, authorizeRoles("admin", "manager"),(req, res) => {
    res.json({ message: "welcome Manager" });
});
//All can access this router
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

// Get user by ID (accessible by admin, manager, and the user themselves)
router.get(
  '/:id',
  verifyToken,
  authorizeRoles('admin', 'manager', 'user', 'trainer', 'supplier'),
  getUserById
);

module.exports = router;