const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Event = require('./models/Event');
const { Booking } = require('./models/Booking');

dotenv.config();

const debugStats = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    console.log(
      'Debug Time Range:',
      currentMonthStart.toISOString(),
      'to',
      nextMonthStart.toISOString()
    );

    const checkModel = async (Model, name) => {
      const total = await Model.countDocuments();
      const monthCount = await Model.countDocuments({
        createdAt: { $gte: currentMonthStart, $lt: nextMonthStart },
      });
      console.log(`\n--- ${name} ---`);
      console.log('Total:', total);
      console.log('New This Month:', monthCount);

      if (name === 'User') {
        const roles = ['ADMIN', 'ORGANIZER', 'ATTENDEE'];
        for (const role of roles) {
          const roleCount = await Model.countDocuments({
            role: role,
            createdAt: { $gte: currentMonthStart, $lt: nextMonthStart },
          });
          console.log(`  Role ${role}: ${roleCount}`);
        }
      }

      if (monthCount < 10 && monthCount > 0) {
        const items = await Model.find({
          createdAt: { $gte: currentMonthStart, $lt: nextMonthStart },
        }).select('createdAt name fullName role');
        console.log('Items:', items);
      } else if (monthCount === 0 && total > 0) {
        const lastItem = await Model.findOne().sort({ createdAt: -1 });
        console.log('Latest Item Date:', lastItem.createdAt);
      }
    };

    await checkModel(User, 'User');
    await checkModel(Event, 'Event');
    await checkModel(Booking, 'Booking');

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

debugStats();
