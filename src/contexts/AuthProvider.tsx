/**
 * AuthProvider - Manages authentication state using the AuthService
 * Single source of truth for auth state using React Context
 */

import * as React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useServices } from "../hooks/common";
import type { User, AuthState } from "@/types/auth";

export interface AuthContextValue extends AuthState {
  login: () => Promise<void>;
  logout: () => void;
  handleCallback: () => Promise<boolean>;
  getAccessToken: () => Promise<string | null>;
  isAuthenticated: boolean;
}

// === CONTEXT CREATION ===
export const AuthContext = React.createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({
  children,
}: AuthProviderProps): React.ReactElement {
  const { auth } = useServices();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    try {
      const isAuth = await auth.isAuthenticated();
      if (isAuth) {
        const user = await auth.getUser();
        setState((prev) => ({ ...prev, user, isLoading: false, error: null }));
      } else {
        setState((prev) => ({ ...prev, isLoading: false, error: null }));
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to check authentication status",
      }));
    }
  }, [auth]);

  // Initialize auth state on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await auth.initiateLogin();
    } catch (error) {
      console.error("Login failed:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to start login process",
      }));
    }
  }, [auth]);

  const handleCallback = useCallback(async (): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await auth.handleRedirectCallback();
      const user = await auth.getUser();

      // Clear the URL parameters after successful authentication
      window.history.replaceState({}, document.title, window.location.pathname);

      setState((prev) => ({
        ...prev,
        user,
        isLoading: false,
        error: null,
      }));
      return true;
    } catch (error) {
      console.error("Callback handling failed:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to complete login process",
      }));
      return false;
    }
  }, [auth]);

  const logout = useCallback(() => {
    auth.logout();
    setState({
      user: null,
      isLoading: false,
      error: null,
    });
  }, [auth]);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      return await auth.getAccessToken();
    } catch (error) {
      console.error("Failed to get access token:", error);
      return null;
    }
  }, [auth]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
      handleCallback,
      getAccessToken,
      isAuthenticated: !!state.user,
    }),
    [state, login, logout, handleCallback, getAccessToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
