import type { TrackMetadata } from "@/types/queue-types";
import tracksData from "./music-tracks.json";
import { SpotifyApiService } from "./spotify-api-service";

/**
 * Consolidated music utilities for track management and queue generation
 */

// === WEATHER-TO-MUSIC MAPPING ===

export interface AudioFeatures {
  valence?: number; // 0.0-1.0 (sadness-happiness)
  energy?: number; // 0.0-1.0 (low-high energy)
  danceability?: number; // 0.0-1.0 (less-more danceable)
  acousticness?: number; // 0.0-1.0 (electric-acoustic)
  instrumentalness?: number; // 0.0-1.0 (vocal-instrumental)
  tempo?: number; // BPM range
}

export interface WeatherMusicMapping {
  genres: string[];
  audioFeatures: AudioFeatures;
  seedKeywords: string[];
}

class WeatherMusicMapper {
  private static readonly weatherMappings: Record<string, WeatherMusicMapping> =
    {
      // Clear/Sunny Weather
      "clear sky": {
        genres: ["pop", "indie-pop", "tropical", "summer", "funk"],
        audioFeatures: {
          valence: 0.7, // High happiness
          energy: 0.8, // High energy
          danceability: 0.7, // Danceable
          acousticness: 0.3, // More electric
          tempo: 120, // Upbeat tempo
        },
        seedKeywords: ["happy", "upbeat", "sunny", "bright", "energetic"],
      },
      sunny: {
        genres: ["pop", "reggae", "tropical", "beach", "surf"],
        audioFeatures: {
          valence: 0.8,
          energy: 0.7,
          danceability: 0.8,
          acousticness: 0.4,
          tempo: 115,
        },
        seedKeywords: ["sunshine", "beach", "summer", "warm", "tropical"],
      },

      // Cloudy Weather
      cloudy: {
        genres: ["indie", "alternative", "folk", "ambient", "chill"],
        audioFeatures: {
          valence: 0.5, // Neutral mood
          energy: 0.4, // Lower energy
          danceability: 0.4, // Less danceable
          acousticness: 0.6, // More acoustic
          tempo: 100, // Moderate tempo
        },
        seedKeywords: [
          "contemplative",
          "mellow",
          "cloudy",
          "overcast",
          "thoughtful",
        ],
      },
      "broken clouds": {
        genres: ["indie-rock", "alternative", "folk-rock", "ambient"],
        audioFeatures: {
          valence: 0.6,
          energy: 0.5,
          danceability: 0.5,
          acousticness: 0.5,
          tempo: 105,
        },
        seedKeywords: ["partly cloudy", "mixed", "changing", "dynamic"],
      },

      // Rainy Weather
      rain: {
        genres: ["jazz", "blues", "ambient", "neo-soul", "lo-fi"],
        audioFeatures: {
          valence: 0.3, // Lower happiness
          energy: 0.3, // Low energy
          danceability: 0.3, // Not very danceable
          acousticness: 0.7, // More acoustic
          instrumentalness: 0.4, // Some instrumental
          tempo: 80, // Slower tempo
        },
        seedKeywords: [
          "rain",
          "melancholy",
          "contemplative",
          "cozy",
          "introspective",
        ],
      },
      drizzle: {
        genres: ["ambient", "chillout", "downtempo", "indie-folk"],
        audioFeatures: {
          valence: 0.4,
          energy: 0.2,
          danceability: 0.2,
          acousticness: 0.8,
          instrumentalness: 0.5,
          tempo: 70,
        },
        seedKeywords: ["drizzle", "soft", "gentle", "peaceful", "calm"],
      },

      // Storm Weather
      thunderstorm: {
        genres: ["rock", "metal", "electronic", "dark-ambient", "industrial"],
        audioFeatures: {
          valence: 0.2, // Low happiness
          energy: 0.9, // Very high energy
          danceability: 0.6, // Moderately danceable
          acousticness: 0.1, // Very electric
          tempo: 140, // Fast tempo
        },
        seedKeywords: ["storm", "intense", "dramatic", "powerful", "electric"],
      },

      // Snow Weather
      snow: {
        genres: ["classical", "ambient", "folk", "winter", "acoustic"],
        audioFeatures: {
          valence: 0.6, // Peaceful happiness
          energy: 0.2, // Very low energy
          danceability: 0.2, // Not danceable
          acousticness: 0.9, // Very acoustic
          instrumentalness: 0.6, // More instrumental
          tempo: 60, // Very slow tempo
        },
        seedKeywords: ["snow", "winter", "peaceful", "serene", "crystalline"],
      },

      // Fog/Mist
      fog: {
        genres: ["ambient", "ethereal", "shoegaze", "dream-pop", "atmospheric"],
        audioFeatures: {
          valence: 0.4,
          energy: 0.3,
          danceability: 0.3,
          acousticness: 0.6,
          instrumentalness: 0.7, // More instrumental
          tempo: 85,
        },
        seedKeywords: [
          "fog",
          "mysterious",
          "ethereal",
          "atmospheric",
          "dreamy",
        ],
      },
      mist: {
        genres: ["ambient", "new-age", "chillout", "ethereal"],
        audioFeatures: {
          valence: 0.5,
          energy: 0.25,
          danceability: 0.25,
          acousticness: 0.7,
          instrumentalness: 0.8,
          tempo: 75,
        },
        seedKeywords: ["mist", "gentle", "soft", "floating", "serene"],
      },

      // Wind
      windy: {
        genres: ["folk", "indie", "acoustic", "singer-songwriter"],
        audioFeatures: {
          valence: 0.5,
          energy: 0.6,
          danceability: 0.4,
          acousticness: 0.7,
          tempo: 110,
        },
        seedKeywords: ["wind", "flowing", "movement", "dynamic", "natural"],
      },
    };

