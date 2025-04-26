const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create new user
const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      address,
      membershipType,
      membershipStartDate,
      membershipEndDate,
      profileImage,
      dietType,
      allergies,
      specialGuidelines
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,
      phone,
      address,
      membershipType,
      membershipStartDate,
      membershipEndDate,
      profileImage,
      dietType,
      allergies,
      specialGuidelines
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      message: 'Users retrieved successfully',
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      message: 'User retrieved successfully',
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
};

// Get all members
const getMembers = async (req, res) => {
  try {
    console.log('Fetching members...');
    const members = await User.find({ 
      role: 'user',
      isActive: true 
    }).select('name email phone membershipType profileImage role dietType allergies specialGuidelines');
    
    console.log(`Found ${members.length} members`);
    res.json({ 
      message: 'Members retrieved successfully',
      members 
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ 
      message: 'Error retrieving members', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getMembers
}; 