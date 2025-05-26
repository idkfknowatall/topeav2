import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import helmet from 'helmet';
import sanitizeHtml from 'sanitize-html';

// Load environment variables
dotenv.config();

// Validate critical environment variables
if (!process.env.EMAIL_PASSWORD) {
  console.error('Error: EMAIL_PASSWORD environment variable is not set. Please configure it in your .env file.');
  process.exit(1); // Exit the process if a critical variable is missing
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(compression()); // Compress responses
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://fonts.googleapis.com"], // Removed 'unsafe-inline'
      styleSrc: ["'self'", "https://fonts.googleapis.com"],  // Removed 'unsafe-inline'
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://topea.me", "https://www.topea.me"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// HTTPS redirection in production
if (process.env.NODE_ENV === 'production') {
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

app.use(express.json({ limit: '100kb' })); // Limit request size
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://topea.me', 'https://www.topea.me']
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'],
  methods: ['POST', 'OPTIONS'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_IP = 5;

const rateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, {
      count: 1,
      resetTime: Date.now() + RATE_LIMIT_WINDOW_MS
    });
    next();
    return;
  }

  const record = requestCounts.get(ip);

  if (record) { // Ensure record exists before accessing its properties
    // Reset count if the window has passed
    if (Date.now() > record.resetTime) {
      record.count = 1;
      record.resetTime = Date.now() + RATE_LIMIT_WINDOW_MS;
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
  }
  next();
};

// Create email transporter
const transporter = nodemailer.createTransport({
  host: 'mail.topea.me',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'contact@topea.me',
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    // In production, ensure valid certificates. In development, you might allow self-signed certs.
    // For production, remove or set to true.
    rejectUnauthorized: process.env.NODE_ENV === 'development' ? false : true
  }
});

// Contact form endpoint
interface ContactFormRequest {
  name: string;
  email: string;
  projectType?: string;
  budget?: string;
  message: string;
  honeypot?: string;
}

app.post('/api/contact', rateLimiter, async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { name, email, projectType, budget, message, honeypot } = req.body as ContactFormRequest;

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

    // Sanitize options
    const sanitizeOptions = {
      allowedTags: ['p', 'br', 'strong', 'em', 'b', 'i', 'u'],
      allowedAttributes: {},
    };

    // Sanitize inputs
    const sanName = sanitizeHtml(name, { allowedTags: [], allowedAttributes: {} });
    const sanEmail = sanitizeHtml(email, { allowedTags: [], allowedAttributes: {} }); // Sanitize for display, original for 'replyTo' and 'to'
    const sanProjectType = projectType ? sanitizeHtml(projectType, { allowedTags: [], allowedAttributes: {} }) : 'Not specified';
    const sanBudget = budget ? sanitizeHtml(budget, { allowedTags: [], allowedAttributes: {} }) : 'Not specified';
    const sanMessageText = sanitizeHtml(message, { allowedTags: [], allowedAttributes: {} });
    const sanMessageHtml = sanitizeHtml(message.replace(/\n/g, '<br>'), sanitizeOptions);


    // Prepare email content
    const mailOptions = {
      from: 'contact@topea.me',
      to: 'contact@topea.me',
      replyTo: email, // Original email for replyTo
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

    // Send email
    await transporter.sendMail(mailOptions);

    // Send auto-reply to the user
    const autoReplyOptions = {
      from: 'contact@topea.me',
      to: email, // Original email for 'to' field
      subject: 'Thank you for contacting Topea',
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

    await transporter.sendMail(autoReplyOptions);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Set cache control for static assets
  app.use(express.static(path.join(__dirname, '../dist'), {
    etag: true,
    lastModified: true,
    setHeaders: (res: express.Response, path: string) => {
      // Set long cache for assets with hash in filename
      if (path.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff2|woff|ttf|eot)$/)) {
        const maxAge = path.includes('.') && path.split('.').length > 2
          ? 31536000 // 1 year for hashed assets
          : 86400; // 1 day for non-hashed assets

        res.setHeader('Cache-Control', `public, max-age=${maxAge}, immutable`);
      } else {
        // HTML files and other assets
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      }
    }
  }));

  // Health check endpoint
  app.get('/health', (_req: express.Request, res: express.Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Handle all other routes
  app.get('*', (_req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
