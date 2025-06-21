/**
 * Simple Spotify Auth Context - React Integration
 * Single source of truth for auth state using React Context
 */

import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import {
  startSpotifyLogin,
  handleSpotifyCallback,
  getCurrentUser,
  getValidAccessToken,
  clearTokens,
  isAuthenticated,
} from "@/lib/spotify-auth";
import type { SpotifyUser } from "@/lib/spotify-types";

interface AuthState {
  user: SpotifyUser | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: () => Promise<void>;
  logout: () => void;
  handleCallback: () => Promise<boolean>;
  getAccessToken: () => Promise<string | null>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
export type { AuthContextValue };

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (isAuthenticated()) {
          const accessToken = await getValidAccessToken();
          if (accessToken) {
            const user = await getCurrentUser(accessToken);
            setState({ user, isLoading: false, error: null });
            return;
          }
        }

        // No valid auth
        setState({ user: null, isLoading: false, error: null });
      } catch (error) {
        console.error("Auth initialization failed:", error);
        clearTokens();
        setState({
          user: null,
          isLoading: false,
          error:
            error instanceof Error ? error.message : "Authentication failed",
        });
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      await startSpotifyLogin();
      // Redirect happens in startSpotifyLogin, so this won't execute
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed",
      });
    }
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setState({ user: null, isLoading: false, error: null });
  }, []);

  const handleCallback = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const tokens = await handleSpotifyCallback();
      if (!tokens) {
        throw new Error("No tokens received");
      }

      const user = await getCurrentUser(tokens.access_token);
      setState({ user, isLoading: false, error: null });
      return true;
    } catch (error) {
      console.error("Callback handling failed:", error);
      setState({
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      });
      return false;
    }
  }, []);

  const getAccessToken = useCallback(async () => {
    try {
      return await getValidAccessToken();
    } catch (error) {
      console.error("Failed to get access token:", error);
      setState((prev) => ({
        ...prev,
        error: "Session expired. Please log in again.",
      }));
      return null;
    }
  }, []);

  const contextValue: AuthContextValue = {
    ...state,
    login,
    logout,
    handleCallback,
    getAccessToken,
    isAuthenticated: !!state.user,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
