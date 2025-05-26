/**
 * Security monitoring and logging system for production
 * Tracks security events, suspicious activities, and potential threats
 */

import { Request, Response, NextFunction } from 'express';

export interface SecurityEvent {
  type: 'RATE_LIMIT_EXCEEDED' | 'SUSPICIOUS_ACTIVITY' | 'BLOCKED_IP' | 'INVALID_REQUEST' | 'XSS_ATTEMPT' | 'SQL_INJECTION_ATTEMPT';
  ip: string;
  userAgent: string;
  timestamp: string;
  details: Record<string, any>;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private readonly maxEvents = 10000; // Keep last 10k events in memory
  private readonly alertThresholds = {
    RATE_LIMIT_EXCEEDED: 5, // Alert after 5 rate limit violations from same IP
    SUSPICIOUS_ACTIVITY: 3,  // Alert after 3 suspicious activities
    BLOCKED_IP: 1,          // Alert immediately when IP is blocked
    INVALID_REQUEST: 3,     // Alert after 3 invalid requests
    XSS_ATTEMPT: 1,         // Alert immediately on XSS attempts
    SQL_INJECTION_ATTEMPT: 1, // Alert immediately on SQL injection attempts
  };
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up old events every hour
    this.cleanupInterval = setInterval(() => {
      this.cleanupOldEvents();
    }, 60 * 60 * 1000);
  }

  logEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };

    this.events.push(securityEvent);

    // Log to console in production
    if (process.env.NODE_ENV === 'production') {
      console.warn(`[SECURITY] ${event.type}: ${event.ip}`, event.details);
    }

    // Check if we need to send alerts
    this.checkAlertThresholds(securityEvent);

    // Cleanup if we have too many events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
  }

  private checkAlertThresholds(event: SecurityEvent): void {
    const recentEvents = this.getRecentEventsByIP(event.ip, event.type, 60 * 60 * 1000); // Last hour
    const threshold = this.alertThresholds[event.type];

    if (recentEvents.length >= threshold) {
      this.sendAlert(event, recentEvents.length);
    }
  }

  private sendAlert(event: SecurityEvent, eventCount: number): void {
    const alertMessage = `SECURITY ALERT: ${event.type} from IP ${event.ip} (${eventCount} events in last hour)`;

    // In production, you would send this to:
    // - Email alerts
    // - Slack/Discord webhooks
    // - Security monitoring services (Datadog, New Relic, etc.)
    // - Log aggregation services (ELK stack, Splunk, etc.)

    console.error(`[SECURITY ALERT] ${alertMessage}`, {
      event,
      eventCount,
      recentEvents: this.getRecentEventsByIP(event.ip, event.type, 60 * 60 * 1000)
    });

    // Example: Send to webhook (uncomment and configure in production)
    /*
    if (process.env.SECURITY_WEBHOOK_URL) {
      fetch(process.env.SECURITY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: alertMessage,
          event,
          eventCount
        })
      }).catch(err => console.error('Failed to send security alert:', err));
    }
    */
  }

  private getRecentEventsByIP(ip: string, type: SecurityEvent['type'], timeWindowMs: number): SecurityEvent[] {
    const cutoff = Date.now() - timeWindowMs;
    return this.events.filter(event =>
      event.ip === ip &&
      event.type === type &&
      new Date(event.timestamp).getTime() > cutoff
    );
  }

  private cleanupOldEvents(): void {
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // Keep events for 24 hours
    this.events = this.events.filter(event =>
      new Date(event.timestamp).getTime() > cutoff
    );
  }

  // Cleanup method for graceful shutdown
  cleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    // Clear all events
    this.events = [];

    console.log('SecurityMonitor cleanup completed: Intervals cleared and events purged');
  }

  // Method to check if monitor has been cleaned up
  isCleanedUp(): boolean {
    return this.cleanupInterval === null;
  }

  getSecurityReport(): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    topOffendingIPs: Array<{ ip: string; eventCount: number }>;
    recentCriticalEvents: SecurityEvent[];
  } {
    const eventsByType: Record<string, number> = {};
    const ipCounts: Record<string, number> = {};

    this.events.forEach(event => {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      ipCounts[event.ip] = (ipCounts[event.ip] || 0) + 1;
    });

    const topOffendingIPs = Object.entries(ipCounts)
      .map(([ip, count]) => ({ ip, eventCount: count }))
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, 10);

    const recentCriticalEvents = this.events
      .filter(event => event.severity === 'CRITICAL')
      .slice(-20);

    return {
      totalEvents: this.events.length,
      eventsByType,
      topOffendingIPs,
      recentCriticalEvents,
    };
  }

  // Middleware to detect and log suspicious requests
  createSecurityMiddleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const userAgent = req.get('User-Agent') || 'unknown';

      // Check for common attack patterns
      this.checkForAttackPatterns(req, ip, userAgent);

      // Log unusual request patterns
      this.checkForUnusualPatterns(req, ip, userAgent);

      next();
    };
  }

  private checkForAttackPatterns(req: Request, ip: string, userAgent: string): void {
    const url = req.url.toLowerCase();
    const body = JSON.stringify(req.body || {}).toLowerCase();
    const query = JSON.stringify(req.query || {}).toLowerCase();

    // XSS patterns
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /eval\(/i,
      /document\.cookie/i
    ];

    if (xssPatterns.some(pattern => pattern.test(url) || pattern.test(body) || pattern.test(query))) {
      this.logEvent({
        type: 'XSS_ATTEMPT',
        ip,
        userAgent,
        severity: 'CRITICAL',
        details: {
          url: req.url,
          method: req.method,
          body: req.body,
          query: req.query
        }
      });
    }

    // SQL Injection patterns
    const sqlPatterns = [
      /union\s+select/i,
      /drop\s+table/i,
      /insert\s+into/i,
      /delete\s+from/i,
      /update\s+set/i,
      /'\s*or\s*'1'\s*=\s*'1/i,
      /'\s*or\s*1\s*=\s*1/i
    ];

    if (sqlPatterns.some(pattern => pattern.test(url) || pattern.test(body) || pattern.test(query))) {
      this.logEvent({
        type: 'SQL_INJECTION_ATTEMPT',
        ip,
        userAgent,
        severity: 'CRITICAL',
        details: {
          url: req.url,
          method: req.method,
          body: req.body,
          query: req.query
        }
      });
    }
  }

  private checkForUnusualPatterns(req: Request, ip: string, userAgent: string): void {
    // Check for suspicious user agents
    const suspiciousUserAgents = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /php/i
    ];

    if (suspiciousUserAgents.some(pattern => pattern.test(userAgent))) {
      this.logEvent({
        type: 'SUSPICIOUS_ACTIVITY',
        ip,
        userAgent,
        severity: 'MEDIUM',
        details: {
          reason: 'Suspicious user agent',
          userAgent,
          url: req.url
        }
      });
    }

    // Check for unusual request sizes
    const contentLength = parseInt(req.get('content-length') || '0');
    if (contentLength > 1024 * 1024) { // > 1MB
      this.logEvent({
        type: 'SUSPICIOUS_ACTIVITY',
        ip,
        userAgent,
        severity: 'MEDIUM',
        details: {
          reason: 'Large request size',
          contentLength,
          url: req.url
        }
      });
    }

    // Check for unusual request methods
    if (!['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'].includes(req.method)) {
      this.logEvent({
        type: 'SUSPICIOUS_ACTIVITY',
        ip,
        userAgent,
        severity: 'MEDIUM',
        details: {
          reason: 'Unusual HTTP method',
          method: req.method,
          url: req.url
        }
      });
    }
  }
}

// Create singleton instance
export const securityMonitor = new SecurityMonitor();

export default securityMonitor;
