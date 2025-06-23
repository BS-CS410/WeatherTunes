import { useState, useEffect, useContext } from "react";
import { SettingsContext } from "@/contexts/SettingsProvider";
import { ServiceContext } from "@/contexts/ServiceContext";

/**
 * Consolidated hooks utility file
 * Contains commonly used hooks to reduce file fragmentation
 */

// === SETTINGS HOOKS ===

/**
 * Hook for accessing settings context
 */
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

// === SERVICE HOOKS ===

/**
 * Hook for accessing service context - consolidated with other common hooks
 */
export function useServices() {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useServices must be used within a ServiceProvider");
  }
  return context;
}

// === UTILITY HOOKS ===

/**
 * Simple debounce hook
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for handling async operations
 */
export function useAsync<T, E = Error>(
  asyncFunction: () => Promise<T>,
  immediate = false,
) {
  const [loading, setLoading] = useState(immediate);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      setData(result);
      return result;
    } catch (err) {
      setError(err as E);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate]);

  return { loading, data, error, execute };
}

/**
 * Hook for managing boolean states (toggles, modals, etc.)
 */
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = () => setValue((prev) => !prev);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);

  return { value, toggle, setTrue, setFalse, setValue };
}

// === WEATHER UTILITY HOOKS ===

/**
 * Hook for weather-based time calculations
 */
export function useWeatherTime() {
  const getCurrentTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 21) return "evening";
    return "night";
  };

  return { getCurrentTimeOfDay };
}

/**
 * Hook for weather condition utilities
 */
export function useWeatherUtils() {
  const formatWeatherCondition = (
    condition: string,
    description?: string,
  ): string => {
    const displayCondition = description || condition;
    if (!displayCondition || displayCondition.trim() === "") {
      return "Unknown";
    }
    return (
      displayCondition.charAt(0).toUpperCase() +
      displayCondition.slice(1).toLowerCase()
    );
  };

  return {
    formatWeatherCondition,
  };
}
