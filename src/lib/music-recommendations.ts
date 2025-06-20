import { spotifyApiService } from "./spotify-client";
import type { TrackMetadata } from "@/types/queue-types";

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
      clear: {
        genres: ["pop", "indie-pop", "funk", "disco"],
        audioFeatures: {
          valence: 0.75,
          energy: 0.8,
          danceability: 0.7,
          acousticness: 0.3,
          tempo: 125,
        },
        seedKeywords: ["bright", "clear", "fresh", "optimistic"],
      },

      // Cloudy/Overcast Weather
      cloudy: {
        genres: ["indie", "alternative", "folk", "lo-fi"],
        audioFeatures: {
          valence: 0.5,
          energy: 0.5,
          danceability: 0.4,
          acousticness: 0.6,
          tempo: 100,
        },
        seedKeywords: ["contemplative", "mellow", "atmospheric", "dreamy"],
      },

      // Rainy Weather
      rain: {
        genres: ["indie", "folk", "acoustic", "jazz"],
        audioFeatures: {
          valence: 0.4,
          energy: 0.3,
          danceability: 0.3,
          acousticness: 0.8,
          tempo: 80,
        },
        seedKeywords: ["rainy", "cozy", "melancholic", "peaceful"],
      },

      // Default fallback
      default: {
        genres: ["pop", "indie", "alternative"],
        audioFeatures: {
          valence: 0.6,
          energy: 0.6,
          danceability: 0.5,
          acousticness: 0.5,
          tempo: 100,
        },
        seedKeywords: ["chill", "relaxed", "moderate"],
      },
    };

  /**
   * Get music mapping for weather condition with dynamic temperature adjustments
   */
  static getMusicMapping(
    condition: string,
    temperature: number,
    timeOfDay: string,
  ): {
    genres: string[];
    audioFeatures: AudioFeatures;
    keywords: string[];
  } {
    // Normalize condition
    const normalizedCondition = condition.toLowerCase().trim();

    // Get base mapping
    const mapping =
      this.weatherMappings[normalizedCondition] || this.weatherMappings.default;

    // Adjust based on temperature
    const adjustedFeatures = this.adjustForTemperature(
      { ...mapping.audioFeatures },
      temperature,
    );

    // Adjust based on time of day
    const timeAdjustedFeatures = this.adjustForTimeOfDay(
      adjustedFeatures,
      timeOfDay,
    );

    return {
      genres: mapping.genres,
      audioFeatures: timeAdjustedFeatures,
      keywords: mapping.seedKeywords,
    };
  }

  /**
   * Adjust audio features based on temperature with enhanced granularity
   */
  private static adjustForTemperature(
    features: AudioFeatures,
    temperature: number,
  ): AudioFeatures {
    const adjusted = { ...features };

    // Enhanced temperature mapping with more granular ranges
    if (temperature >= 30) {
      // Very hot weather (30°C+) - tropical, high energy
      adjusted.energy = Math.min(1.0, (adjusted.energy || 0.5) + 0.25);
      adjusted.danceability = Math.min(
        1.0,
        (adjusted.danceability || 0.5) + 0.2,
      );
      adjusted.valence = Math.min(1.0, (adjusted.valence || 0.5) + 0.15);
      adjusted.tempo = (adjusted.tempo || 100) + 20;
    } else if (temperature >= 25) {
      // Hot weather (25-29°C) - energetic and upbeat
      adjusted.energy = Math.min(1.0, (adjusted.energy || 0.5) + 0.2);
      adjusted.danceability = Math.min(
        1.0,
        (adjusted.danceability || 0.5) + 0.15,
      );
      adjusted.valence = Math.min(1.0, (adjusted.valence || 0.5) + 0.1);
      adjusted.tempo = (adjusted.tempo || 100) + 15;
    } else if (temperature >= 20) {
      // Warm weather (20-24°C) - pleasant and moderate
      adjusted.energy = Math.min(1.0, (adjusted.energy || 0.5) + 0.1);
      adjusted.valence = Math.min(1.0, (adjusted.valence || 0.5) + 0.05);
      adjusted.tempo = (adjusted.tempo || 100) + 5;
    } else if (temperature >= 15) {
      // Mild weather (15-19°C) - comfortable, no major adjustments
      // Keep baseline features
    } else if (temperature >= 10) {
      // Cool weather (10-14°C) - slightly more relaxed
      adjusted.energy = Math.max(0.0, (adjusted.energy || 0.5) - 0.05);
      adjusted.acousticness = Math.min(
        1.0,
        (adjusted.acousticness || 0.5) + 0.05,
      );
      adjusted.tempo = Math.max(60, (adjusted.tempo || 100) - 5);
    } else if (temperature >= 0) {
      // Cold weather (0-9°C) - more contemplative and acoustic
      adjusted.energy = Math.max(0.0, (adjusted.energy || 0.5) - 0.1);
      adjusted.acousticness = Math.min(
        1.0,
        (adjusted.acousticness || 0.5) + 0.1,
      );
      adjusted.valence = Math.max(0.0, (adjusted.valence || 0.5) - 0.05);
      adjusted.tempo = Math.max(60, (adjusted.tempo || 100) - 10);
    } else if (temperature >= -10) {
      // Very cold weather (-10 to -1°C) - intimate and warm genres
      adjusted.energy = Math.max(0.0, (adjusted.energy || 0.5) - 0.2);
      adjusted.acousticness = Math.min(
        1.0,
        (adjusted.acousticness || 0.5) + 0.2,
      );
      adjusted.valence = Math.max(0.0, (adjusted.valence || 0.5) - 0.1);
      adjusted.tempo = Math.max(60, (adjusted.tempo || 100) - 20);
    } else {
      // Extremely cold weather (-10°C and below) - very mellow and introspective
      adjusted.energy = Math.max(0.0, (adjusted.energy || 0.5) - 0.3);
      adjusted.acousticness = Math.min(
        1.0,
        (adjusted.acousticness || 0.5) + 0.3,
      );
      adjusted.valence = Math.max(0.0, (adjusted.valence || 0.5) - 0.15);
      adjusted.tempo = Math.max(50, (adjusted.tempo || 100) - 30);
    }

    return adjusted;
  }

  /**
   * Adjust audio features based on time of day
   */
  private static adjustForTimeOfDay(
    features: AudioFeatures,
    timeOfDay: string,
  ): AudioFeatures {
    const adjusted = { ...features };

    switch (timeOfDay.toLowerCase()) {
      case "morning":
        // Morning - more energetic and upbeat
        adjusted.energy = Math.min(1.0, (adjusted.energy || 0.5) + 0.1);
        adjusted.valence = Math.min(1.0, (adjusted.valence || 0.5) + 0.15);
        adjusted.danceability = Math.min(
          1.0,
          (adjusted.danceability || 0.5) + 0.1,
        );
        break;

      case "evening":
        // Evening - more relaxed
        adjusted.energy = Math.max(0.0, (adjusted.energy || 0.5) - 0.1);
        adjusted.acousticness = Math.min(
          1.0,
          (adjusted.acousticness || 0.5) + 0.1,
        );
        break;

      case "night":
        // Night - more chill and atmospheric
        adjusted.energy = Math.max(0.0, (adjusted.energy || 0.5) - 0.2);
        adjusted.acousticness = Math.min(
          1.0,
          (adjusted.acousticness || 0.5) + 0.2,
        );
        adjusted.valence = Math.max(0.0, (adjusted.valence || 0.5) - 0.1);
        adjusted.tempo = Math.max(60, (adjusted.tempo || 100) - 20);
        break;

      default: // afternoon or any other time
        // Keep features as-is for afternoon
        break;
    }

    return adjusted;
  }

  /**
   * Get recommendation parameters formatted for Spotify API
   */
  static getRecommendationParams(
    condition: string,
    temperature: number,
    timeOfDay: string,
  ): {
    seed_genres: string[];
    target_valence: number;
    target_energy: number;
    target_danceability: number;
    target_acousticness: number;
    target_tempo: number;
  } {
    const mapping = this.getMusicMapping(condition, temperature, timeOfDay);

    return {
      seed_genres: mapping.genres.slice(0, 3), // Spotify allows max 5 seeds total
      target_valence: mapping.audioFeatures.valence || 0.5,
      target_energy: mapping.audioFeatures.energy || 0.5,
      target_danceability: mapping.audioFeatures.danceability || 0.5,
      target_acousticness: mapping.audioFeatures.acousticness || 0.5,
      target_tempo: mapping.audioFeatures.tempo || 100,
    };
  }
}

