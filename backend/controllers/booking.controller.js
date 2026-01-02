const { Booking, Waitlist } = require('../models/Booking');
const { TicketType, PromotionalCode } = require('../models/Ticket');
const Event = require('../models/Event');
const crypto = require('crypto');
const sendEmail = require('../utils/email');
const { notifyWaitlistUsers } = require('../utils/waitlist');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');

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
  const requestedSeats = []; // Track all seats in this request to check for internal duplicates

  // Validate and process tickets
  for (const ticketReq of tickets) {
    const ticketType = await TicketType.findById(ticketReq.ticketTypeId);
    // ... validation ...

    if (!ticketType) {
      res.status(400);
      throw new Error(`Invalid ticket type: ${ticketReq.ticketTypeId}`);
    }

    const qty = ticketReq.quantity || 1;

    // SCALABLE SEAT CHECK:
    // If specific seat numbers are requested, we must check if they are already taken.
    if (ticketReq.seatNumbers && ticketReq.seatNumbers.length > 0) {
      if (ticketReq.seatNumbers.length !== qty) {
        res.status(400);
        throw new Error(
          `Mismatch between quantity (${qty}) and provided seat numbers (${ticketReq.seatNumbers.length})`
        );
      }

      // 1. Check for duplicates within the request itself
      for (const seat of ticketReq.seatNumbers) {
        if (requestedSeats.includes(seat)) {
          res.status(400);
          throw new Error(`Duplicate seat in request: ${seat}`);
        }
        requestedSeats.push(seat);
      }

      // 2. Check against database
      // Find any CONFIRMED or PENDING booking for this event that contains any of these seats
      // Note: This relies on MongoDB structure.
      // We need to query: "tickets.seatNumber" IN [requestedSeats] AND eventId == currentEventId AND status != 'CANCELLED'

      // Optimize: We can do a single query before the loop if we gathered all seats first,
      // but since we are iterating ticket types, we might do it per chunk or gather all first.
      // Let's gather all seats first? No, we need ticketType context.
      // Actually, preventing any overlap for the EVENT is the goal.

      const existingBooking = await Booking.findOne({
        eventId,
        status: { $ne: 'CANCELLED' },
        'tickets.seatNumber': { $in: ticketReq.seatNumbers },
      });

      if (existingBooking) {
        // Find which seat is taken
        // This is a bit rough, but finds at least one collision
        res.status(400);
        // We could identify exactly which one, but for now generic error is safe
        throw new Error(`One or more selected seats are already booked.`);
      }
    }

    if (ticketType.soldTickets + qty > ticketType.maxTickets) {
      // ...
      res.status(400);
      throw new Error(`Not enough tickets available for ${ticketType.category}`);
    }

    // Calculate price
    for (let i = 0; i < qty; i++) {
      totalAmount += ticketType.price;
      bookingTickets.push({
        ticketTypeId: ticketType._id,
        category: ticketType.category,
        section: ticketType.section,
        seatNumber: ticketReq.seatNumbers ? ticketReq.seatNumbers[i] : 'N/A', // Simplified
        price: ticketType.price,
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
    status: 'PENDING', // Wait for payment
  });

  // Log Activity
  const ActivityLog = require('../models/ActivityLog');
  await ActivityLog.create({
    action: 'BOOKING_CREATED',
    targetId: booking._id,
    metadata: { amount: finalAmount },
  });

  res.status(201).json(booking);
};

// @desc    Process Mock Payment
// @route   POST /api/bookings/pay
// @access  Private
const processPayment = async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.status !== 'PENDING') {
    res.status(400);
    throw new Error('Booking is not pending payment');
  }

  // Simulate payment processing delay or logic
  // Update to CONFIRMED
  booking.status = 'CONFIRMED';
  booking.paymentDate = new Date();
  await booking.save();

  // Send Email via Firebase Trigger (moved from createBooking)
  const event = await Event.findById(booking.eventId);

  // Generate QR Code Data URL
  const qrCodeDataUrl = await QRCode.toDataURL(booking.qrCode || booking._id.toString());

  sendEmail({
    email: booking.attendeeEmail,
    subject: 'Booking Confirmation - ' + (event ? event.name : 'Event'),
    message: `
            Dear ${booking.attendeeName},

            Your booking for ${event ? event.name : 'the event'} has been confirmed!

            Event Date: ${new Date(booking.eventDate).toLocaleDateString()}
            Booking ID: ${booking._id}
            Total Amount: RM ${booking.finalAmount}

            Please show the QR Code in your app or the attached QR code below at the entrance.

            Enjoy the event!
            
            EMS Team
          `,
    html: `
      <h2>Booking Confirmed!</h2>
      <p>Dear ${booking.attendeeName},</p>
      <p>Your booking for <strong>${
        event ? event.name : 'the event'
      }</strong> has been confirmed!</p>
      <p>
        <strong>Event Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}<br>
        <strong>Booking ID:</strong> ${booking._id}<br>
        <strong>Total Amount:</strong> RM ${booking.finalAmount}
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <img src="${qrCodeDataUrl}" alt="Ticket QR Code" style="width: 200px; height: 200px;" />
        <p>Scan this code at the entrance</p>
      </div>
      <p>Enjoy the event!</p>
      <p>EMS Team</p>
    `,
  }).catch((error) => console.error('Booking email failed:', error));

  // Log
  const ActivityLog = require('../models/ActivityLog');
  await ActivityLog.create({
    action: 'PAYMENT_SUCCESS',
    targetId: booking._id,
    metadata: { amount: booking.finalAmount },
  });

  res.status(200).json({ success: true, booking });
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
    attendeePhone: req.user.phoneNumber,
  });

  res.status(201).json(waitlistEntry);
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check authorization (Attendee can view own, Organizer/Admin can view any)
  if (
    booking.attendeeId.toString() !== req.user.id &&
    req.user.role !== 'ADMIN' &&
    req.user.role !== 'ORGANIZER'
  ) {
    res.status(401);
    throw new Error('Not authorized to view this booking');
  }

  res.status(200).json(booking);
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Authorization: Attendee can cancel own, Admin/Organizer can cancel any
  if (
    booking.attendeeId.toString() !== req.user.id &&
    req.user.role !== 'ADMIN' &&
    req.user.role !== 'ORGANIZER'
  ) {
    res.status(401);
    throw new Error('Not authorized to cancel this booking');
  }

  if (booking.status === 'CANCELLED') {
    res.status(400);
    throw new Error('Booking is already cancelled');
  }

  // Restore ticket stock
  // Group tickets by ID to minimize DB queries
  const ticketCounts = {};
  booking.tickets.forEach((ticket) => {
    const id = ticket.ticketTypeId.toString();
    ticketCounts[id] = (ticketCounts[id] || 0) + 1;
  });

  // Update each ticket type
  for (const [id, count] of Object.entries(ticketCounts)) {
    await TicketType.findByIdAndUpdate(id, { $inc: { soldTickets: -count } });
  }

  booking.status = 'CANCELLED';
  await booking.save();

  // Notify waitlist (async, don't block response)
  notifyWaitlistUsers(booking.eventId).catch((err) => console.error('Auto-notify failed:', err));

  res.status(200).json(booking);
};

