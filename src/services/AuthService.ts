import { generateRandomString, generateCodeChallenge } from "../lib/core";

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

type TokenData = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Timestamp in ms
};

export type User = {
  id: string;
  display_name: string;
  email: string;
  images?: Array<{ url: string }>;
};

const TOKEN_STORAGE_KEY = "spotify_auth_tokens";
const CODE_VERIFIER_KEY = "spotify_code_verifier";
const STATE_KEY = "spotify_auth_state";

export class AuthService {
  private clientId: string;
  private redirectUri: string;
  private scopes: string[];
  private refreshPromise: Promise<TokenData | null> | null = null;
  private isProcessingCallback = false;

  constructor() {
    this.clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    this.redirectUri = `${window.location.origin}/callback`;
    this.scopes = [
      "user-read-private",
      "user-read-email",
      "user-read-playback-state",
      "user-modify-playback-state",
      "streaming",
      "user-library-read",
    ];
  }

  async initiateLogin(): Promise<void> {
    // Clear any existing callback processing state
    this.isProcessingCallback = false;

    const codeVerifier = generateRandomString(64);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = generateRandomString(16);

    // Store verifier and state for the callback
    localStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);
    localStorage.setItem(STATE_KEY, state);

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: "code",
      redirect_uri: this.redirectUri,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      scope: this.scopes.join(" "),
      state: state,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async handleRedirectCallback(): Promise<void> {
    // Prevent multiple simultaneous callback processing
    if (this.isProcessingCallback) {
      console.warn("Callback already being processed, skipping duplicate call");
      return;
    }

    this.isProcessingCallback = true;

    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const receivedState = params.get("state");
      const error = params.get("error");

      // Retrieve stored state and verifier
      const storedState = localStorage.getItem(STATE_KEY);
      const codeVerifier = localStorage.getItem(CODE_VERIFIER_KEY);

      if (error) {
        // Clean up stored values on error
        localStorage.removeItem(STATE_KEY);
        localStorage.removeItem(CODE_VERIFIER_KEY);
        throw new Error(`Spotify auth error: ${error}`);
      }

      if (!receivedState || receivedState !== storedState) {
        // Clean up stored values on state mismatch
        localStorage.removeItem(STATE_KEY);
        localStorage.removeItem(CODE_VERIFIER_KEY);
        throw new Error("State mismatch error. Potential CSRF attack.");
      }

      if (!code) {
        // Clean up stored values on missing code
        localStorage.removeItem(STATE_KEY);
        localStorage.removeItem(CODE_VERIFIER_KEY);
        throw new Error("Missing required 'code' authentication parameter.");
      }

      if (!codeVerifier) {
        // Clean up stored values on missing verifier
        localStorage.removeItem(STATE_KEY);
        localStorage.removeItem(CODE_VERIFIER_KEY);
        throw new Error("No code verifier found in local storage.");
      }

      // Clean up state after successful validation
      localStorage.removeItem(STATE_KEY);

      // Exchange the authorization code for an access token
      await this.exchangeCodeForToken(code, codeVerifier);
    } finally {
      this.isProcessingCallback = false;
    }
  }

  async exchangeCodeForToken(
    code: string,
    codeVerifier: string,
  ): Promise<TokenData> {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        grant_type: "authorization_code",
        code,
        redirect_uri: this.redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.error_description || "Failed to authenticate with Spotify",
      );
    }

    const data: TokenResponse = await response.json();
    const tokenData: TokenData = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };

    this.storeTokens(tokenData);
    localStorage.removeItem(CODE_VERIFIER_KEY);
    return tokenData;
  }

  async getAccessToken(): Promise<string> {
    const tokens = this.getTokens();
    if (!tokens) {
      throw new Error("Not authenticated");
    }

    // If token is expired or about to expire, refresh it
    if (Date.now() >= tokens.expiresAt - 60000) {
      // Refresh if less than 1 minute until expiration
      try {
        const newTokens = await this.refreshTokens(tokens.refreshToken);
        return newTokens.accessToken;
      } catch (error) {
        console.error("Failed to refresh token:", error);
        throw new Error("Failed to refresh access token");
      }
    }

    return tokens.accessToken;
  }

  async getAccessTokenSafe(): Promise<string | null> {
    const tokens = this.getStoredTokens();

    if (!tokens) {
      return null;
    }

    // If token is still valid, return it
    if (Date.now() < tokens.expiresAt - 60000) {
      // 1 minute buffer
      return tokens.accessToken;
    }

    // Otherwise, refresh the token
    return this.refreshToken(tokens.refreshToken);
  }

  async getUser(): Promise<User | null> {
    try {
      const accessToken = await this.getAccessToken();
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to get user:", error);
      this.logout(); // Clear tokens on failure
      return null;
    }
  }

  private async refreshAccessToken(refreshToken: string): Promise<TokenData> {
    // If a refresh is already in progress, wait for it
    if (this.refreshPromise) {
      const result = await this.refreshPromise;
      if (!result) {
        throw new Error("Failed to refresh token");
      }
      return result;
    }

    const refreshPromise = (async () => {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${this.clientId}:`)}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: this.clientId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data: TokenResponse = await response.json();
      const tokenData: TokenData = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || refreshToken, // Use new refresh token if provided, otherwise keep the old one
        expiresAt: Date.now() + data.expires_in * 1000,
      };

      this.storeTokens(tokenData);
      return tokenData;
    })();

    try {
      this.refreshPromise = refreshPromise;
      return await refreshPromise;
    } finally {
      if (this.refreshPromise === refreshPromise) {
        this.refreshPromise = null;
      }
    }
  }

  private getTokens(): TokenData | null {
    const tokenString = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!tokenString) return null;

    try {
      return JSON.parse(tokenString);
    } catch (error) {
      console.error("Failed to parse stored tokens", error);
      return null;
    }
  }

  private getStoredTokens(): TokenData | null {
    return this.getTokens();
  }

  async isAuthenticated(): Promise<boolean> {
    const tokens = this.getTokens();
    if (!tokens) {
      return false;
    }

    // If token is still valid, no need to refresh
    if (Date.now() < tokens.expiresAt - 60000) {
      return true;
    }

    // If token is expired, try to refresh it
    try {
      await this.refreshAccessToken(tokens.refreshToken);
      return true; // Refresh was successful
    } catch (error) {
      console.error("Token refresh failed, user needs to log in again.", error);
      this.logout(); // Clear tokens and log out user
      return false; // Refresh failed
    }
  }

  logout(): void {
    this.clearTokens();
  }

  // For backward compatibility
  private async refreshToken(refreshToken: string): Promise<string | null> {
    try {
      const result = await this.refreshAccessToken(refreshToken);
      return result?.accessToken || null;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  }

  // For backward compatibility with older code
  private async refreshTokens(refreshToken: string): Promise<TokenData> {
    return this.refreshAccessToken(refreshToken);
  }

  private storeTokens(tokens: TokenData): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  }

  private clearTokens(): void {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(CODE_VERIFIER_KEY);
    } catch (error) {
      console.error("Failed to clear tokens:", error);
    }
  }
}
