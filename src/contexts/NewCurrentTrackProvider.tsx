/**
 * Simplified current track provider using the new queue system
 */

import React, { createContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { useQueue } from "@/hooks/useQueue";
import { useSpotifyAuth } from "@/hooks/useSpotifyAuth";
import type { TrackMetadata } from "@/types/queue-types";

interface CurrentTrackContextType {
  trackMetadata: TrackMetadata | null;
  isLoading: boolean;
  currentTrackId: string | null;
  updateTrack: (trackId: string) => Promise<void>;
  playNext: () => Promise<void>;
  songQueue: TrackMetadata[];
}

const CurrentTrackContext = createContext<CurrentTrackContextType | undefined>(
  undefined,
);

interface CurrentTrackProviderProps {
  children: ReactNode;
}

/**
 * Simplified current track provider - delegates to queue system
 */
export const CurrentTrackProvider: React.FC<CurrentTrackProviderProps> = ({
  children,
}) => {
  const { user } = useSpotifyAuth();
  const { currentTrack, upcomingTracks, isLoading, playNext } = useQueue();
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync current track state
  const trackMetadata = currentTrack;
  const currentTrackId = currentTrack?.id || null;
  const songQueue = upcomingTracks;

  const updateTrack = useCallback(
    async (trackId: string): Promise<void> => {
      if (!user || !trackId) return;

      setIsUpdating(true);
      try {
        // For now, just update local state
        // In a full implementation, this would sync with Spotify
        console.log(`Updating current track to: ${trackId}`);
      } catch (error) {
        console.error("Failed to update track:", error);
      } finally {
        setIsUpdating(false);
      }
    },
    [user],
  );

  const contextValue: CurrentTrackContextType = {
    trackMetadata,
    isLoading: isLoading || isUpdating,
    currentTrackId,
    updateTrack,
    playNext,
    songQueue,
  };

  return (
    <CurrentTrackContext.Provider value={contextValue}>
      {children}
    </CurrentTrackContext.Provider>
  );
};

export { CurrentTrackContext };
export type { CurrentTrackContextType };
