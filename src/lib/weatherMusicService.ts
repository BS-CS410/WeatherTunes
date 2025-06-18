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
    // Map weather conditions to music tags that actually exist in tracks.json
    const weatherTagMap: Record<string, string[]> = {
      clear: ["sunny", "happy", "pop", "upbeat pop", "feel good hits"],
      sunny: ["sunny", "happy", "pop", "upbeat pop", "feel good hits"],
      "partly-cloudy": ["chill", "indie", "pop"],
      cloudy: ["chill", "indie", "pop", "relax"],
      overcast: ["chill", "indie", "pop", "relax"],
      rain: ["rainy", "chill", "relax", "rainy night jazz", "soft rain indie"],
      drizzle: ["rainy", "chill", "relax", "rainy night jazz"],
      thunderstorm: [
        "intense",
        "storm",
        "dramatic",
        "electronic",
        "stormy vibes",
      ],
      snow: ["acoustic", "winter", "chill", "cozy", "indie"],
      fog: ["chill", "ambient", "relax"],
      mist: ["chill", "ambient", "relax"],
    };

    // Map temperature ranges to mood modifiers using actual tags
    const tempMoodMap = (temp: number): string[] => {
      if (temp < 0) return ["winter", "acoustic", "chill"];
      if (temp < 10) return ["chill", "indie"];
      if (temp < 20) return ["indie", "acoustic", "pop"];
      if (temp < 30) return ["pop", "upbeat pop", "happy"];
      return ["sunny", "dance", "party hits", "summer dance"];
    };

    // Map time of day to additional tags using actual tags
    const timeTagMap: Record<string, string[]> = {
      morning: ["fresh pop", "upbeat pop", "happy"],
      afternoon: ["pop", "upbeat pop", "sunny"],
      evening: ["sunset pop", "beach chill", "chill"],
      night: ["late night summer vibes", "rainy night jazz", "dreamy beats"],
    };

    // Combine all tags
    const weatherTags = weatherTagMap[condition.toLowerCase()] || [
      "pop",
      "chill",
    ];
    const tempTags = tempMoodMap(temperature);
    const timeTags = timeTagMap[timeOfDay];

    const allTags = [...weatherTags, ...tempTags, ...timeTags];

    // Generate queue based on combined tags with improved fallback
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
      clear: ["sunny", "happy", "pop"],
      sunny: ["sunny", "happy", "pop"],
      rain: ["rainy", "chill", "relax"],
      cloudy: ["chill", "indie"],
      snow: ["acoustic", "winter", "chill"],
      storm: ["intense", "storm", "dramatic"],
    };

    const weatherTags = weatherTagMap[condition.toLowerCase()] || ["pop"];

    // Add temperature-based tags using actual tags from tracks.json
    if (temperature > 25) weatherTags.push("sunny", "dance", "party hits");
    else if (temperature < 5) weatherTags.push("winter", "acoustic", "chill");

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
      seasonalTags = ["fresh pop", "upbeat pop", "happy", "indie"];
    } else if (month >= 5 && month <= 7) {
      // Summer (June-August)
      seasonalTags = [
        "sunny",
        "dance",
        "party hits",
        "summer dance",
        "upbeat pop",
      ];
    } else if (month >= 8 && month <= 10) {
      // Fall (September-November)
      seasonalTags = ["chill", "indie", "acoustic"];
    } else {
      // Winter (December-February)
      seasonalTags = ["acoustic", "winter", "chill"];
    }

    return QueueManager.generateMoodQueue(seasonalTags, maxTracks);
  }
}
