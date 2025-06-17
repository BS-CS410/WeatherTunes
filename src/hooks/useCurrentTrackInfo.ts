import { useCurrentTrackContext } from "@/contexts/useCurrentTrackContext";

/**
 * Simple hook to get current track information
 * Provides direct access to track ID and metadata state
 */
export const useCurrentTrackInfo = () => {
  const { trackMetadata, currentTrackId, isLoading } = useCurrentTrackContext();

  return {
    trackId: currentTrackId,
    metadata: trackMetadata,
    isLoading,
    hasTrack: !!currentTrackId,
    isReady: !!trackMetadata && !isLoading,
  };
};
