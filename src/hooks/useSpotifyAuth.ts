/**
 * React hooks for Spotify authentication
 */

import { useState, useEffect } from "react";
import { spotifyAuth } from "@/lib/spotify-auth";
import type { AuthState } from "@/lib/spotify-types";

/**
 * Hook for using Spotify authentication
 */
export function useSpotifyAuth() {
  const [authState, setAuthState] = useState<AuthState>(spotifyAuth.getState());

  useEffect(() => {
    const unsubscribe = spotifyAuth.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    error: authState.error,
    isAuthenticated: !!authState.user,
    login: () => spotifyAuth.login(),
    logout: () => spotifyAuth.logout(),
    handleCallback: () => spotifyAuth.handleCallback(),
  };
}
