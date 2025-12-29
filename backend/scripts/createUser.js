const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const userSchema = mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    fullName: String,
    phoneNumber: String,
    organizationName: String,
    role: String,
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

const createUser = async () => {
  await connectDB();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);

  const user = await User.create({
    username: 'admin',
    email: 'admin@example.com',
    password: hashedPassword,
    fullName: 'Admin User',
    phoneNumber: '1234567890',
    organizationName: 'EMS',
    role: 'ADMIN',
  });

  console.log('User created:', user);
  process.exit();
};

createUser();
