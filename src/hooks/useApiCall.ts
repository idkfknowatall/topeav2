import { useState, useCallback, useRef, useEffect } from 'react';
import { logger } from '../services/logger';

export interface ApiCallOptions {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  retryCondition?: (error: any, attempt: number) => boolean;
  onRetry?: (attempt: number, error: any) => void;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export interface ApiCallState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  retryCount: number;
  isRetrying: boolean;
}

export interface ApiCallResult<T> extends ApiCallState<T> {
  execute: (url: string, options?: RequestInit) => Promise<T | null>;
  retry: () => Promise<T | null>;
  reset: () => void;
  cancel: () => void;
}

const DEFAULT_OPTIONS: Required<Omit<ApiCallOptions, 'retryCondition' | 'onRetry' | 'onSuccess' | 'onError'>> = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 10000,
};

function isRetryableError(error: any): boolean {
  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }

  // HTTP status codes that should be retried
  if (error.status) {
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    return retryableStatuses.includes(error.status);
  }

  return false;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function useApiCall<T = any>(options: ApiCallOptions = {}): ApiCallResult<T> {
  const {
    maxRetries = DEFAULT_OPTIONS.maxRetries,
    retryDelay = DEFAULT_OPTIONS.retryDelay,
    timeout = DEFAULT_OPTIONS.timeout,
    retryCondition = isRetryableError,
    onRetry,
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<ApiCallState<T>>({
    data: null,
    loading: false,
    error: null,
    retryCount: 0,
    isRetrying: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const lastRequestRef = useRef<{ url: string; options?: RequestInit } | null>(null);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setState(prev => ({ ...prev, loading: false, isRetrying: false }));
  }, []);

  const reset = useCallback(() => {
    cancel();
    setState({
      data: null,
      loading: false,
      error: null,
      retryCount: 0,
      isRetrying: false,
    });
    lastRequestRef.current = null;
  }, [cancel]);

  const executeRequest = useCallback(async (
    url: string,
    requestOptions: RequestInit = {},
    attempt: number = 0
  ): Promise<T | null> => {
    const isRetry = attempt > 0;

    setState(prev => ({
      ...prev,
      loading: true,
      isRetrying: isRetry,
      error: isRetry ? prev.error : null,
      retryCount: attempt,
    }));

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    try {
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeout);
      });

      // Prepare fetch options
      const fetchOptions: RequestInit = {
        ...requestOptions,
        signal: abortControllerRef.current.signal,
      };

      // Log API call attempt
      logger.info(`API Call ${isRetry ? 'Retry' : 'Start'}`, {
        url,
        attempt,
        method: fetchOptions.method || 'GET',
        timeout,
      });

      // Execute fetch with timeout
      const response = await Promise.race([
        fetch(url, fetchOptions),
        timeoutPromise,
      ]);

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        throw new Error('Request was cancelled');
      }

      // Validate response content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        logger.warn('Non-JSON API response', {
          url,
          status: response.status,
          contentType,
          responseText: text.substring(0, 200),
        });
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      // Handle HTTP errors
      if (!response.ok) {
        const error = new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
        (error as any).status = response.status;
        (error as any).response = data;
        throw error;
      }

      // Success
      setState(prev => ({
        ...prev,
        data,
        loading: false,
        error: null,
        isRetrying: false,
      }));

      logger.info('API Call Success', {
        url,
        attempt,
        responseSize: JSON.stringify(data).length,
      });

      if (onSuccess) {
        onSuccess(data);
      }

      return data;

    } catch (error: any) {
      // Check if request was cancelled
      if (error.name === 'AbortError' || error.message === 'Request was cancelled') {
        logger.info('API Call Cancelled', { url, attempt });
        return null;
      }

      const shouldRetry = attempt < maxRetries && retryCondition(error, attempt);

      logger.error(`API Call ${shouldRetry ? 'Failed (will retry)' : 'Failed (final)'}`, {
        url,
        attempt,
        error: {
          name: error.name,
          message: error.message,
          status: error.status,
        },
        willRetry: shouldRetry,
      });

      if (shouldRetry) {
        // Call retry callback
        if (onRetry) {
          onRetry(attempt + 1, error);
        }

        // Calculate exponential backoff delay
        const backoffDelay = retryDelay * Math.pow(2, attempt);
        const jitteredDelay = backoffDelay + Math.random() * 1000; // Add jitter

        logger.info('API Call Retry Scheduled', {
          url,
          nextAttempt: attempt + 1,
          delayMs: jitteredDelay,
        });

        // Wait before retry
        await delay(jitteredDelay);

        // Recursive retry
        return executeRequest(url, requestOptions, attempt + 1);
      } else {
        // Final failure
        const errorMessage = error.message || 'An unexpected error occurred';

        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
          isRetrying: false,
        }));

        if (onError) {
          onError(error);
        }

        return null;
      }
    }
  }, [maxRetries, retryDelay, timeout, retryCondition, onRetry, onSuccess, onError]);

  const execute = useCallback(async (url: string, requestOptions?: RequestInit): Promise<T | null> => {
    // Store request details for retry functionality
    lastRequestRef.current = { url, options: requestOptions };

    return executeRequest(url, requestOptions, 0);
  }, [executeRequest]);

  const retry = useCallback(async (): Promise<T | null> => {
    if (!lastRequestRef.current) {
      logger.warn('Retry called but no previous request found');
      return null;
    }

    const { url, options } = lastRequestRef.current;
    return executeRequest(url, options, 0);
  }, [executeRequest]);

  // Cleanup on component unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }

      // Clear request reference
      lastRequestRef.current = null;

      // Log cleanup for debugging
      logger.debug('useApiCall cleanup: Cancelled ongoing requests and cleared references');
    };
  }, []);

  return {
    ...state,
    execute,
    retry,
    reset,
    cancel,
  };
}

// Specialized hook for form submissions
export function useFormSubmission<T = any>(options: ApiCallOptions = {}) {
  const apiCall = useApiCall<T>({
    maxRetries: 2, // Fewer retries for form submissions
    retryDelay: 2000, // Longer delay for form submissions
    ...options,
  });

  const submitForm = useCallback(async (
    url: string,
    formData: any,
    method: 'POST' | 'PUT' | 'PATCH' = 'POST'
  ): Promise<T | null> => {
    return apiCall.execute(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
  }, [apiCall]);

  return {
    ...apiCall,
    submitForm,
  };
}

export default useApiCall;
