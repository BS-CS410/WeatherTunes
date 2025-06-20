/**
 * Frontend-only Spotify API service
 * Direct Spotify API integration without backend proxy
 */

import { authService } from "./auth-frontend";
import type { TrackMetadata } from "@/types/queue-types";

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
  explicit: boolean;
  popularity: number;
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
    total: number;
  };
}

interface SpotifyTopTracksResponse {
  items: SpotifyTrack[];
}

interface SpotifyRecommendationsResponse {
  tracks: SpotifyTrack[];
}

/**
 * Frontend-only Spotify API service
 */
export class FrontendSpotifyApiService {
  private static instance: FrontendSpotifyApiService;

  static getInstance(): FrontendSpotifyApiService {
    if (!FrontendSpotifyApiService.instance) {
      FrontendSpotifyApiService.instance = new FrontendSpotifyApiService();
    }
    return FrontendSpotifyApiService.instance;
  }

  /**
   * Search for tracks on Spotify
   */
  static async searchTracks(
    query: string,
    limit: number = 20,
  ): Promise<SpotifySearchResult> {
    try {
      const searchParams = new URLSearchParams({
        q: query,
        type: "track",
        limit: limit.toString(),
        market: "US",
      });

      const data = await authService.spotifyApiRequest<SpotifySearchResponse>(
        `/search?${searchParams}`,
      );

      const tracks = data.tracks.items.map(this.formatTrack);

      return {
        tracks,
        query,
        count: tracks.length,
      };
    } catch (error) {
      console.error("Failed to search tracks:", error);
      return {
        tracks: [],
        query,
        count: 0,
      };
    }
  }

  /**
   * Get track by ID
   */
  static async getTrackById(trackId: string): Promise<TrackMetadata | null> {
    try {
      const data = await authService.spotifyApiRequest<SpotifyTrack>(
        `/tracks/${trackId}`,
      );
      return this.formatTrack(data);
    } catch (error) {
      console.error("Failed to get track:", error);
      return null;
    }
  }

  /**
   * Get weather-based music recommendations
   */
  static async getWeatherRecommendations(
    request: WeatherRecommendationRequest,
  ): Promise<WeatherRecommendationResponse> {
    const {
      weather_condition,
      temperature,
      time_of_day = "afternoon",
      limit = 20,
      use_personalization = true,
    } = request;

    try {
      let tracks: TrackMetadata[] = [];

      if (use_personalization) {
        // Try personalized recommendations first
        const personalizedTracks =
          await this.getPersonalizedWeatherRecommendations(
            weather_condition,
            temperature,
            time_of_day,
            limit,
          );

        if (personalizedTracks.length > 0) {
          tracks = personalizedTracks;
        }
      }

      // Fallback to search-based recommendations
      if (tracks.length === 0) {
        tracks = await this.getSearchBasedRecommendations(
          weather_condition,
          temperature,
          time_of_day,
          limit,
        );
      }

      return {
        tracks,
        weather_condition,
        temperature,
        time_of_day,
        count: tracks.length,
      };
    } catch (error) {
      console.error("Failed to get weather recommendations:", error);
      return {
        tracks: [],
        weather_condition,
        temperature,
        time_of_day,
        count: 0,
      };
    }
  }

  /**
   * Get personalized recommendations using user's top tracks
   */
  private static async getPersonalizedWeatherRecommendations(
    weatherCondition: string,
    temperature: number,
    timeOfDay: string,
    limit: number,
  ): Promise<TrackMetadata[]> {
    try {
      // Get user's top tracks
      const topTracksData =
        await authService.spotifyApiRequest<SpotifyTopTracksResponse>(
          "/me/top/tracks?time_range=medium_term&limit=5",
        );

      if (topTracksData.items.length === 0) {
        return [];
      }

      // Use top tracks as seeds with weather-based audio features
      const moodMapping = this.getMoodMapping(
        weatherCondition,
        temperature,
        timeOfDay,
      );

      const params = new URLSearchParams({
        seed_tracks: topTracksData.items
          .slice(0, 3)
          .map((t) => t.id)
          .join(","),
        limit: limit.toString(),
        market: "US",
        target_valence: (
          (moodMapping.valence_range[0] + moodMapping.valence_range[1]) /
          2
        ).toString(),
        target_energy: (moodMapping.energy_level === "high"
          ? 0.8
          : moodMapping.energy_level === "medium"
            ? 0.5
            : 0.2
        ).toString(),
      });

      const data =
        await authService.spotifyApiRequest<SpotifyRecommendationsResponse>(
          `/recommendations?${params}`,
        );

      return data.tracks.map(this.formatTrack);
    } catch (error) {
      console.error("Failed to get personalized recommendations:", error);
      return [];
    }
  }

