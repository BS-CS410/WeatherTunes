import type { TrackMetadata } from "@/types/queue";
import tracksData from "./tracks.json";

/**
 * Manages access to track metadata from unified tracks.json
 */
export class TracksManager {
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
   * Get tracks for weather condition
   */
  static getTracksForWeather(condition: string): TrackMetadata[] {
    const weatherTagMap: Record<string, string[]> = {
      sunny: ["sunny", "happy", "upbeat pop", "summer dance", "fresh pop"],
      clear: ["sunny", "happy", "upbeat pop", "summer dance", "fresh pop"],
      rainy: ["rainy", "chill", "rainy night jazz", "soft rain indie"],
      rain: ["rainy", "chill", "rainy night jazz", "soft rain indie"],
      cloudy: ["chill", "indie", "pop", "relax"],
      snowy: ["acoustic", "winter", "chill"],
      snow: ["acoustic", "winter", "chill"],
      stormy: ["intense", "storm", "dramatic", "stormy vibes"],
      thunderstorm: ["intense", "storm", "dramatic", "stormy vibes"],
    };

    const tags = weatherTagMap[condition.toLowerCase()] || ["pop", "chill"];
    const tracks = this.getTracksByTags(tags);

    // If no tracks found for weather condition, return random tracks
    if (tracks.length === 0) {
      console.warn(
        `No tracks found for weather condition: ${condition}. Using random tracks.`,
      );
      return this.getAllTracks().slice(0, 10);
    }

    return tracks;
  }
}
