import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import type { ReactNode } from "react";
import { apiClient } from "@/lib/api-client";
import { SpotifyApiService } from "@/lib/spotify-api-service";
import { useAuth } from "@/hooks/hooks-utility";
import type { TrackMetadata } from "@/types/queue-types";

// Queue management constants
const TARGET_QUEUE_SIZE = 12; // Fixed number of tracks to maintain in queue

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
  playTrackFromQueue: (trackId: string) => Promise<void>;
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
  const mountedRef = useRef(true);
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
      const response = await apiClient.get("/queue");
      const data = response.data as { queue?: TrackMetadata[] };
      // Always trim to TARGET_QUEUE_SIZE
      setSongQueue((data.queue || []).slice(0, TARGET_QUEUE_SIZE));
    } catch (error) {
      console.error("Failed to fetch queue:", error);

      // If it's an auth error, the user needs to log in again
      if (error instanceof Error && error.message.includes("401")) {
        console.warn("Backend session expired, user needs to re-authenticate");
      }

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

        const response = await apiClient.post("/queue/add", {
          track,
        });

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
      await apiClient.post("/queue/clear", {});
      setSongQueue([]);
    } catch (error) {
      console.error("Failed to clear queue:", error);
    }
  }, [user]);

  /**
   * Enhanced queue replenishment helper function - maintains target queue size
   */
  const replenishQueueToTarget = useCallback(
    async (currentQueue: TrackMetadata[]): Promise<void> => {
      const currentSize = currentQueue.length;
      const tracksNeeded = TARGET_QUEUE_SIZE - currentSize;

      if (tracksNeeded <= 0) {
        // Always trim to TARGET_QUEUE_SIZE
        setSongQueue(currentQueue.slice(0, TARGET_QUEUE_SIZE));
        console.log(
          `Queue already at target size (${currentSize}/${TARGET_QUEUE_SIZE})`,
        );
        return;
      }

      console.log(
        `Replenishing queue: ${currentSize}/${TARGET_QUEUE_SIZE} tracks, need ${tracksNeeded} more`,
      );

      const timeOfDay = getCurrentTimeOfDay();
      let newTracks: TrackMetadata[] = [];

      // Get current weather conditions
      // Default values if not available
      const defaultCondition = "clear sky";
      const defaultTemperature = 20;

      try {
        newTracks = await SpotifyApiService.getEnhancedWeatherRecommendations(
          defaultCondition,
          defaultTemperature,
          timeOfDay,
          tracksNeeded,
        );

        console.log(
          `Got ${newTracks.length} enhanced weather-based tracks for ${defaultCondition} at ${defaultTemperature}°C`,
        );
      } catch (error) {
        console.log(
          "Enhanced weather-based recommendations failed, trying basic personalized...",
        );
        try {
          newTracks =
            await SpotifyApiService.getPersonalizedWeatherRecommendations(
              defaultCondition,
              defaultTemperature,
              timeOfDay,
              tracksNeeded,
            );
          console.log(`Got ${newTracks.length} personalized tracks`);
        } catch (fallbackError) {
          console.log("Personalized recommendations failed, trying search...");
          newTracks = await SpotifyApiService.searchTracks(
            "popular music 2024",
            tracksNeeded,
          );
          console.log(`Got ${newTracks.length} search-based tracks`);
        }
      }

      if (newTracks.length > 0) {
        // Always trim to TARGET_QUEUE_SIZE
        const updatedQueue = [...currentQueue, ...newTracks].slice(
          0,
          TARGET_QUEUE_SIZE,
        );
        setSongQueue(updatedQueue);
        console.log(
          `Queue replenished: ${currentSize} → ${updatedQueue.length}/${TARGET_QUEUE_SIZE} tracks`,
        );

        // Try to sync with backend if possible
        try {
          await apiClient.post("http://localhost:8000/queue/replace", {
            tracks: updatedQueue,
          });
          console.log("Successfully synced queue to backend");
        } catch (syncError) {
          console.log("Backend sync failed, continuing with local queue");
        }
      }
    },
    [],
  );

  /**
   * Immediate replenishment - triggers as soon as a track is removed
   */
  const triggerImmediateReplenishment = useCallback(
    async (newQueueSize: number): Promise<void> => {
      if (!user || newQueueSize >= TARGET_QUEUE_SIZE) return;

      console.log(
        `Immediate replenishment triggered: ${newQueueSize}/${TARGET_QUEUE_SIZE} tracks`,
      );

      // Use current queue state for replenishment
      const currentQueue = songQueue.slice(0, newQueueSize);
      await replenishQueueToTarget(currentQueue);
    },
    [user, songQueue, replenishQueueToTarget],
  );

  const setNextTrack = useCallback(async (): Promise<void> => {
    if (!user) {
      console.warn("Cannot advance track: user not authenticated");
      return;
    }

    try {
      const response = await apiClient.post("/queue/next", {});

      // Update current track if response includes it
      const data = response.data as {
        currentTrack?: TrackMetadata;
        queue?: TrackMetadata[];
      };
      if (data.currentTrack) {
        setTrackMetadata(data.currentTrack);
        setCurrentTrackId(data.currentTrack.id);
      }

      // Update queue state if provided and trigger immediate replenishment
      if (data.queue !== undefined) {
        setSongQueue(data.queue);

        // Always trigger immediate replenishment after track change
        console.log(
          `Track advanced, triggering immediate replenishment (${data.queue.length}/${TARGET_QUEUE_SIZE})...`,
        );
        setTimeout(async () => {
          try {
            await triggerImmediateReplenishment(data.queue?.length || 0);
          } catch (error) {
            console.error(
              "Failed to auto-replenish queue after track skip:",
              error,
            );
          }
        }, 100);
      }
    } catch (error) {
      console.error("Failed to set next track:", error);

      // Check if it's an auth error and clear user state if needed
      if (error instanceof Error && error.message.includes("401")) {
        console.warn("Authentication expired, user needs to log in again");
        // Don't clear user state here - let auth service handle it
      }

      // Fallback: manually advance the queue locally
      if (songQueue.length > 0) {
        const nextTrack = songQueue[0];
        const remainingQueue = songQueue.slice(1);

        setTrackMetadata(nextTrack);
        setCurrentTrackId(nextTrack.id);
        setSongQueue(remainingQueue);

        // Check if local queue needs immediate replenishment
        console.log(
          `Local queue after fallback, triggering immediate replenishment (${remainingQueue.length}/${TARGET_QUEUE_SIZE})...`,
        );
        setTimeout(async () => {
          try {
            await triggerImmediateReplenishment(remainingQueue.length);
          } catch (error) {
            console.error("Failed to replenish local queue:", error);
          }
        }, 100);
      }
    }
  }, [user, songQueue, triggerImmediateReplenishment]);

  /**
   * Automatically replenish queue with weather-appropriate tracks
   */
  const replenishQueue = useCallback(async (): Promise<void> => {
    if (!user) return;

    // Get the current queue state directly
    setSongQueue((currentQueue) => {
      replenishQueueToTarget(currentQueue);
      return currentQueue; // Don't change state here, let replenishQueueToTarget handle it
    });
  }, [user, replenishQueueToTarget]);

  /**
   * Play a specific track from the queue, removing it from the queue
   */
  const playTrackFromQueue = useCallback(
    async (trackId: string): Promise<void> => {
      if (!user) return;

      try {
        // Use functional update to get current queue state
        setSongQueue((currentQueue) => {
          // Find the track in the queue
          const trackIndex = currentQueue.findIndex(
            (track) => track.id === trackId,
          );
          if (trackIndex === -1) {
            console.warn(`Track ${trackId} not found in queue`);
            return currentQueue;
          }

          const selectedTrack = currentQueue[trackIndex];

          // Remove the track from the queue
          const updatedQueue = currentQueue.filter(
            (track) => track.id !== trackId,
          );

          // Async operations in a separate call
          (async () => {
            try {
              // Try to update the queue on the backend
              await apiClient.post("http://localhost:8000/queue/replace", {
                tracks: updatedQueue,
              });
              console.log("Successfully updated queue on backend");
            } catch (error) {
              console.warn(
                "Failed to update queue on backend, continuing with local update:",
                error,
              );
            }

            // Set the selected track as current
            setTrackMetadata(selectedTrack);
            setCurrentTrackId(selectedTrack.id);

            console.log(
              `Playing track from queue: ${selectedTrack.title} by ${selectedTrack.artist}`,
            );

            // Immediately replenish queue to target size after track removal
            console.log(
              `Track removed from queue, triggering immediate replenishment (${updatedQueue.length}/${TARGET_QUEUE_SIZE})...`,
            );
            setTimeout(async () => {
              try {
                await triggerImmediateReplenishment(updatedQueue.length);
              } catch (error) {
                console.error(
                  "Failed to replenish queue after track selection:",
                  error,
                );
              }
            }, 100);
          })();

          return updatedQueue;
        });
      } catch (error) {
        console.error("Failed to play track from queue:", error);
      }
    },
    [user, triggerImmediateReplenishment],
  );

  /**
   * Effect to maintain queue at target size - replenish whenever below target
   * Using a ref to prevent infinite loops
   */
  const lastQueueSizeRef = useRef<number>(0);

  useEffect(() => {
    if (user && songQueue.length > 0 && songQueue.length < TARGET_QUEUE_SIZE) {
      // Only trigger if queue size actually changed to prevent loops
      if (lastQueueSizeRef.current !== songQueue.length) {
        lastQueueSizeRef.current = songQueue.length;
        console.log(
          `Queue size (${songQueue.length}) below target (${TARGET_QUEUE_SIZE}), auto-replenishing...`,
        );

        // Use a timeout to break the potential loop
        const timeoutId = setTimeout(() => {
          if (mountedRef.current) {
            replenishQueueToTarget(songQueue);
          }
        }, 500);

        return () => clearTimeout(timeoutId);
      }
    } else {
      lastQueueSizeRef.current = songQueue.length;
    }
  }, [user, songQueue.length, songQueue, replenishQueueToTarget]);

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

  /**
   * Cleanup effect for mounted ref
   */
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const contextValue: CurrentTrackContextType = {
    trackMetadata,
    isLoading,
    currentTrackId,
    updateTrack,
    playTrackFromQueue,
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
