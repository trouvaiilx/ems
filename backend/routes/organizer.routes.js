const express = require('express');
const router = express.Router();
const {
  getOrganizerStats,
  getOrganizerAnalytics,
  exportReport,
} = require('../controllers/organizer.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/stats', protect, authorize('ORGANIZER'), getOrganizerStats);
router.get('/analytics', protect, authorize('ORGANIZER'), getOrganizerAnalytics);
router.get('/export', protect, authorize('ORGANIZER'), exportReport);

module.exports = router;