  /**
   * Get time-of-day adjustments for audio features
   */
  private static getTimeAdjustments(timeOfDay: string): Partial<AudioFeatures> {
    switch (timeOfDay) {
      case "morning":
        return { valence: 0.1, energy: 0.1, tempo: 10 }; // Slightly more positive and energetic
      case "afternoon":
        return { energy: 0.05, danceability: 0.05 }; // Peak energy time
      case "evening":
        return { valence: -0.05, energy: -0.1, acousticness: 0.1 }; // Winding down
      case "night":
        return { valence: -0.1, energy: -0.2, acousticness: 0.2, tempo: -20 }; // Calmer, more acoustic
      default:
        return {};
    }
  }

  /**
   * Get temperature adjustments for audio features
   */
  private static getTemperatureAdjustments(
    tempCelsius: number,
  ): Partial<AudioFeatures> {
    if (tempCelsius >= 25) {
      // Hot weather - more energetic, tropical
      return { valence: 0.1, energy: 0.1, danceability: 0.1, tempo: 10 };
    } else if (tempCelsius >= 15) {
      // Mild weather - no major adjustments
      return {};
    } else if (tempCelsius >= 0) {
      // Cold weather - more contemplative
      return { valence: -0.05, energy: -0.1, acousticness: 0.1, tempo: -10 };
    } else {
      // Very cold - much more contemplative and acoustic
      return { valence: -0.1, energy: -0.2, acousticness: 0.2, tempo: -20 };
    }
  }

  /**
   * Get Spotify recommendation parameters for weather conditions
   */
  static getRecommendationParams(
    weatherCondition: string,
    temperature: number = 20,
    timeOfDay: string = "afternoon",
  ): {
    genres: string[];
    audioFeatures: AudioFeatures;
    keywords: string[];
  } {
    const normalizedCondition = weatherCondition.toLowerCase().trim();

    // Find the best matching weather condition
    let mapping = this.weatherMappings[normalizedCondition];

    // Fallback to partial matches
    if (!mapping) {
      const conditionKey = Object.keys(this.weatherMappings).find(
        (key) =>
          normalizedCondition.includes(key) ||
          key.includes(normalizedCondition),
      );
      mapping = conditionKey
        ? this.weatherMappings[conditionKey]
        : this.weatherMappings["cloudy"];
    }

    // Apply time and temperature adjustments
    const timeAdjustments = this.getTimeAdjustments(timeOfDay);
    const tempAdjustments = this.getTemperatureAdjustments(temperature);

    const adjustedFeatures: AudioFeatures = { ...mapping.audioFeatures };

    // Apply adjustments with bounds checking
    Object.entries({ ...timeAdjustments, ...tempAdjustments }).forEach(
      ([key, adjustment]) => {
        const currentValue = adjustedFeatures[key as keyof AudioFeatures] || 0;
        if (key === "tempo") {
          adjustedFeatures[key as keyof AudioFeatures] = Math.max(
            50,
            Math.min(200, currentValue + adjustment),
          );
        } else {
          adjustedFeatures[key as keyof AudioFeatures] = Math.max(
            0,
            Math.min(1, currentValue + adjustment),
          );
        }
      },
    );

    return {
      genres: mapping.genres,
      audioFeatures: adjustedFeatures,
      keywords: mapping.seedKeywords,
    };
  }
}

