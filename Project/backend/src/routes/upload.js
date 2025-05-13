import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import UserModel from '../models/userModel.js';
import { v4 as uuidv4 } from 'uuid';
import { authenticate } from '../middlewares/verifyToken.js';

const router = express.Router();

// Ensure 'uploads' folder exists
const uploadDir = path.join('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get user profile image
router.get('/profile-image/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Getting profile image for user:', userId);

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If user has no profile image, return default
    if (!user.profileImage) {
      return res.json({
        success: true,
        imageUrl: '/default-profile.png'
      });
    }

    // Return the full URL for the profile image
    const imageUrl = `/uploads/${path.basename(user.profileImage)}`;
    return res.json({
      success: true,
      imageUrl: imageUrl
    });

  } catch (error) {
    console.error('Error getting profile image:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error getting profile image'
    });
  }
});

// Update user profile image in database
async function updateUserProfileImage(userId, imageUrl) {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Delete old profile image if it exists
    if (user.profileImage) {
      const oldImagePath = path.join('uploads', path.basename(user.profileImage));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update user's profile image
    user.profileImage = imageUrl;
    const updatedUser = await user.save();
    
    if (!updatedUser) {
      throw new Error('Failed to save user profile');
    }

    console.log('User updated in database:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('Error updating user profile image:', error);
    throw error;
  }
}

// Profile image upload route
router.post('/', authenticate, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Update user's profile image in database
    const updatedUser = await updateUserProfileImage(userId, imageUrl);
    
    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      imageUrl: imageUrl,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading profile image'
    });
  }
});

export default router;
