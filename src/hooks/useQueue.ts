/**
 * Modern queue hook - simple interface to queue manager
 */

import { useState, useEffect, useCallback } from "react";
import { queueManager } from "@/lib/queue-manager";
import type { TrackMetadata } from "@/types/queue-types";
import { useSpotifyAuth } from "./useSpotifyAuth";

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
  const { user } = useSpotifyAuth();
  const [currentTrack, setCurrentTrack] = useState<TrackMetadata | null>(null);
  const [upcomingTracks, setUpcomingTracks] = useState<TrackMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    }
  }, [user]);

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
