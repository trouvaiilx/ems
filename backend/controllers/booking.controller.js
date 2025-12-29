const { Booking, Waitlist } = require('../models/Booking');
const { TicketType, PromotionalCode } = require('../models/Ticket');
const Event = require('../models/Event');
const crypto = require('crypto');

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    const { eventId, tickets, promoCode } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    let totalAmount = 0;
    const bookingTickets = [];

    // Validate and process tickets
    for (const ticketReq of tickets) {
        const ticketType = await TicketType.findById(ticketReq.ticketTypeId);

        if (!ticketType) {
            res.status(400);
            throw new Error(`Invalid ticket type: ${ticketReq.ticketTypeId}`);
        }

        // If quantity is provided, we treat it as multiple tickets
        const qty = ticketReq.quantity || 1;

        if (ticketType.soldTickets + qty > ticketType.maxTickets) {
            res.status(400);
            throw new Error(`Not enough tickets available for ${ticketType.category}`);
        }

        // Calculate price (basic logic, ignoring dynamic quantity > 1 for simplified schema mapping)
        // Assuming tickets array in request maps 1-to-1 or logic splits it.
        // For simplicity, let's assume 'tickets' in req has 'quantity' but we need to create individual ticket entries if we track seats.
        // Or we just store the summary. The model has `tickets: [bookingTicketSchema]`.
        // I'll assume the request sends individual ticket details if seats are involved, or just quantity.
        for(let i=0; i<qty; i++) {
            totalAmount += ticketType.price;
            bookingTickets.push({
                ticketTypeId: ticketType._id,
                category: ticketType.category,
                section: ticketType.section,
                seatNumber: ticketReq.seatNumbers ? ticketReq.seatNumbers[i] : 'N/A', // Simplified
                price: ticketType.price
            });
        }

        // Update sold count
        ticketType.soldTickets += qty;
        await ticketType.save();
    }

    // Apply Discount
    let discountApplied = 0;
    if (promoCode) {
        const promo = await PromotionalCode.findOne({ code: promoCode, eventId, isActive: true });
        if (promo && new Date() <= promo.expiryDate) {
            discountApplied = (totalAmount * promo.discountPercentage) / 100;
        }
    }

    const finalAmount = totalAmount - discountApplied;

    // Generate Mock QR Code string
    const qrCode = crypto.randomBytes(16).toString('hex');

    const booking = await Booking.create({
        eventId,
        eventName: event.name,
        eventDate: event.date,
        attendeeId: req.user.id,
        attendeeName: req.user.fullName,
        attendeeEmail: req.user.email,
        tickets: bookingTickets,
        totalAmount,
        discountApplied,
        finalAmount,
        promoCode,
        qrCode,
        status: 'CONFIRMED' // Auto confirm for now
    });

    res.status(201).json(booking);
};

// @desc    Get user bookings
// @route   GET /api/bookings/my
const getMyBookings = async (req, res) => {
    const bookings = await Booking.find({ attendeeId: req.user.id }).sort('-createdAt');
    res.status(200).json(bookings);
};

// @desc    Get bookings for an event (Organizer)
// @route   GET /api/bookings/event/:eventId
const getEventBookings = async (req, res) => {
    const bookings = await Booking.find({ eventId: req.params.eventId });
    res.status(200).json(bookings);
};

// @desc    Join Waitlist
// @route   POST /api/bookings/waitlist
const joinWaitlist = async (req, res) => {
    const { eventId } = req.body;

    const exists = await Waitlist.findOne({ eventId, attendeeId: req.user.id });
    if (exists) {
        res.status(400);
        throw new Error('Already on waitlist');
    }

    const waitlistEntry = await Waitlist.create({
        eventId,
        attendeeId: req.user.id,
        attendeeEmail: req.user.email,
        attendeePhone: req.user.phoneNumber
    });

    res.status(201).json(waitlistEntry);
};

module.exports = {
    createBooking,
    getMyBookings,
    getEventBookings,
    joinWaitlist
};
