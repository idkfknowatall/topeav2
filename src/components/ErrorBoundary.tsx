import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../services/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'section' | 'component';
  name?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Generate unique error ID for tracking
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Store error info in state for better error reporting
    this.setState({ errorInfo });

    // Generate error context
    const errorContext = {
      boundaryName: this.props.name || 'Unknown',
      boundaryLevel: this.props.level || 'component',
      errorId: this.state.errorId,
      props: this.props.name ? { name: this.props.name, level: this.props.level } : undefined,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    // Log to our production logging service
    logger.logReactError(error, errorInfo, errorInfo.componentStack || undefined);

    // Call custom error handler if provided
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (handlerError) {
        logger.error('Error in custom error handler', {
          originalError: error.message,
          handlerError: handlerError instanceof Error ? handlerError.message : String(handlerError),
        });
      }
    }

    // Log user action for analytics
    logger.logUserAction('Error Boundary Triggered', errorContext);
  }

  private handleRetry = () => {
    logger.logUserAction('Error Boundary Retry', {
      errorId: this.state.errorId,
      boundaryName: this.props.name || 'Unknown',
    });

    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: undefined
    });
  };

  private handleReload = () => {
    logger.logUserAction('Error Boundary Reload', {
      errorId: this.state.errorId,
      boundaryName: this.props.name || 'Unknown',
    });

    window.location.reload();
  };

  private renderFallbackUI() {
    const { level = 'component' } = this.props;
    const isPageLevel = level === 'page';

    // Component-level error (smaller fallback)
    if (!isPageLevel) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Component Error
              </h3>
              <p className="mt-1 text-sm text-red-700">
                This section couldn't load properly.
              </p>
              <div className="mt-3">
                <button
                  onClick={this.handleRetry}
                  className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Page-level error (full fallback)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center p-8 max-w-lg mx-auto">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Oops! Something went wrong</h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.
          </p>

          {/* Error ID for support */}
          {this.state.errorId && (
            <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-600">
                <span className="font-medium">Error ID:</span> {this.state.errorId}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Please include this ID when contacting support
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={this.handleRetry}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
            <button
              onClick={this.handleReload}
              className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors duration-200 font-medium"
            >
              Reload Page
            </button>
          </div>

          {/* Contact Support */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Still having issues?{' '}
              <a
                href="mailto:contact@topea.me"
                className="text-primary-600 hover:text-primary-700 font-medium"
                onClick={() => logger.logUserAction('Error Boundary Contact Support', { errorId: this.state.errorId })}
              >
                Contact our support team
              </a>
            </p>
          </div>

          {/* Development Error Details */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-8 text-left">
              <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700 font-medium">
                🔧 Error Details (Development Only)
              </summary>
              <div className="mt-4 space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Error Message:</h4>
                  <p className="text-sm text-red-700">{this.state.error.message}</p>
                </div>
                {this.state.error.stack && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <h4 className="font-medium text-slate-800 mb-2">Stack Trace:</h4>
                    <pre className="text-xs text-slate-600 overflow-auto whitespace-pre-wrap">
                      {this.state.error.stack}
                    </pre>
                  </div>
                )}
                {this.state.errorInfo?.componentStack && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Component Stack:</h4>
                    <pre className="text-xs text-blue-600 overflow-auto whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Enhanced fallback UI
      return this.renderFallbackUI();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
