const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please add a username'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    fullName: {
      type: String,
      required: [true, 'Please add a full name'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please add a phone number'],
    },
    organizationName: {
      type: String,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'ORGANIZER', 'ATTENDEE'],
      default: 'ATTENDEE',
    },
    isFirstLogin: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
