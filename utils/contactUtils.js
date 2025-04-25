/**
 * Shared utility functions for contact form handling
 */

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
  return {
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
  return {
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
};

/**
 * Checks if a submission is likely spam using a honeypot field
 * @param {string} honeypot - The honeypot field value
 * @returns {boolean} - Whether the submission is likely spam
 */
const isSpam = (honeypot) => {
  return !!honeypot; // If honeypot is filled, it's likely a bot
};

module.exports = {
  validateEmail,
  createMailOptions,
  createAutoReplyOptions,
  isSpam
};
