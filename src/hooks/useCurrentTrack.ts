import { useState, useCallback, useEffect } from "react";
import { apiClient, TracksManager } from "@/lib";
import { useAuth } from "./useAuth";
import type {
  TrackMetadata,
  QueueResponse,
  NextTrackResponse,
  AddTrackResponse,
  ClearQueueResponse,
  ReplaceQueueResponse,
} from "@/types/queue";

interface UseCurrentTrackReturn {
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

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

/**
 * Manages current track metadata state
 * Fetches track information from TracksManager (local tracks.json)
 * Interacts with backend for queue management
 */
export const useCurrentTrack = (): UseCurrentTrackReturn => {
  const { user } = useAuth();
  const [trackMetadata, setTrackMetadata] = useState<TrackMetadata | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [songQueue, setSongQueue] = useState<TrackMetadata[]>([]);

  const fetchQueueFromBackend = useCallback(async () => {
    // Only fetch if user is authenticated
    if (!user) {
      setSongQueue([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.get<QueueResponse>(
        `${API_BASE_URL}/queue`,
      );
      if (response.data && response.data.queue) {
        // Backend now sends full TrackMetadata objects
        setSongQueue(response.data.queue);
      } else {
        setSongQueue([]);
      }
    } catch (error) {
      console.error("Failed to fetch queue from backend:", error);
      setSongQueue([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Add user as dependency

  useEffect(() => {
    fetchQueueFromBackend();
  }, [fetchQueueFromBackend]);

  const updateTrack = useCallback(
    async (trackId: string) => {
      if (!trackId) {
        setTrackMetadata(null);
        setCurrentTrackId(null);
        return;
      }

      // Avoid re-fetching if the track ID is already the current one
      // and metadata for it is already loaded.
      if (currentTrackId === trackId && trackMetadata?.id === trackId) {
        return;
      }

      setCurrentTrackId(trackId);
      setIsLoading(true);
      try {
        const localTrack = TracksManager.getTrackById(trackId);
        if (localTrack) {
          setTrackMetadata(localTrack);
        } else {
          setTrackMetadata({
            id: trackId,
            title: "Unknown Track",
            artist: "Unknown Artist",
            albumArt: "",
          });
        }
      } catch (error) {
        console.error(
          "Failed to fetch track metadata using TracksManager:",
          error,
        );
        setTrackMetadata({
          id: trackId,
          title: "Error Loading Track",
          artist: "Unknown Artist",
          albumArt: "",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [trackMetadata, currentTrackId],
  );

  const setNextTrack = useCallback(async () => {
    if (!user) {
      console.warn("Cannot set next track: user not authenticated");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post<NextTrackResponse>(
        `${API_BASE_URL}/queue/next`,
        {},
      );
      // Backend now sends full next_track object and queue of TrackMetadata
      if (response.data && response.data.next_track) {
        setTrackMetadata(response.data.next_track);
        setCurrentTrackId(response.data.next_track.id);
        setSongQueue(response.data.queue || []);
      } else {
        setTrackMetadata(null);
        setCurrentTrackId(null);
        setSongQueue(response.data?.queue || []); // Use queue if present, even if next_track is null
      }
    } catch (error) {
      console.error("Failed to set next track:", error);
      setTrackMetadata(null);
      setCurrentTrackId(null);
      setSongQueue([]); // Clear queue on error
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addTrackToQueue = useCallback(
    async (trackId: string) => {
      if (!trackId) return;

      if (!user) {
        console.warn("Cannot add track to queue: user not authenticated");
        return;
      }

      // Get full track metadata from TracksManager to send to backend
      const trackToAdd = TracksManager.getTrackById(trackId);
      if (!trackToAdd) {
        console.error(`Track with ID ${trackId} not found in TracksManager.`);
        // Optionally, handle this with a user notification
        return;
      }

      setIsLoading(true);
      try {
        const response = await apiClient.post<AddTrackResponse>(
          `${API_BASE_URL}/queue/add`,
          {
            track: trackToAdd, // Send the full track object
          },
        );
        // Update queue from backend response (source of truth)
        if (response.data && response.data.queue) {
          // Backend now sends full TrackMetadata objects
          setSongQueue(response.data.queue);
        }
      } catch (error) {
        console.error("Failed to add track to queue:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [user], // Add user dependency
  );

  const replaceQueueWithTracks = useCallback(
    async (trackIds: string[]) => {
      if (!user) {
        console.warn("Cannot replace queue: user not authenticated");
        return;
      }

      setIsLoading(true);
      try {
        // Fetch full metadata for all track IDs to send to the backend
        const tracksToReplaceWith: TrackMetadata[] = [];
        for (const id of trackIds) {
          const trackMeta = TracksManager.getTrackById(id);
          if (trackMeta) {
            tracksToReplaceWith.push(trackMeta);
          } else {
            // Handle case where a track ID might not be found, if necessary
            // For now, we'll just skip it or add a placeholder
            console.warn(
              `Track ID ${id} not found in TracksManager during replace.`,
            );
            // Optionally, add a placeholder or skip
            // tracksToReplaceWith.push({ id, title: "Unknown Track", artist: "Unknown Artist", albumArt: "" });
          }
        }

        if (tracksToReplaceWith.length === 0 && trackIds.length > 0) {
          console.warn("No valid tracks found to replace the queue with.");
          // Potentially clear the queue or leave as is, depending on desired behavior
          // setSongQueue([]);
          // setIsLoading(false);
          // return;
        }

        const response = await apiClient.post<ReplaceQueueResponse>(
          `${API_BASE_URL}/queue/replace`,
          {
            tracks: tracksToReplaceWith, // Send array of full track objects
          },
        );
        if (response.data && response.data.queue) {
          // Backend now sends full TrackMetadata objects
          setSongQueue(response.data.queue);
        }
      } catch (error) {
        console.error("Failed to replace queue:", error);
        // Check if it's an authentication error
        if (error instanceof Error && error.message.includes("401")) {
          console.warn(
            "Authentication required - user may need to log in again",
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [user], // Add user dependency
  );

  const clearQueue = useCallback(async () => {
    if (!user) {
      console.warn("Cannot clear queue: user not authenticated");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post<ClearQueueResponse>(
        `${API_BASE_URL}/queue/clear`,
        {},
      );
      if (response.data && response.data.queue) {
        setSongQueue(response.data.queue);
        // Also clear the current playing track if the queue is cleared
        setTrackMetadata(null);
        setCurrentTrackId(null);
      }
    } catch (error) {
      console.error("Failed to clear queue:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

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
  };
};