// === DYNAMIC QUEUE MANAGER ===

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
      const recommendations = await spotifyApiService.getWeatherRecommendations(
        {
          weather_condition: weatherCondition,
          temperature,
          time_of_day: timeOfDay as
            | "morning"
            | "afternoon"
            | "evening"
            | "night",
          limit: maxTracks,
          use_personalization: true,
        },
      );

      if (recommendations.tracks.length > 0) {
        return recommendations.tracks.map((track: TrackMetadata) => track.id);
      }

      // If no tracks found, throw error instead of falling back to hardcoded data
      throw new Error("No Spotify recommendations available");
    } catch (error) {
      console.error("Failed to generate dynamic weather queue:", error);
      throw error; // Let the caller handle fallback
    }
  }

  /**
   * Primary weather queue generation method - always uses dynamic Spotify data
   */
  static async generateWeatherQueue(
    condition: string,
    maxTracks: number = 10,
    temperature?: number,
    timeOfDay?: string,
  ): Promise<string[]> {
    // Always use dynamic generation with Spotify API
    const temp = temperature ?? 20; // Default temperature if not provided
    const time = timeOfDay ?? QueueManager.getCurrentTimeOfDay();

    return QueueManager.generateWeatherQueueDynamic(
      condition,
      temp,
      time,
      maxTracks,
    );
  }

  /**
   * Generate a queue based on mood/tags using Spotify API
   */
  static async generateMoodQueue(
    tags: string[],
    maxTracks: number = 10,
  ): Promise<string[]> {
    try {
      // Use first tag as main genre
      const genres = tags.slice(0, 2); // Spotify only accepts a few genres

      const recommendations = await spotifyApiService.getWeatherRecommendations(
        {
          weather_condition: genres[0] || "pop",
          temperature: 20,
          time_of_day: "afternoon",
          limit: maxTracks,
          use_personalization: false,
        },
      );

      const trackIds = recommendations.tracks.map(
        (track: TrackMetadata) => track.id,
      );

      if (trackIds.length === 0) {
        throw new Error("No Spotify recommendations found for mood");
      }

      return trackIds;
    } catch (error) {
      console.error("Failed to generate mood queue:", error);
      throw error;
    }
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
   * Validate a queue structure
   */
  static validateQueue(queue: unknown): queue is string[] {
    return Array.isArray(queue) && queue.every((id) => typeof id === "string");
  }
}

// Export the classes and their methods
export { QueueManager, WeatherMusicMapper };

// Async queue generation methods
export const generateWeatherQueue =
  QueueManager.generateWeatherQueue.bind(QueueManager);
export const generateWeatherQueueDynamic =
  QueueManager.generateWeatherQueueDynamic.bind(QueueManager);

// Async methods
export const generateMoodQueue =
  QueueManager.generateMoodQueue.bind(QueueManager);
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
