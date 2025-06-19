import type { TrackMetadata } from "@/types/queue";
import { SpotifyApiService } from "@/lib/spotifyApiService";

/**
 * Advanced Weather Music Service - Phase 2 Implementation
 * Uses only live Spotify API, no local tracks.json fallback
 */
export class AdvancedWeatherMusicService {
  /**
   * Generate queue based on current weather conditions using only Spotify API
   */
  static async generateWeatherBasedQueue(
    temperature: number,
    condition: string,
    timeOfDay: "morning" | "afternoon" | "evening" | "night" = "afternoon",
    maxTracks: number = 12,
  ): Promise<string[]> {
    try {
      // Get live Spotify recommendations
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

      // If no tracks returned, try a more generic search
      const fallbackTracks = await SpotifyApiService.searchTracks(
        this.getWeatherSearchQuery(condition, timeOfDay),
        maxTracks,
      );

      return fallbackTracks.map((track) => track.id);
    } catch (error) {
      console.error("Failed to generate weather-based queue:", error);
      throw new Error("Unable to generate queue - Spotify API unavailable");
    }
  }

  /**
   * Generate an adaptive playlist with smooth transitions
   */
  static async generateAdaptivePlaylist(
    temperature: number,
    condition: string,
    timeOfDay: "morning" | "afternoon" | "evening" | "night" = "afternoon",
    durationMinutes: number = 60,
  ): Promise<TrackMetadata[]> {
    try {
      const tracks = await SpotifyApiService.getAdaptivePlaylist(
        condition,
        temperature,
        timeOfDay,
        durationMinutes,
      );

      return tracks;
    } catch (error) {
      console.error("Failed to generate adaptive playlist:", error);
      // Fallback to regular recommendations
      const trackIds = await this.generateWeatherBasedQueue(
        temperature,
        condition,
        timeOfDay,
        Math.floor(durationMinutes / 3), // Estimate tracks needed
      );

      // Convert track IDs to metadata
      const trackPromises = trackIds.map(async (id) => {
        try {
          return await SpotifyApiService.getTrackById(id);
        } catch {
          return null;
        }
      });

      const tracks = await Promise.all(trackPromises);
      return tracks.filter((track): track is TrackMetadata => track !== null);
    }
  }

  /**
   * Get mood-based recommendations using Spotify search
   */
  static async getMoodBasedTracks(
    mood: string,
    limit: number = 20,
  ): Promise<TrackMetadata[]> {
    try {
      const searchQuery = this.getMoodSearchQuery(mood);
      return await SpotifyApiService.searchTracks(searchQuery, limit);
    } catch (error) {
      console.error("Failed to get mood-based tracks:", error);
      return [];
    }
  }

  /**
   * Get similar tracks to the current playing track
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
   * Generate search query based on weather condition
   */
  private static getWeatherSearchQuery(
    condition: string,
    timeOfDay: string,
  ): string {
    const weatherQueries: Record<string, string[]> = {
      sunny: ["summer", "upbeat", "happy", "energetic"],
      clear: ["bright", "positive", "cheerful"],
      rainy: ["chill", "indie", "acoustic", "mellow"],
      rain: ["relaxing", "ambient", "soft"],
      cloudy: ["indie", "alternative", "contemplative"],
      overcast: ["moody", "atmospheric"],
      thunderstorm: ["intense", "dramatic", "powerful"],
      storm: ["electronic", "energetic", "dynamic"],
      snow: ["peaceful", "acoustic", "winter"],
      snowy: ["cozy", "warm", "folk"],
      fog: ["ambient", "ethereal", "dreamy"],
      foggy: ["mysterious", "atmospheric"],
    };

    const timeQueries: Record<string, string[]> = {
      morning: ["wake up", "coffee", "fresh start"],
      afternoon: ["productive", "energetic"],
      evening: ["wind down", "relaxing"],
      night: ["chill", "ambient", "peaceful"],
    };

    const weatherKeywords = weatherQueries[condition.toLowerCase()] || [
      "music",
    ];
    const timeKeywords = timeQueries[timeOfDay] || [];

    // Combine weather and time keywords
    const allKeywords = [...weatherKeywords, ...timeKeywords];
    return allKeywords[Math.floor(Math.random() * allKeywords.length)];
  }

  /**
   * Generate search query based on mood
   */
  private static getMoodSearchQuery(mood: string): string {
    const moodQueries: Record<string, string> = {
      happy: "upbeat energetic positive",
      sad: "melancholy emotional slow",
      energetic: "high energy dance electronic",
      calm: "peaceful relaxing ambient",
      romantic: "love romantic slow",
      focused: "instrumental ambient study",
      party: "dance party upbeat",
      workout: "high energy motivational",
      chill: "chill relaxing indie",
      nostalgic: "nostalgic throwback classic",
    };

    return moodQueries[mood.toLowerCase()] || mood;
  }

  /**
   * Get personalized recommendations based on weather and user preferences
   */
  static async getPersonalizedRecommendations(
    temperature: number,
    condition: string,
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
      console.error("Failed to get personalized recommendations:", error);
      // Fallback to search-based recommendations
      const searchQuery = this.getWeatherSearchQuery(condition, timeOfDay);
      return await SpotifyApiService.searchTracks(searchQuery, limit);
    }
  }

  /**
   * Record user interaction for learning
   */
  static async recordUserInteraction(
    trackId: string,
    interactionType: "like" | "dislike" | "skip" | "replay" | "play_complete",
    context: {
      weather_condition?: string;
      temperature?: number;
      time_of_day?: string;
    } = {},
  ): Promise<void> {
    try {
      await SpotifyApiService.recordInteraction(
        trackId,
        interactionType,
        context,
      );
    } catch (error) {
      console.error("Failed to record user interaction:", error);
      // Don't throw error - interaction recording is not critical
    }
  }
}
