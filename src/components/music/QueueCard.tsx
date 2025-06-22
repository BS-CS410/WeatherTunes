/**
 * QueueCard component for displaying and managing the music queue
 * Uses the new Spotify Web Playback SDK and service architecture
 */

import { useState, useRef } from "react";
import { COLORS, TYPOGRAPHY, ANIMATIONS, LAYOUT } from "@/lib";
import { cn } from "@/lib";
import { useSpotifyQueue } from "@/hooks/spotify";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import type { TrackMetadata } from "@/types/queue-types";

export function QueueCard() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const { user, isLoading: authLoading } = useAuth();
  const { upcomingTracks, isLoading, playNext, playTrack, clearQueue } =
    useSpotifyQueue();

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

  const handlePlayTrack = async (trackId: string) => {
    if (!user) return;
    await playTrack(trackId);
  };

  const handleSkipTrack = async () => {
    if (!user) return;
    await playNext();
  };

  const handleClearQueue = async () => {
    if (!user) return;
    await clearQueue();
  };

  if (authLoading) {
    return (
      <div className="relative">
        <div className={LAYOUT.padding.lg}>
          <h2 className={cn(TYPOGRAPHY.display.xl, COLORS.text.primary)}>
            Up Next:
          </h2>
        </div>
        <div className={cn(LAYOUT.container.center, LAYOUT.padding.xl)}>
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
        <div className={LAYOUT.padding.lg}>
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
        className={cn("flex items-center justify-between", LAYOUT.padding.lg)}
      >
        <h2 className={cn(TYPOGRAPHY.display.xl, COLORS.text.primary)}>
          Up Next:
        </h2>
        {upcomingTracks.length > 0 && (
          <div className={cn("flex", LAYOUT.spacing.sm)}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSkipTrack}
              disabled={isLoading}
              className="text-xs"
            >
              Skip
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearQueue}
              disabled={isLoading}
              className="text-xs"
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Queue display area */}
      <div className="queue-display-area">
        {isLoading ? (
          <div className="flex items-center justify-center px-6 py-8">
            <p className={cn(TYPOGRAPHY.body.base, COLORS.text.muted)}>
              Loading queue...
            </p>
          </div>
        ) : upcomingTracks.length === 0 ? (
          <div className="flex items-center justify-center px-6 py-8">
            <p className={cn(TYPOGRAPHY.body.base, COLORS.text.muted)}>
              Your queue is being prepared with music for the current weather...
            </p>
          </div>
        ) : (
          <div className="scrollbar-thin scrollbar-track-black/10 scrollbar-thumb-slate-600/60 hover:scrollbar-thumb-slate-600/80 relative z-0 overflow-x-auto px-6">
            <div className="flex min-w-max flex-row gap-2 px-2 py-4">
              {upcomingTracks.map((track: TrackMetadata, idx: number) => {
                const isHovered = hoveredId === track.id;
                const isNextUp = idx === 0 && hoveredId === null;
                const isNextUpOrHovered =
                  isNextUp || (hoveredId === track.id && idx === 0);

                return (
                  <div
                    key={`${track.id}-${idx}`}
                    className={cn(
                      "group flex min-w-[120px] flex-col items-center",
                      ANIMATIONS.transition.standard,
                    )}
                    onMouseEnter={() => handleMouseEnter(track.id)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handlePlayTrack(track.id)}
                  >
                    <div className="relative">
                      <img
                        src={
                          track.albumArt ||
                          track.albumArtFallback ||
                          "/placeholder-album.svg"
                        }
                        alt={track.title}
                        onError={(e) => {
                          if (
                            track.albumArtFallback &&
                            e.currentTarget.src !== track.albumArtFallback
                          ) {
                            e.currentTarget.src = track.albumArtFallback;
                          } else {
                            e.currentTarget.src = "/placeholder-album.svg";
                          }
                        }}
                        className={cn(
                          "relative z-10 h-28 w-28 cursor-pointer rounded-xl object-cover",
                          ANIMATIONS.transition.standard,
                          isHovered || isNextUp
                            ? "-translate-y-2 scale-110 shadow-2xl hover:brightness-105 dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] dark:hover:brightness-110"
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
                                "drop-shadow-[0_1px_4px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]",
                              )
                            : COLORS.text.primary,
                        )}
                      >
                        {track.title}
                      </div>
                      <div
                        className={cn(
                          "w-28 truncate text-center",
                          TYPOGRAPHY.body.xs,
                          ANIMATIONS.transition.standard,
                          isNextUpOrHovered
                            ? cn(
                                COLORS.text.secondary,
                                "drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]",
                              )
                            : COLORS.text.muted,
                        )}
                      >
                        {track.artist}
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
