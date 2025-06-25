/**
 * Spotify Mini Player Component
 * Compact player for favorites and search results
 * Uses the new Spotify Web Playback SDK and service architecture
 */

import React from "react";
import type { TrackMetadata } from "@/types/queue-types";
import { cn } from "@/lib";
import { TYPOGRAPHY, COLORS } from "@/lib";

interface SpotifyMiniPlayerProps {
  track: TrackMetadata;
  className?: string;
  onClick?: () => void;
}

/**
 * Redesigned, simplified, and elegant Spotify player for individual tracks.
 * Adopts a clean, vertical layout.
 */
export const SpotifyMiniPlayer: React.FC<SpotifyMiniPlayerProps> = ({
  track,
  className = "",
  onClick,
}) => {
  return (
    <div
      className={cn(
        "group flex cursor-pointer flex-col items-center space-y-2 text-center",
        className,
      )}
      onClick={onClick}
    >
      {/* Album Art */}
      <div
        className="relative w-full flex-shrink-0"
        style={{ paddingBottom: "100%" }}
      >
        <img
          src={track.albumArt || "/placeholder-album.svg"}
          alt={track.title}
          className="absolute h-full w-full rounded-md object-cover"
          loading="lazy"
        />
      </div>

      {/* Track Info */}
      <div className="w-full min-w-0 flex-1">
        <h4
          className={cn(
            "truncate font-medium",
            TYPOGRAPHY.body.sm,
            COLORS.text.primary,
          )}
        >
          {track.title}
        </h4>
        <p
          className={cn("truncate", TYPOGRAPHY.body.xs, COLORS.text.secondary)}
        >
          {track.artist}
        </p>
      </div>
    </div>
  );
};
