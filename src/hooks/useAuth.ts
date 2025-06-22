/**
 * useAuth hook - Simple interface to auth context
 * Provides access to authentication state and methods
 */

import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "@/contexts/AuthProvider";

/**
 * Hook to access the authentication context
 * @returns Authentication context value with user, loading, and auth methods
 * @throws Error if used outside of an AuthProvider
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
