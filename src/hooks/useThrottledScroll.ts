import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * Throttle function to limit how often a function can be called
 */
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;

  return (...args: Parameters<T>) => {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

interface UseThrottledScrollOptions {
  threshold?: number;
  throttleMs?: number;
}

/**
 * Custom hook for throttled scroll events
 * Optimized for performance with configurable throttling
 */
export const useThrottledScroll = (options: UseThrottledScrollOptions = {}) => {
  const { threshold = 10, throttleMs = 16 } = options; // 16ms ≈ 60fps
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const throttledHandlerRef = useRef<(() => void) | null>(null);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrollY(currentScrollY);
    setIsScrolled(currentScrollY > threshold);
  }, [threshold]);

  useEffect(() => {
    // Create throttled handler
    throttledHandlerRef.current = throttle(handleScroll, throttleMs);

    // Add event listener
    window.addEventListener('scroll', throttledHandlerRef.current, { passive: true });

    // Set initial state
    handleScroll();

    // Cleanup
    return () => {
      if (throttledHandlerRef.current) {
        window.removeEventListener('scroll', throttledHandlerRef.current);
      }
    };
  }, [handleScroll, throttleMs]);

  return { isScrolled, scrollY };
};

/**
 * Hook specifically for header scroll behavior
 */
export const useHeaderScroll = (threshold = 10) => {
  return useThrottledScroll({ threshold, throttleMs: 16 });
};

/**
 * Hook for parallax effects with higher precision
 */
export const useParallaxScroll = () => {
  return useThrottledScroll({ threshold: 0, throttleMs: 8 }); // Higher frequency for smooth parallax
};
