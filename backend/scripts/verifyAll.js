const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Use 5003 or 5000 depending on what's running. Let's try 5003 first since I started it.
// Actually, I should probably rely on the user's main server if possible, but I can't guarantee it's up.
// I'll assume 5003 is still up or I can restart it.
const API_URL = 'http://127.0.0.1:5003/api';

const runTests = async () => {
  try {
    console.log(`Running tests against ${API_URL}`);

    // 1. Auth: Login
    console.log('1. Testing Login...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' }), // Password was changed to this
    });

    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('   [PASS] Login successful');

    // 2. User: Get All (Admin)
    console.log('2. Testing Get All Users...');
    const userRes = await fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) throw new Error(`Get Users failed: ${userRes.statusText}`);
    console.log('   [PASS] Get All Users successful');

    // 3. Event: Get Events (Search)
    console.log('3. Testing Events Search...');
    const eventRes = await fetch(`${API_URL}/events?keyword=Music`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!eventRes.ok) throw new Error(`Get Events failed: ${eventRes.statusText}`);
    const events = await eventRes.json();
    console.log(`   [PASS] Get Events successful (Found ${events.length} matches)`);

    // 4. Ticket: Get Ticket Types (requires eventId, skipping for generic smoke test unless we grab one from step 3)
    // If events > 0, we can test it.
    if (events.length > 0) {
      const eventId = events[0]._id;
      console.log(`4. Testing Ticket Types for Event ${eventId}...`);
      const ticketRes = await fetch(`${API_URL}/tickets/event/${eventId}`);
      if (!ticketRes.ok) throw new Error(`Get Ticket Types failed: ${ticketRes.statusText}`);
      console.log('   [PASS] Get Ticket Types successful');
    } else {
      console.log('   [SKIP] No events found to test tickets');
    }

    console.log('\nAll Smoke Tests Passed!');
  } catch (error) {
    console.error('\n[FAIL] Test Failure:', error.message);
  }
};

runTests();
