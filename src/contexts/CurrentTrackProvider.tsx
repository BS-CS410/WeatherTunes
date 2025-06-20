import React, { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { apiClient } from "@/lib/api-client";
import { SpotifyApiService } from "@/lib/spotify-api-service";
import { useAuth } from "@/hooks/hooks-utility";
import type { TrackMetadata } from "@/types/queue-types";

// Queue management constants
const REPLENISH_THRESHOLD = 3; // Replenish queue when it falls below this number
const TRACKS_TO_ADD = 8; // Number of tracks to add when replenishing

/**
 * Get current time of day for music matching
 */
function getCurrentTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

interface CurrentTrackContextType {
  trackMetadata: TrackMetadata | null;
  isLoading: boolean;
  currentTrackId: string | null;
  updateTrack: (trackId: string) => Promise<void>;
  songQueue: TrackMetadata[];
  setNextTrack: () => Promise<void>;
  addTrackToQueue: (trackId: string) => Promise<void>;
  replaceQueueWithTracks: (trackIds: string[]) => Promise<void>;
  replaceQueueWithTrackMetadata: (tracks: TrackMetadata[]) => Promise<void>;
  clearQueue: () => Promise<void>;
  replenishQueue: () => Promise<void>;
}

const CurrentTrackContext = createContext<CurrentTrackContextType | undefined>(
  undefined,
);

interface CurrentTrackProviderProps {
  children: ReactNode;
}

/**
 * Provides current track metadata state across components
 * Manages Spotify track information for display synchronization
 */
export const CurrentTrackProvider: React.FC<CurrentTrackProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const [trackMetadata, setTrackMetadata] = useState<TrackMetadata | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [songQueue, setSongQueue] = useState<TrackMetadata[]>([]);

  // Fetch queue on mount when user is authenticated
  const fetchQueue = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await apiClient.get("http://localhost:8000/queue");
      const data = response.data as { queue?: TrackMetadata[] };
      setSongQueue(data.queue || []);
    } catch (error) {
      console.error("Failed to fetch queue:", error);
      console.log(
        "Starting with empty queue - queue will be populated automatically",
      );
      setSongQueue([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchQueue();
    } else {
      setIsLoading(false);
      setSongQueue([]);
    }
  }, [user, fetchQueue]);

  const updateTrack = useCallback(
    async (trackId: string): Promise<void> => {
      if (!trackId) {
        setTrackMetadata(null);
        setCurrentTrackId(null);
        return;
      }

      // Don't refetch if same track is already loaded
      if (currentTrackId === trackId && trackMetadata) {
        return;
      }

      try {
        const track = await SpotifyApiService.getTrackById(trackId);
        if (track) {
          setTrackMetadata(track);
          setCurrentTrackId(trackId);
        } else {
          // Handle Spotify API failure gracefully
          setTrackMetadata({
            id: trackId,
            title: "Unknown Track",
            artist: "Unknown Artist",
            albumArt: "",
          });
          setCurrentTrackId(trackId);
        }
      } catch (error) {
        console.error("Failed to update track:", error);
        setTrackMetadata({
          id: trackId,
          title: "Unknown Track",
          artist: "Unknown Artist",
          albumArt: "",
        });
        setCurrentTrackId(trackId);
      }
    },
    [currentTrackId, trackMetadata],
  );

  const addTrackToQueue = useCallback(
    async (trackId: string): Promise<void> => {
      if (!user) return;

      try {
        const track = await SpotifyApiService.getTrackById(trackId);
        if (!track) return;

        const response = await apiClient.post(
          "http://localhost:8000/queue/add",
          {
            track,
          },
        );

        // Update queue if response includes new queue state
        const data = response.data as { queue?: TrackMetadata[] };
        if (data.queue) {
          setSongQueue(data.queue);
        }
      } catch (error) {
        console.error("Failed to add track to queue:", error);
      }
    },
    [user],
  );

  const replaceQueueWithTracks = useCallback(
    async (trackIds: string[]): Promise<void> => {
      if (!user) return;

      try {
        const tracks = await SpotifyApiService.getTracksByIds(trackIds);

        const response = await apiClient.post(
          "http://localhost:8000/queue/replace",
          {
            tracks,
          },
        );

        // Update queue if response includes new queue state
        const data = response.data as { queue?: TrackMetadata[] };
        if (data.queue) {
          setSongQueue(data.queue);
        }
      } catch (error) {
        console.error("Failed to replace queue:", error);
      }
    },
    [user],
  );

  const replaceQueueWithTrackMetadata = useCallback(
    async (tracks: TrackMetadata[]): Promise<void> => {
      if (!user) return;

      try {
        const response = await apiClient.post(
          "http://localhost:8000/queue/replace",
          {
            tracks,
          },
        );

        // Update queue if response includes new queue state
        const data = response.data as { queue?: TrackMetadata[] };
        if (data.queue) {
          setSongQueue(data.queue);
        }
      } catch (error) {
        console.error("Failed to replace queue with track metadata:", error);

        // Fallback: update local queue state even if backend fails
        console.log("Falling back to local queue management");
        setSongQueue(tracks);

        // Don't throw the error, let the operation continue
      }
    },
    [user],
  );

  const clearQueue = useCallback(async (): Promise<void> => {
    if (!user) return;

    try {
      await apiClient.post("http://localhost:8000/queue/clear", {});
      setSongQueue([]);
    } catch (error) {
      console.error("Failed to clear queue:", error);
    }
  }, [user]);

  /**
   * Local queue replenishment helper function
   */
  const replenishQueueLocally = useCallback(
    async (currentQueue: TrackMetadata[]): Promise<void> => {
      console.log(
        "Replenishing queue locally with weather-appropriate tracks...",
      );

      const timeOfDay = getCurrentTimeOfDay();
      let newTracks: TrackMetadata[] = [];

      // Get current weather conditions
      // Default values if not available
      const defaultCondition = "clear sky";
      const defaultTemperature = 20;

      try {
        newTracks = await SpotifyApiService.getRecommendationsForCurrentWeather(
          defaultCondition,
          defaultTemperature,
          TRACKS_TO_ADD,
          timeOfDay,
        );

        console.log(
          `Got ${newTracks.length} weather-based tracks for ${defaultCondition}`,
        );
      } catch (error) {
        console.log(
          "Weather-based recommendations failed, trying personalized...",
        );
        try {
          newTracks =
            await SpotifyApiService.getPersonalizedWeatherRecommendations(
              defaultCondition,
              defaultTemperature,
              timeOfDay,
              TRACKS_TO_ADD,
            );
          console.log(`Got ${newTracks.length} personalized tracks`);
        } catch (fallbackError) {
          console.log("Personalized recommendations failed, trying search...");
          newTracks = await SpotifyApiService.searchTracks(
            "popular music 2024",
            TRACKS_TO_ADD,
          );
          console.log(`Got ${newTracks.length} search-based tracks`);
        }
      }

      if (newTracks.length > 0) {
        const updatedQueue = [...currentQueue, ...newTracks];
        setSongQueue(updatedQueue);
        console.log(
          `Local queue replenished: added ${newTracks.length} tracks, total: ${updatedQueue.length}`,
        );

        // Try to sync with backend if possible
        try {
          await apiClient.post("http://localhost:8000/queue/replace", {
            tracks: updatedQueue,
          });
          console.log("Successfully synced local queue to backend");
        } catch (syncError) {
          console.log("Backend sync failed, continuing with local queue");
        }
      }
    },
    [],
  );

  const setNextTrack = useCallback(async (): Promise<void> => {
    if (!user) return;

    try {
      const response = await apiClient.post(
        "http://localhost:8000/queue/next",
        {},
      );

      // Update current track if response includes it
      const data = response.data as {
        currentTrack?: TrackMetadata;
        queue?: TrackMetadata[];
      };
      if (data.currentTrack) {
        setTrackMetadata(data.currentTrack);
        setCurrentTrackId(data.currentTrack.id);
      }

      // Update queue state if provided and check for replenishment
      if (data.queue !== undefined) {
        setSongQueue(data.queue);

        // Check if queue needs replenishment after track change
        if (data.queue.length <= REPLENISH_THRESHOLD) {
          console.log(
            `Queue low after track skip (${data.queue.length} tracks), replenishing...`,
          );
          // Trigger replenishment asynchronously
          setTimeout(async () => {
            try {
              await replenishQueueLocally(data.queue || []);
            } catch (error) {
              console.error(
                "Failed to auto-replenish queue after track skip:",
                error,
              );
            }
          }, 100);
        }
      }
    } catch (error) {
      console.error("Failed to set next track:", error);

      // Fallback: manually advance the queue locally
      if (songQueue.length > 0) {
        const nextTrack = songQueue[0];
        const remainingQueue = songQueue.slice(1);

        setTrackMetadata(nextTrack);
        setCurrentTrackId(nextTrack.id);
        setSongQueue(remainingQueue);

        // Check if local queue needs replenishment
        if (remainingQueue.length <= REPLENISH_THRESHOLD) {
          console.log(
            `Local queue low (${remainingQueue.length} tracks), replenishing...`,
          );
          setTimeout(async () => {
            try {
              await replenishQueueLocally(remainingQueue);
            } catch (error) {
              console.error("Failed to replenish local queue:", error);
            }
          }, 100);
        }
      }
    }
  }, [user, songQueue, replenishQueueLocally]);

  /**
   * Automatically replenish queue with weather-appropriate tracks
   */
  const replenishQueue = useCallback(async (): Promise<void> => {
    if (!user) return;

    await replenishQueueLocally(songQueue);
  }, [user, songQueue, replenishQueueLocally]);

  /**
   * Effect to check queue size and auto-replenish when needed
   */
  useEffect(() => {
    if (
      user &&
      songQueue.length > 0 &&
      songQueue.length <= REPLENISH_THRESHOLD
    ) {
      console.log(
        `Queue size (${songQueue.length}) below threshold (${REPLENISH_THRESHOLD}), auto-replenishing...`,
      );
      replenishQueue();
    }
  }, [user, songQueue.length, replenishQueue]);

  /**
   * Effect to automatically start playing the first track when queue is loaded
   */
  useEffect(() => {
    if (user && songQueue.length > 0 && !currentTrackId && !isLoading) {
      console.log("Auto-starting first track from queue...");
      // Use setNextTrack to properly remove the track from queue
      setNextTrack();
    }
  }, [user, songQueue.length, currentTrackId, isLoading, setNextTrack]);

  const contextValue: CurrentTrackContextType = {
    trackMetadata,
    isLoading,
    currentTrackId,
    updateTrack,
    songQueue,
    setNextTrack,
    addTrackToQueue,
    replaceQueueWithTracks,
    replaceQueueWithTrackMetadata,
    clearQueue,
    replenishQueue,
  };

  return (
    <CurrentTrackContext.Provider value={contextValue}>
      {children}
    </CurrentTrackContext.Provider>
  );
};

export { CurrentTrackContext };

export type { CurrentTrackContextType, TrackMetadata };
