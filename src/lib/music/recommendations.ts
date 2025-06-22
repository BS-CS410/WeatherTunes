import { spotifyApi } from "./spotify-api";
import type { TrackMetadata } from "@/types/queue-types";

/**
 * Music utilities for track management and queue generation
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
      clouds: {
        genres: ["indie", "alternative", "shoegaze", "dream-pop", "ambient"],
        audioFeatures: {
          valence: 0.5, // Neutral mood
          energy: 0.5, // Medium energy
          danceability: 0.4, // Less danceable
          acousticness: 0.6, // More acoustic
          tempo: 90, // Slower tempo
        },
        seedKeywords: ["cloudy", "overcast", "contemplative", "mellow"],
      },
      "few clouds": {
        genres: ["indie-pop", "folk", "acoustic", "chill"],
        audioFeatures: {
          valence: 0.6,
          energy: 0.6,
          danceability: 0.5,
          acousticness: 0.7,
          tempo: 100,
        },
        seedKeywords: ["partly cloudy", "breezy", "peaceful"],
      },
      "scattered clouds": {
        genres: ["indie", "alternative", "folk-rock", "soft-rock"],
        audioFeatures: {
          valence: 0.4,
          energy: 0.5,
          danceability: 0.4,
          acousticness: 0.6,
          tempo: 95,
        },
        seedKeywords: ["scattered", "variable", "changing"],
      },
      "broken clouds": {
        genres: ["alternative", "grunge", "indie-rock", "post-rock"],
        audioFeatures: {
          valence: 0.3,
          energy: 0.6,
          danceability: 0.3,
          acousticness: 0.4,
          tempo: 85,
        },
        seedKeywords: ["broken", "dramatic", "moody"],
      },
      overcast: {
        genres: ["ambient", "post-rock", "slowcore", "drone"],
        audioFeatures: {
          valence: 0.2,
          energy: 0.3,
          danceability: 0.2,
          acousticness: 0.8,
          tempo: 70,
        },
        seedKeywords: ["grey", "overcast", "heavy", "atmospheric"],
      },

      // Rainy Weather
      rain: {
        genres: ["jazz", "blues", "lo-fi", "neo-soul", "r&b"],
        audioFeatures: {
          valence: 0.3, // Melancholic
          energy: 0.4, // Lower energy
          danceability: 0.3, // Not very danceable
          acousticness: 0.7, // Acoustic preference
          tempo: 80, // Slower tempo
        },
        seedKeywords: ["rain", "drops", "cozy", "intimate", "melancholy"],
      },
      "light rain": {
        genres: ["acoustic", "folk", "singer-songwriter", "indie-folk"],
        audioFeatures: {
          valence: 0.4,
          energy: 0.3,
          danceability: 0.2,
          acousticness: 0.8,
          tempo: 75,
        },
        seedKeywords: ["gentle", "light", "soft", "drizzle"],
      },
      "moderate rain": {
        genres: ["jazz", "blues", "soul", "lo-fi"],
        audioFeatures: {
          valence: 0.3,
          energy: 0.4,
          danceability: 0.3,
          acousticness: 0.7,
          tempo: 80,
        },
        seedKeywords: ["steady", "moderate", "consistent"],
      },
      "heavy rain": {
        genres: ["ambient", "post-rock", "classical", "dark-ambient"],
        audioFeatures: {
          valence: 0.2,
          energy: 0.3,
          danceability: 0.1,
          acousticness: 0.8,
          tempo: 60,
        },
        seedKeywords: ["heavy", "intense", "powerful", "storm"],
      },
      drizzle: {
        genres: ["lo-fi", "chillhop", "ambient", "downtempo"],
        audioFeatures: {
          valence: 0.4,
          energy: 0.2,
          danceability: 0.2,
          acousticness: 0.9,
          tempo: 70,
        },
        seedKeywords: ["mist", "light", "gentle", "soft"],
      },

      // Snow Weather
      snow: {
        genres: ["classical", "ambient", "folk", "winter"],
        audioFeatures: {
          valence: 0.4, // Peaceful but neutral
          energy: 0.3, // Low energy
          danceability: 0.2, // Not danceable
          acousticness: 0.8, // Very acoustic
          tempo: 65, // Very slow
        },
        seedKeywords: ["snow", "winter", "peaceful", "serene", "quiet"],
      },
      "light snow": {
        genres: ["folk", "acoustic", "classical", "new-age"],
        audioFeatures: {
          valence: 0.5,
          energy: 0.2,
          danceability: 0.1,
          acousticness: 0.9,
          tempo: 60,
        },
        seedKeywords: ["gentle", "falling", "soft", "delicate"],
      },
      "heavy snow": {
        genres: ["classical", "ambient", "drone", "post-rock"],
        audioFeatures: {
          valence: 0.3,
          energy: 0.2,
          danceability: 0.1,
          acousticness: 0.8,
          tempo: 50,
        },
        seedKeywords: ["blizzard", "heavy", "intense", "white"],
      },

      // Thunderstorm Weather
      thunderstorm: {
        genres: ["metal", "rock", "electronic", "industrial", "dark-ambient"],
        audioFeatures: {
          valence: 0.2, // Dark mood
          energy: 0.9, // Very high energy
          danceability: 0.4, // Moderate danceability
          acousticness: 0.2, // Electric/synthetic
          tempo: 140, // Fast tempo
        },
        seedKeywords: ["thunder", "lightning", "storm", "power", "intensity"],
      },
      "thunderstorm with rain": {
        genres: ["progressive-rock", "post-metal", "shoegaze", "noise"],
        audioFeatures: {
          valence: 0.1,
          energy: 0.8,
          danceability: 0.3,
          acousticness: 0.1,
          tempo: 130,
        },
        seedKeywords: ["dramatic", "intense", "electric", "powerful"],
      },

      // Fog/Mist Weather
      fog: {
        genres: ["ambient", "drone", "dark-ambient", "minimal"],
        audioFeatures: {
          valence: 0.3, // Mysterious
          energy: 0.2, // Very low energy
          danceability: 0.1, // Not danceable
          acousticness: 0.6, // Moderate acoustic
          tempo: 55, // Very slow
        },
        seedKeywords: ["fog", "mist", "mysterious", "ethereal", "obscure"],
      },
      mist: {
        genres: ["ambient", "new-age", "minimal", "soundscape"],
        audioFeatures: {
          valence: 0.4,
          energy: 0.1,
          danceability: 0.1,
          acousticness: 0.7,
          tempo: 50,
        },
        seedKeywords: ["misty", "ethereal", "floating", "soft"],
      },

      // Extreme Weather
      hail: {
        genres: ["experimental", "noise", "industrial", "breakcore"],
        audioFeatures: {
          valence: 0.1,
          energy: 0.9,
          danceability: 0.2,
          acousticness: 0.1,
          tempo: 160,
        },
        seedKeywords: ["chaos", "intense", "harsh", "aggressive"],
      },
      tornado: {
        genres: ["mathcore", "technical-metal", "breakcore", "harsh-noise"],
        audioFeatures: {
          valence: 0.0,
          energy: 1.0,
          danceability: 0.1,
          acousticness: 0.0,
          tempo: 200,
        },
        seedKeywords: ["chaos", "destruction", "whirlwind", "extreme"],
      },

      // Default fallback
      default: {
        genres: ["pop", "indie", "alternative", "rock"],
        audioFeatures: {
          valence: 0.5,
          energy: 0.6,
          danceability: 0.5,
          acousticness: 0.5,
          tempo: 100,
        },
        seedKeywords: ["general", "mixed", "varied"],
      },
    };

  /**
   * Get music mapping for weather condition
   */
  static getMapping(condition: string): WeatherMusicMapping {
    const normalizedCondition = condition.toLowerCase().trim();
    return (
      this.weatherMappings[normalizedCondition] || this.weatherMappings.default
    );
  }

  /**
   * Get all available weather conditions
   */
  static getAvailableConditions(): string[] {
    return Object.keys(this.weatherMappings).filter((key) => key !== "default");
  }

  /**
   * Search for similar weather conditions
   */
  static findSimilarCondition(condition: string): string | null {
    const normalizedCondition = condition.toLowerCase().trim();
    const conditions = this.getAvailableConditions();

    // Direct match
    if (conditions.includes(normalizedCondition)) {
      return normalizedCondition;
    }

    // Partial match
    const partialMatch = conditions.find(
      (c) => c.includes(normalizedCondition) || normalizedCondition.includes(c),
    );

    if (partialMatch) {
      return partialMatch;
    }

    // Keyword matching
    for (const [conditionKey, mapping] of Object.entries(
      this.weatherMappings,
    )) {
      if (conditionKey === "default") continue;

      const keywords = mapping.seedKeywords.map((k) => k.toLowerCase());
      if (keywords.some((keyword) => normalizedCondition.includes(keyword))) {
        return conditionKey;
      }
    }

    return null;
  }
}

