import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values to improve performance
 * Delays updating the debounced value until after the specified delay
 * 
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 300ms)
 * @returns The debounced value
 * 
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   // This will only run 500ms after the user stops typing
 *   if (debouncedSearchTerm) {
 *     performSearch(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes before delay completes
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debouncing form input changes
 * Specifically designed for form fields with validation
 * 
 * @param initialValue - The initial value for the input
 * @param delay - The delay in milliseconds (default: 300ms)
 * @returns Object containing the current value, debounced value, and setter function
 * 
 * @example
 * ```tsx
 * const { value, debouncedValue, setValue } = useDebouncedInput('', 500);
 * 
 * // Use value for immediate UI updates
 * <input value={value} onChange={(e) => setValue(e.target.value)} />
 * 
 * // Use debouncedValue for validation or API calls
 * useEffect(() => {
 *   if (debouncedValue) {
 *     validateInput(debouncedValue);
 *   }
 * }, [debouncedValue]);
 * ```
 */
export function useDebouncedInput(initialValue: string = '', delay: number = 300) {
  const [value, setValue] = useState<string>(initialValue);
  const debouncedValue = useDebounce(value, delay);

  return {
    value,
    debouncedValue,
    setValue,
  };
}

/**
 * Custom hook for debouncing callback functions
 * Useful for expensive operations like API calls or complex calculations
 * 
 * @param callback - The function to debounce
 * @param delay - The delay in milliseconds (default: 300ms)
 * @param dependencies - Dependencies array for the callback
 * @returns The debounced callback function
 * 
 * @example
 * ```tsx
 * const debouncedSearch = useDebouncedCallback(
 *   (searchTerm: string) => {
 *     // Expensive search operation
 *     performSearch(searchTerm);
 *   },
 *   500,
 *   []
 * );
 * 
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 * ```
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300,
  dependencies: React.DependencyList = []
): T {
  const [debouncedCallback, setDebouncedCallback] = useState<T | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedCallback(() => callback);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [callback, delay, ...dependencies]);

  return (debouncedCallback || callback) as T;
}

export default useDebounce;
