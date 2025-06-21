/**
 * Modern queue hook - simple interface to queue manager
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { queueManager } from "@/lib/queue-manager";
import type { TrackMetadata } from "@/types/queue-types";
import { useAuth } from "./useAuth";
import { useWeatherQueue } from "./useWeatherQueue";

interface UseQueueReturn {
  // State
  currentTrack: TrackMetadata | null;
  upcomingTracks: TrackMetadata[];
  isLoading: boolean;

  // Actions
  replaceQueue: (tracks: TrackMetadata[]) => Promise<void>;
  addToQueue: (tracks: TrackMetadata[]) => Promise<void>;
  playNext: () => Promise<void>;
  playTrack: (trackId: string) => Promise<void>;
  clearQueue: () => Promise<void>;
}

/**
 * Hook for queue management - single source of truth
 */
export function useQueue(): UseQueueReturn {
  const { user } = useAuth();
  const { replaceQueueWithWeatherTracks } = useWeatherQueue();
  const [currentTrack, setCurrentTrack] = useState<TrackMetadata | null>(null);
  const [upcomingTracks, setUpcomingTracks] = useState<TrackMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAutoInitialized, setHasAutoInitialized] = useState(false);

  // Use ref to store the replaceQueueWithWeatherTracks function to avoid dependency issues
  const replaceQueueRef = useRef(replaceQueueWithWeatherTracks);
  replaceQueueRef.current = replaceQueueWithWeatherTracks;

  // Subscribe to queue state changes
  useEffect(() => {
    const updateState = (state: {
      tracks: TrackMetadata[];
      currentIndex: number;
      isLoading: boolean;
    }) => {
      const current = queueManager.getCurrentTrack();
      const upcoming = queueManager.getUpcomingTracks();

      setCurrentTrack(current);
      setUpcomingTracks(upcoming);
      setIsLoading(state.isLoading);
    };

    // Initial state
    updateState(queueManager.getState());

    // Subscribe to changes
    const unsubscribe = queueManager.subscribe(updateState);

    return unsubscribe;
  }, []);

  // Clear queue when user logs out
  useEffect(() => {
    if (!user) {
      queueManager.clearQueue();
      setHasAutoInitialized(false);
    }
  }, [user]);

  // Auto-initialize queue when user logs in and queue is empty
  useEffect(() => {
    if (
      user &&
      !hasAutoInitialized &&
      upcomingTracks.length === 0 &&
      !isLoading
    ) {
      setHasAutoInitialized(true);
      console.log("Auto-initializing queue with weather-based tracks...");

      // Use ref to avoid dependency cycle
      const initializeQueue = async () => {
        try {
          await replaceQueueRef.current(15);
        } catch (error) {
          console.error("Failed to auto-initialize queue:", error);
          setHasAutoInitialized(false); // Reset to allow retry
        }
      };

      initializeQueue();
    }
  }, [user, hasAutoInitialized, upcomingTracks.length, isLoading]);

  const replaceQueue = useCallback(
    async (tracks: TrackMetadata[]) => {
      if (!user) return;
      await queueManager.replaceQueue(tracks);
    },
    [user],
  );

  const addToQueue = useCallback(
    async (tracks: TrackMetadata[]) => {
      if (!user) return;
      await queueManager.addTracks(tracks);
    },
    [user],
  );

  const playNext = useCallback(async () => {
    if (!user) return;
    await queueManager.playNext();
  }, [user]);

  const playTrack = useCallback(
    async (trackId: string) => {
      if (!user) return;
      await queueManager.playTrack(trackId);
    },
    [user],
  );

  const clearQueue = useCallback(async () => {
    if (!user) return;
    await queueManager.clearQueue();
  }, [user]);

  return {
    currentTrack,
    upcomingTracks,
    isLoading,
    replaceQueue,
    addToQueue,
    playNext,
    playTrack,
    clearQueue,
  };
}
