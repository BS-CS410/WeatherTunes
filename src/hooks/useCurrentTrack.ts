import { useContext } from "react";
import { CurrentTrackContext } from "@/contexts/CurrentTrackProvider";
import type { CurrentTrackContextType } from "@/contexts/CurrentTrackProvider";

/**
 * Hook to access current track context
 * Must be used within CurrentTrackProvider
 */
export const useCurrentTrackContext = (): CurrentTrackContextType => {
  const context = useContext(CurrentTrackContext);
  if (context === undefined) {
    throw new Error(
      "useCurrentTrackContext must be used within CurrentTrackProvider",
    );
  }
  return context;
};

/**
 * Safe hook to access current track context with default fallback
 * Returns null values if used outside the provider
 */
export const useCurrentTrack = (): CurrentTrackContextType | null => {
  const context = useContext(CurrentTrackContext);
  if (context === undefined) {
    console.warn(
      "useCurrentTrack used outside CurrentTrackProvider, returning null",
    );
    return null;
  }
  return context;
};
