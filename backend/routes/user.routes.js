const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  deleteUser,
  createOrganizer,
} = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', protect, authorize('ADMIN'), getAllUsers);
router.get('/:id', protect, authorize('ADMIN'), getUserById);
router.post('/organizer', protect, authorize('ADMIN'), createOrganizer);
router.delete('/:id', protect, authorize('ADMIN'), deleteUser);

module.exports = router;
