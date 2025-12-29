const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const API_URL = 'http://127.0.0.1:5006/api';

const testCreateOrganizer = async () => {
  try {
    console.log(`Running Organizer Creation Test against ${API_URL}`);

    // 1. Login as Admin
    console.log('1. Logging in as Admin...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' }),
    });

    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('   [PASS] Login successful');

    // 2. Create Organizer
    console.log('2. Creating Organizer...');
    const organizerData = {
      fullName: 'Test Organizer',
      email: `organizer${Date.now()}@test.com`,
      phoneNumber: '0123456789',
      organizationName: 'Test Events Co.',
    };

    const createRes = await fetch(`${API_URL}/users/organizer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(organizerData),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      throw new Error(`Create Organizer failed: ${createRes.status} ${errText}`);
    }

    const createdUser = await createRes.json();
    console.log('   [PASS] Organizer created:', createdUser);

    if (createdUser.password && createdUser.username) {
      console.log('   [PASS] Credentials returned successfully');
    } else {
      throw new Error('Credentials NOT returned');
    }
  } catch (error) {
    console.error(`\n[FAIL] Test Failed:`, error.message);
  }
};

testCreateOrganizer();
