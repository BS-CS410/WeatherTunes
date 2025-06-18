import type { TrackMetadata } from "@/types/queue";
import { TracksManager } from "@/lib/tracksManager";

/**
 * Queue management utilities for generating and manipulating track queues
 */
export class QueueManager {
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
   * Get recommended tracks similar to current track
   */
  static getRecommendedTracks(
    currentTrack: TrackMetadata,
    maxTracks: number = 8,
  ): string[] {
    if (!currentTrack.tags || currentTrack.tags.length === 0) {
      // Fallback to random tracks
      return this.getRandomTracks(maxTracks);
    }

    const similarTracks = TracksManager.getTracksByTags(
      currentTrack.tags,
    ).filter((track) => track.id !== currentTrack.id); // Exclude current track

    const shuffled = this.shuffleArray([...similarTracks]);
    return shuffled.slice(0, maxTracks).map((track) => track.id);
  }

  /**
   * Get random tracks for fallback
   */
  static getRandomTracks(maxTracks: number = 10): string[] {
    const allTracks = TracksManager.getAllTracks();
    const shuffled = this.shuffleArray([...allTracks]);
    return shuffled.slice(0, maxTracks).map((track) => track.id);
  }

  /**
   * Shuffle array utility
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
   * Generate a diverse queue with different moods
   */
  static generateDiverseQueue(maxTracks: number = 15): string[] {
    const moodCategories = [
      ["happy", "upbeat", "sunny"],
      ["chill", "mellow", "relaxing"],
      ["indie", "alternative"],
      ["dance", "electronic"],
      ["acoustic", "folk"],
    ];

    const tracksPerMood = Math.ceil(maxTracks / moodCategories.length);
    const allTracks: string[] = [];

    moodCategories.forEach((tags) => {
      const moodTracks = this.generateMoodQueue(tags, tracksPerMood);
      allTracks.push(...moodTracks);
    });

    // Shuffle the final mix and trim to desired length
    const shuffled = this.shuffleArray(allTracks);
    return shuffled.slice(0, maxTracks);
  }
}
