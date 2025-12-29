const express = require('express');
const router = express.Router();
const { getSystemStats, getAnalytics, exportReport } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/stats', protect, authorize('ADMIN'), getSystemStats);
router.get('/analytics', protect, authorize('ADMIN'), getAnalytics);
router.get('/export', protect, authorize('ADMIN'), exportReport);

module.exports = router;
