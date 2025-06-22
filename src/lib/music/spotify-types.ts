/**
 * Spotify types for authentication and API
 * Single source of truth for all Spotify-related interfaces
 */

import type { TrackMetadata } from "@/types/queue-types";

// Authentication types
export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string }>;
}

export interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface AuthState {
  user: SpotifyUser | null;
  isLoading: boolean;
  error: string | null;
}

// API types
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
}

export interface WeatherRecommendationResponse {
  tracks: TrackMetadata[];
  weather_condition: string;
  temperature: number;
  time_of_day: string;
  count: number;
}

// Re-export TrackMetadata for convenience
export type { TrackMetadata };
