/**
 * Consolidated Spotify client service
 * Handles authentication, API calls, and player functionality
 */

import type { TrackMetadata } from "@/types/queue-types";

// === CONFIGURATION ===

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

// === TYPES ===

export interface AuthUser {
  username: string;
  isAuthenticated: true;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

export interface SpotifySearchResult {
  tracks: TrackMetadata[];
  query: string;
  count: number;
}

export interface WeatherRecommendationRequest {
  weather_condition: string;
  temperature: number;
  time_of_day?: "morning" | "afternoon" | "evening" | "night";
  limit?: number;
  use_personalization?: boolean;
  user_preferences?: UserMusicPreferences;
}

export interface UserMusicPreferences {
  preferred_genres?: string[];
  preferred_artists?: string[];
  audio_feature_preferences?: {
    valence?: number;
    energy?: number;
    danceability?: number;
    acousticness?: number;
  };
  explicit_content?: boolean;
}

export interface WeatherRecommendationResponse {
  tracks: TrackMetadata[];
  weather_condition: string;
  temperature: number;
  time_of_day: string;
  count: number;
}

interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  duration_ms: number;
  preview_url?: string;
  external_urls: { spotify: string };
}

// === AUTHENTICATION SERVICE ===

class AuthService {
  private static instance: AuthService;
  private currentUser: AuthUser | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      const tokens = this.getStoredTokens();
      if (tokens && this.isTokenValid(tokens)) {
        const user = await this.fetchUserProfile(tokens.access_token);
        this.currentUser = user;
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      this.clearStoredTokens();
    }
  }

  async login(): Promise<void> {
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    localStorage.setItem("spotify_code_verifier", codeVerifier);

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: "code",
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params}`;
  }

  async handleCallback(code: string): Promise<AuthUser> {
    const codeVerifier = localStorage.getItem("spotify_code_verifier");
    if (!codeVerifier) {
      throw new Error("Code verifier not found");
    }

    const tokens = await this.exchangeCodeForTokens(code, codeVerifier);
    this.storeTokens(tokens);
    localStorage.removeItem("spotify_code_verifier");

    const user = await this.fetchUserProfile(tokens.access_token);
    this.currentUser = user;
    return user;
  }

  async logout(): Promise<void> {
    this.clearStoredTokens();
    this.currentUser = null;
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  async getValidAccessToken(): Promise<string | null> {
    const tokens = this.getStoredTokens();
    if (!tokens) return null;

    if (this.isTokenValid(tokens)) {
      return tokens.access_token;
    }

    try {
      const newTokens = await this.refreshAccessToken(tokens.refresh_token);
      this.storeTokens(newTokens);
      return newTokens.access_token;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      this.clearStoredTokens();
      this.currentUser = null;
      return null;
    }
  }

  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

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
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + data.expires_in * 1000,
    };
  }

  private async refreshAccessToken(
    refreshToken: string,
  ): Promise<SpotifyTokens> {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh access token");
    }

    const data = await response.json();
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token || refreshToken,
      expires_at: Date.now() + data.expires_in * 1000,
    };
  }

  private async fetchUserProfile(accessToken: string): Promise<AuthUser> {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const data = await response.json();
    return {
      username: data.display_name || data.id,
      isAuthenticated: true,
    };
  }

  private storeTokens(tokens: SpotifyTokens): void {
    localStorage.setItem("spotify_tokens", JSON.stringify(tokens));
  }

  private getStoredTokens(): SpotifyTokens | null {
    const stored = localStorage.getItem("spotify_tokens");
    return stored ? JSON.parse(stored) : null;
  }

  private clearStoredTokens(): void {
    localStorage.removeItem("spotify_tokens");
  }

  private isTokenValid(tokens: SpotifyTokens): boolean {
    return Date.now() < tokens.expires_at - 60000; // 1 minute buffer
  }
}

// === API SERVICE ===

class SpotifyApiServiceClass {
  private static instance: SpotifyApiServiceClass;
  private authService: AuthService;

  constructor() {
    this.authService = AuthService.getInstance();
  }

  static getInstance(): SpotifyApiServiceClass {
    if (!SpotifyApiServiceClass.instance) {
      SpotifyApiServiceClass.instance = new SpotifyApiServiceClass();
    }
    return SpotifyApiServiceClass.instance;
  }

  async searchTracks(
    query: string,
    limit: number = 20,
  ): Promise<SpotifySearchResult> {
    const accessToken = await this.authService.getValidAccessToken();
    if (!accessToken) {
      throw new Error("No valid access token available");
    }

    const response = await fetch(
      `https://api.spotify.com/v1/search?${new URLSearchParams({
        q: query,
        type: "track",
        limit: limit.toString(),
      })}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    const tracks = data.tracks.items.map(this.transformTrack);

    return {
      tracks,
      query,
      count: tracks.length,
    };
  }

  async getWeatherRecommendations(
    request: WeatherRecommendationRequest,
  ): Promise<WeatherRecommendationResponse> {
    const accessToken = await this.authService.getValidAccessToken();
    if (!accessToken) {
      throw new Error("No valid access token available");
    }

    const seedGenres = this.getGenresForWeather(request.weather_condition);
    const audioFeatures = this.getAudioFeaturesForWeather(
      request.weather_condition,
    );

    const params = new URLSearchParams({
      seed_genres: seedGenres.slice(0, 3).join(","),
      limit: (request.limit || 20).toString(),
      target_valence: audioFeatures.valence?.toString() || "0.5",
      target_energy: audioFeatures.energy?.toString() || "0.5",
      target_danceability: audioFeatures.danceability?.toString() || "0.5",
    });

    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Recommendations failed: ${response.statusText}`);
    }

    const data = await response.json();
    const tracks = data.tracks.map(this.transformTrack);

    return {
      tracks,
      weather_condition: request.weather_condition,
      temperature: request.temperature,
      time_of_day: request.time_of_day || "day",
      count: tracks.length,
    };
  }

  async getTrackById(trackId: string): Promise<TrackMetadata | null> {
    const accessToken = await this.authService.getValidAccessToken();
    if (!accessToken) {
      throw new Error("No valid access token available");
    }
    const response = await fetch(
      `https://api.spotify.com/v1/tracks/${trackId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to get track: ${response.statusText}`);
    }
    const track = await response.json();
    return this.transformTrack(track);
  }

  private transformTrack(spotifyTrack: SpotifyTrack): TrackMetadata {
    return {
      id: spotifyTrack.id,
      title: spotifyTrack.name,
      artist: spotifyTrack.artists.map((artist) => artist.name).join(", "),
      albumArt: spotifyTrack.album.images[0]?.url || "",
    };
  }

  private getGenresForWeather(condition: string): string[] {
    const weatherGenres: Record<string, string[]> = {
      clear: ["pop", "indie-pop", "tropical", "summer", "funk"],
      rain: ["jazz", "blues", "indie", "acoustic", "ambient"],
      snow: ["classical", "ambient", "folk", "indie-folk", "piano"],
      cloudy: ["indie", "alternative", "rock", "folk"],
      fog: ["ambient", "electronic", "downtempo", "chillout"],
    };

    return weatherGenres[condition] || weatherGenres.clear;
  }

  private getAudioFeaturesForWeather(condition: string) {
    interface AudioFeatureValues {
      valence: number;
      energy: number;
      danceability: number;
    }

    const weatherFeatures: Record<string, AudioFeatureValues> = {
      clear: { valence: 0.8, energy: 0.7, danceability: 0.7 },
      rain: { valence: 0.3, energy: 0.4, danceability: 0.3 },
      snow: { valence: 0.4, energy: 0.3, danceability: 0.2 },
      cloudy: { valence: 0.5, energy: 0.5, danceability: 0.5 },
      fog: { valence: 0.3, energy: 0.2, danceability: 0.3 },
    };

    return weatherFeatures[condition] || weatherFeatures.clear;
  }
}

// === EXPORTS ===

export const authService = AuthService.getInstance();
export const spotifyApiService = SpotifyApiServiceClass.getInstance();

// Legacy exports for compatibility
export { SpotifyApiServiceClass as SpotifyApiService };
export { SpotifyApiServiceClass as FrontendSpotifyApiService };
