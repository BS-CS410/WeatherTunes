import React, { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { apiClient } from "@/lib/api-client";
import { SpotifyApiService } from "@/lib/spotify-api-service";
import { useAuth } from "@/hooks/hooks-utility";
import type { TrackMetadata } from "@/types/queue-types";

interface CurrentTrackContextType {
  trackMetadata: TrackMetadata | null;
  isLoading: boolean;
  currentTrackId: string | null;
  updateTrack: (trackId: string) => Promise<void>;
  songQueue: TrackMetadata[];
  setNextTrack: () => Promise<void>;
  addTrackToQueue: (trackId: string) => Promise<void>;
  replaceQueueWithTracks: (trackIds: string[]) => Promise<void>;
  clearQueue: () => Promise<void>;
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

  const clearQueue = useCallback(async (): Promise<void> => {
    if (!user) return;

    try {
      await apiClient.post("http://localhost:8000/queue/clear", {});
      setSongQueue([]);
    } catch (error) {
      console.error("Failed to clear queue:", error);
    }
  }, [user]);

  const setNextTrack = useCallback(async (): Promise<void> => {
    if (!user) return;

    try {
      const response = await apiClient.post(
        "http://localhost:8000/queue/next",
        {},
      );

      // Update current track if response includes it
      const data = response.data as { currentTrack?: TrackMetadata };
      if (data.currentTrack) {
        setTrackMetadata(data.currentTrack);
        setCurrentTrackId(data.currentTrack.id);
      }
    } catch (error) {
      console.error("Failed to set next track:", error);
    }
  }, [user]);

  const contextValue: CurrentTrackContextType = {
    trackMetadata,
    isLoading,
    currentTrackId,
    updateTrack,
    songQueue,
    setNextTrack,
    addTrackToQueue,
    replaceQueueWithTracks,
    clearQueue,
  };

  return (
    <CurrentTrackContext.Provider value={contextValue}>
      {children}
    </CurrentTrackContext.Provider>
  );
};

export { CurrentTrackContext };

export type { CurrentTrackContextType, TrackMetadata };
