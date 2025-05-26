import { useEffect, useState, useRef } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Custom hook for intersection observer functionality
 * Optimized to reuse observer instances and prevent memory leaks
 */
export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Don't create new observer if already triggered and triggerOnce is true
    if (triggerOnce && hasTriggered) return;

    // Create observer if it doesn't exist
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const isIntersecting = entry.isIntersecting;
            setIsVisible(isIntersecting);

            if (isIntersecting && triggerOnce) {
              setHasTriggered(true);
              // Disconnect observer after first trigger if triggerOnce is true
              observerRef.current?.disconnect();
            }
          });
        },
        {
          threshold,
          rootMargin,
        }
      );
    }

    // Start observing
    observerRef.current.observe(element);

    // Cleanup function
    return () => {
      if (observerRef.current && element) {
        observerRef.current.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { isVisible, elementRef };
};

/**
 * Hook specifically for scroll animations that trigger once
 */
export const useScrollAnimation = (threshold = 0.1) => {
  return useIntersectionObserver({
    threshold,
    triggerOnce: true,
  });
};

/**
 * Hook for elements that need continuous visibility tracking
 */
export const useVisibilityTracker = (threshold = 0.1) => {
  return useIntersectionObserver({
    threshold,
    triggerOnce: false,
  });
};
