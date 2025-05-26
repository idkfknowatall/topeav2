/**
 * Production-ready logging service for error tracking and monitoring
 * Supports multiple log levels and external error reporting services
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  url: string;
  userAgent: string;
  userId?: string;
  sessionId: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
    componentStack?: string;
  };
  context?: Record<string, any>;
  performance?: {
    memory?: any;
    timing?: any;
    navigation?: any;
  };
}

export interface ErrorReportingConfig {
  apiEndpoint?: string;
  apiKey?: string;
  enableConsoleLogging: boolean;
  enableRemoteLogging: boolean;
  logLevel: LogLevel;
  maxRetries: number;
  retryDelay: number;
}

class Logger {
  private config: ErrorReportingConfig;
  private sessionId: string;
  private logQueue: LogEntry[] = [];
  private isOnline: boolean = navigator.onLine;
  private eventListeners: Array<{ element: EventTarget; event: string; handler: EventListener }> = [];

  constructor(config: Partial<ErrorReportingConfig> = {}) {
    this.config = {
      enableConsoleLogging: process.env.NODE_ENV === 'development',
      enableRemoteLogging: process.env.NODE_ENV === 'production',
      logLevel: process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
      maxRetries: 3,
      retryDelay: 1000,
      apiEndpoint: '/api/logs',
      ...config,
    };

    this.sessionId = this.generateSessionId();
    this.setupEventListeners();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupEventListeners(): void {
    // Helper function to add tracked event listeners
    const addTrackedListener = (element: EventTarget, event: string, handler: EventListener) => {
      element.addEventListener(event, handler);
      this.eventListeners.push({ element, event, handler });
    };

    // Monitor online/offline status
    const onlineHandler = () => {
      this.isOnline = true;
      this.flushQueuedLogs();
    };
    addTrackedListener(window, 'online', onlineHandler);

    const offlineHandler = () => {
      this.isOnline = false;
    };
    addTrackedListener(window, 'offline', offlineHandler);

    // Global error handler
    const errorHandler = (event: ErrorEvent) => {
      this.error('Global Error', {
        error: {
          name: 'GlobalError',
          message: event.message,
          stack: event.error?.stack,
        },
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    };
    addTrackedListener(window, 'error', errorHandler);

    // Unhandled promise rejection handler
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      this.error('Unhandled Promise Rejection', {
        error: {
          name: 'UnhandledPromiseRejection',
          message: event.reason?.message || String(event.reason),
          stack: event.reason?.stack,
        },
      });
    };
    addTrackedListener(window, 'unhandledrejection', rejectionHandler);
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      context,
    };

    // Add performance data for errors and critical logs
    if (level >= LogLevel.ERROR && 'performance' in window) {
      try {
        entry.performance = {
          memory: (performance as any).memory ? {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
            jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
          } : undefined,
          timing: performance.timing ? {
            loadEventEnd: performance.timing.loadEventEnd,
            domContentLoadedEventEnd: performance.timing.domContentLoadedEventEnd,
            responseEnd: performance.timing.responseEnd,
          } : undefined,
        };
      } catch (e) {
        // Ignore performance data collection errors
      }
    }

    return entry;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.logLevel;
  }

  private async sendToRemote(entry: LogEntry, retryCount = 0): Promise<void> {
    if (!this.config.enableRemoteLogging || !this.config.apiEndpoint) {
      return;
    }

    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify(entry),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      if (retryCount < this.config.maxRetries) {
        setTimeout(() => {
          this.sendToRemote(entry, retryCount + 1);
        }, this.config.retryDelay * Math.pow(2, retryCount));
      } else {
        // Queue for later if we're offline
        if (!this.isOnline) {
          this.logQueue.push(entry);
        }
      }
    }
  }

  private flushQueuedLogs(): void {
    const queue = [...this.logQueue];
    this.logQueue = [];

    queue.forEach(entry => {
      this.sendToRemote(entry);
    });
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry = this.createLogEntry(level, message, context);

    // Console logging
    if (this.config.enableConsoleLogging) {
      const logMethod = level >= LogLevel.ERROR ? 'error' :
                       level >= LogLevel.WARN ? 'warn' :
                       level >= LogLevel.INFO ? 'info' : 'debug';

      console[logMethod](`[${LogLevel[level]}] ${message}`, context || '');
    }

    // Remote logging
    if (this.isOnline) {
      this.sendToRemote(entry);
    } else {
      this.logQueue.push(entry);
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context);
  }

  critical(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.CRITICAL, message, context);
  }

  // Specialized method for React Error Boundary
  logReactError(error: Error, errorInfo: any, componentStack?: string): void {
    this.error('React Error Boundary', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        componentStack: componentStack || errorInfo.componentStack,
      },
      context: {
        errorInfo,
        reactVersion: React.version,
      },
    });
  }

  // Performance monitoring
  logPerformance(metric: string, value: number, context?: Record<string, any>): void {
    this.info(`Performance: ${metric}`, {
      metric,
      value,
      ...context,
    });
  }

  // User action tracking
  logUserAction(action: string, context?: Record<string, any>): void {
    this.info(`User Action: ${action}`, context);
  }

  // Cleanup method to remove all event listeners and prevent memory leaks
  cleanup(): void {
    // Remove all tracked event listeners
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });

    // Clear the listeners array
    this.eventListeners = [];

    // Clear the log queue
    this.logQueue = [];

    // Log cleanup completion
    console.log('Logger cleanup completed: All event listeners removed and queues cleared');
  }

  // Method to check if logger has been cleaned up
  isCleanedUp(): boolean {
    return this.eventListeners.length === 0;
  }
}

// Create singleton instance
export const logger = new Logger();

// React import for version logging
import React from 'react';

export default logger;
