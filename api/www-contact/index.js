// This is a duplicate of the contact API endpoint for the www subdomain
// to avoid CORS issues between www and non-www domains
const nodemailer = require('nodemailer');
// Fix the path to the contactUtils module
const path = require('path');
const contactUtilsPath = path.join(process.cwd(), 'utils/contactUtils.js');
const { validateEmail, createMailOptions, createAutoReplyOptions, isSpam } = require(contactUtilsPath);

// Create email transporter with the updated settings
const transporter = nodemailer.createTransport({
  host: 'de3000.dnsiaas.com', // Using the HELO domain from your settings
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'contact@topea.me',
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false
  }
});

// Rate limiting (simple in-memory implementation)
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_IP = 5;

// Define the origins allowed to access this function
const ALLOWED_ORIGINS = [
  'https://topea.me',
  'https://www.topea.me',
  // Add development origins if needed:
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173'
];

module.exports = async (req, res) => {
  // Get the origin of the request
  const requestOrigin = req.headers.origin;

  // Set the Access-Control-Allow-Origin header ONLY if the request origin is in our allowed list
  // For preflight requests, we'll use a wildcard to avoid redirect issues
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
  }

  // Set other necessary CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); // Only allow POST and OPTIONS
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle CORS preflight requests (OPTIONS method)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests for the main logic
  if (req.method !== 'POST') {
    // Set status 405 Method Not Allowed if it's not POST or OPTIONS
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    // Basic rate limiting
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';

    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, {
        count: 1,
        resetTime: Date.now() + RATE_LIMIT_WINDOW
      });
    } else {
      const record = requestCounts.get(ip);

      // Reset count if the window has passed
      if (Date.now() > record.resetTime) {
        record.count = 1;
        record.resetTime = Date.now() + RATE_LIMIT_WINDOW;
      }
      // Check if rate limit exceeded
      else if (record.count >= MAX_REQUESTS_PER_IP) {
        return res.status(429).json({
          error: 'Too many requests, please try again later.'
        });
      } else {
        // Increment count
        record.count++;
      }
    }

    const { name, email, projectType, budget, message, honeypot } = req.body;

    // Check honeypot field (spam protection)
    if (isSpam(honeypot)) {
      // This is likely a bot, but we'll return a 200 to avoid alerting the bot
      return res.status(200).json({ success: true });
    }

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Create mail options using the shared utility functions
    const mailOptions = createMailOptions(name, email, projectType, budget, message);
    const autoReplyOptions = createAutoReplyOptions(name, email, projectType, budget, message);

    // Send the notification email
    await transporter.sendMail(mailOptions);

    // Send the auto-reply email
    await transporter.sendMail(autoReplyOptions);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
};
