/**
 * AuthProvider - Manages authentication state using the AuthService
 * Single source of truth for auth state using React Context
 */

import * as React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useServices } from "../hooks/common";
import type { AuthState, User } from "@/types/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  error: string | null;
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
    data: null,
    isLoading: true,
    error: null,
  });

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    console.log("AuthProvider: checkAuth called. Current state:", state);
    try {
      const isAuth = await auth.isAuthenticated();
      console.log("AuthProvider: isAuthenticated result:", isAuth);
      if (isAuth) {
        const user = await auth.getUser();
        console.log(
          "AuthProvider: getUser result:",
          user ? "User found" : "No user",
        );
        setState((prev) => ({ ...prev, data: user, isLoading: false, error: null }));
      } else {
        setState((prev) => ({ ...prev, data: null, isLoading: false, error: null }));
      }
    } catch (error) {
      console.error("AuthProvider: Auth check failed:", error);
      if (error instanceof Error && error.message.includes("401")) {
        console.log("AuthProvider: 401 error, logging out.");
        auth.logout();
      }
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to check authentication status",
      }));
    }
    console.log("AuthProvider: checkAuth finished. New state:", state);
  }, [auth]);

  // Initialize auth state on mount
  useEffect(() => {
    console.log("AuthProvider: useEffect (mount) triggered.");
    checkAuth();
  }, [checkAuth]);

  const navigate = useNavigate(); // Initialize useNavigate

  // Redirect after successful authentication
  useEffect(() => {
    console.log(
      "AuthProvider: useEffect (redirect) triggered. Current state:",
      state,
    );
    // Only redirect if user is authenticated, not loading, no error, AND we are currently on the callback page
    if (
      state.data &&
      !state.isLoading &&
      !state.error &&
      window.location.pathname === "/callback"
    ) {
      console.log("AuthProvider: Redirecting to / using useNavigate.");
      window.history.replaceState({}, document.title, window.location.pathname); // Clean URL
      navigate("/", { replace: true }); // Use navigate for proper React Router handling
    }
  }, [state.data, state.isLoading, state.error, navigate]);

  const login = useCallback(async () => {
    console.log("AuthProvider: login called.");
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await auth.initiateLogin();
      console.log("AuthProvider: initiateLogin completed.");
    } catch (error) {
      console.error("AuthProvider: Login failed:", error);
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
    console.log("AuthProvider: handleCallback called.");
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await auth.handleRedirectCallback();
      console.log("AuthProvider: handleRedirectCallback completed.");
      const user = await auth.getUser();
      console.log(
        "AuthProvider: getUser after callback result:",
        user ? "User found" : "No user",
      );

      setState((prev) => ({
        ...prev,
        data: user,
        isLoading: false,
        error: null,
      }));
      console.log("AuthProvider: handleCallback finished.");
      return true;
    } catch (error) {
      console.error("AuthProvider: Callback handling failed:", error);
      if (error instanceof Error && error.message.includes("401")) {
        console.log("AuthProvider: 401 error during callback, logging out.");
        auth.logout();
      }
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
    console.log("AuthProvider: logout called.");
    auth.logout();
    setState({
      data: null,
      isLoading: false,
      error: null,
    });
    // Note: state logging here would cause infinite loop if state is in dependency array
    console.log("AuthProvider: logout finished.");
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
      user: state.data,
      isLoading: state.isLoading,
      error: state.error,
      login,
      logout,
      handleCallback,
      getAccessToken,
      isAuthenticated: !!state.data,
    }),
    [state, login, logout, handleCallback, getAccessToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
