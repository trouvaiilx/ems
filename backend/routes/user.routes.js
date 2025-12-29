const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
} = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', protect, authorize('ADMIN'), getAllUsers);
router.get('/:id', protect, authorize('ADMIN'), getUserById);

module.exports = router;
