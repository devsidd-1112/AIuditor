/**
 * Hook for persisting state to localStorage
 * Safe for Next.js client components
 */

import { useState, useEffect } from "react";

export function usePersistedState<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize state with default value
  const [state, setState] = useState<T>(defaultValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setState(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error loading persisted state for key "${key}":`, error);
    }
    setIsHydrated(true);
  }, [key]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isHydrated) {
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.warn(`Error saving persisted state for key "${key}":`, error);
      }
    }
  }, [key, state, isHydrated]);

  return [state, setState];
}
