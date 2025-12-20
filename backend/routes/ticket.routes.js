const express = require('express');
const router = express.Router();
const {
    getTicketTypes,
    createTicketType,
    updateTicketType,
    deleteTicketType,
    createPromoCode,
    verifyPromoCode
} = require('../controllers/ticket.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/event/:eventId', getTicketTypes);
router.post('/', protect, authorize('ORGANIZER', 'ADMIN'), createTicketType);
router.put('/:id', protect, authorize('ORGANIZER', 'ADMIN'), updateTicketType);
router.delete('/:id', protect, authorize('ORGANIZER', 'ADMIN'), deleteTicketType);
router.post('/promo', protect, authorize('ORGANIZER', 'ADMIN'), createPromoCode);
router.post('/promo/verify', verifyPromoCode);

module.exports = router;
