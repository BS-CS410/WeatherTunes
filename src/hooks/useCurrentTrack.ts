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

// Export alias for backward compatibility
export const useCurrentTrack = useCurrentTrackContext;
