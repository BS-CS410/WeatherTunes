/**
 * QueueCard component for displaying and managing the music queue
 * Uses the new Spotify Web Playback SDK and service architecture
 */

import { useState } from "react";
import { COLORS, TYPOGRAPHY, LAYOUT, ANIMATIONS, CARD_STYLES } from "@/lib";
import { useAuth } from "@/hooks/useAuth";
import { useSpotifyQueue } from "@/hooks/spotify";
import { cn } from "@/lib";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TrackMetadata } from "@/types/queue-types";

export function QueueCard() {
  const { user, isLoading: authLoading } = useAuth();
  const { upcomingTracks, isLoading, playTrack, clearQueue } =
    useSpotifyQueue();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleMouseEnter = (id: string) => {
    setHoveredId(id);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
  };

  const handlePlayTrack = async (trackId: string) => {
    if (!user) return;
    await playTrack(trackId);
  };

  const handleClearQueue = async () => {
    if (!user) return;
    await clearQueue();
  };

  if (authLoading) {
    return (
      <Card variant="interactive" className="w-full">
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
      </Card>
    );
  }

  if (!user) {
    return (
      <Card variant="interactive" className="w-full">
        <div className="relative">
          <div className={LAYOUT.padding.lg}>
            <h2 className={cn(TYPOGRAPHY.display.xl, COLORS.text.primary)}>
              Up Next:
            </h2>
          </div>
          <div className={cn(LAYOUT.container.center, LAYOUT.padding.xl)}>
            <div className="text-center">
              <p className={cn(TYPOGRAPHY.body.lg, COLORS.text.muted, "mb-4")}>
                Please log into Spotify to view your queue.
              </p>
              <button
                onClick={() => (window.location.href = "/login")}
                className={cn(
                  "rounded-xl bg-[#1DB954] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#1ED760]",
                  LAYOUT.padding.button.md,
                )}
              >
                Login to Spotify
              </button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="interactive" className="w-full">
      <div className="relative">
        {/* Header */}
        <div className={LAYOUT.padding.lg}>
          <div className="flex items-center justify-between">
            <h2 className={cn(TYPOGRAPHY.display.xl, COLORS.text.primary)}>
              Up Next:
            </h2>
            {upcomingTracks.length > 0 && (
              <Button
                onClick={handleClearQueue}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                Clear Queue
              </Button>
            )}
          </div>
        </div>

        {/* Queue Display */}
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
                Your queue is being prepared with music for the current
                weather...
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
                        "group flex min-w-[120px] flex-col items-center rounded-lg p-2",
                        CARD_STYLES.sunken,
                        isNextUpOrHovered &&
                          "scale-105 bg-white/20 dark:bg-black/30",
                      )}
                      onMouseEnter={() => handleMouseEnter(track.id)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handlePlayTrack(track.id)}
                    >
                      <div className="relative">
                        <div
                          className={cn(
                            "flex-shrink-0 overflow-hidden rounded-xl bg-gray-200 dark:border dark:border-white/[0.08] dark:bg-black/20",
                            ANIMATIONS.transition.standard,
                            isNextUpOrHovered
                              ? "scale-110 shadow-lg shadow-black/20 dark:shadow-white/10"
                              : "scale-100",
                          )}
                          style={{
                            width: 112,
                            height: 112,
                          }}
                        >
                          <img
                            src={track.albumArt || "/placeholder-album.svg"}
                            alt={`${track.title} album art`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                "/placeholder-album.svg";
                            }}
                          />
                        </div>

                        {/* Next Up Indicator */}
                        {idx === 0 && (
                          <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white shadow-lg">
                            ▷
                          </div>
                        )}

                        {/* Play Button Overlay */}
                        {isHovered && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 backdrop-blur-sm">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black shadow-lg">
                              ▷
                            </div>
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
                              : COLORS.text.secondary,
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
    </Card>
  );
}
