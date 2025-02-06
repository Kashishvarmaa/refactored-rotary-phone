// Import required modules
require('dotenv').config();
const twilio = require('twilio');

// Get credentials from environment variables
const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Create a Twilio client
const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

// Function to send SMS
function sendSms(toPhoneNumber, message) {
  client.messages
    .create({
      body: message,               // Message content
      from: TWILIO_PHONE_NUMBER,   // Twilio phone number (sender)
      to: toPhoneNumber            // Recipient phone number
    })
    .then((message) => {
      console.log(`Message sent successfully! SID: ${message.sid}`);
    })
    .catch((error) => {
      console.error(`Error occurred: ${error.message}`);
    });
}

// Example usage
const recipientPhoneNumber = '+917795051727';  // Replace with the recipient's phone number
const smsMessage = 'Hello, this is a test SMS from Twilio.';

// Send the SMS
sendSms(recipientPhoneNumber, smsMessage);