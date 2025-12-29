const mongoose = require('mongoose');

const ticketTypeSchema = mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Event',
    },
    category: {
      type: String,
      enum: ['GENERAL_ADMISSION', 'VIP', 'SENIOR_CITIZEN', 'CHILD'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    section: {
      type: String,
      enum: ['BALCONY', 'MEZZANINE', 'STALL'],
      required: true,
    },
    maxTickets: {
      type: Number,
      required: true,
    },
    soldTickets: {
      type: Number,
      default: 0,
    },
    waitlistAllocation: {
      type: Number,
      default: 0,
    },
    seatConfig: {
      rows: { type: Number, default: 0 },
      seatsPerRow: { type: Number, default: 0 },
      rowLabelType: {
        type: String,
        enum: ['ALPHABET', 'NUMBER'],
        default: 'ALPHABET',
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ticketTypeSchema.virtual('availableTickets').get(function () {
  return this.maxTickets - this.soldTickets;
});

const promotionalCodeSchema = mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Event',
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
  },
  applicableCategories: [
    {
      type: String,
      enum: ['GENERAL_ADMISSION', 'VIP', 'SENIOR_CITIZEN', 'CHILD'],
    },
  ],
  expiryDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = {
  TicketType: mongoose.model('TicketType', ticketTypeSchema),
  PromotionalCode: mongoose.model('PromotionalCode', promotionalCodeSchema),
};
