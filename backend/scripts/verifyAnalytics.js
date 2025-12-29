const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');
const Event = require('../models/Event');
const connectDB = require('../config/db');
const bcrypt = require('bcryptjs');

dotenv.config();

const API_URL = 'http://localhost:5014/api';

const verifyAnalytics = async () => {
  try {
    await connectDB();

    // 1. Create Admin
    const email = `admin_analytics_${Date.now()}@test.com`;
    const password = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await User.create({
      username: `admin_an_${Date.now()}`,
      email,
      password: hashedPassword,
      fullName: 'Analytics Admin',
      phoneNumber: '1234567890',
      role: 'ADMIN',
      isFirstLogin: false,
    });

    // 2. Login to get Token
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: admin.username, password }),
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    // 3. Test GET /admin/analytics (Default Weekly)
    const weeklyRes = await fetch(`${API_URL}/admin/analytics?period=weekly`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const weeklyData = await weeklyRes.json();
    console.log('Weekly Analytics:', JSON.stringify(weeklyData, null, 2));

    if (Array.isArray(weeklyData)) {
      console.log('GET /admin/analytics?period=weekly : PASS');
    } else {
      console.log('GET /admin/analytics?period=weekly : FAIL');
    }

    // 4. Test GET /admin/analytics (Monthly)
    const monthlyRes = await fetch(`${API_URL}/admin/analytics?period=monthly`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const monthlyData = await monthlyRes.json();
    console.log('Monthly Analytics:', JSON.stringify(monthlyData, null, 2));

    if (Array.isArray(monthlyData)) {
      console.log('GET /admin/analytics?period=monthly : PASS');
    } else {
      console.log('GET /admin/analytics?period=monthly : FAIL');
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

verifyAnalytics();
