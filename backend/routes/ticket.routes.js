const express = require('express');
const router = express.Router();
const {
  getTicketTypes,
  createTicketType,
  updateTicketType,
  deleteTicketType,
  createPromoCode,
  verifyPromoCode,
  getPromoCode,
  updatePromoCode,
} = require('../controllers/ticket.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/event/:eventId', getTicketTypes);
router.get('/promo/:eventId', protect, authorize('ORGANIZER', 'ADMIN'), getPromoCode);
router.post('/', protect, authorize('ORGANIZER', 'ADMIN'), createTicketType);
router.put('/:id', protect, authorize('ORGANIZER', 'ADMIN'), updateTicketType);
router.delete('/:id', protect, authorize('ORGANIZER', 'ADMIN'), deleteTicketType);
router.post('/promo', protect, authorize('ORGANIZER', 'ADMIN'), createPromoCode);
router.put('/promo/:id', protect, authorize('ORGANIZER', 'ADMIN'), updatePromoCode);
router.post('/promo/verify', verifyPromoCode);

module.exports = router;
