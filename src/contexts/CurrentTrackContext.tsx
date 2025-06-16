import React, { createContext } from "react";
import type { ReactNode } from "react";
import { useCurrentTrack } from "@/hooks/useCurrentTrack";

interface TrackMetadata {
  title: string;
  artist: string;
  albumArt: string;
}

interface CurrentTrackContextType {
  trackMetadata: TrackMetadata | null;
  isLoading: boolean;
  updateTrack: (trackId: string) => Promise<void>;
}

const CurrentTrackContext = createContext<CurrentTrackContextType | undefined>(undefined);

interface CurrentTrackProviderProps {
  children: ReactNode;
}

/**
 * Provides current track metadata state across components
 * Manages Spotify track information for display synchronization
 */
export const CurrentTrackProvider: React.FC<CurrentTrackProviderProps> = ({ children }) => {
  const trackData = useCurrentTrack();

  return (
    <CurrentTrackContext.Provider value={trackData}>
      {children}
    </CurrentTrackContext.Provider>
  );
};

export { CurrentTrackContext };

export type { CurrentTrackContextType, TrackMetadata };
