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

export class AuthService {
  private clientId: string;
  private redirectUri: string;
  private scopes: string[];
  private refreshPromise: Promise<TokenData | null> | null = null;

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
    return this.startLogin();
  }

  async startLogin(): Promise<void> {
    const codeVerifier = generateRandomString(64);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Store code verifier for the callback
    localStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: "code",
      redirect_uri: this.redirectUri,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      scope: this.scopes.join(" "),
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async handleCallback(params: { code: string; state: string }): Promise<void> {
    // The state parameter is not used but kept for future validation if needed
    const { code } = params;
    const codeVerifier = localStorage.getItem(CODE_VERIFIER_KEY);

    if (!codeVerifier) {
      throw new Error("No code verifier found in local storage");
    }

    // Exchange the authorization code for an access token
    await this.exchangeCodeForToken(code, codeVerifier);
  }

  async handleCallbackFromUrl(): Promise<void> {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");

    if (error) {
      throw new Error(`Spotify auth error: ${error}`);
    }

    if (!code || !state) {
      throw new Error("Missing required authentication parameters");
    }

    return this.handleCallback({ code, state });
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

  async getUser(): Promise<User> {
    const tokens = this.getTokens();
    if (!tokens) {
      throw new Error("Not authenticated");
    }

    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    return response.json();
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

  isAuthenticated(): boolean {
    const tokens = this.getTokens();
    return tokens !== null && Date.now() < tokens.expiresAt;
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
