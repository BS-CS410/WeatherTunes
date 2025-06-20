/**
 * Simplified Spotify Authentication using Authorization Code with PKCE
 * No backend required for authentication
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

interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

class SpotifyAuthService {
  private static instance: SpotifyAuthService;
  private tokens: SpotifyTokens | null = null;

  static getInstance(): SpotifyAuthService {
    if (!SpotifyAuthService.instance) {
      SpotifyAuthService.instance = new SpotifyAuthService();
    }
    return SpotifyAuthService.instance;
  }

  private constructor() {
    this.loadTokensFromStorage();
  }

  /**
   * Generate code verifier and challenge for PKCE
   */
  private async generateCodeChallenge(): Promise<{
    verifier: string;
    challenge: string;
  }> {
    const codeVerifier = this.generateRandomString(128);
    const codeChallenge = this.base64URLEncode(await this.sha256(codeVerifier));

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

  private base64URLEncode(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const base64 = btoa(String.fromCharCode(...bytes));
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }

  /**
   * Start the OAuth flow
   */
  async login(): Promise<void> {
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
   * Handle the callback and exchange code for tokens
   */
  async handleCallback(code: string): Promise<boolean> {
    const codeVerifier = localStorage.getItem("spotify_code_verifier");
    if (!codeVerifier) {
      throw new Error("Code verifier not found");
    }

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

    return true;
  }

  /**
   * Get valid access token (refresh if needed)
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
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.tokens !== null;
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearTokens();
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
        throw new Error("Authentication expired");
      }
      throw new Error(`Spotify API error: ${response.status}`);
    }

    return response.json();
  }
}

export const spotifyAuth = SpotifyAuthService.getInstance();
