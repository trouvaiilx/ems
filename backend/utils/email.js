const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// These should be in .env
// GMAIL_CLIENT_ID
// GMAIL_CLIENT_SECRET
// GMAIL_REDIRECT_URI
// GMAIL_REFRESH_TOKEN
// GMAIL_USER (The email address authenticating)

const sendEmail = async (options) => {
  try {
    // 1. Check if OAuth creds are present
    if (
      !process.env.GMAIL_CLIENT_ID ||
      !process.env.GMAIL_CLIENT_SECRET ||
      !process.env.GMAIL_REFRESH_TOKEN
    ) {
      console.log('Missing Gmail API Credentials (GMAIL_CLIENT_ID, ...).');
      console.log('--- GMAIL API MOCK PREVIEW ---');
      console.log(`To: ${options.email}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`Message: \n${options.message}`);
      console.log('------------------------------');
      return;
    }

    // 2. Setup OAuth2 Client
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI || 'https://developers.google.com/oauthplayground'
    );

    oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

    // 3. Get Access Token
    const accessToken = await oAuth2Client.getAccessToken();

    // 4. Create Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    // 5. Send Email
    const message = {
      from: `${process.env.FROM_NAME || 'EMS Admin'} <${process.env.GMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message.replace(/\n/g, '<br>'),
    };

    const info = await transporter.sendMail(message);
    console.log('Gmail API sent message: %s', info.messageId);
  } catch (error) {
    console.error('Gmail API Email Failed:', error);
  }
};

module.exports = sendEmail;
