import { useState, useCallback, useEffect } from "react";
import { apiClient, AdvancedWeatherMusicService } from "@/lib";
import { useAuth } from "./useAuth";
import type {
  TrackMetadata,
  QueueResponse,
  NextTrackResponse,
  AddTrackResponse,
  ClearQueueResponse,
  ReplaceQueueResponse,
} from "@/types/queue";

interface UseAdvancedCurrentTrackReturn {
  trackMetadata: TrackMetadata | null;
  isLoading: boolean;
  currentTrackId: string | null;
  updateTrack: (trackId: string) => Promise<void>;
  songQueue: TrackMetadata[];
  setNextTrack: () => Promise<void>;
  addTrackToQueue: (trackId: string) => Promise<void>;
  replaceQueueWithTracks: (trackIds: string[]) => Promise<void>;
  clearQueue: () => Promise<void>;
  recordInteraction: (
    trackId: string,
    interactionType: "like" | "dislike" | "skip" | "replay" | "play_complete",
    context?: {
      weather_condition?: string;
      temperature?: number;
      time_of_day?: string;
    },
  ) => Promise<void>;
  generateAdaptiveQueue: (
    temperature: number,
    condition: string,
    timeOfDay?: "morning" | "afternoon" | "evening" | "night",
    maxTracks?: number,
  ) => Promise<void>;
  getSimilarTracks: (
    trackId: string,
    limit?: number,
  ) => Promise<TrackMetadata[]>;
}

/**
 * Advanced track management hook - Phase 2 Implementation
 * Uses only live Spotify API, no local tracks.json fallback
 * Supports user interaction learning and adaptive playlists
 */
