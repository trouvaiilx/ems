const Event = require('../models/Event');
const { Waitlist } = require('../models/Booking');
const sendEmail = require('./email');

/**
 * Notify users on the waitlist for a specific event
 * @param {string} eventId - The ID of the event
 * @param {number} limit - Number of users to notify (default: 5)
 * @returns {Promise<{count: number, message: string}>} - Result of notification
 */
const notifyWaitlistUsers = async (eventId, limit = 5) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error('Event not found');
  }

  // Find users to notify (oldest first, not yet notified)
  const waitlistEntries = await Waitlist.find({
    eventId,
    notified: false,
  })
    .sort('createdAt')
    .limit(limit);

  if (waitlistEntries.length === 0) {
    return { count: 0, message: 'No users to notify' };
  }

  let notifiedCount = 0;

  for (const entry of waitlistEntries) {
    try {
      await sendEmail({
        email: entry.attendeeEmail,
        subject: `Spots Available: ${event.name}`,
        message: `
          Good news!
          
          Spots have opened up for ${event.name}.
          
          Please login and book your ticket as soon as possible.
          
          Link: http://ems-five.vercel.app/events/${event._id}
          
          Best regards,
          EMS Team
        `,
      });

      entry.notified = true;
      await entry.save();
      notifiedCount++;
    } catch (error) {
      console.error(`Failed to notify ${entry.attendeeEmail}:`, error);
    }
  }

  return {
    count: notifiedCount,
    message: `Notified ${notifiedCount} users`,
  };
};

module.exports = { notifyWaitlistUsers };
