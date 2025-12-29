const mongoose = require('mongoose');

const activityLogSchema = mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        'USER_REGISTERED',
        'ORGANIZER_CREATED',
        'EVENT_CREATED',
        'BOOKING_CREATED',
        'PAYMENT_SUCCESS',
      ],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    metadata: {
      type: Object, // Flexible field for extra data like role, amount, etc.
    },
  },
  {
    timestamps: true, // This gives us the createdAt we need for monthly stats
  }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
