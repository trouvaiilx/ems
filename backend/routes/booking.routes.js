const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getEventBookings,
    joinWaitlist
} = require('../controllers/booking.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/event/:eventId', protect, authorize('ORGANIZER', 'ADMIN'), getEventBookings);
router.post('/waitlist', protect, joinWaitlist);

module.exports = router;