// === TRACKS MANAGER ===

class TracksManager {
  private static tracks: Map<string, TrackMetadata> = new Map();

  static {
    // Initialize tracks map on module load for fallback
    tracksData.forEach((track) => {
      this.tracks.set(track.id, track as TrackMetadata);
    });
  }

  /**
   * Get track metadata by ID from local data
   */
  static getTrackById(id: string): TrackMetadata | null {
    return this.tracks.get(id) || null;
  }

  /**
   * Get multiple tracks by IDs
   */
  static getTracksByIds(ids: string[]): TrackMetadata[] {
    return ids
      .map((id) => this.getTrackById(id))
      .filter((track): track is TrackMetadata => track !== null);
  }

  /**
   * Search tracks by tags
   */
  static getTracksByTags(tags: string[]): TrackMetadata[] {
    return Array.from(this.tracks.values()).filter((track) => {
      // Skip tracks without tags
      if (!track.tags || track.tags.length === 0) {
        return false;
      }
      // Return tracks that have at least one matching tag
      return track.tags.some((tag) => tags.includes(tag));
    });
  }

  /**
   * Get all available tracks
   */
  static getAllTracks(): TrackMetadata[] {
    return Array.from(this.tracks.values());
  }

  /**
   * Get tracks suitable for weather conditions
   */
  static getTracksForWeather(condition: string): TrackMetadata[] {
    const weatherTags = this.getWeatherTags(condition.toLowerCase());
    return this.getTracksByTags(weatherTags);
  }

  /**
   * Map weather conditions to mood tags
   */
  private static getWeatherTags(condition: string): string[] {
    const weatherTagMap: Record<string, string[]> = {
      "clear sky": ["upbeat", "happy", "energetic"],
      sunny: ["upbeat", "happy", "energetic"],
      cloudy: ["chill", "contemplative"],
      rain: ["melancholic", "contemplative", "cozy"],
      storm: ["intense", "dramatic"],
      snow: ["peaceful", "cozy", "contemplative"],
      fog: ["mysterious", "atmospheric"],
      mist: ["mysterious", "atmospheric"],
    };

    return weatherTagMap[condition] || ["chill"];
  }

  /**
   * Get tracks by mood
   */
  static getTracksByMood(mood: string): TrackMetadata[] {
    const moodTags = [mood];
    return this.getTracksByTags(moodTags);
  }
}

// === QUEUE MANAGER ===

class QueueManager {
  /**
   * Generate a weather-based queue using Spotify recommendations
   */
  static async generateWeatherQueueDynamic(
    weatherCondition: string,
    temperature: number = 20,
    timeOfDay: string = "afternoon",
    maxTracks: number = 10,
  ): Promise<string[]> {
    try {
      // Use Spotify API to get weather-appropriate recommendations
      const tracks =
        await SpotifyApiService.getRecommendationsForCurrentWeather(
          weatherCondition,
          temperature,
          maxTracks,
          timeOfDay as "morning" | "afternoon" | "evening" | "night",
        );

      if (tracks.length > 0) {
        return tracks.map((track) => track.id);
      }

      // Fallback to local tracks if Spotify API fails
      console.warn(
        "Spotify recommendations failed, falling back to local tracks",
      );
      return this.generateWeatherQueueLocal(weatherCondition, maxTracks);
    } catch (error) {
      console.error("Failed to generate dynamic weather queue:", error);
      return this.generateWeatherQueueLocal(weatherCondition, maxTracks);
    }
  }

  /**
   * Generate a queue based on weather conditions (legacy/fallback method)
   */
  static generateWeatherQueueLocal(
    condition: string,
    maxTracks: number = 10,
  ): string[] {
    const tracks = TracksManager.getTracksForWeather(condition);

    // Shuffle and limit tracks
    const shuffled = this.shuffleArray([...tracks]);
    return shuffled.slice(0, maxTracks).map((track) => track.id);
  }

