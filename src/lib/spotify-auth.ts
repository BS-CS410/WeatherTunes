/**
 * Simple and robust Spotify authentication using Authorization Code + PKCE flow
 * Based on official Spotify Web API documentation
 */

import type { SpotifyUser, SpotifyTokens, AuthState } from "./spotify-types";

// Configuration
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = window.location.origin + "/callback";
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "streaming",
  "user-library-read",
  "user-top-read",
].join(" ");

/**
 * Simple Spotify authentication service
 */
class SpotifyAuth {
  private static instance: SpotifyAuth;
  private listeners: Array<(state: AuthState) => void> = [];
  private state: AuthState = {
    user: null,
    isLoading: false,
    error: null,
  };

  static getInstance(): SpotifyAuth {
    if (!SpotifyAuth.instance) {
      SpotifyAuth.instance = new SpotifyAuth();
    }
    return SpotifyAuth.instance;
  }

  private constructor() {
    this.initialize();
  }

  /**
   * Subscribe to auth state changes
   */
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Get current auth state
   */
  getState(): AuthState {
    return this.state;
  }

  /**
   * Initialize auth on app start
   */
  private async initialize(): Promise<void> {
    try {
      const tokens = this.getStoredTokens();
      if (tokens && this.isTokenValid(tokens)) {
        this.setState({ ...this.state, isLoading: true });
        const user = await this.fetchUserProfile(tokens.access_token);
        this.setState({ user, isLoading: false, error: null });
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
      this.clearTokens();
      this.setState({ user: null, isLoading: false, error: null });
    }
  }

  /**
   * Start login flow
   */
  async login(): Promise<void> {
    if (!CLIENT_ID || !REDIRECT_URI) {
      console.error("Spotify CLIENT_ID or REDIRECT_URI is missing.");
      return;
    }

    // Always generate a fresh code verifier for each login attempt
    const codeVerifier = this.generateCodeVerifier();
    localStorage.setItem("spotify_code_verifier", codeVerifier);

    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    // Build authorization URL
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: "code",
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      state: this.generateState(),
    });

    // Redirect to Spotify authorization
    window.location.href = `https://accounts.spotify.com/authorize?${params}`;
  }

  /**
   * Handle OAuth callback
   */
  async handleCallback(): Promise<boolean> {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const error = urlParams.get("error");

      if (error) {
        throw new Error(`OAuth error: ${error}`);
      }

      if (!code) {
        throw new Error("No authorization code received");
      }

      const codeVerifier = localStorage.getItem("spotify_code_verifier");
      if (!codeVerifier) {
        // Try to provide a more helpful error message
        throw new Error(
          "Code verifier not found. This may happen if the login flow was interrupted or browser storage was cleared. Please try logging in again.",
        );
      }

      this.setState({ ...this.state, isLoading: true });

      const tokens = await this.exchangeCodeForTokens(code, codeVerifier);
      this.storeTokens(tokens);
      localStorage.removeItem("spotify_code_verifier");

      const user = await this.fetchUserProfile(tokens.access_token);
      this.setState({ user, isLoading: false, error: null });

      return true;
    } catch (error) {
      console.error("Callback handling failed:", error);
      this.setState({
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      });
      return false;
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    console.log("Logging out user...");
    this.clearTokens();
    this.setState({ user: null, isLoading: false, error: null });
  }

  /**
   * Get valid access token (handles refresh if needed)
   */
  async getAccessToken(): Promise<string | null> {
    const tokens = this.getStoredTokens();
    if (!tokens) return null;

    // Return current token if still valid
    if (this.isTokenValid(tokens)) {
      return tokens.access_token;
    }

    // Try to refresh token
    try {
      const newTokens = await this.refreshTokens(tokens.refresh_token);
      this.storeTokens(newTokens);
      return newTokens.access_token;
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.clearTokens();
      this.setState({ user: null, isLoading: false, error: "Session expired" });
      return null;
    }
  }

  /**
   * Generate PKCE code verifier
   */
  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  /**
   * Generate PKCE code challenge
   */
  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  /**
   * Generate state parameter for CSRF protection
   */
  private generateState(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }

  /**
   * Exchange authorization code for tokens
   */
  private async exchangeCodeForTokens(
    code: string,
    codeVerifier: string,
  ): Promise<SpotifyTokens> {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error_description || "Token exchange failed");
    }

    const data = await response.json();
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + data.expires_in * 1000,
    };
  }

  /**
   * Refresh access token
   */
  private async refreshTokens(refreshToken: string): Promise<SpotifyTokens> {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: CLIENT_ID,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error_description || "Token refresh failed");
    }

    const data = await response.json();
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token || refreshToken,
      expires_at: Date.now() + data.expires_in * 1000,
    };
  }

  /**
   * Fetch user profile from Spotify
   */
  private async fetchUserProfile(accessToken: string): Promise<SpotifyUser> {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return response.json();
  }

  /**
   * Store tokens in localStorage
   */
  private storeTokens(tokens: SpotifyTokens): void {
    localStorage.setItem("spotify_tokens", JSON.stringify(tokens));
  }

  /**
   * Get stored tokens
   */
  private getStoredTokens(): SpotifyTokens | null {
    const stored = localStorage.getItem("spotify_tokens");
    return stored ? JSON.parse(stored) : null;
  }

  /**
   * Clear stored tokens
   */
  private clearTokens(): void {
    localStorage.removeItem("spotify_tokens");
    localStorage.removeItem("spotify_code_verifier");
  }

  /**
   * Check if token is valid (with 1 minute buffer)
   */
  private isTokenValid(tokens: SpotifyTokens): boolean {
    return Date.now() < tokens.expires_at - 60000;
  }

  /**
   * Update state and notify listeners
   */
  private setState(newState: AuthState): void {
    this.state = newState;
    this.listeners.forEach((listener) => listener(this.state));
  }
}

// Export singleton instance
export const spotifyAuth = SpotifyAuth.getInstance();
