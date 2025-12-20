const { TicketType, PromotionalCode } = require('../models/Ticket');
const Event = require('../models/Event');

// @desc    Get ticket types for an event
// @route   GET /api/tickets/event/:eventId
const getTicketTypes = async (req, res) => {
    const ticketTypes = await TicketType.find({ eventId: req.params.eventId });
    res.status(200).json(ticketTypes);
};

// @desc    Create ticket type
// @route   POST /api/tickets
// @access  Private (Organizer/Admin)
const createTicketType = async (req, res) => {
    const { eventId, category, price, section, maxTickets } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Authorization check
    if (event.organizerId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        res.status(401);
        throw new Error('Not authorized to add tickets to this event');
    }

    const ticketType = await TicketType.create({
        eventId,
        category,
        price,
        section,
        maxTickets
    });

    res.status(201).json(ticketType);
};

// @desc    Update ticket type
// @route   PUT /api/tickets/:id
const updateTicketType = async (req, res) => {
    const ticketType = await TicketType.findById(req.params.id);
    if (!ticketType) {
        res.status(404);
        throw new Error('Ticket type not found');
    }

    const updatedTicketType = await TicketType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedTicketType);
};

// @desc    Delete ticket type
// @route   DELETE /api/tickets/:id
const deleteTicketType = async (req, res) => {
     const ticketType = await TicketType.findById(req.params.id);
    if (!ticketType) {
        res.status(404);
        throw new Error('Ticket type not found');
    }
    await ticketType.deleteOne();
    res.status(200).json({ id: req.params.id });
};

// @desc    Create promo code
// @route   POST /api/tickets/promo
const createPromoCode = async (req, res) => {
    const promoCode = await PromotionalCode.create(req.body);
    res.status(201).json(promoCode);
};

// @desc    Verify promo code
// @route   POST /api/tickets/promo/verify
const verifyPromoCode = async (req, res) => {
    const { code, eventId } = req.body;
    const promo = await PromotionalCode.findOne({ code, eventId, isActive: true });

    if (!promo) {
        res.status(404);
        throw new Error('Invalid promo code');
    }

    if (new Date() > promo.expiryDate) {
        res.status(400);
        throw new Error('Promo code expired');
    }

    res.status(200).json(promo);
};


module.exports = {
    getTicketTypes,
    createTicketType,
    updateTicketType,
    deleteTicketType,
    createPromoCode,
    verifyPromoCode
};