  /**
   * Primary weather queue generation method - uses dynamic by default
   */
  static async generateWeatherQueue(
    condition: string,
    maxTracks: number = 10,
    temperature?: number,
    timeOfDay?: string,
  ): Promise<string[]> {
    // Try dynamic first if temperature is provided
    if (temperature !== undefined) {
      return this.generateWeatherQueueDynamic(
        condition,
        temperature,
        timeOfDay || this.getCurrentTimeOfDay(),
        maxTracks,
      );
    }

    // Fallback to local method
    return this.generateWeatherQueueLocal(condition, maxTracks);
  }

  /**
   * Get current time of day
   */
  private static getCurrentTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 21) return "evening";
    return "night";
  }

  /**
   * Generate a queue based on mood/tags
   */
  static generateMoodQueue(tags: string[], maxTracks: number = 10): string[] {
    // First try to find tracks with any of the tags
    let tracks = TracksManager.getTracksByTags(tags);

    // If no tracks found with any tags, fall back to random tracks
    if (tracks.length === 0) {
      console.warn(
        `No tracks found for tags: ${tags.join(", ")}. Using random tracks.`,
      );
      return this.getRandomTracks(maxTracks);
    }

    // If we have fewer tracks than needed, add more variety
    if (tracks.length < maxTracks) {
      const additionalTracks = TracksManager.getAllTracks().filter(
        (track) =>
          !tracks.some((existingTrack) => existingTrack.id === track.id),
      );
      tracks = [...tracks, ...additionalTracks];
    }

    // Shuffle and limit tracks
    const shuffled = this.shuffleArray([...tracks]);
    return shuffled.slice(0, maxTracks).map((track) => track.id);
  }

  /**
   * Generate a random queue
   */
  static getRandomTracks(count: number = 10): string[] {
    const allTracks = TracksManager.getAllTracks();
    const shuffled = this.shuffleArray([...allTracks]);
    return shuffled.slice(0, count).map((track) => track.id);
  }

  /**
   * Fisher-Yates shuffle algorithm
   */
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Validate queue format
   */
  static validateQueue(queue: string[]): boolean {
    return Array.isArray(queue) && queue.every((id) => typeof id === "string");
  }
}

// Export the classes and their methods
export { TracksManager, QueueManager, WeatherMusicMapper };

// Export individual methods for backward compatibility
export const getTrackById = TracksManager.getTrackById.bind(TracksManager);
export const getTracksByIds = TracksManager.getTracksByIds.bind(TracksManager);
export const getTracksByTags =
  TracksManager.getTracksByTags.bind(TracksManager);
export const getAllTracks = TracksManager.getAllTracks.bind(TracksManager);
export const getTracksForWeather =
  TracksManager.getTracksForWeather.bind(TracksManager);
export const getTracksByMood =
  TracksManager.getTracksByMood.bind(TracksManager);

// Async queue generation methods
export const generateWeatherQueue =
  QueueManager.generateWeatherQueue.bind(QueueManager);
export const generateWeatherQueueDynamic =
  QueueManager.generateWeatherQueueDynamic.bind(QueueManager);
export const generateWeatherQueueLocal =
  QueueManager.generateWeatherQueueLocal.bind(QueueManager);

// Sync methods
export const generateMoodQueue =
  QueueManager.generateMoodQueue.bind(QueueManager);
export const getRandomTracks = QueueManager.getRandomTracks.bind(QueueManager);
export const validateQueue = QueueManager.validateQueue.bind(QueueManager);

// Weather mapping utilities
export const getWeatherRecommendationParams =
  WeatherMusicMapper.getRecommendationParams.bind(WeatherMusicMapper);

// Export getWeatherMood for backward compatibility
export function getWeatherMood(weather: { main: string }): string {
  const weatherTagMap: Record<string, string> = {
    Clear: "upbeat",
    Rain: "mellow",
    Clouds: "chill",
    Snow: "peaceful",
    Thunderstorm: "intense",
    Drizzle: "contemplative",
    Mist: "mysterious",
    Fog: "mysterious",
  };

  return weatherTagMap[weather.main] || "chill";
}