// === MUSIC QUEUE MANAGEMENT ===

/**
 * Generate music recommendations based on weather
 */
export async function generateWeatherPlaylist(
  weatherCondition: string,
  temperature?: number,
  timeOfDay?: string,
  limit = 20,
): Promise<TrackMetadata[]> {
  try {
    // Use Spotify API to get recommendations
    const response = await spotifyApi.getWeatherRecommendations({
      weather_condition: weatherCondition,
      temperature: temperature || 20,
      time_of_day: timeOfDay as "morning" | "afternoon" | "evening" | "night",
      limit,
    });

    return response.tracks;
  } catch (error) {
    console.error("Failed to generate weather playlist:", error);
    // Return empty array as fallback
    return [];
  }
}

/**
 * Search for tracks with specific criteria
 */
export async function searchTracks(
  query: string,
  limit = 20,
): Promise<TrackMetadata[]> {
  try {
    const response = await spotifyApi.searchTracks(query, limit);
    return response.tracks;
  } catch (error) {
    console.error("Failed to search tracks:", error);
    return [];
  }
}

/**
 * Get tracks by genre and audio features
 */
export async function getTracksByGenreAndFeatures(
  genre: string,
  audioFeatures: AudioFeatures,
  limit = 20,
): Promise<TrackMetadata[]> {
  try {
    const response = await spotifyApi.searchByGenreAndFeatures(
      genre,
      audioFeatures as Record<string, number>,
      limit,
    );
    return response.tracks;
  } catch (error) {
    console.error("Failed to get tracks by genre and features:", error);
    return [];
  }
}

