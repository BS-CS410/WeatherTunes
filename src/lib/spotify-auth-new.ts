/**
 * Simple Spotify Authentication - Pure Functions
 * Implements official Spotify PKCE flow exactly as documented
 * https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
 */

import type { SpotifyUser, SpotifyTokens } from "./spotify-types";

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

// Token refresh debouncing
let refreshPromise: Promise<SpotifyTokens | null> | null = null;

/**
 * Generate PKCE code verifier (exact implementation from Spotify docs)
 */
function generateCodeVerifier(): string {
  const generateRandomString = (length: number): string => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

  return generateRandomString(64);
}

/**
 * Generate PKCE code challenge (exact implementation from Spotify docs)
 */
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const sha256 = async (plain: string): Promise<ArrayBuffer> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
  };

  const base64encode = (input: ArrayBuffer): string => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const hashed = await sha256(codeVerifier);
  return base64encode(hashed);
}

/**
 * Start Spotify OAuth login flow
 */
export async function startSpotifyLogin(): Promise<void> {
  if (!CLIENT_ID) {
    throw new Error("Spotify CLIENT_ID is not configured");
  }

  try {
    // Generate PKCE parameters
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Store code verifier for callback
    localStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);

    // Build authorization URL (exact parameters from Spotify docs)
    const authUrl = new URL("https://accounts.spotify.com/authorize");
    const params = {
      response_type: "code",
      client_id: CLIENT_ID,
      scope: SCOPES,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: REDIRECT_URI,
    };

    authUrl.search = new URLSearchParams(params).toString();

    // Redirect to Spotify
    window.location.href = authUrl.toString();
  } catch (error) {
    console.error("Failed to start login:", error);
    localStorage.removeItem(CODE_VERIFIER_KEY);
    throw error;
  }
}

/**
 * Handle OAuth callback and exchange code for tokens
 */
export async function handleSpotifyCallback(): Promise<SpotifyTokens | null> {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const error = urlParams.get("error");

  if (error) {
    throw new Error(`OAuth error: ${error}`);
  }

  if (!code) {
    throw new Error("No authorization code received");
  }

  const codeVerifier = localStorage.getItem(CODE_VERIFIER_KEY);
  if (!codeVerifier) {
    throw new Error(
      "Code verifier not found. Please restart the login process.",
    );
  }

  try {
    // Exchange code for tokens (exact implementation from Spotify docs)
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
      const errorData = await response.json();
      throw new Error(errorData.error_description || "Token exchange failed");
    }

    const data = await response.json();
    const tokens: SpotifyTokens = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + data.expires_in * 1000,
    };

    // Store tokens and cleanup
    storeTokens(tokens);
    localStorage.removeItem(CODE_VERIFIER_KEY);

    return tokens;
  } catch (error) {
    localStorage.removeItem(CODE_VERIFIER_KEY);
    throw error;
  }
}

/**
 * Get current user profile
 */
export async function getCurrentUser(
  accessToken: string,
): Promise<SpotifyUser> {
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
 * Get valid access token (handles refresh automatically with debouncing)
 */
export async function getValidAccessToken(): Promise<string | null> {
  const tokens = getStoredTokens();
  if (!tokens) return null;

  // Return current token if still valid (with 1 minute buffer)
  if (Date.now() < tokens.expires_at - 60000) {
    return tokens.access_token;
  }

  // Debounce concurrent refresh attempts
  if (refreshPromise) {
    const result = await refreshPromise;
    return result?.access_token || null;
  }

  // Start refresh process
  refreshPromise = refreshAccessToken(tokens.refresh_token);

  try {
    const newTokens = await refreshPromise;
    refreshPromise = null;
    return newTokens?.access_token || null;
  } catch (error) {
    refreshPromise = null;
    console.error("Token refresh failed:", error);
    clearTokens();
    return null;
  }
}

/**
 * Refresh access token
 */
async function refreshAccessToken(
  refreshToken: string,
): Promise<SpotifyTokens | null> {
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
    throw new Error("Token refresh failed");
  }

  const data = await response.json();
  const tokens: SpotifyTokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token || refreshToken, // Use new refresh token if provided
    expires_at: Date.now() + data.expires_in * 1000,
  };

  storeTokens(tokens);
  return tokens;
}

/**
 * Store tokens in localStorage with error handling
 */
function storeTokens(tokens: SpotifyTokens): void {
  try {
    localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
  } catch (error) {
    console.error("Failed to store tokens:", error);
    // Continue without storage - user will need to re-login
  }
}

/**
 * Get stored tokens with error handling
 */
export function getStoredTokens(): SpotifyTokens | null {
  try {
    const stored = localStorage.getItem(TOKENS_KEY);
    if (!stored) return null;

    const tokens = JSON.parse(stored);

    // Validate token structure
    if (!tokens.access_token || !tokens.refresh_token || !tokens.expires_at) {
      console.warn("Invalid token structure found, clearing storage");
      clearTokens();
      return null;
    }

    return tokens;
  } catch (error) {
    console.error("Failed to parse stored tokens:", error);
    clearTokens();
    return null;
  }
}

/**
 * Clear all auth data
 */
export function clearTokens(): void {
  try {
    localStorage.removeItem(TOKENS_KEY);
    localStorage.removeItem(CODE_VERIFIER_KEY);
  } catch (error) {
    console.error("Failed to clear tokens:", error);
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const tokens = getStoredTokens();
  return tokens !== null;
}
