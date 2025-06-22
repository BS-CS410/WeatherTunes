import { useState, useEffect, useCallback } from "react";
import { useSpotifyService } from "./useSpotifyService";
import { useAuth } from "./useAuth";
import type { TrackMetadata } from "@/types/queue-types";

interface UseSpotifyQueueReturn {
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
 * Hook for managing the Spotify queue
 * Replaces the old queueManager singleton with direct Spotify API calls
 */
export function useSpotifyQueue(): UseSpotifyQueueReturn {
  const { user } = useAuth();
  const spotifyService = useSpotifyService();
  const [currentTrack, setCurrentTrack] = useState<TrackMetadata | null>(null);
  const [upcomingTracks, setUpcomingTracks] = useState<TrackMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load queue when user changes
  useEffect(() => {
    if (!user) {
      setCurrentTrack(null);
      setUpcomingTracks([]);
      return;
    }

    const loadQueue = async () => {
      try {
        setIsLoading(true);
        const queue = await spotifyService.getQueue();
        setCurrentTrack(queue.currently_playing as unknown as TrackMetadata);
        setUpcomingTracks((queue.queue || []) as unknown as TrackMetadata[]);
      } catch (error) {
        console.error('Failed to load queue:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQueue();
  }, [user, spotifyService]);

  const replaceQueue = useCallback(async (tracks: TrackMetadata[]) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      // Clear current queue by playing the first track
      if (tracks.length > 0) {
        await spotifyService.play([`spotify:track:${tracks[0].id}`]);
        // Add remaining tracks to queue
        for (let i = 1; i < tracks.length; i++) {
          await spotifyService.addToQueue(`spotify:track:${tracks[i].id}`);
        }
      }
      // Update local state
      setCurrentTrack(tracks[0] || null);
      setUpcomingTracks(tracks.slice(1));
    } catch (error) {
      console.error('Failed to replace queue:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, spotifyService]);

  const addToQueue = useCallback(async (tracks: TrackMetadata[]) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      for (const track of tracks) {
        await spotifyService.addToQueue(`spotify:track:${track.id}`);
      }
      // Refresh queue to update state
      // Update local state with the newly added tracks
      setUpcomingTracks(prev => [...prev, ...tracks]);
    } catch (error) {
      console.error('Failed to add to queue:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, spotifyService]);

  const playNext = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      await spotifyService.next();
      // Refresh queue to update state
      const queue = await spotifyService.getQueue();
      setCurrentTrack(queue.currently_playing as unknown as TrackMetadata);
      setUpcomingTracks((queue.queue || []) as unknown as TrackMetadata[]);
    } catch (error) {
      console.error('Failed to play next track:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, spotifyService]);

  const playTrack = useCallback(async (trackId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      await spotifyService.play([`spotify:track:${trackId}`]);
      // Refresh queue to update state
      const queue = await spotifyService.getQueue();
      setCurrentTrack(queue.currently_playing as unknown as TrackMetadata);
      setUpcomingTracks((queue.queue || []) as unknown as TrackMetadata[]);
    } catch (error) {
      console.error('Failed to play track:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, spotifyService]);

  const clearQueue = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      // Pause playback to clear the queue
      await spotifyService.pause();
      // Update local state
      setCurrentTrack(null);
      setUpcomingTracks([]);
    } catch (error) {
      console.error('Failed to clear queue:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, spotifyService]);

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
