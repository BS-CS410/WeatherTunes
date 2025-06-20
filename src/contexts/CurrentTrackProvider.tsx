import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import type { ReactNode } from "react";
import { FrontendSpotifyApiService } from "@/lib/spotify-api-frontend";
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
 * Frontend-only implementation with local storage persistence
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

  // Load queue from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedQueue = localStorage.getItem("music_queue");
      if (savedQueue) {
        try {
          const parsedQueue = JSON.parse(savedQueue) as TrackMetadata[];
          setSongQueue(parsedQueue.slice(0, TARGET_QUEUE_SIZE));
        } catch (error) {
          console.error("Failed to parse saved queue:", error);
          setSongQueue([]);
        }
      }
    } else {
      setSongQueue([]);
    }
    setIsLoading(false);
  }, [user]);

  // Save queue to localStorage whenever it changes
  useEffect(() => {
    if (user && songQueue.length > 0) {
      localStorage.setItem("music_queue", JSON.stringify(songQueue));
    }
  }, [user, songQueue]);

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
        const track = await FrontendSpotifyApiService.getTrackById(trackId);
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
        const track = await FrontendSpotifyApiService.getTrackById(trackId);
        if (!track) return;

        setSongQueue((currentQueue) => {
          // Avoid duplicates
          if (currentQueue.some((t) => t.id === trackId)) {
            return currentQueue;
          }
          const newQueue = [...currentQueue, track].slice(0, TARGET_QUEUE_SIZE);
          return newQueue;
        });
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
        const tracks: TrackMetadata[] = [];
        for (const trackId of trackIds.slice(0, TARGET_QUEUE_SIZE)) {
          const track = await FrontendSpotifyApiService.getTrackById(trackId);
          if (track) {
            tracks.push(track);
          }
        }
        setSongQueue(tracks);
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
        setSongQueue(tracks.slice(0, TARGET_QUEUE_SIZE));
      } catch (error) {
        console.error("Failed to replace queue with track metadata:", error);
        setSongQueue(tracks.slice(0, TARGET_QUEUE_SIZE));
      }
    },
    [user],
  );

  const clearQueue = useCallback(async (): Promise<void> => {
    if (!user) return;

    try {
      setSongQueue([]);
      localStorage.removeItem("music_queue");
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

      // Get current weather conditions (default values for now)
      const defaultCondition = "clear sky";
      const defaultTemperature = 20;

      try {
        const weatherRecommendations =
          await FrontendSpotifyApiService.getWeatherRecommendations({
            weather_condition: defaultCondition,
            temperature: defaultTemperature,
            time_of_day: timeOfDay,
            limit: tracksNeeded,
            use_personalization: true,
          });

        newTracks = weatherRecommendations.tracks;
        console.log(
          `Got ${newTracks.length} weather-based tracks for ${defaultCondition} at ${defaultTemperature}°C`,
        );
      } catch (error) {
        console.log("Weather-based recommendations failed, trying search...");
        try {
          const searchResults = await FrontendSpotifyApiService.searchTracks(
            "popular music 2024",
            tracksNeeded,
          );
          newTracks = searchResults.tracks;
          console.log(`Got ${newTracks.length} search-based tracks`);
        } catch (searchError) {
          console.error("Failed to get any tracks:", searchError);
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
      if (songQueue.length > 0) {
        const nextTrack = songQueue[0];
        const remainingQueue = songQueue.slice(1);

        setTrackMetadata(nextTrack);
        setCurrentTrackId(nextTrack.id);
        setSongQueue(remainingQueue);

        // Check if local queue needs immediate replenishment
        console.log(
          `Track advanced, triggering immediate replenishment (${remainingQueue.length}/${TARGET_QUEUE_SIZE})...`,
        );
        setTimeout(async () => {
          try {
            await triggerImmediateReplenishment(remainingQueue.length);
          } catch (error) {
            console.error("Failed to replenish queue after track skip:", error);
          }
        }, 100);
      }
    } catch (error) {
      console.error("Failed to set next track:", error);
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
