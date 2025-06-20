/**
 * Service for live Spotify API integration
 * Handles search, recommendations, and weather-based music discovery
 */

import { apiClient } from "./api-client";
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
}

export interface WeatherRecommendationResponse {
  tracks: TrackMetadata[];
  weather_condition: string;
  temperature: number;
  time_of_day: string;
  count: number;
}

/**
 * Service for live Spotify API integration
 */
export class SpotifyApiService {
  /**
   * Search for tracks on Spotify
   */
  static async searchTracks(
    query: string,
    limit: number = 10,
  ): Promise<TrackMetadata[]> {
    try {
      const response = await apiClient.get<SpotifySearchResult>(
        `/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      );

      return response.data.tracks || [];
    } catch (error) {
      console.error("Spotify search failed:", error);
      return [];
    }
  }

  /**
   * Get weather-based music recommendations from Spotify
   */
  static async getWeatherRecommendations(
    request: WeatherRecommendationRequest,
  ): Promise<TrackMetadata[]> {
    try {
      const response = await apiClient.post<WeatherRecommendationResponse>(
        "/recommendations/weather",
        request,
      );

      return response.data.tracks || [];
    } catch (error) {
      console.error("Weather recommendations failed:", error);
      return [];
    }
  }

  /**
   * Get recommendations for current weather conditions with optional time override
   */
  static async getRecommendationsForCurrentWeather(
    weatherCondition: string,
    temperature: number,
    limit: number = 20,
    timeOfDay?: "morning" | "afternoon" | "evening" | "night",
  ): Promise<TrackMetadata[]> {
    const currentHour = new Date().getHours();
    let calculatedTimeOfDay: "morning" | "afternoon" | "evening" | "night";

    if (currentHour >= 6 && currentHour < 12) calculatedTimeOfDay = "morning";
    else if (currentHour >= 12 && currentHour < 17)
      calculatedTimeOfDay = "afternoon";
    else if (currentHour >= 17 && currentHour < 21)
      calculatedTimeOfDay = "evening";
    else calculatedTimeOfDay = "night";

    return this.getWeatherRecommendations({
      weather_condition: weatherCondition.toLowerCase(),
      temperature,
      time_of_day: timeOfDay || calculatedTimeOfDay,
      limit,
    });
  }

  /**
   * Get personalized weather recommendations
   */
  static async getPersonalizedWeatherRecommendations(
    weatherCondition: string,
    temperature: number,
    timeOfDay: "morning" | "afternoon" | "evening" | "night" = "afternoon",
    limit: number = 20,
  ): Promise<TrackMetadata[]> {
    return this.getWeatherRecommendations({
      weather_condition: weatherCondition.toLowerCase(),
      temperature,
      time_of_day: timeOfDay,
      limit,
    });
  }

  /**
   * Get an adaptive playlist with smooth transitions
   */
  static async getAdaptivePlaylist(
    weatherCondition: string,
    temperature: number,
    timeOfDay: "morning" | "afternoon" | "evening" | "night" = "afternoon",
    durationMinutes: number = 60,
  ): Promise<TrackMetadata[]> {
    try {
      const response = await apiClient.post<{ playlist: TrackMetadata[] }>(
        "/playlist/adaptive",
        {
          weather_condition: weatherCondition.toLowerCase(),
          temperature,
          time_of_day: timeOfDay,
          duration_minutes: durationMinutes,
        },
      );

      return response.data.playlist || [];
    } catch (error) {
      console.error("Adaptive playlist failed:", error);
      return [];
    }
  }

  /**
   * Get track metadata by Spotify ID
   */
  static async getTrackById(trackId: string): Promise<TrackMetadata | null> {
    try {
      const response = await apiClient.get<{ track: TrackMetadata }>(
        `/spotify/track/${trackId}`,
        { credentials: "include" },
      );
      return response.data.track;
    } catch (error) {
      console.error(`Failed to fetch track ${trackId}:`, error);
      return null;
    }
  }

  /**
   * Get multiple tracks by their Spotify IDs
   */
  static async getTracksByIds(trackIds: string[]): Promise<TrackMetadata[]> {
    try {
      if (trackIds.length === 0) return [];

      const response = await apiClient.post<{ tracks: TrackMetadata[] }>(
        `/spotify/tracks`,
        { track_ids: trackIds },
        { credentials: "include" },
      );
      return response.data.tracks || [];
    } catch (error) {
      console.error("Failed to fetch tracks:", error);
      return [];
    }
  }

  /**
   * Get similar tracks to a given track
   */
  static async getSimilarTracks(
    trackId: string,
    limit: number = 10,
  ): Promise<TrackMetadata[]> {
    try {
      // For now, use a simple search approach
      // In a full implementation, this would use Spotify's recommendation API with track seeds
      const track = await this.getTrackById(trackId);
      if (track) {
        const searchQuery = `${track.artist} ${track.title}`;
        const results = await this.searchTracks(searchQuery, limit + 5);
        // Remove the original track and return similar ones
        return results.filter((t) => t.id !== trackId).slice(0, limit);
      }
      return [];
    } catch (error) {
      console.error("Failed to get similar tracks:", error);
      return [];
    }
  }

  /**
   * Record user interaction for learning
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
      await apiClient.post("/interactions", {
        track_id: trackId,
        interaction_type: interactionType,
        context,
      });
    } catch (error) {
      console.error("Failed to record interaction:", error);
      // Don't throw - interaction recording is not critical
    }
  }
}
