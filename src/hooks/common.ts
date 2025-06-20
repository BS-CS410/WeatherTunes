import { useState, useEffect, useContext } from "react";
import { authService } from "@/lib/spotify-client";
import type { AuthState } from "@/lib/spotify-client";
import { SettingsContext } from "@/contexts/SettingsProvider";
import { AuthContext } from "@/contexts/auth-context";

/**
 * Consolidated hooks utility file
 * Contains commonly used hooks to reduce file fragmentation
 */

// === STORAGE HOOKS ===

/**
 * Custom hook for persistent settings using localStorage
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setStoredValue = (newValue: T) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [value, setStoredValue] as const;
}

// === AUTHENTICATION HOOKS ===

/**
 * React hook for authentication state management
 * Provides reactive access to auth status throughout the application
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: authService.getCurrentUser(),
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    // Check if user is authenticated on mount
    const currentUser = authService.getCurrentUser();
    setAuthState({
      user: currentUser,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...authState,
    login: () => authService.login(),
    logout: () => authService.logout(),
    checkAuth: () => {
      const currentUser = authService.getCurrentUser();
      setAuthState((prev) => ({
        ...prev,
        user: currentUser,
      }));
    },
  };
}

/**
 * Hook for using auth context (alternative to direct auth service)
 */
export function useAuthContext(): AuthState {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

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
