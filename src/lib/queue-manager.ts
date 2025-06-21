/**
 * Modern queue management system - single source of truth
 * Handles all queue operations with minimal complexity
 */

import type { TrackMetadata } from "@/types/queue-types";
import { spotifyApi } from "./spotify-api";

interface QueueState {
  tracks: TrackMetadata[];
  currentIndex: number;
  isLoading: boolean;
}

interface QueueConfig {
  maxSize: number;
  minThreshold: number;
  storageKey: string;
}

type QueueListener = (state: QueueState) => void;

/**
 * Centralized queue manager with immutable state updates
 */
export class QueueManager {
  private state: QueueState = {
    tracks: [],
    currentIndex: -1,
    isLoading: false,
  };

  private config: QueueConfig = {
    maxSize: 15,
    minThreshold: 5,
    storageKey: "weathertunes_queue",
  };

  private listeners = new Set<QueueListener>();
  private isReplenishing = false;

  constructor(config?: Partial<QueueConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    this.loadFromStorage();
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: QueueListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get current state snapshot
   */
  getState(): QueueState {
    return { ...this.state };
  }

  /**
   * Get current track
   */
  getCurrentTrack(): TrackMetadata | null {
    const { tracks, currentIndex } = this.state;
    return currentIndex >= 0 && currentIndex < tracks.length
      ? tracks[currentIndex]
      : null;
  }

  /**
   * Get upcoming tracks
   */
  getUpcomingTracks(): TrackMetadata[] {
    const { tracks, currentIndex } = this.state;
    return tracks.slice(currentIndex + 1);
  }

  /**
   * Replace entire queue with new tracks
   */
  async replaceQueue(tracks: TrackMetadata[]): Promise<void> {
    this.updateState({
      tracks: this.deduplicateTracks(tracks.slice(0, this.config.maxSize)),
      currentIndex: -1,
      isLoading: false,
    });
    this.saveToStorage();
    this.checkReplenishment();
  }

  /**
   * Add tracks to queue
   */
  async addTracks(tracks: TrackMetadata[]): Promise<void> {
    const currentTracks = this.state.tracks;
    const newTracks = this.deduplicateTracks([...currentTracks, ...tracks]);

    this.updateState({
      tracks: newTracks.slice(0, this.config.maxSize),
    });
    this.saveToStorage();
    this.checkReplenishment();
  }

  /**
   * Play next track in queue
   */
  async playNext(): Promise<TrackMetadata | null> {
    const { tracks, currentIndex } = this.state;
    const nextIndex = currentIndex + 1;

    if (nextIndex < tracks.length) {
      this.updateState({ currentIndex: nextIndex });
      this.saveToStorage();
      this.checkReplenishment();
      return tracks[nextIndex];
    }

    return null;
  }

  /**
   * Play specific track from queue
   */
  async playTrack(trackId: string): Promise<TrackMetadata | null> {
    const { tracks } = this.state;
    const trackIndex = tracks.findIndex((track) => track.id === trackId);

    if (trackIndex !== -1) {
      this.updateState({ currentIndex: trackIndex });
      this.saveToStorage();
      this.checkReplenishment();
      return tracks[trackIndex];
    }

    return null;
  }

  /**
   * Clear queue
   */
  async clearQueue(): Promise<void> {
    this.updateState({
      tracks: [],
      currentIndex: -1,
      isLoading: false,
    });
    this.saveToStorage();
  }

  /**
   * Auto-replenish queue when below threshold
   */
  private async checkReplenishment(): Promise<void> {
    const upcomingCount = this.getUpcomingTracks().length;

    if (upcomingCount < this.config.minThreshold && !this.isReplenishing) {
      this.isReplenishing = true;
      this.updateState({ isLoading: true });

      try {
        const tracksNeeded = this.config.maxSize - this.state.tracks.length;
        const newTracks = await this.generateTracks(tracksNeeded);

        if (newTracks.length > 0) {
          await this.addTracks(newTracks);
        }
      } catch (error) {
        console.error("Queue replenishment failed:", error);
      } finally {
        this.isReplenishing = false;
        this.updateState({ isLoading: false });
      }
    }
  }

  /**
   * Generate new tracks based on weather conditions
   */
  private async generateTracks(count: number): Promise<TrackMetadata[]> {
    try {
      // Get weather-based recommendations
      const timeOfDay = this.getCurrentTimeOfDay();
      const weatherRecommendations = await spotifyApi.getWeatherRecommendations(
        {
          weather_condition: "clear sky", // Default fallback
          temperature: 20,
          time_of_day: timeOfDay,
          limit: count,
        },
      );

      return weatherRecommendations.tracks;
    } catch (error) {
      console.error("Weather recommendations failed:", error);

      // Fallback to search
      try {
        const searchResults = await spotifyApi.searchTracks(
          "popular music",
          count,
        );
        return searchResults.tracks;
      } catch (searchError) {
        console.error("Search fallback failed:", searchError);
        return [];
      }
    }
  }

  /**
   * Remove duplicate tracks while preserving order
   */
  private deduplicateTracks(tracks: TrackMetadata[]): TrackMetadata[] {
    const seen = new Set<string>();
    return tracks.filter((track) => {
      if (seen.has(track.id)) {
        return false;
      }
      seen.add(track.id);
      return true;
    });
  }

  /**
   * Update state and notify listeners
   */
  private updateState(updates: Partial<QueueState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  /**
   * Save queue to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(
        this.config.storageKey,
        JSON.stringify({
          tracks: this.state.tracks,
          currentIndex: this.state.currentIndex,
        }),
      );
    } catch (error) {
      console.error("Failed to save queue to storage:", error);
    }
  }

  /**
   * Load queue from localStorage
   */
  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(this.config.storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        this.updateState({
          tracks: data.tracks || [],
          currentIndex: data.currentIndex || -1,
        });
      }
    } catch (error) {
      console.error("Failed to load queue from storage:", error);
    }
  }

  /**
   * Get current time of day
   */
  private getCurrentTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 21) return "evening";
    return "night";
  }
}

// Singleton instance
export const queueManager = new QueueManager();
