import { useEffect, useState } from "react";
import { authService, type AuthState } from "@/lib/auth";

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
