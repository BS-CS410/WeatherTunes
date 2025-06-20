/**
 * Frontend-only authentication service using Spotify PKCE OAuth
 * Replaces backend-dependent auth-utils.ts
 */

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = `${window.location.origin}/callback`;
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

export interface AuthUser {
  username: string;
  isAuthenticated: true;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

interface SpotifyUserProfile {
  id: string;
  display_name: string;
  email: string;
}

class FrontendAuthService {
  private static instance: FrontendAuthService;
  private listeners: ((_state: AuthState) => void)[] = [];
  private state: AuthState = {
    user: null,
    isLoading: true,
    error: null,
  };
  private tokens: SpotifyTokens | null = null;

  static getInstance(): FrontendAuthService {
    if (!FrontendAuthService.instance) {
      FrontendAuthService.instance = new FrontendAuthService();
    }
    return FrontendAuthService.instance;
  }

  private constructor() {
    this.loadTokensFromStorage();
    this.checkAuth();
  }

  /**
   * Subscribe to auth state changes
   */
  subscribe(listener: (_state: AuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Get current auth state
   */
  getState(): AuthState {
    return { ...this.state };
  }

  /**
   * Update state and notify listeners
   */
  private setState(newState: Partial<AuthState>): void {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener(this.getState()));
  }

  /**
   * Check current authentication status
   */
  async checkAuth(): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      if (!this.tokens) {
        this.setState({
          user: null,
          isLoading: false,
          error: null,
        });
        return;
      }

      // Check if token is still valid
      const token = await this.getAccessToken();
      if (!token) {
        this.setState({
          user: null,
          isLoading: false,
          error: null,
        });
        return;
      }

      // Get user profile to verify authentication
      const profile = await this.getUserProfile();
      if (profile) {
        this.setState({
          user: { username: profile.id, isAuthenticated: true },
          isLoading: false,
          error: null,
        });
      } else {
        this.setState({
          user: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      this.setState({
        user: null,
        isLoading: false,
        error: "Failed to check authentication status.",
      });
    }
  }

  /**
   * Start the OAuth flow
   */
  async login(): Promise<void> {
    if (!CLIENT_ID) {
      throw new Error("Spotify Client ID not configured");
    }

    const { verifier, challenge } = await this.generateCodeChallenge();

    // Store verifier for later use
    localStorage.setItem("spotify_code_verifier", verifier);

    const authUrl = new URL("https://accounts.spotify.com/authorize");
    authUrl.searchParams.append("client_id", CLIENT_ID);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.append("scope", SCOPES);
    authUrl.searchParams.append("code_challenge_method", "S256");
    authUrl.searchParams.append("code_challenge", challenge);

    window.location.href = authUrl.toString();
  }

  /**
   * Handle OAuth callback
   */
  async handleCallback(code: string): Promise<boolean> {
    const codeVerifier = localStorage.getItem("spotify_code_verifier");
    if (!codeVerifier) {
      throw new Error("Code verifier not found");
    }

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: codeVerifier,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to exchange code for tokens");
      }

      const data = await response.json();

      this.tokens = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: Date.now() + data.expires_in * 1000,
      };

      this.saveTokensToStorage();
      localStorage.removeItem("spotify_code_verifier");

      // Update auth state
      await this.checkAuth();

      return true;
    } catch (error) {
      console.error("Token exchange failed:", error);
      this.setState({
        user: null,
        isLoading: false,
        error: "Authentication failed. Please try again.",
      });
      return false;
    }
  }

  /**
   * Log out user
   */
  async logout(): Promise<void> {
    this.clearTokens();
    this.setState({
      user: null,
      isLoading: false,
      error: null,
    });
  }

  /**
   * Force sync auth state
   */
  async forceAuthSync(): Promise<boolean> {
    await this.checkAuth();
    return this.state.user !== null;
  }

  /**
   * Get valid access token
   */
  async getAccessToken(): Promise<string | null> {
    if (!this.tokens) {
      return null;
    }

    // Check if token is still valid (with 5 min buffer)
    if (this.tokens.expires_at > Date.now() + 5 * 60 * 1000) {
      return this.tokens.access_token;
    }

    // Refresh token
    return await this.refreshToken();
  }

  /**
   * Make authenticated Spotify API request
   */
  async spotifyApiRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = await this.getAccessToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token invalid, clear and require re-auth
        this.clearTokens();
        this.setState({
          user: null,
          isLoading: false,
          error: "Authentication expired. Please log in again.",
        });
        throw new Error("Authentication expired");
      }
      throw new Error(`Spotify API error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get user profile
   */
  private async getUserProfile(): Promise<SpotifyUserProfile | null> {
    try {
      return await this.spotifyApiRequest<SpotifyUserProfile>("/me");
    } catch (error) {
      console.error("Failed to get user profile:", error);
      return null;
    }
  }

  /**
   * Refresh access token
   */
  private async refreshToken(): Promise<string | null> {
    if (!this.tokens?.refresh_token) {
      return null;
    }

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          grant_type: "refresh_token",
          refresh_token: this.tokens.refresh_token,
        }),
      });

      if (!response.ok) {
        this.clearTokens();
        return null;
      }

      const data = await response.json();

      this.tokens = {
        access_token: data.access_token,
        refresh_token: data.refresh_token || this.tokens.refresh_token,
        expires_at: Date.now() + data.expires_in * 1000,
      };

      this.saveTokensToStorage();
      return this.tokens.access_token;
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.clearTokens();
      return null;
    }
  }

  /**
   * Generate PKCE code challenge
   */
  private async generateCodeChallenge(): Promise<{
    verifier: string;
    challenge: string;
  }> {
    const codeVerifier = this.generateRandomString(128);
    const codeChallenge = await this.base64URLEncode(
      await this.sha256(codeVerifier),
    );

    return {
      verifier: codeVerifier,
      challenge: codeChallenge,
    };
  }

  private generateRandomString(length: number): string {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  }

  private async sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return crypto.subtle.digest("SHA-256", data);
  }

  private async base64URLEncode(buffer: ArrayBuffer): Promise<string> {
    const bytes = new Uint8Array(buffer);
    const base64 = btoa(String.fromCharCode(...bytes));
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }

  /**
   * Save tokens to localStorage
   */
  private saveTokensToStorage(): void {
    if (this.tokens) {
      localStorage.setItem("spotify_tokens", JSON.stringify(this.tokens));
    }
  }

  /**
   * Load tokens from localStorage
   */
  private loadTokensFromStorage(): void {
    const stored = localStorage.getItem("spotify_tokens");
    if (stored) {
      try {
        this.tokens = JSON.parse(stored);
      } catch (error) {
        console.error("Failed to parse stored tokens:", error);
        localStorage.removeItem("spotify_tokens");
      }
    }
  }

  /**
   * Clear tokens
   */
  private clearTokens(): void {
    this.tokens = null;
    localStorage.removeItem("spotify_tokens");
    localStorage.removeItem("spotify_code_verifier");
  }
}

export const authService = FrontendAuthService.getInstance();
