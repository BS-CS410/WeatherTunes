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
    return Array.from(this.tracks.values()).filter((track) =>
      track.tags?.some((tag) => tags.includes(tag)),
    );
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
      rainy: ["rainy", "chill", "sleepy lofi", "soft rain indie"],
      cloudy: ["cloudy", "mellow", "indie", "lo-fi"],
      snowy: ["snowy", "acoustic", "winter", "cozy"],
      stormy: ["storm", "intense", "dramatic"],
    };

    const tags = weatherTagMap[condition.toLowerCase()] || [];
    return this.getTracksByTags(tags);
  }
}
