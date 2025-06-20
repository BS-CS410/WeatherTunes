import { useState, useEffect, useContext } from "react";
import { authService } from "@/lib/auth-utils";
import type { AuthState } from "@/lib/auth-utils";
import { SettingsContext } from "@/contexts/SettingsProvider";

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

/**
 * React hook for authentication state management
 * Provides reactive access to auth status throughout the application
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(authService.getState());

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.subscribe(setAuthState);

    return unsubscribe;
  }, []);

  return {
    ...authState,
    login: () => authService.login(),
    logout: () => authService.logout(),
    checkAuth: () => authService.checkAuth(),
  };
}

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
