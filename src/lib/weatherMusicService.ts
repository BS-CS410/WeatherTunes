import type { TrackMetadata } from "@/types/queue";
import { SpotifyApiService } from "@/lib/spotifyApiService";

/**
 * Service for integrating weather conditions with music queue generation
 * Uses Spotify API with mood-based weather matching
 */
export class WeatherMusicService {
  /**
   * Generate queue based on current weather conditions using Spotify API
   */
  static async generateWeatherBasedQueue(
    temperature: number,
    condition: string,
    timeOfDay: "morning" | "afternoon" | "evening" | "night" = "afternoon",
    maxTracks: number = 12,
  ): Promise<string[]> {
    try {
      // Get weather-based recommendations from Spotify API
      const spotifyTracks =
        await SpotifyApiService.getRecommendationsForCurrentWeather(
          condition,
          temperature,
          maxTracks,
          timeOfDay,
        );

      if (spotifyTracks.length > 0) {
        console.log(
          `Generated ${spotifyTracks.length} tracks from Spotify API for ${condition} weather`,
        );
        return spotifyTracks.map((track) => track.id);
      }

      // If no tracks found, return empty array
      console.warn(
        `No tracks found for ${condition} weather at ${temperature}°C`,
      );
      return [];
    } catch (error) {
      console.error("Failed to generate weather-based queue:", error);
      return [];
    }
  }

  /**
   * Get multiple tracks by their IDs from Spotify
   */
  static async getTracksByIds(trackIds: string[]): Promise<TrackMetadata[]> {
    if (trackIds.length === 0) return [];

    try {
      return await SpotifyApiService.getTracksByIds(trackIds);
    } catch (error) {
      console.error("Failed to fetch tracks by IDs:", error);
      return [];
    }
  }

  /**
   * Get similar tracks to a given track using Spotify
   */
  static async getSimilarTracks(
    trackId: string,
    limit: number = 10,
  ): Promise<TrackMetadata[]> {
    try {
      return await SpotifyApiService.getSimilarTracks(trackId, limit);
    } catch (error) {
      console.error("Failed to get similar tracks:", error);
      return [];
    }
  }

  /**
   * Search for tracks on Spotify
   */
  static async searchTracks(
    query: string,
    limit: number = 10,
  ): Promise<TrackMetadata[]> {
    try {
      return await SpotifyApiService.searchTracks(query, limit);
    } catch (error) {
      console.error("Failed to search tracks:", error);
      return [];
    }
  }

  /**
   * Get personalized weather recommendations
   */
  static async getPersonalizedWeatherRecommendations(
    condition: string,
    temperature: number,
    timeOfDay: "morning" | "afternoon" | "evening" | "night" = "afternoon",
    limit: number = 20,
  ): Promise<TrackMetadata[]> {
    try {
      return await SpotifyApiService.getPersonalizedWeatherRecommendations(
        condition,
        temperature,
        timeOfDay,
        limit,
      );
    } catch (error) {
      console.error(
        "Failed to get personalized weather recommendations:",
        error,
      );
      return [];
    }
  }

  /**
   * Get available weather conditions supported by the system
   */
  static getAvailableWeatherConditions(): string[] {
    return [
      "sunny",
      "clear",
      "partly cloudy",
      "cloudy",
      "overcast",
      "rainy",
      "rain",
      "drizzle",
      "thunderstorm",
      "storm",
      "snow",
      "snowy",
      "fog",
      "foggy",
      "mist",
      "haze",
    ];
  }

  /**
   * Get recommended queue size based on conditions
   */
  static getRecommendedQueueSize(condition: string, timeOfDay: string): number {
    // Longer queues for chill/background conditions
    const chillConditions = ["rain", "drizzle", "fog", "mist", "snow"];
    const isChillCondition = chillConditions.includes(condition.toLowerCase());

    // Evening/night tend to be longer listening sessions
    const isLongSession = ["evening", "night"].includes(timeOfDay);

    if (isChillCondition || isLongSession) {
      return 20; // Longer queue
    }

    return 12; // Standard queue
  }
}
