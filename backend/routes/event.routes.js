const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
} = require('../controllers/event.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const upload = require('../middleware/upload.middleware');

router
  .route('/')
  .get(getEvents)
  .post(protect, authorize('ORGANIZER', 'ADMIN'), upload.single('image'), createEvent);
router
  .route('/:id')
  .get(getEventById)
  .put(protect, authorize('ORGANIZER', 'ADMIN'), upload.single('image'), updateEvent)
  .delete(protect, authorize('ORGANIZER', 'ADMIN'), deleteEvent);

module.exports = router;
