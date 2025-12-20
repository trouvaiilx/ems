const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public (or Private depending on req)
const getEvents = async (req, res) => {
  const events = await Event.find();
  res.status(200).json(events);
};

// @desc    Get event by id
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
    const event = await Event.findById(req.params.id);
    if(!event) {
        res.status(404);
        throw new Error('Event not found');
    }
    res.status(200).json(event);
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer/Admin)
const createEvent = async (req, res) => {
  if (!req.body.name || !req.body.description || !req.body.date || !req.body.time) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  const event = await Event.create({
    ...req.body,
    organizerId: req.user.id,
    organizerName: req.user.fullName // Assuming user has fullName
  });

  res.status(200).json(event);
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Organizer/Admin)
const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(400);
    throw new Error('Event not found');
  }

  // Check user (only organizer or admin can update)
  if (event.organizerId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedEvent);
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Organizer/Admin)
const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(400);
    throw new Error('Event not found');
  }

  // Check user
  if (event.organizerId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
    res.status(401);
    throw new Error('User not authorized');
  }

  await event.deleteOne();

  res.status(200).json({ id: req.params.id });
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
