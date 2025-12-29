const mongoose = require('mongoose');
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

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  role: String,
});

const User = mongoose.model('User', userSchema);

const listUsers = async () => {
  await connectDB();
  const users = await User.find({}, 'username email role');
  console.log('Users found:', users);
  process.exit();
};

listUsers();
