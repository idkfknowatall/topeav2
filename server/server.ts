import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://topea.me', 'http://91.108.80.187:3000', 'http://91.108.80.187']
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'],
  methods: ['POST', 'OPTIONS'],
  credentials: true
}));

// Rate limiting
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_IP = 5;

const rateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, {
      count: 1,
      resetTime: Date.now() + RATE_LIMIT_WINDOW
    });
    next();
    return;
  }

  const record = requestCounts.get(ip);

  // Reset count if the window has passed
  if (Date.now() > record.resetTime) {
    record.count = 1;
    record.resetTime = Date.now() + RATE_LIMIT_WINDOW;
    next();
    return;
  }

  // Check if rate limit exceeded
  if (record.count >= MAX_REQUESTS_PER_IP) {
    res.status(429).json({
      error: 'Too many requests, please try again later.'
    });
    return;
  }

  // Increment count and proceed
  record.count++;
  next();
};

// Create email transporter
const transporter = nodemailer.createTransport({
  host: 'mail.topea.me',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'contact@topea.me',
    pass: process.env.EMAIL_PASSWORD || 'ed,2$?1Ra(Yq'
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false
  }
});

// Contact form endpoint
app.post('/api/contact', rateLimiter, async (req, res): Promise<void> => {
  try {
    const { name, email, projectType, budget, message, honeypot } = req.body;

    // Check honeypot field (spam protection)
    if (honeypot) {
      // This is likely a bot, but we'll return a 200 to avoid alerting the bot
      res.status(200).json({ success: true });
      return;
    }

    // Validate required fields
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required' });
      return;
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    // Prepare email content
    const mailOptions = {
      from: 'contact@topea.me',
      to: 'contact@topea.me',
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Project Type: ${projectType || 'Not specified'}
Budget: ${budget || 'Not specified'}
Message:
${message}
      `,
      html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Project Type:</strong> ${projectType || 'Not specified'}</p>
<p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send auto-reply to the user
    const autoReplyOptions = {
      from: 'contact@topea.me',
      to: email,
      subject: 'Thank you for contacting Topea',
      text: `
Dear ${name},

Thank you for reaching out to us. We have received your message and will get back to you within 24 business hours.

Here's a summary of your inquiry:
- Project Type: ${projectType || 'Not specified'}
- Budget: ${budget || 'Not specified'}
- Message: ${message}

Best regards,
The Topea Team
      `,
      html: `
<h2>Thank you for contacting Topea</h2>
<p>Dear ${name},</p>
<p>Thank you for reaching out to us. We have received your message and will get back to you within 24 business hours.</p>
<p>Here's a summary of your inquiry:</p>
<ul>
  <li><strong>Project Type:</strong> ${projectType || 'Not specified'}</li>
  <li><strong>Budget:</strong> ${budget || 'Not specified'}</li>
  <li><strong>Message:</strong> ${message.replace(/\n/g, '<br>')}</li>
</ul>
<p>Best regards,<br>The Topea Team</p>
      `
    };

    await transporter.sendMail(autoReplyOptions);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