// @desc    Check-in attendee
// @route   PUT /api/bookings/checkin
// @access  Private (Organizer/Admin)
const checkInBooking = async (req, res) => {
  const { qrCode } = req.body;

  const booking = await Booking.findOne({ qrCode });

  if (!booking) {
    res.status(404);
    throw new Error('Invalid QR Code');
  }

  if (booking.status === 'CANCELLED') {
    res.status(400);
    throw new Error('Booking is cancelled');
  }

  if (booking.checkedIn) {
    res.status(400);
    throw new Error(`Attendee already checked in at ${booking.checkedInAt}`);
  }

  booking.checkedIn = true;
  booking.checkedInAt = new Date();
  await booking.save();

  res.status(200).json(booking);
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings/all
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  const bookings = await Booking.find({})
    .populate('eventId', 'name date')
    .populate('attendeeId', 'fullName email')
    .sort('-createdAt');
  res.status(200).json(bookings);
};

// @desc    Get waitlist for an event
// @route   GET /api/bookings/waitlist/event/:eventId
const getWaitlistByEvent = async (req, res) => {
  const waitlist = await Waitlist.find({ eventId: req.params.eventId }).sort('createdAt');
  res.status(200).json(waitlist);
};

// @desc    Leave waitlist
// @route   DELETE /api/bookings/waitlist/:id
const leaveWaitlist = async (req, res) => {
  const waitlistEntry = await Waitlist.findById(req.params.id);

  if (!waitlistEntry) {
    res.status(404);
    throw new Error('Waitlist entry not found');
  }

  // Auth check: User can remove themselves, or Admin/Organizer
  if (
    waitlistEntry.attendeeId.toString() !== req.user.id &&
    req.user.role !== 'ADMIN' &&
    req.user.role !== 'ORGANIZER'
  ) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await waitlistEntry.deleteOne();
  res.status(200).json({ message: 'Removed from waitlist' });
};

