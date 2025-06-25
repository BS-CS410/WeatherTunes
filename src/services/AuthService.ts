import { generateSecureRandomString } from "../lib/core";
import {
  generateCodeVerifier,
  generateCodeChallenge,
} from "../lib/core/crypto.utils";
import type { User, TokenInfo } from "@/types/auth";

interface SpotifyTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

// Configuration constants
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

// Storage keys
const TOKENS_KEY = "spotify_tokens";
const CODE_VERIFIER_KEY = "spotify_code_verifier";
const STATE_KEY = "spotify_auth_state";

export class AuthService {
  private clientId: string = CLIENT_ID;
  private redirectUri: string = REDIRECT_URI;
  private scopes: string[] = SCOPES.split(" ");
  private refreshPromise: Promise<TokenInfo | null> | null = null;
  private isProcessingCallback = false;

  constructor() {
    if (!this.clientId) {
      throw new Error("Spotify CLIENT_ID is not configured");
    }
  }

  async initiateLogin(): Promise<void> {
    // Clear any existing callback processing state
    this.isProcessingCallback = false;

    try {
      // Generate PKCE parameters
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const state = generateSecureRandomString(16); // Use secure random for state

      // Store code verifier and state for the callback
      this.storeCodeVerifier(codeVerifier);
      localStorage.setItem(STATE_KEY, state);

      // Build authorization URL (exact parameters from Spotify docs)
      const authUrl = new URL("https://accounts.spotify.com/authorize");
      const params = {
        response_type: "code",
        client_id: this.clientId,
        scope: this.scopes.join(" "),
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
        redirect_uri: this.redirectUri,
        state: state,
      };

      authUrl.search = new URLSearchParams(params).toString();

      // Redirect to Spotify
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error("Failed to start login:", error);
      this.clearCodeVerifier();
      throw error;
    }
  }

  async handleRedirectCallback(): Promise<void> {
    // Prevent multiple simultaneous callback processing
    if (this.isProcessingCallback) {
      console.warn("Callback already being processed, skipping duplicate call");
      return;
    }

    this.isProcessingCallback = true;

    try {
      console.log(
        "handleRedirectCallback - Current URL:",
        window.location.href,
      );
      console.log(
        "handleRedirectCallback - Current Origin:",
        window.location.origin,
      );

      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const receivedState = params.get("state");
      const error = params.get("error");

      console.log("handleRedirectCallback - URL Params:", {
        code,
        receivedState,
        error,
      });

      // Retrieve stored state and verifier
      const storedState = localStorage.getItem(STATE_KEY);
      const codeVerifier = this.getCodeVerifier();

      console.log("handleRedirectCallback - Stored Values:", {
        storedState,
        codeVerifier,
      });

      if (error) {
        console.error("handleRedirectCallback - Spotify auth error:", error);
        // Clean up stored values on error
        localStorage.removeItem(STATE_KEY);
        this.clearTokens();
        throw new Error(`Spotify auth error: ${error}`);
      }

      if (!receivedState || receivedState !== storedState) {
        console.error("handleRedirectCallback - State mismatch:", {
          receivedState,
          storedState,
        });
        // Clean up stored values on state mismatch
        localStorage.removeItem(STATE_KEY);
        this.clearTokens();
        throw new Error("State mismatch error. Potential CSRF attack.");
      }

      if (!code) {
        console.error("handleRedirectCallback - Missing code parameter.");
        // Clean up stored values on missing code
        localStorage.removeItem(STATE_KEY);
        this.clearTokens();
        throw new Error("Missing required 'code' authentication parameter.");
      }

      if (!codeVerifier) {
        console.error("handleRedirectCallback - No code verifier found.");
        // Clean up stored values on missing verifier
        localStorage.removeItem(STATE_KEY);
        this.clearTokens();
        throw new Error("No code verifier found in local storage.");
      }

      console.log(
        "handleRedirectCallback - All checks passed, exchanging code for token.",
      );
      // Exchange the authorization code for an access token
      await this.exchangeCodeForToken(code, codeVerifier);
    } finally {
      this.isProcessingCallback = false;
    }
  }

  async exchangeCodeForToken(
    code: string,
    codeVerifier: string,
  ): Promise<TokenInfo> {
    try {
      console.log("Exchange Code for Token - Client ID:", this.clientId);
      console.log("Exchange Code for Token - Redirect URI:", this.redirectUri);

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
        const errorText = await response.text();
        console.error(
          "Token exchange failed (HTTP error):",
          response.status,
          errorText,
        );
        throw new Error(
          `Failed to authenticate with Spotify: ${response.status} - ${errorText}`,
        );
      }

      const data: SpotifyTokenResponse = await response.json();
      const tokenData: TokenInfo = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + data.expires_in * 1000 - 60000, // 1 minute buffer
      };

