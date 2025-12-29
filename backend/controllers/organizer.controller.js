const Event = require('../models/Event');
const { Booking } = require('../models/Booking');
const { TicketType } = require('../models/Ticket');

// @desc    Get organizer stats (Dashboard Summary)
// @route   GET /api/organizer/stats
// @access  Private/Organizer
const getOrganizerStats = async (req, res) => {
  try {
    const organizerId = req.user.id;

    // 1. Total Events
    const totalEvents = await Event.countDocuments({ organizerId });

    // 2. Get all event IDs for this organizer
    const events = await Event.find({ organizerId }).select('_id');
    const eventIds = events.map((e) => e._id);

    // 3. Total Bookings & Revenue
    const stats = await Booking.aggregate([
      { $match: { eventId: { $in: eventIds }, status: 'CONFIRMED' } },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$finalAmount' },
        },
      },
    ]);

    const totalBookings = stats.length > 0 ? stats[0].totalBookings : 0;
    const totalRevenue = stats.length > 0 ? stats[0].totalRevenue : 0;

    // 4. Recent Sales (Last 5 bookings)
    const recentSales = await Booking.find({
      eventId: { $in: eventIds },
      status: 'CONFIRMED',
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('eventId', 'name')
      .populate('attendeeId', 'fullName');

    // 5. Monthly Stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const newEventsThisMonth = await Event.countDocuments({
      organizerId,
      createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
    });

    const revenueThisMonthResult = await Booking.aggregate([
      {
        $match: {
          eventId: { $in: eventIds },
          status: 'CONFIRMED',
          createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
        },
      },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } },
    ]);
    const revenueThisMonth =
      revenueThisMonthResult.length > 0 ? revenueThisMonthResult[0].total : 0;

    const bookingsThisMonth = await Booking.countDocuments({
      eventId: { $in: eventIds },
      status: 'CONFIRMED',
      createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
    });

    res.status(200).json({
      totalEvents,
      totalBookings,
      totalRevenue,
      recentSales,
      thisMonth: {
        events: newEventsThisMonth,
        bookings: bookingsThisMonth,
        revenue: revenueThisMonth,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get organizer analytics (Sales & Occupancy Reports)
// @route   GET /api/organizer/analytics
// @access  Private/Organizer
const getOrganizerAnalytics = async (req, res) => {
  try {
    const { eventId, period } = req.query;
    const organizerId = req.user.id;

    // 1. Determine Date Range and Grouping Format
    let startDate = new Date();
    let dateFormat = '%Y-%m-%d';

    if (period === 'weekly') {
      startDate.setDate(startDate.getDate() - 90); // Last ~3 months
      dateFormat = '%Y-%U'; // Year-Week
    } else if (period === 'monthly') {
      startDate.setMonth(startDate.getMonth() - 12); // Last 12 months
      dateFormat = '%Y-%m'; // Year-Month
    } else {
      // Daily (default)
      startDate.setDate(startDate.getDate() - 30); // Last 30 days
      dateFormat = '%Y-%m-%d';
    }

    // 2. Resolve Event IDs
    let targetEventIds = [];
    if (eventId) {
      // Verify ownership
      const event = await Event.findOne({ _id: eventId, organizerId });
      if (!event) {
        return res.status(404).json({ message: 'Event not found or unauthorized' });
      }
      targetEventIds = [event._id];
    } else {
      // All events
      const events = await Event.find({ organizerId }).select('_id');
      targetEventIds = events.map((e) => e._id);
    }

    // 3. Sales Report (New Sales per period)
    const salesReportRaw = await Booking.aggregate([
      {
        $match: {
          eventId: { $in: targetEventIds },
          status: 'CONFIRMED',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          ticketsSold: { $sum: 1 },
          revenue: { $sum: '$finalAmount' },
          averageTicketPrice: { $avg: '$finalAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const salesReports = salesReportRaw.map((item) => ({
      period: item._id,
      ticketsSold: item.ticketsSold,
      revenue: item.revenue,
      averageTicketPrice: Math.round(item.averageTicketPrice || 0),
    }));

    // 4. Occupancy Report (Cumulative Occupancy)
    const ticketTypes = await TicketType.find({ eventId: { $in: targetEventIds } });
    const totalCapacity = ticketTypes.reduce((sum, t) => sum + t.maxTickets, 0);
    const finalCapacity = totalCapacity > 0 ? totalCapacity : 1;

    let cumulativeSold = 0;
    // Get total sold BEFORE the start date for baseline
    const initialSold = await Booking.countDocuments({
      eventId: { $in: targetEventIds },
      status: 'CONFIRMED',
      createdAt: { $lt: startDate },
    });
    cumulativeSold = initialSold;

    // Note: This naive mapping mainly works if salesReports covers all periods.
    // Ideally we'd fill gaps (dates with 0 sales) to show flat lines.
    // For MVP we just show points where sales happened.
    const occupancyReports = salesReports.map((report) => {
      cumulativeSold += report.ticketsSold;
      const occupancyRate = (cumulativeSold / finalCapacity) * 100;
      return {
        period: report.period,
        totalSeats: finalCapacity,
        occupiedSeats: cumulativeSold,
        occupancyRate: parseFloat(occupancyRate.toFixed(1)),
      };
    });

    res.status(200).json({
      salesReports,
      occupancyReports,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Export organizer reports
// @route   GET /api/organizer/export
// @access  Private/Organizer
const exportReport = async (req, res) => {
  const { format } = req.query; // pdf or csv

  try {
    const organizerId = req.user.id;
    // Fetch organizer's events
    const events = await Event.find({ organizerId });
    const eventIds = events.map((e) => e._id);

    const reports = await Promise.all(
      events.map(async (event) => {
        // Calculate Revenue
        const revenueResult = await Booking.aggregate([
          { $match: { eventId: event._id, status: 'CONFIRMED' } },
          { $group: { _id: null, total: { $sum: '$finalAmount' } } },
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Calculate Occupancy
        const tickets = await TicketType.find({ eventId: event._id });
        let occupancyRate = 0;
        if (tickets.length > 0) {
          const max = tickets.reduce((sum, t) => sum + t.maxTickets, 0);
          const sold = tickets.reduce((sum, t) => sum + t.soldTickets, 0);
          if (max > 0) {
            occupancyRate = (sold / max) * 100;
          }
        }

        // Calculate Tickets Sold
        const ticketsSold = tickets.reduce((sum, t) => sum + t.soldTickets, 0);

        return {
          eventName: event.name,
          date: event.date.toISOString().split('T')[0],
          ticketsSold,
          totalRevenue,
          occupancyRate: Math.round(occupancyRate * 10) / 10,
        };
      })
    );

    if (format === 'csv') {
      const { Parser } = require('json2csv');
      const fields = ['eventName', 'date', 'ticketsSold', 'totalRevenue', 'occupancyRate'];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(reports);

      res.header('Content-Type', 'text/csv');
      res.attachment('organizer_report.csv');
      return res.send(csv);
    }

    if (format === 'pdf') {
      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument();

      res.header('Content-Type', 'application/pdf');
      res.attachment('organizer_report.pdf');

      doc.pipe(res);

      doc.fontSize(20).text('Organizer Event Report', { align: 'center' });
      doc.moveDown();

      reports.forEach((r) => {
        doc.fontSize(14).text(r.eventName);
        doc.fontSize(10).text(`Date: ${r.date}`);
        doc.text(`Tickets Sold: ${r.ticketsSold}`);
        doc.text(`Revenue: RM ${r.totalRevenue}`);
        doc.text(`Occupancy: ${r.occupancyRate}%`);
        doc.moveDown();
      });

      doc.end();
      return;
    }

    res.status(400);
    throw new Error('Invalid format');
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error('Export Failed');
  }
};

module.exports = {
  getOrganizerStats,
  getOrganizerAnalytics,
  exportReport,
};