export const useAdvancedCurrentTrack = (): UseAdvancedCurrentTrackReturn => {
  const { user } = useAuth();
  const [trackMetadata, setTrackMetadata] = useState<TrackMetadata | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [songQueue, setSongQueue] = useState<TrackMetadata[]>([]);

  const fetchQueueFromBackend = useCallback(async () => {
    if (!user) {
      setSongQueue([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.get<QueueResponse>("/queue", {
        credentials: "include",
      });

      if (response.data?.queue) {
        setSongQueue(response.data.queue);
      }
    } catch (error) {
      console.error("Failed to fetch queue:", error);
      setSongQueue([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const updateTrack = useCallback(async (trackId: string): Promise<void> => {
    if (!trackId) {
      console.warn("No track ID provided to updateTrack");
      return;
    }

    setIsLoading(true);
    setCurrentTrackId(trackId);

    try {
      // Try to get track metadata from Spotify API
      const spotifyTrack = await AdvancedWeatherMusicService.getSimilarTracks(
        trackId,
        1,
      );
      if (spotifyTrack.length > 0) {
        setTrackMetadata(spotifyTrack[0]);
        return;
      }

      // If not found in recent tracks, search by ID
      const searchResults =
        await AdvancedWeatherMusicService.getMoodBasedTracks(trackId, 1);
      if (searchResults.length > 0) {
        setTrackMetadata(searchResults[0]);
        return;
      }

      console.warn(`Track with ID ${trackId} not found in Spotify`);
      setTrackMetadata(null);
    } catch (error) {
      console.error("Failed to fetch track metadata:", error);
      setTrackMetadata(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setNextTrack = useCallback(async (): Promise<void> => {
    if (!user) {
      console.warn("User not authenticated, cannot set next track");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post<NextTrackResponse>(
        "/queue/next",
        {},
        { credentials: "include" },
      );

      if (response.data?.next_track) {
        await updateTrack(response.data.next_track.id);
      }

      // Refresh queue
      await fetchQueueFromBackend();
    } catch (error) {
      console.error("Failed to set next track:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, updateTrack, fetchQueueFromBackend]);

  const addTrackToQueue = useCallback(
    async (trackId: string): Promise<void> => {
      if (!user) {
        console.warn("User not authenticated, cannot add track to queue");
        return;
      }

      setIsLoading(true);
      try {
        // Get track metadata from Spotify first
        const tracks = await AdvancedWeatherMusicService.getSimilarTracks(
          trackId,
          1,
        );
        const trackToAdd = tracks.length > 0 ? tracks[0] : null;

        if (!trackToAdd) {
          console.error(`Track with ID ${trackId} not found in Spotify.`);
          return;
        }

        const response = await apiClient.post<AddTrackResponse>(
          "/queue/add",
          { track: trackToAdd },
          { credentials: "include" },
        );

        if (response.data?.message) {
          console.log(response.data.message);
        }

        // Refresh queue
        await fetchQueueFromBackend();
      } catch (error) {
        console.error("Failed to add track to queue:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [user, fetchQueueFromBackend],
  );

  const replaceQueueWithTracks = useCallback(
    async (trackIds: string[]): Promise<void> => {
      if (!user) {
        console.warn("User not authenticated, cannot replace queue");
        return;
      }

      setIsLoading(true);
      try {
        // Get metadata for all tracks from Spotify
        const trackPromises = trackIds.map(async (id) => {
          try {
            const tracks = await AdvancedWeatherMusicService.getSimilarTracks(
              id,
              1,
            );
            return tracks.length > 0 ? tracks[0] : null;
          } catch (error) {
            console.error(
              `Track ID ${id} not found in Spotify during replace.`,
              error,
            );
            return null;
          }
        });

        const tracks = await Promise.all(trackPromises);
        const validTracks = tracks.filter(
          (track): track is TrackMetadata => track !== null,
        );

        if (validTracks.length === 0) {
          console.warn("No valid tracks found for queue replacement");
          return;
        }

        const response = await apiClient.post<ReplaceQueueResponse>(
          "/queue/replace",
          { tracks: validTracks },
          { credentials: "include" },
        );

        if (response.data?.message) {
          console.log(response.data.message);
        }

        // Update local queue state
        setSongQueue(validTracks);

        // If we have tracks, set the first one as current
        if (validTracks.length > 0) {
          await updateTrack(validTracks[0].id);
        }
      } catch (error) {
        console.error("Failed to replace queue:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [user, updateTrack],
  );

  const clearQueue = useCallback(async (): Promise<void> => {
    if (!user) {
      console.warn("User not authenticated, cannot clear queue");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post<ClearQueueResponse>(
        "/queue/clear",
        {},
        { credentials: "include" },
      );

      if (response.data?.message) {
        console.log(response.data.message);
      }

      setSongQueue([]);
      setTrackMetadata(null);
      setCurrentTrackId(null);
    } catch (error) {
      console.error("Failed to clear queue:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const recordInteraction = useCallback(
    async (
      trackId: string,
      interactionType: "like" | "dislike" | "skip" | "replay" | "play_complete",
      context: {
        weather_condition?: string;
        temperature?: number;
        time_of_day?: string;
      } = {},
    ): Promise<void> => {
      try {
        await AdvancedWeatherMusicService.recordUserInteraction(
          trackId,
          interactionType,
          context,
        );
        console.log(
          `Recorded ${interactionType} interaction for track ${trackId}`,
        );
      } catch (error) {
        console.error("Failed to record interaction:", error);
      }
    },
    [],
  );

  const generateAdaptiveQueue = useCallback(
    async (
      temperature: number,
      condition: string,
      timeOfDay: "morning" | "afternoon" | "evening" | "night" = "afternoon",
      maxTracks: number = 12,
    ): Promise<void> => {
      setIsLoading(true);
      try {
        const trackIds =
          await AdvancedWeatherMusicService.generateWeatherBasedQueue(
            temperature,
            condition,
            timeOfDay,
            maxTracks,
          );

        if (trackIds.length > 0) {
          await replaceQueueWithTracks(trackIds);
          console.log(
            `Generated adaptive queue with ${trackIds.length} tracks`,
          );
        }
      } catch (error) {
        console.error("Failed to generate adaptive queue:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [replaceQueueWithTracks],
  );

  const getSimilarTracks = useCallback(
    async (trackId: string, limit: number = 10): Promise<TrackMetadata[]> => {
      try {
        return await AdvancedWeatherMusicService.getSimilarTracks(
          trackId,
          limit,
        );
      } catch (error) {
        console.error("Failed to get similar tracks:", error);
        return [];
      }
    },
    [],
  );

  // Fetch queue on mount and when user changes
  useEffect(() => {
    fetchQueueFromBackend();
  }, [fetchQueueFromBackend]);

  return {
    trackMetadata,
    isLoading,
    currentTrackId,
    updateTrack,
    songQueue,
    setNextTrack,
    addTrackToQueue,
    replaceQueueWithTracks,
    clearQueue,
    recordInteraction,
    generateAdaptiveQueue,
    getSimilarTracks,
  };
};
