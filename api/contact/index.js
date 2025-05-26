const nodemailer = require('nodemailer');
const sanitizeHtml = require('sanitize-html');

// Sanitize options
const sanitizeOptions = {
  allowedTags: ['p', 'br', 'strong', 'em', 'b', 'i', 'u'],
  allowedAttributes: {},
};

// Utility functions for contact form handling
/**
 * Validates an email address
 * @param {string} email - The email address to validate
 * @returns {boolean} - Whether the email is valid
 */
const validateEmail = (email) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

/**
 * Creates mail options for the contact form submission
 * @param {string} name - The name of the sender
 * @param {string} email - The email of the sender
 * @param {string} projectType - The project type
 * @param {string} budget - The budget
 * @param {string} message - The message
 * @returns {object} - The mail options
 */
const createMailOptions = (name, email, projectType, budget, message) => {
  const sanName = sanitizeHtml(name, { allowedTags: [], allowedAttributes: {} });
  const sanEmail = sanitizeHtml(email, { allowedTags: [], allowedAttributes: {} });
  const sanProjectType = projectType ? sanitizeHtml(projectType, { allowedTags: [], allowedAttributes: {} }) : 'Not specified';
  const sanBudget = budget ? sanitizeHtml(budget, { allowedTags: [], allowedAttributes: {} }) : 'Not specified';
  const sanMessageText = sanitizeHtml(message, { allowedTags: [], allowedAttributes: {} });
  const sanMessageHtml = sanitizeHtml(message.replace(/\n/g, '<br>'), sanitizeOptions);

  return {
    from: 'contact@topea.me',
    to: 'contact@topea.me',
    replyTo: sanEmail, // Use sanitized email for replyTo as well
    subject: `New Contact Form Submission from ${sanName}`,
    text: `
Name: ${sanName}
Email: ${sanEmail}
Project Type: ${sanProjectType}
Budget: ${sanBudget}
Message:
${sanMessageText}
    `,
    html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${sanName}</p>
<p><strong>Email:</strong> ${sanEmail}</p>
<p><strong>Project Type:</strong> ${sanProjectType}</p>
<p><strong>Budget:</strong> ${sanBudget}</p>
<p><strong>Message:</strong></p>
<p>${sanMessageHtml}</p>
    `
  };
};

/**
 * Creates mail options for the auto-reply
 * @param {string} name - The name of the sender
 * @param {string} email - The email of the sender
 * @param {string} projectType - The project type
 * @param {string} budget - The budget
 * @param {string} message - The message
 * @returns {object} - The mail options
 */
const createAutoReplyOptions = (name, email, projectType, budget, message) => {
  const sanName = sanitizeHtml(name, { allowedTags: [], allowedAttributes: {} });
  // Email for 'to' field should remain as is for delivery, but other instances are sanitized
  const sanEmail = sanitizeHtml(email, { allowedTags: [], allowedAttributes: {} });
  const sanProjectType = projectType ? sanitizeHtml(projectType, { allowedTags: [], allowedAttributes: {} }) : 'Not specified';
  const sanBudget = budget ? sanitizeHtml(budget, { allowedTags: [], allowedAttributes: {} }) : 'Not specified';
  const sanMessageText = sanitizeHtml(message, { allowedTags: [], allowedAttributes: {} });
  const sanMessageHtml = sanitizeHtml(message.replace(/\n/g, '<br>'), sanitizeOptions);

  return {
    from: 'contact@topea.me',
    to: email, // Original email for 'to' field
    subject: `Thank you for contacting Topea`, // Subject doesn't need user input directly here
    text: `
Dear ${sanName},

Thank you for reaching out to us. We have received your message and will get back to you within 24 business hours.

Here's a summary of your inquiry:
- Project Type: ${sanProjectType}
- Budget: ${sanBudget}
- Message: ${sanMessageText}

Best regards,
The Topea Team
    `,
    html: `
<h2>Thank you for contacting Topea</h2>
<p>Dear ${sanName},</p>
<p>Thank you for reaching out to us. We have received your message and will get back to you within 24 business hours.</p>
<p>Here's a summary of your inquiry:</p>
<ul>
  <li><strong>Project Type:</strong> ${sanProjectType}</li>
  <li><strong>Budget:</strong> ${sanBudget}</li>
  <li><strong>Message:</strong> ${sanMessageHtml}</li>
</ul>
<p>Best regards,<br>The Topea Team</p>
    `
  };
};

/**
 * Checks if a submission is likely spam using a honeypot field
 * @param {string} honeypot - The honeypot field value
 * @returns {boolean} - Whether the submission is likely spam
 */
const isSpam = (honeypot) => {
  return !!honeypot; // If honeypot is filled, it's likely a bot
};

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
    // For production, ensure valid certificates. In development, you might allow self-signed certs.
    // For production, this should be true.
    rejectUnauthorized: process.env.NODE_ENV === 'development' ? false : true
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
