const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sendEmail = require('../utils/email');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { username, email, password, fullName, phoneNumber, organizationName, role } = req.body;

  if (!username || !email || !password || !fullName || !phoneNumber) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    fullName,
    phoneNumber,
    organizationName,
    role: 'ATTENDEE', // Default to ATTENDEE, roles must be assigned by Admin later
    isFirstLogin: false, // Self-registered users don't need first login flow
  });

  if (user) {
    // Log Activity
    const ActivityLog = require('../models/ActivityLog');
    await ActivityLog.create({
      action: 'USER_REGISTERED',
      targetId: user._id,
      metadata: { role: 'ATTENDEE' },
    });

    // Send Email via Firebase Trigger
    try {
      await sendEmail({
        email: user.email,
        subject: 'Welcome to Event Management System',
        message: `Hi ${user.fullName},\n\nThank you for registering with us! You can now browse events and book tickets.\n\nBest regards,\nEMS Team`,
      });
    } catch (err) {
      console.error('Welcome email failed:', err);
    }

    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Check for user email
  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isFirstLogin: user.isFirstLogin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide current and new password');
  }

  const user = await User.findById(req.user.id);

  // Check current password
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    res.status(401);
    throw new Error('Invalid current password');
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  // Set isFirstLogin to false
  user.isFirstLogin = false;

  await user.save();

  res.status(200).json({ success: true, message: 'Password updated successfully' });
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  changePassword,
};
