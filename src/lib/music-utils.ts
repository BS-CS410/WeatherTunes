import type { TrackMetadata } from "@/types/queue-types";
import tracksData from "./music-tracks.json";

/**
 * Consolidated music utilities for track management and queue generation
 */

// === TRACKS MANAGER ===

class TracksManager {
  private static tracks: Map<string, TrackMetadata> = new Map();

  static {
    // Initialize tracks map on module load
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
   * Generate a queue based on weather conditions
   */
  static generateWeatherQueue(
    condition: string,
    maxTracks: number = 10,
  ): string[] {
    const tracks = TracksManager.getTracksForWeather(condition);

    // Shuffle and limit tracks
    const shuffled = this.shuffleArray([...tracks]);
    return shuffled.slice(0, maxTracks).map((track) => track.id);
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
export { TracksManager, QueueManager };

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

export const generateWeatherQueue =
  QueueManager.generateWeatherQueue.bind(QueueManager);
export const generateMoodQueue =
  QueueManager.generateMoodQueue.bind(QueueManager);
export const getRandomTracks = QueueManager.getRandomTracks.bind(QueueManager);
export const validateQueue = QueueManager.validateQueue.bind(QueueManager);

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
