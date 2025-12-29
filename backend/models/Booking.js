const mongoose = require('mongoose');

const bookingTicketSchema = mongoose.Schema({
    ticketTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'TicketType'
    },
    category: String,
    section: String,
    seatNumber: String,
    price: Number
});

const bookingSchema = mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Event',
    },
    eventName: String,
    eventDate: Date,
    attendeeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    attendeeName: String,
    attendeeEmail: String,
    tickets: [bookingTicketSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    discountApplied: {
        type: Number,
        default: 0
    },
    finalAmount: {
        type: Number,
        required: true
    },
    promoCode: String,
    qrCode: String,
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
      default: 'PENDING',
    },
    checkedIn: {
        type: Boolean,
        default: false
    },
    checkedInAt: Date
  },
  {
    timestamps: true,
  }
);

const waitlistSchema = mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    },
    attendeeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    attendeeEmail: String,
    attendeePhone: String,
    notified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = {
    Booking: mongoose.model('Booking', bookingSchema),
    Waitlist: mongoose.model('Waitlist', waitlistSchema)
};
