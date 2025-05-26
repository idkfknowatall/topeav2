import type { NextApiRequest, NextApiResponse } from 'next';
import { LogEntry, LogLevel } from '../../services/logger';

interface LogApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Rate limiting storage (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 100, // Max requests per window
  windowMs: 15 * 60 * 1000, // 15 minutes
};

function getRateLimitKey(req: NextApiRequest): string {
  // Use IP address for rate limiting
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]) : req.socket.remoteAddress;
  return `rate_limit:${ip}`;
}

function isRateLimited(req: NextApiRequest): boolean {
  const key = getRateLimitKey(req);
  const now = Date.now();
  const limit = rateLimitMap.get(key);

  if (!limit || now > limit.resetTime) {
    // Reset or create new limit
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs,
    });
    return false;
  }

  if (limit.count >= RATE_LIMIT.maxRequests) {
    return true;
  }

  limit.count++;
  return false;
}

function validateLogEntry(entry: any): entry is LogEntry {
  return (
    typeof entry === 'object' &&
    typeof entry.level === 'number' &&
    typeof entry.message === 'string' &&
    typeof entry.timestamp === 'string' &&
    typeof entry.url === 'string' &&
    typeof entry.userAgent === 'string' &&
    typeof entry.sessionId === 'string'
  );
}

function sanitizeLogEntry(entry: LogEntry): LogEntry {
  // Remove sensitive information
  const sanitized = { ...entry };
  
  // Remove potential PII from URL
  if (sanitized.url) {
    try {
      const url = new URL(sanitized.url);
      // Remove query parameters that might contain sensitive data
      const sensitiveParams = ['token', 'key', 'password', 'email', 'phone'];
      sensitiveParams.forEach(param => {
        if (url.searchParams.has(param)) {
          url.searchParams.set(param, '[REDACTED]');
        }
      });
      sanitized.url = url.toString();
    } catch (e) {
      // If URL parsing fails, keep original but log the issue
      console.warn('Failed to parse URL for sanitization:', sanitized.url);
    }
  }

  // Sanitize user agent (keep basic info, remove detailed version numbers)
  if (sanitized.userAgent) {
    sanitized.userAgent = sanitized.userAgent.replace(/\d+\.\d+\.\d+/g, 'x.x.x');
  }

  // Limit context size to prevent abuse
  if (sanitized.context) {
    const contextStr = JSON.stringify(sanitized.context);
    if (contextStr.length > 10000) {
      sanitized.context = { 
        ...sanitized.context, 
        _truncated: true,
        _originalSize: contextStr.length 
      };
    }
  }

  return sanitized;
}

async function logToConsole(entry: LogEntry): Promise<void> {
  const timestamp = new Date(entry.timestamp).toISOString();
  const level = LogLevel[entry.level] || 'UNKNOWN';
  
  const logMessage = `[${timestamp}] [${level}] ${entry.message}`;
  const context = {
    sessionId: entry.sessionId,
    url: entry.url,
    error: entry.error,
    context: entry.context,
    performance: entry.performance,
  };

  // Use appropriate console method based on log level
  switch (entry.level) {
    case LogLevel.DEBUG:
      console.debug(logMessage, context);
      break;
    case LogLevel.INFO:
      console.info(logMessage, context);
      break;
    case LogLevel.WARN:
      console.warn(logMessage, context);
      break;
    case LogLevel.ERROR:
    case LogLevel.CRITICAL:
      console.error(logMessage, context);
      break;
    default:
      console.log(logMessage, context);
  }
}

async function logToExternalService(entry: LogEntry): Promise<void> {
  // In production, integrate with services like:
  // - Sentry
  // - LogRocket
  // - DataDog
  // - New Relic
  // - Custom logging service

  // Example Sentry integration (commented out):
  /*
  if (entry.level >= LogLevel.ERROR && entry.error) {
    Sentry.captureException(new Error(entry.error.message), {
      tags: {
        sessionId: entry.sessionId,
        errorId: entry.context?.errorId,
      },
      extra: {
        url: entry.url,
        userAgent: entry.userAgent,
        context: entry.context,
        performance: entry.performance,
      },
    });
  }
  */

  // For now, we'll just log to console in production
  // In a real production environment, you'd send to your logging service
  if (process.env.NODE_ENV === 'production') {
    // Could send to external logging service here
    console.log('Production log entry:', entry);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LogApiResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    // Rate limiting
    if (isRateLimited(req)) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
      });
    }

    // Validate request body
    if (!req.body) {
      return res.status(400).json({
        success: false,
        error: 'Request body is required',
      });
    }

    // Validate log entry structure
    if (!validateLogEntry(req.body)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid log entry format',
      });
    }

    const logEntry = req.body as LogEntry;

    // Sanitize the log entry
    const sanitizedEntry = sanitizeLogEntry(logEntry);

    // Log to console (always)
    await logToConsole(sanitizedEntry);

    // Log to external service (production)
    if (process.env.NODE_ENV === 'production') {
      await logToExternalService(sanitizedEntry);
    }

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Log entry recorded successfully',
    });

  } catch (error) {
    console.error('Error processing log entry:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

// Clean up rate limit map periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, limit] of rateLimitMap.entries()) {
    if (now > limit.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes
