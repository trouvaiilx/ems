const dotenv = require('dotenv');
// const colors = require('colors');
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');
const bcrypt = require('bcryptjs');

dotenv.config();

const API_URL = 'http://localhost:5013/api';

const verifyStats = async () => {
  try {
    await connectDB();

    // 1. Create Admin
    const email = `admin_test_${Date.now()}@test.com`;
    const password = 'password123';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await User.create({
      username: `admin_${Date.now()}`,
      email,
      password: hashedPassword,
      fullName: 'Test Admin',
      phoneNumber: '1234567890',
      role: 'ADMIN',
      isFirstLogin: false,
    });

    console.log(`Created Admin: ${email}`);

    // 2. Login to get Token
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: admin.username, password }),
    });
    const loginData = await loginRes.json();

    if (!loginData.token) {
      throw new Error('Login failed: ' + JSON.stringify(loginData));
    }

    const token = loginData.token;
    console.log('Got Admin Token');

    // 3. Test GET /stats
    const statsRes = await fetch(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const statsData = await statsRes.json();

    console.log('Stats Response:', statsData);

    if (statsData.totalUsers !== undefined) {
      console.log('GET /admin/stats : PASS');
    } else {
      console.log('GET /admin/stats : FAIL (Invalid Structure)');
    }

    // 4. Test GET /bookings/all
    const bookingsRes = await fetch(`${API_URL}/bookings/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const bookingsData = await bookingsRes.json();

    console.log(`Fetched ${Array.isArray(bookingsData) ? bookingsData.length : 0} bookings`);
    if (Array.isArray(bookingsData)) {
      console.log('GET /bookings/all : PASS');
    } else {
      console.log('GET /bookings/all : FAIL', bookingsData);
    }

    // Cleanup
    await User.findByIdAndDelete(admin._id);
    console.log('Cleanup Done');
    process.exit(0);
  } catch (error) {
    console.error('Test Failed:', error);
    process.exit(1);
  }
};

verifyStats();
