const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const API_URL = 'http://127.0.0.1:5011/api';

const testAttendeeEmail = async () => {
  try {
    console.log(`Running Attendee Registration Email Test against ${API_URL}`);

    const userData = {
      username: `attendee${Date.now()}`,
      email: `attendee${Date.now()}@test.com`,
      password: 'password123',
      fullName: 'Test Attendee',
      phoneNumber: '0123456789',
    };

    console.log('1. Registering new attendee...');
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Registration failed: ${res.status} ${errText}`);
    }

    const data = await res.json();
    console.log('   [PASS] Registration successful:', data.username);
    console.log('   [CHECK] Look for Ethereal Preview URL in server logs above.');
  } catch (error) {
    console.error(`\n[FAIL] Test Failed:`, error.message);
  }
};

testAttendeeEmail();
