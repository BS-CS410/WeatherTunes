import { useState, useCallback } from "react";
import { getSpotifyTrackMetadata } from "@/lib/spotifyWeather";

interface TrackMetadata {
  title: string;
  artist: string;
  albumArt: string;
}

interface UseCurrentTrackReturn {
  trackMetadata: TrackMetadata | null;
  isLoading: boolean;
  updateTrack: (trackId: string) => Promise<void>;
}

/**
 * Manages current track metadata state
 * Fetches and caches Spotify track information for display
 */
export const useCurrentTrack = (): UseCurrentTrackReturn => {
  const [trackMetadata, setTrackMetadata] = useState<TrackMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);

  const updateTrack = useCallback(async (trackId: string) => {
    if (!trackId || trackId === currentTrackId) return; // Prevent duplicate updates
    
    setCurrentTrackId(trackId);
    setIsLoading(true);
    
    try {
      const metadata = await getSpotifyTrackMetadata(trackId);
      // Double-check that this is still the current track (in case of rapid changes)
      setCurrentTrackId(current => {
        if (current === trackId) {
          setTrackMetadata(metadata);
          return current;
        }
        return current; // Don't update metadata if track changed
      });
    } catch (error) {
      console.error("Failed to fetch track metadata:", error);
      setTrackMetadata(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentTrackId]);

  return {
    trackMetadata,
    isLoading,
    updateTrack,
  };
};
