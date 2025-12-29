const User = require('../models/User');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/email');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json(users);
};

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};
// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.status(200).json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Register new organizer (Admin only)
// @route   POST /api/users/organizer
// @access  Private/Admin
const createOrganizer = async (req, res) => {
  const { fullName, email, phoneNumber, organizationName } = req.body;

  if (!fullName || !email || !phoneNumber) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Generate random credentials
  const username = fullName.toLowerCase().replace(/\s+/g, '.') + Math.floor(Math.random() * 100);
  const password = 'Pass' + Math.floor(1000 + Math.random() * 9000); // Simple random pass

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    fullName,
    phoneNumber,
    organizationName,
    role: 'ORGANIZER',
    isFirstLogin: true,
  });

  if (user) {
    // Log Activity
    const ActivityLog = require('../models/ActivityLog');
    await ActivityLog.create({
      action: 'ORGANIZER_CREATED',
      targetId: user._id,
      metadata: { role: 'ORGANIZER' },
    });

    // Send Email via Firebase Trigger
    try {
      const message = `
                Welcome to the Event Management System.
                
                Your organizer account has been created.
                
                Login Credentials:
                Username: ${username}
                Password: ${password}
                
                Please login and change your password immediately.
            `;

      await sendEmail({
        email: user.email,
        subject: 'Organizer Account Created',
        message,
      });
    } catch (error) {
      console.error('Email send failed:', error);
    }

    // Return raw credentials so Admin can share them (in real app, email them)
    res.status(201).json({
      _id: user.id,
      username,
      password, // RETURN RAW PASSWORD FOR DISPLAY
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  createOrganizer,
};
