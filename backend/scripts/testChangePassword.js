const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const API_URL = 'http://127.0.0.1:5003/api/auth';

const testChangePassword = async () => {
  try {
    // 1. Login as admin
    console.log('Logging in as admin...');
    const loginRes = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' }),
    });

    if (!loginRes.ok) {
      throw new Error(`Login failed: ${loginRes.statusText}`);
    }

    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Login successful. Token received.');

    // 2. Change password
    console.log('Changing specific password...');
    const changeRes = await fetch(`${API_URL}/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: 'admin123',
        newPassword: 'admin123',
      }),
    });

    const changeData = await changeRes.json();
    console.log('Change password response:', changeData);

    if (!changeRes.ok) throw new Error(changeData.message);

    // 3. Verify isFirstLogin is false
    const meRes = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const meData = await meRes.json();
    console.log('User profile:', meData);

    if (meData.isFirstLogin === false) {
      console.log('SUCCESS: isFirstLogin is false after password change.');
    } else {
      console.log('FAILURE: isFirstLogin is still true.');
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

testChangePassword();
