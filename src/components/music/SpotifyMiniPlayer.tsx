/**
 * Spotify Mini Player Component
 * Compact player for favorites and search results
 */

import React, { useCallback } from "react";
import { useSpotifyPlayer } from "@/hooks/useSpotifyPlayer";
import { Play, Pause } from "lucide-react";
import type { TrackMetadata } from "@/types/queue-types";

interface SpotifyMiniPlayerProps {
  track: TrackMetadata;
  className?: string;
  size?: "sm" | "md";
  onClick?: () => void;
}

/**
 * Compact Spotify player for individual tracks
 */
export const SpotifyMiniPlayer: React.FC<SpotifyMiniPlayerProps> = ({
  track,
  className = "",
  size = "md",
  onClick,
}) => {
  const { state, controls } = useSpotifyPlayer();

  const isCurrentTrack = state.currentTrack?.id === track.id;
  const isPlaying = isCurrentTrack && state.isPlaying;

  /**
   * Handle play/pause toggle
   */
  const handlePlayPause = useCallback(
    async (event: React.MouseEvent) => {
      event.stopPropagation();

      if (isCurrentTrack) {
        // Toggle current track
        if (isPlaying) {
          await controls.pause();
        } else {
          await controls.play();
        }
      } else {
        // Play new track via queue system
        onClick?.();
      }
    },
    [isCurrentTrack, isPlaying, controls, onClick],
  );

  const imageSize = size === "sm" ? "w-12 h-12" : "w-16 h-16";
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const buttonSize = size === "sm" ? "p-2" : "p-3";

  return (
    <div
      className={`group hover:bg-muted/50 flex cursor-pointer items-center space-x-3 rounded-lg p-3 transition-colors ${className}`}
      onClick={onClick}
    >
      {/* Album Art with Play Button Overlay */}
      <div className="relative flex-shrink-0">
        <img
          src={
            track.albumArt || track.albumArtFallback || "/placeholder-album.svg"
          }
          alt={track.title}
          className={`${imageSize} rounded object-cover`}
        />

        {/* Play/Pause Overlay */}
        <div className="absolute inset-0 flex items-center justify-center rounded bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={handlePlayPause}
            className={`${buttonSize} bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-colors`}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className={iconSize} />
            ) : (
              <Play className={iconSize} />
            )}
          </button>
        </div>

        {/* Currently Playing Indicator */}
        {isCurrentTrack && (
          <div className="bg-primary absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full" />
        )}
      </div>

      {/* Track Info */}
      <div className="min-w-0 flex-1">
        <h4
          className={`text-foreground truncate font-medium ${size === "sm" ? "text-sm" : "text-base"}`}
        >
          {track.title}
        </h4>
        <p
          className={`text-muted-foreground truncate ${size === "sm" ? "text-xs" : "text-sm"}`}
        >
          {track.artist}
        </p>

        {/* Tags */}
        {track.tags && track.tags.length > 0 && size !== "sm" && (
          <div className="mt-1 flex flex-wrap gap-1">
            {track.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-muted text-muted-foreground inline-block rounded-full px-2 py-0.5 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Playing Animation */}
      {isPlaying && (
        <div className="flex items-center space-x-1">
          <div
            className="bg-primary h-3 w-1 animate-pulse rounded-full"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="bg-primary h-4 w-1 animate-pulse rounded-full"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="bg-primary h-2 w-1 animate-pulse rounded-full"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      )}
    </div>
  );
};