/**
 * Create a mixed playlist combining multiple sources
 */
export async function createMixedPlaylist(
  weatherCondition: string,
  temperature?: number,
  timeOfDay?: string,
  additionalGenres: string[] = [],
  limit = 30,
): Promise<TrackMetadata[]> {
  try {
    const mapping = WeatherMusicMapper.getMapping(weatherCondition);
    const tracks: TrackMetadata[] = [];

    // Get tracks from primary weather mapping
    const weatherTracks = await generateWeatherPlaylist(
      weatherCondition,
      temperature,
      timeOfDay,
      Math.floor(limit * 0.6),
    );
    tracks.push(...weatherTracks);

    // Add variety from additional genres
    for (const genre of additionalGenres.slice(0, 2)) {
      const genreTracks = await getTracksByGenreAndFeatures(
        genre,
        mapping.audioFeatures,
        Math.floor(limit * 0.2),
      );
      tracks.push(...genreTracks);
    }

    // Remove duplicates and shuffle
    const uniqueTracks = tracks.filter(
      (track, index, self) =>
        index === self.findIndex((t) => t.id === track.id),
    );

    return shuffleArray(uniqueTracks).slice(0, limit);
  } catch (error) {
    console.error("Failed to create mixed playlist:", error);
    return [];
  }
}

// === UTILITY FUNCTIONS ===

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get time-based audio feature adjustments
 */
export function getTimeBasedAdjustments(
  timeOfDay: string,
): Partial<AudioFeatures> {
  const adjustments: Record<string, Partial<AudioFeatures>> = {
    morning: {
      valence: 0.1, // Slightly more positive
      energy: 0.1, // Slightly more energetic
      tempo: 10, // Slightly faster
    },
    afternoon: {
      valence: 0.0, // No change
      energy: 0.0, // No change
      tempo: 0, // No change
    },
    evening: {
      valence: -0.1, // Slightly more mellow
      energy: -0.2, // Less energetic
      tempo: -15, // Slower
    },
    night: {
      valence: -0.2, // More mellow
      energy: -0.3, // Much less energetic
      tempo: -25, // Much slower
    },
  };

  return adjustments[timeOfDay] || adjustments.afternoon;
}

/**
 * Get temperature-based audio feature adjustments
 */
export function getTemperatureBasedAdjustments(
  temperature: number,
): Partial<AudioFeatures> {
  // Temperature in Celsius for consistency
  if (temperature > 30) {
    // Hot weather - high energy, tropical
    return {
      valence: 0.2,
      energy: 0.2,
      danceability: 0.2,
      tempo: 20,
    };
  } else if (temperature > 20) {
    // Warm weather - positive, moderate energy
    return {
      valence: 0.1,
      energy: 0.1,
      danceability: 0.1,
      tempo: 10,
    };
  } else if (temperature > 10) {
    // Cool weather - neutral
    return {};
  } else if (temperature > 0) {
    // Cold weather - more mellow
    return {
      valence: -0.1,
      energy: -0.1,
      acousticness: 0.1,
      tempo: -10,
    };
  } else {
    // Freezing weather - very mellow, acoustic
    return {
      valence: -0.2,
      energy: -0.2,
      acousticness: 0.2,
      tempo: -20,
    };
  }
}

// Export the mapper class for direct access
export { WeatherMusicMapper };
