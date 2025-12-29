const User = require('../models/User');
const Event = require('../models/Event');
const { Booking } = require('../models/Booking');
const { TicketType } = require('../models/Ticket');
const ActivityLog = require('../models/ActivityLog');
// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getSystemStats = async (req, res) => {
  try {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1); // Same as currentMonthStart, but used as end of last month range

    console.log('--- Stats Debug ---');
    console.log(
      'Current Month Range:',
      currentMonthStart.toISOString(),
      'to',
      nextMonthStart.toISOString()
    );

    // Helpers
    const getCount = async (Model, query = {}) => Model.countDocuments(query);
    const getCountByDate = async (
      Model,
      startDate,
      endDate,
      dateField = 'createdAt',
      query = {}
    ) => {
      const count = await Model.countDocuments({
        ...query,
        [dateField]: { $gte: startDate, $lt: endDate },
      });
      console.log(
        `Count for ${Model.modelName} (${startDate.toISOString()} - ${endDate.toISOString()}):`,
        count
      );
      return count;
    };

    // 1. Users (Total: Active Users, New: Registered LOGS this month)
    const totalUsers = await getCount(User);
    const currentMonthUsers = await getCount(ActivityLog, {
      action: 'USER_REGISTERED',
      createdAt: { $gte: currentMonthStart, $lt: nextMonthStart },
    });

    // 2. Organizers (Total: Active Organizers, New: Created LOGS this month)
    const totalOrganizers = await getCount(User, { role: 'ORGANIZER' });
    const currentMonthOrg = await getCount(ActivityLog, {
      action: 'ORGANIZER_CREATED',
      createdAt: { $gte: currentMonthStart, $lt: nextMonthStart },
    });

    // 3. Events (New: Created LOGS this month)
    const totalEvents = await Event.countDocuments();
    const currentMonthEvents = await getCount(ActivityLog, {
      action: 'EVENT_CREATED',
      createdAt: { $gte: currentMonthStart, $lt: nextMonthStart },
    });

    // 4. Bookings (New: Created LOGS this month)
    const totalBookings = await Booking.countDocuments();
    const currentMonthBookings = await getCount(ActivityLog, {
      action: 'BOOKING_CREATED',
      createdAt: { $gte: currentMonthStart, $lt: nextMonthStart },
    });

    // 5. Revenue (REMAINS SAME - Revenue is based on valid bookings, usually we DO want this to go down if refunded.
    // If user wants revenue to be strict "sales generated" regardless of refund, we'd log it.
    // But usually financial metrics reflect current valid state. The user specifically asked about counters like "add 2 organizers".
    // I'll leave Revenue as is for now unless requested, as "New Revenue" usually implies net.
    // BUT to correspond with "New bookings", maybe it should be gross revenue?
    // Let's stick to the requested "counts" for now. The prompt example was about organizers/events.
    // Revenue from 'CONFIRMED' bookings is essentially 'persistent' unless cancelled.
    // If I delete a booking, revenue drops. That is technically correct for accounting.
    // A deleted organizer is different - history says they WERE added.
    // I will keep revenue as sums of existing confirmed bookings for financial accuracy.)

    const getRevenue = async (startDate, endDate) => {
      const result = await Booking.aggregate([
        {
          $match: {
            status: 'CONFIRMED',
            createdAt: { $gte: startDate, $lt: endDate },
          },
        },
        { $group: { _id: null, total: { $sum: '$finalAmount' } } },
      ]);
      return result.length > 0 ? result[0].total : 0;
    };
    // Total Revenue (All time)
    const totalRevenueResult = await Booking.aggregate([
      { $match: { status: 'CONFIRMED' } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } },
    ]);
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;
    const currentRevenue = await getRevenue(currentMonthStart, nextMonthStart);
    const lastRevenue = await getRevenue(lastMonthStart, lastMonthEnd);
    // const revenueChange = calculateChange(currentRevenue, lastRevenue);

    res.status(200).json({
      totalUsers,
      totalOrganizers,
      totalEvents,
      totalBookings,
      totalRevenue,
      date_range: {
        current_start: currentMonthStart,
        last_start: lastMonthStart,
      },
      changes: {
        users: currentMonthUsers,
        organizers: currentMonthOrg,
        events: currentMonthEvents,
        bookings: currentMonthBookings,
        revenue: currentRevenue,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error('Server Error');
  }
};

// ... getAnalytics stays same ... But wait, I'm replacing the whole file content for exportReport?
// No, I'm using replace_file_content with range.
// I need to be careful to KEEP getAnalytics.
// The instruction said "Replace getSystemStats with advanced version and add exportReport".
// I should probably do 2 separate edits or one big one.
// Let's add exportReport below getSystemStats but BEFORE module.exports.

// ... (getAnalytics code is in lines 39-113) ...

// @desc    Export analytics report
// @route   GET /api/admin/export
// @access  Private/Admin
const exportReport = async (req, res) => {
  const { format } = req.query; // pdf or csv
  const { period } = req.query;

  try {
    // Fetch data (reuse getAnalytics logic or just call it? calling controller in controller is messy.
    // Better extract logic or just re-run query. Re-querying is safer and cleaner here.)
    // For simplicity, let's just fetch "All Events" summary for now, or the same data as /analytics.
    // The user asked for "export report in the analytics". So it likely exports the displayed chart data.

    let groupFormat;
    if (period === 'monthly') {
      groupFormat = '%Y-%m';
    } else {
      groupFormat = '%Y-W%V';
    }

    const eventStats = await Event.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$date' } },
          events: { $push: '$_id' },
          eventsHosted: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    const reports = await Promise.all(
      eventStats.map(async (stat) => {
        const eventIds = stat.events;
        const revenueResult = await Booking.aggregate([
          { $match: { eventId: { $in: eventIds }, status: 'CONFIRMED' } },
          { $group: { _id: null, total: { $sum: '$finalAmount' } } },
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        const { TicketType } = require('../models/Ticket');
        let totalOccupancy = 0;
        let eventCountForOccupancy = 0;
        for (const eventId of eventIds) {
          const tickets = await TicketType.find({ eventId });
          if (tickets.length > 0) {
            const max = tickets.reduce((sum, t) => sum + t.maxTickets, 0);
            const sold = tickets.reduce((sum, t) => sum + t.soldTickets, 0);
            if (max > 0) {
              totalOccupancy += (sold / max) * 100;
              eventCountForOccupancy++;
            }
          }
        }
        const averageOccupancy =
          eventCountForOccupancy > 0 ? totalOccupancy / eventCountForOccupancy : 0;

        return {
          period: stat._id,
          eventsHosted: stat.eventsHosted,
          totalRevenue,
          averageOccupancy: Math.round(averageOccupancy * 10) / 10,
        };
      })
    );

    if (format === 'csv') {
      const { Parser } = require('json2csv');
      const fields = ['period', 'eventsHosted', 'totalRevenue', 'averageOccupancy'];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(reports);

      res.header('Content-Type', 'text/csv');
      res.attachment('analytics_report.csv');
      return res.send(csv);
    }

    if (format === 'pdf') {
      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument();

      res.header('Content-Type', 'application/pdf');
      res.attachment('analytics_report.pdf');

      doc.pipe(res);

      doc.fontSize(20).text('EMS Analytics Report', { align: 'center' });
      doc.moveDown();

      reports.forEach((r) => {
        doc.fontSize(12).text(`Period: ${r.period}`);
        doc.fontSize(10).text(`Events: ${r.eventsHosted}`);
        doc.text(`Revenue: RM ${r.totalRevenue}`);
        doc.text(`Occupancy: ${r.averageOccupancy}%`);
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

// @desc    Get analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  const { period } = req.query; // 'weekly' or 'monthly'

  // Determine date grouping format
  let groupFormat;
  // MongoDB $dateToString format
  if (period === 'monthly') {
    groupFormat = '%Y-%m'; // Monthly: 2025-11
  } else {
    groupFormat = '%Y-W%V'; // Weekly: 2025-W45
  }

  try {
    // 1. Aggregate Events by Period
    const eventStats = await Event.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$date' } },
          events: { $push: '$_id' },
          eventsHosted: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 }, // Last 12 periods max
    ]);

    // 2. Enrich with Revenue and Occupancy
    const reports = await Promise.all(
      eventStats.map(async (stat) => {
        const eventIds = stat.events;

        // Calculate Revenue from Bookings
        const revenueResult = await Booking.aggregate([
          { $match: { eventId: { $in: eventIds }, status: 'CONFIRMED' } },
          { $group: { _id: null, total: { $sum: '$finalAmount' } } },
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Calculate Occupancy from TicketTypes
        // For each event, calculate occupancy, then average them for the period
        const { TicketType } = require('../models/Ticket');
        let totalOccupancy = 0;
        let eventCountForOccupancy = 0;

        for (const eventId of eventIds) {
          const tickets = await TicketType.find({ eventId });
          if (tickets.length > 0) {
            const max = tickets.reduce((sum, t) => sum + t.maxTickets, 0);
            const sold = tickets.reduce((sum, t) => sum + t.soldTickets, 0);
            if (max > 0) {
              totalOccupancy += (sold / max) * 100;
              eventCountForOccupancy++;
            }
          }
        }

        const averageOccupancy =
          eventCountForOccupancy > 0 ? totalOccupancy / eventCountForOccupancy : 0;

        return {
          period: stat._id,
          eventsHosted: stat.eventsHosted,
          totalRevenue,
          averageOccupancy: Math.round(averageOccupancy * 10) / 10, // Round to 1 decimal
        };
      })
    );

    res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error('Analytics Error');
  }
};

module.exports = {
  getSystemStats,
  getAnalytics,
  exportReport,
};
