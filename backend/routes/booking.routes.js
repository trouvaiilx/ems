const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getEventBookings,
  joinWaitlist,
  getWaitlistByEvent,
  leaveWaitlist,
  getBookingById,
  cancelBooking,
  checkInBooking,
  getAllBookings,
  processPayment,
  notifyWaitlist,
  getEventBookedSeats,
  downloadTicket,
} = require('../controllers/booking.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, createBooking);
router.post('/pay', protect, processPayment);
router.get('/my', protect, getMyBookings);
router.get('/event/:eventId', protect, authorize('ORGANIZER', 'ADMIN'), getEventBookings);
router.post('/waitlist', protect, joinWaitlist);
// Duplicate removed
router.get('/waitlist/event/:eventId', protect, getWaitlistByEvent);
router.post('/waitlist/notify', protect, authorize('ORGANIZER', 'ADMIN'), notifyWaitlist);
router.delete('/waitlist/:id', protect, leaveWaitlist);

// Public route for checking seat availability
router.get('/event/:eventId/seats', getEventBookedSeats);
// Specific routes first
router.put('/checkin', protect, authorize('ADMIN'), checkInBooking);
router.get('/all', protect, authorize('ADMIN'), getAllBookings);

// Dynamic routes last
router.route('/:id').get(protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