  /**
   * Get search-based recommendations
   */
  private static async getSearchBasedRecommendations(
    weatherCondition: string,
    temperature: number,
    timeOfDay: string,
    limit: number,
  ): Promise<TrackMetadata[]> {
    const moodMapping = this.getMoodMapping(
      weatherCondition,
      temperature,
      timeOfDay,
    );

    // Build search query based on mood
    const genreQueries = moodMapping.mood_tags
      .map((tag) => `genre:${tag}`)
      .join(" OR ");
    const query = `(${genreQueries}) year:2020-2024`;

    const result = await this.searchTracks(query, limit);
    return result.tracks;
  }

  /**
   * Get user's music profile
   */
  static async getUserMusicProfile(): Promise<
    UserMusicPreferences | undefined
  > {
    try {
      // Get top artists for genres
      const topArtistsData = await authService.spotifyApiRequest<{
        items: Array<{ name: string; genres: string[] }>;
      }>("/me/top/artists?time_range=medium_term&limit=20");

      // Extract genres and artists
      const genres = new Set<string>();
      const artists: string[] = [];

      topArtistsData.items.forEach((artist) => {
        artists.push(artist.name);
        artist.genres.forEach((genre) => genres.add(genre));
      });

      return {
        preferred_genres: Array.from(genres).slice(0, 10),
        preferred_artists: artists.slice(0, 10),
        audio_feature_preferences: {
          valence: 0.5, // Default values - could be calculated from user's tracks
          energy: 0.5,
          danceability: 0.5,
          acousticness: 0.5,
        },
        explicit_content: false,
      };
    } catch (error) {
      console.warn("Failed to fetch user music profile:", error);
      return undefined;
    }
  }

  /**
   * Record user interaction (simplified - could be stored locally)
   */
  static async recordInteraction(
    trackId: string,
    interactionType: "like" | "dislike" | "skip" | "replay" | "play_complete",
    context: {
      weather_condition?: string;
      temperature?: number;
      time_of_day?: string;
    } = {},
  ): Promise<void> {
    try {
      // Store interaction locally for future personalization
      const interactions = JSON.parse(
        localStorage.getItem("music_interactions") || "[]",
      );
      interactions.push({
        trackId,
        interactionType,
        context,
        timestamp: Date.now(),
      });

      // Keep only last 1000 interactions
      if (interactions.length > 1000) {
        interactions.splice(0, interactions.length - 1000);
      }

      localStorage.setItem("music_interactions", JSON.stringify(interactions));
    } catch (error) {
      console.error("Failed to record interaction:", error);
      // Don't throw - interaction recording is not critical
    }
  }

  /**
   * Format Spotify track to TrackMetadata
   */
  private static formatTrack(track: SpotifyTrack): TrackMetadata {
    return {
      id: track.id,
      title: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      albumArt: track.album.images[0]?.url || "",
    };
  }

  /**
   * Map weather conditions to musical moods
   */
  private static getMoodMapping(
    weatherCondition: string,
    temperature: number,
    timeOfDay: string,
  ) {
    const weatherMappings = {
      clear: {
        mood_tags: ["pop", "indie", "folk"],
        energy_level: "high" as const,
        valence_range: [0.6, 0.9] as [number, number],
      },
      rain: {
        mood_tags: ["jazz", "blues", "ambient"],
        energy_level: "low" as const,
        valence_range: [0.2, 0.5] as [number, number],
      },
      snow: {
        mood_tags: ["classical", "ambient", "indie"],
        energy_level: "low" as const,
        valence_range: [0.3, 0.6] as [number, number],
      },
      clouds: {
        mood_tags: ["indie", "alternative", "chill"],
        energy_level: "medium" as const,
        valence_range: [0.4, 0.7] as [number, number],
      },
      fog: {
        mood_tags: ["ambient", "electronic", "downtempo"],
        energy_level: "low" as const,
        valence_range: [0.2, 0.5] as [number, number],
      },
    };

    const timeModifiers = {
      morning: { energy_boost: 0.2, valence_boost: 0.1 },
      afternoon: { energy_boost: 0.1, valence_boost: 0.0 },
      evening: { energy_boost: -0.1, valence_boost: -0.1 },
      night: { energy_boost: -0.2, valence_boost: -0.2 },
    };

    const base =
      weatherMappings[
        weatherCondition.toLowerCase() as keyof typeof weatherMappings
      ] || weatherMappings["clear"];
    const timeModifier =
      timeModifiers[timeOfDay as keyof typeof timeModifiers] ||
      timeModifiers["afternoon"];

    return {
      ...base,
      weather_condition: weatherCondition,
      temperature_range: [temperature - 10, temperature + 10] as [
        number,
        number,
      ],
      time_of_day: timeOfDay,
      // Apply time-based modifications to energy and valence
      energy_level: base.energy_level,
      valence_range: [
        Math.max(0, base.valence_range[0] + (timeModifier?.valence_boost || 0)),
        Math.min(1, base.valence_range[1] + (timeModifier?.valence_boost || 0)),
      ] as [number, number],
    };
  }
}

export const spotifyApiService = FrontendSpotifyApiService.getInstance();