// @desc    Notify waitlist users
// @route   POST /api/bookings/waitlist/notify
const notifyWaitlist = async (req, res) => {
  const { eventId, limit } = req.body;

  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check auth
  if (event.organizerId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
    res.status(401);
    throw new Error('Not authorized');
  }

  const result = await notifyWaitlistUsers(eventId, limit);
  res.status(200).json(result);
};

// @desc    Get all booked seats for an event
// @route   GET /api/bookings/event/:eventId/seats
const getEventBookedSeats = async (req, res) => {
  const bookings = await Booking.find({
    eventId: req.params.eventId,
    status: { $ne: 'CANCELLED' },
  }).select('tickets.seatNumber');

  const bookedSeats = bookings.reduce((acc, booking) => {
    booking.tickets.forEach((ticket) => {
      if (ticket.seatNumber && ticket.seatNumber !== 'N/A') {
        acc.push(ticket.seatNumber);
      }
    });
    return acc;
  }, []);

  res.status(200).json(bookedSeats);
};

// @desc    Download ticket PDF
// @route   GET /api/bookings/:id/download
const downloadTicket = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Auth check
  if (
    booking.attendeeId.toString() !== req.user.id &&
    req.user.role !== 'ADMIN' &&
    req.user.role !== 'ORGANIZER'
  ) {
    res.status(401);
    throw new Error('Not authorized');
  }

  if (booking.status !== 'CONFIRMED') {
    res.status(400);
    throw new Error('Ticket is not confirmed');
  }

  // Generate QR Code
  const qrImage = await QRCode.toBuffer(booking.qrCode || booking._id.toString());

  // Create PDF
  const doc = new PDFDocument();

  // Pipe to response
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=ticket-${booking._id}.pdf`);

  doc.pipe(res);

  // Header
  doc.fontSize(25).text('Event Ticket', 100, 50);

  // Event Details
  doc.fontSize(16).text(booking.eventName, 100, 100);
  doc.fontSize(12).text(new Date(booking.eventDate).toLocaleDateString(), 100, 125);

  // Attendee
  doc.moveDown();
  doc.text(`Attendee: ${booking.attendeeName}`);
  doc.text(`Booking ID: ${booking._id}`);

  // Tickets
  doc.moveDown();
  doc.text('Seats:', { underline: true });
  booking.tickets.forEach((t) => {
    const seatStr = t.seatNumber !== 'N/A' ? `Seat ${t.seatNumber}` : 'General Admission';
    doc.text(`- ${t.category} (${t.section}): ${seatStr}`);
  });

  // QR Code
  doc.image(qrImage, 100, 300, { width: 150 });
  doc.text('Scan at entrance', 100, 460);

  doc.end();
};

module.exports = {
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
};
