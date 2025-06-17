import type { TrackMetadata } from "@/types/queue";
import { QueueManager } from "@/lib/queueManager";
import { TracksManager } from "@/lib/tracksManager";

/**
 * Service for integrating weather conditions with music queue generation
 */
export class WeatherMusicService {
  /**
   * Generate queue based on current weather conditions
   */
  static generateWeatherBasedQueue(
    temperature: number,
    condition: string,
    timeOfDay: "morning" | "afternoon" | "evening" | "night" = "afternoon",
    maxTracks: number = 12,
  ): string[] {
    // Map weather conditions to music tags
    const weatherTagMap: Record<string, string[]> = {
      clear: ["sunny", "happy", "upbeat", "feel good"],
      sunny: ["sunny", "happy", "upbeat", "feel good"],
      "partly-cloudy": ["mellow", "indie", "chill"],
      cloudy: ["cloudy", "mellow", "indie", "lo-fi"],
      overcast: ["cloudy", "mellow", "indie", "lo-fi"],
      rain: ["rainy", "chill", "sleepy", "soft"],
      drizzle: ["rainy", "chill", "sleepy", "soft"],
      thunderstorm: ["storm", "intense", "dramatic"],
      snow: ["snowy", "acoustic", "winter", "cozy"],
      fog: ["mellow", "ambient", "chill"],
      mist: ["mellow", "ambient", "chill"],
    };

    // Map temperature ranges to mood modifiers
    const tempMoodMap = (temp: number): string[] => {
      if (temp < 0) return ["winter", "cozy", "acoustic"];
      if (temp < 10) return ["cool", "mellow", "indie"];
      if (temp < 20) return ["mild", "indie", "acoustic"];
      if (temp < 30) return ["warm", "upbeat", "happy"];
      return ["hot", "summer", "dance", "tropical"];
    };

    // Map time of day to additional tags
    const timeTagMap: Record<string, string[]> = {
      morning: ["morning", "fresh", "upbeat"],
      afternoon: ["bright", "energetic"],
      evening: ["sunset", "mellow", "chill"],
      night: ["nighttime", "lo-fi", "ambient"],
    };

    // Combine all tags
    const weatherTags = weatherTagMap[condition.toLowerCase()] || ["mellow"];
    const tempTags = tempMoodMap(temperature);
    const timeTags = timeTagMap[timeOfDay];

    const allTags = [...weatherTags, ...tempTags, ...timeTags];

    // Generate queue based on combined tags
    return QueueManager.generateMoodQueue(allTags, maxTracks);
  }

  /**
   * Get recommended weather-based tracks for current conditions
   */
  static getWeatherRecommendations(
    temperature: number,
    condition: string,
    currentTrack?: TrackMetadata,
  ): TrackMetadata[] {
    if (currentTrack?.tags) {
      // If we have a current track, get similar tracks with weather influence
      const weatherTags = this.getWeatherTags(condition, temperature);
      const combinedTags = [...currentTrack.tags, ...weatherTags];
      const trackIds = QueueManager.generateMoodQueue(combinedTags, 8);
      return TracksManager.getTracksByIds(trackIds);
    }

    // Otherwise generate purely weather-based recommendations
    const trackIds = this.generateWeatherBasedQueue(
      temperature,
      condition,
      "afternoon",
      8,
    );
    return TracksManager.getTracksByIds(trackIds);
  }

  /**
   * Generate a dynamic queue that changes throughout the day
   */
  static generateDynamicDayQueue(
    temperature: number,
    condition: string,
    maxTracks: number = 15,
  ): string[] {
    const currentHour = new Date().getHours();
    let timeOfDay: "morning" | "afternoon" | "evening" | "night";

    if (currentHour >= 6 && currentHour < 12) timeOfDay = "morning";
    else if (currentHour >= 12 && currentHour < 17) timeOfDay = "afternoon";
    else if (currentHour >= 17 && currentHour < 21) timeOfDay = "evening";
    else timeOfDay = "night";

    return this.generateWeatherBasedQueue(
      temperature,
      condition,
      timeOfDay,
      maxTracks,
    );
  }

  /**
   * Helper to get weather-specific tags
   */
  private static getWeatherTags(
    condition: string,
    temperature: number,
  ): string[] {
    const weatherTagMap: Record<string, string[]> = {
      clear: ["sunny", "bright"],
      sunny: ["sunny", "bright"],
      rain: ["rainy", "wet"],
      cloudy: ["cloudy", "overcast"],
      snow: ["snowy", "cold"],
      storm: ["stormy", "intense"],
    };

    const weatherTags = weatherTagMap[condition.toLowerCase()] || [];

    // Add temperature-based tags
    if (temperature > 25) weatherTags.push("hot", "summer");
    else if (temperature < 5) weatherTags.push("cold", "winter");

    return weatherTags;
  }

  /**
   * Generate a seasonal queue based on current month
   */
  static generateSeasonalQueue(maxTracks: number = 12): string[] {
    const month = new Date().getMonth(); // 0-11

    let seasonalTags: string[];
    if (month >= 2 && month <= 4) {
      // Spring (March-May)
      seasonalTags = ["fresh", "upbeat", "bright", "indie"];
    } else if (month >= 5 && month <= 7) {
      // Summer (June-August)
      seasonalTags = ["summer", "sunny", "dance", "tropical", "upbeat"];
    } else if (month >= 8 && month <= 10) {
      // Fall (September-November)
      seasonalTags = ["mellow", "indie", "acoustic", "chill"];
    } else {
      // Winter (December-February)
      seasonalTags = ["cozy", "winter", "acoustic", "soft"];
    }

    return QueueManager.generateMoodQueue(seasonalTags, maxTracks);
  }
}
