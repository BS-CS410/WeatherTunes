import { useState, useRef, useEffect } from "react"; // Added useEffect
import { COLORS, TYPOGRAPHY, ANIMATIONS, LAYOUT } from "@/lib/unifiedStyles";
import { cn } from "@/lib/utils";
import { useCurrentTrackContext } from "@/contexts/useCurrentTrackContext";
import { useAuth } from "@/hooks/useAuth";
import { useWeatherMusic } from "@/hooks/useWeatherMusic";
import { Button } from "@/components/ui/button";

export function QueueCard() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const {
    songQueue,
    updateTrack,
    setNextTrack,
    clearQueue,
    replaceQueueWithTracks,
    isLoading: contextIsLoading, // Renamed from isLoading
  } = useCurrentTrackContext();

  const { user, isLoading: authLoading } = useAuth();
  const { generateWeatherQueue } = useWeatherMusic();

  // State and ref for delayed visual loader
  const [showVisualLoader, setShowVisualLoader] = useState(false);
  const loaderTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (contextIsLoading) {
      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
      }
      loaderTimerRef.current = setTimeout(() => {
        setShowVisualLoader(true);
      }, 300); // Show loader if loading persists > 300ms
    } else {
      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
        loaderTimerRef.current = null;
      }
      setShowVisualLoader(false);
    }

    return () => {
      // Cleanup timer on unmount or if contextIsLoading changes
      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
        loaderTimerRef.current = null;
      }
    };
  }, [contextIsLoading]);

  const handleMouseEnter = (id: string) => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    setHoveredId(id);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    hoverTimeout.current = setTimeout(() => {
      setHoveredId(null);
    }, 80);
  };

  const handleGenerateQueue = async () => {
    if (!user) {
      console.warn("Cannot generate queue: user not authenticated");
      return;
    }

    try {
      // Generate a weather-based queue using current conditions
      const newQueueIds = await generateWeatherQueue(12);

      if (newQueueIds.length > 0) {
        await replaceQueueWithTracks(newQueueIds);
      } else {
        console.warn("No tracks generated for queue");
      }
    } catch (error) {
      console.error("Failed to generate weather-based queue:", error);
    }
  };

  const handleClearQueue = async () => {
    if (!user) {
      console.warn("Cannot clear queue: user not authenticated");
      return;
    }
    await clearQueue();
  };

  const handleSkipTrack = async () => {
    if (!user) {
      console.warn("Cannot skip track: user not authenticated");
      return;
    }
    await setNextTrack();
  };

  if (authLoading) {
    return (
      <div className="relative">
        <div className={LAYOUT.padding.section.queue}>
          <h2 className={cn(TYPOGRAPHY.display.xl, COLORS.text.primary)}>
            Up Next:
          </h2>
        </div>
        <div className={cn(LAYOUT.container.center, LAYOUT.padding.xl)}>
          {/* Use TYPOGRAPHY.body.base for consistency if this is a body text */}
          <p className={cn(TYPOGRAPHY.body.base, COLORS.text.muted)}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative">
        <div className={LAYOUT.padding.section.queue}>
          <h2 className={cn(TYPOGRAPHY.display.xl, COLORS.text.primary)}>
            Up Next:
          </h2>
        </div>
        <div className={cn(LAYOUT.container.center, LAYOUT.padding.xl)}>
          <p className={cn(TYPOGRAPHY.body.base, COLORS.text.muted)}>
            Please log in to manage your music queue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header with controls */}
      <div
        className={cn(
          "flex items-center justify-between",
          LAYOUT.padding.section.queue,
        )}
      >
        <h2 className={cn(TYPOGRAPHY.display.xl, COLORS.text.primary)}>
          Up Next:
        </h2>
        <div className={cn("flex", LAYOUT.spacing.sm)}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateQueue}
            disabled={contextIsLoading} // Use factual loading state for disabling
            className="text-xs"
          >
            Generate Queue
          </Button>
          {songQueue.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSkipTrack}
                disabled={contextIsLoading} // Use factual loading state
                className="text-xs"
              >
                Skip
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearQueue}
                disabled={contextIsLoading} // Use factual loading state
                className="text-xs"
              >
                Clear
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Queue display area */}
      <div className="queue-display-area">
        {" "}
        {/* Wrapper for conditional content below */}
        {showVisualLoader ? (
          <div className="flex items-center justify-center px-6 py-8">
            {" "}
            {/* Added px-6 for consistency */}
            <p className={cn(TYPOGRAPHY.body.base, COLORS.text.muted)}>
              Loading queue...
            </p>
          </div>
        ) : songQueue.length === 0 ? (
          <div className="flex items-center justify-center px-6 py-8">
            {" "}
            {/* Added px-6 for consistency */}
            <p className={cn(TYPOGRAPHY.body.base, COLORS.text.muted)}>
              Queue is empty. Generate a new queue to get started!
            </p>
          </div>
        ) : (
          <div className="scrollbar-thin scrollbar-track-black/10 scrollbar-thumb-slate-600/60 hover:scrollbar-thumb-slate-600/80 relative z-0 overflow-x-auto px-6">
            <div className="flex min-w-max flex-row gap-2 px-2 py-4">
              {songQueue.map((song, idx) => {
                const isHovered = hoveredId === song.id;
                const isNextUp = idx === 0 && hoveredId === null;
                const isNextUpOrHovered =
                  isNextUp || (hoveredId === song.id && idx === 0);

                return (
                  <div
                    key={song.id}
                    className={cn(
                      "group flex min-w-[120px] flex-col items-center",
                      ANIMATIONS.transition.standard,
                    )}
                    onMouseEnter={() => song.id && handleMouseEnter(song.id)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => song.id && updateTrack(song.id)}
                  >
                    <div className="relative">
                      <img
                        src={
                          song.albumArt ||
                          song.albumArtFallback ||
                          "/placeholder-album.svg"
                        }
                        alt={song.title}
                        onError={(e) => {
                          // Try fallback first, then placeholder
                          if (
                            song.albumArtFallback &&
                            e.currentTarget.src !== song.albumArtFallback
                          ) {
                            e.currentTarget.src = song.albumArtFallback;
                          } else {
                            e.currentTarget.src = "/placeholder-album.svg";
                          }
                        }}
                        className={cn(
                          "relative z-10 h-28 w-28 cursor-pointer rounded-lg object-cover",
                          ANIMATIONS.transition.standard,
                          isHovered || isNextUp
                            ? "-translate-y-2 scale-110 shadow-2xl hover:brightness-105 dark:hover:brightness-110"
                            : "",
                        )}
                      />
                      {idx === 0 && (
                        <div className="absolute -top-2 -right-2 z-20 rounded-full bg-blue-500 px-2 py-1 text-xs text-white">
                          Next
                        </div>
                      )}
                    </div>

                    <div className={cn("mt-2")}>
                      <div
                        className={cn(
                          "w-28 truncate text-center",
                          TYPOGRAPHY.body.sm,
                          "font-semibold",
                          ANIMATIONS.transition.standard,
                          isNextUpOrHovered
                            ? cn(
                                COLORS.text.primary,
                                "drop-shadow-[0_1px_4px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_1px_6px_rgba(255,255,255,0.13)]",
                              )
                            : COLORS.text.primary,
                        )}
                      >
                        {song.title}
                      </div>
                      <div
                        className={cn(
                          "w-28 truncate text-center",
                          TYPOGRAPHY.body.xs,
                          ANIMATIONS.transition.standard,
                          isNextUpOrHovered
                            ? cn(
                                COLORS.text.secondary,
                                "drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_1px_2px_rgba(255,255,255,0.10)]",
                              )
                            : COLORS.text.muted,
                        )}
                      >
                        {song.artist}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
