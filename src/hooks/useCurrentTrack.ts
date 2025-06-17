import { useState, useCallback, useRef } from "react";
import { getSpotifyTrackMetadata } from "@/lib/spotifyWeather";

interface TrackMetadata {
  title: string;
  artist: string;
  albumArt: string;
}

interface UseCurrentTrackReturn {
  trackMetadata: TrackMetadata | null;
  isLoading: boolean;
  currentTrackId: string | null;
  updateTrack: (trackId: string) => Promise<void>;
}

/**
 * Manages current track metadata state
 * Fetches and caches Spotify track information for display
 */
export const useCurrentTrack = (): UseCurrentTrackReturn => {
  const [trackMetadata, setTrackMetadata] = useState<TrackMetadata | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const currentTrackIdRef = useRef<string | null>(null);

  // Keep ref in sync with state
  currentTrackIdRef.current = currentTrackId;

  const updateTrack = useCallback(
    async (trackId: string) => {
      console.log("🔄 updateTrack called with:", trackId);
      
      if (!trackId) {
        console.log("🔄 updateTrack: No trackId provided, returning");
        return;
      }

      // Use ref to avoid dependency issues while checking for duplicates
      if (trackId === currentTrackIdRef.current) {
        console.log("🔄 updateTrack: Same track as current, skipping");
        return;
      }

      console.log("🔄 updateTrack: Setting currentTrackId to:", trackId);
      setCurrentTrackId(trackId);
      setIsLoading(true);

      try {
        console.log("🔄 updateTrack: Fetching metadata for:", trackId);
        const metadata = await getSpotifyTrackMetadata(trackId);
        console.log("🔄 updateTrack: Received metadata:", metadata);
        
        // Double-check that this is still the current track (in case of rapid changes)
        setCurrentTrackId((current) => {
          console.log("🔄 updateTrack: Verifying current track. Expected:", trackId, "Actual:", current);
          if (current === trackId) {
            console.log("🔄 updateTrack: Setting metadata for:", trackId, metadata);
            setTrackMetadata(metadata);
            return current;
          }
          console.log("🔄 updateTrack: Track changed during fetch, not updating metadata");
          return current; // Don't update metadata if track changed
        });
      } catch (error) {
        console.error("🔄 updateTrack: Failed to fetch track metadata:", error);
        setTrackMetadata(null);
      } finally {
        setIsLoading(false);
      }
    },
    [], // No dependencies needed since we use ref for comparison
  );

  return {
    trackMetadata,
    isLoading,
    currentTrackId,
    updateTrack,
  };
};