      this.storeTokens(tokenData);
      this.clearCodeVerifier();
      localStorage.removeItem(STATE_KEY); // Clear state key after successful token exchange
      return tokenData;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  async getAccessToken(): Promise<string> {
    const tokens = await this._ensureValidAccessToken();
    if (!tokens) {
      throw new Error("Not authenticated");
    }
    return tokens.accessToken;
  }

  async getUser(): Promise<User | null> {
    try {
      const accessToken = await this.getAccessToken();
      console.log(
        "getUser: Attempting to fetch user info with accessToken (first 10 chars):",
        accessToken ? accessToken.substring(0, 10) + "..." : "N/A",
      );
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Failed to fetch user info (HTTP error):",
          response.status,
          errorText,
        );
        if (response.status === 401) {
          this.clearTokens();
          return null;
        }
        throw new Error(
          `Failed to fetch user info: ${response.status} - ${errorText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to get user:", error);
      this.logout(); // Clear tokens on failure
      return null;
    }
  }

  private async refreshAccessToken(refreshToken: string): Promise<TokenInfo> {
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
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: this.clientId, // client_id is sent in the body for PKCE refresh
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data: SpotifyTokenResponse = await response.json();
      const tokenData: TokenInfo = {
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

  private getTokens(): TokenInfo | null {
    try {
      const stored = localStorage.getItem(TOKENS_KEY);
      if (!stored) {
        console.log("getTokens: No tokens found in localStorage.");
        return null;
      }

      const tokens = JSON.parse(stored);
      console.log("getTokens: Tokens retrieved from localStorage.");

      // Validate token structure
      if (!tokens.accessToken || !tokens.refreshToken || !tokens.expiresAt) {
        console.warn(
          "getTokens: Invalid token structure found, clearing storage",
        );
        this.clearTokens();
        return null;
      }

      return tokens;
    } catch (error) {
      console.error("Failed to parse stored tokens:", error);
      this.clearTokens();
      return null;
    }
  }

  private storeTokens(tokens: TokenInfo): void {
    try {
      localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
      console.log("storeTokens: Tokens successfully stored in localStorage.");
    } catch (error) {
      console.error("storeTokens: Failed to store tokens:", error);
      // Continue without storage - user will need to re-login
    }
  }

  private getCodeVerifier(): string | null {
    try {
      return localStorage.getItem(CODE_VERIFIER_KEY);
    } catch (error) {
      console.error("Failed to get code verifier:", error);
      return null;
    }
  }

  private storeCodeVerifier(codeVerifier: string): void {
    try {
      localStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);
    } catch (error) {
      console.error("Failed to store code verifier:", error);
    }
  }

  private clearCodeVerifier(): void {
    try {
      localStorage.removeItem(CODE_VERIFIER_KEY);
    } catch (error) {
      console.error("Failed to clear code verifier:", error);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const tokens = this.getTokens();
    if (!tokens) {
      return false;
    }
    // Attempt to ensure token is valid, but don't throw if it fails
    try {
      await this._ensureValidAccessToken();
      return true;
    } catch (error) {
      console.warn(
        "Authentication check failed, user is not authenticated:",
        error,
      );
      return false;
    }
  }

  logout(): void {
    this.clearTokens();
  }

  private async _ensureValidAccessToken(): Promise<TokenInfo | null> {
    const tokens = this.getTokens();
    if (!tokens) {
      console.log("_ensureValidAccessToken: No tokens found.");
      return null;
    }

    console.log("_ensureValidAccessToken: Tokens found, checking expiry.");
    // If token is still valid, return it
    if (Date.now() < tokens.expiresAt - 60000) {
      // 1 minute buffer
      console.log("_ensureValidAccessToken: Access token is still valid.");
      return tokens;
    }

    console.log(
      "_ensureValidAccessToken: Access token expired, attempting refresh.",
    );

    // If a refresh is already in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Otherwise, initiate a refresh
    const refreshOperation = this.refreshAccessToken(tokens.refreshToken)
      .then((newTokens) => {
        this.refreshPromise = null; // Clear promise on success
        return newTokens;
      })
      .catch((error) => {
        this.refreshPromise = null; // Clear promise on failure
        console.error(
          "Token refresh failed, user needs to log in again.",
          error,
        );
        this.logout(); // Clear tokens and log out user
        throw error; // Re-throw to propagate the error
      });

    this.refreshPromise = refreshOperation;
    return refreshOperation;
  }

  private clearTokens(): void {
    try {
      localStorage.removeItem(TOKENS_KEY);
      localStorage.removeItem(CODE_VERIFIER_KEY);
      localStorage.removeItem(STATE_KEY); // Clear state key on logout
      console.log(
        "clearTokens: All authentication related items cleared from localStorage.",
      );
    } catch (error) {
      console.error("clearTokens: Failed to clear tokens:", error);
    }
  }
}
