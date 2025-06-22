import { useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { COLORS, TYPOGRAPHY, LAYOUT } from "@/lib";
import { cn } from "@/lib";
import { useAuth } from "@/hooks/useAuth";
import { SpotifyMiniPlayer } from "./SpotifyMiniPlayer";
import { useSpotifyLikedTracks, useSpotifyQueue } from "@/hooks/spotify";
import type { TrackMetadata } from "@/types/queue-types";

interface FavoritesCardProps {
  className?: string;
}

/**
 * User's liked tracks display component with horizontal scrolling
 * Uses unified styling system for consistent appearance
 */
export function FavoritesCard({ className = "" }: FavoritesCardProps) {
  const { user } = useAuth();
  const {
    tracks: likedTracks,
    isLoading: loading,
    error,
  } = useSpotifyLikedTracks(50);
  const { playTrack } = useSpotifyQueue();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTrackPlay = async (track: TrackMetadata) => {
    try {
      await playTrack(track.id);
      setErrorMessage(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to play track";
      setErrorMessage(message);
    }
  };

  if (loading) {
    return (
      <div
        className={cn(LAYOUT.container.center, LAYOUT.padding.xl, className)}
      >
        <p className={cn(TYPOGRAPHY.body.lg, COLORS.text.muted)}>
          Loading your liked tracks...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(LAYOUT.container.center, LAYOUT.padding.xl, className)}
      >
        <div className="text-center">
          <p className={cn(TYPOGRAPHY.body.lg, "mb-2 text-red-500")}>
            Failed to load liked tracks
          </p>
          <p className={cn(TYPOGRAPHY.body.sm, COLORS.text.muted)}>{error}</p>
        </div>
      </div>
    );
  }

  if (!likedTracks?.length) {
    return (
      <div
        className={cn(LAYOUT.container.center, LAYOUT.padding.xl, className)}
      >
        <p className={cn(TYPOGRAPHY.body.lg, COLORS.text.muted)}>
          No liked tracks found. Start by liking some songs on Spotify!
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={cn(LAYOUT.container.center, LAYOUT.padding.xl, className)}
      >
        <div className="text-center">
          <p className={cn(TYPOGRAPHY.body.lg, COLORS.text.muted, "mb-4")}>
            Please log into Spotify to view your liked tracks.
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
    );
  }

  return (
    <div className={cn("relative w-full", className)}>
      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}
      <div className={LAYOUT.padding.section.md}>
        <h3 className={cn(TYPOGRAPHY.display.xl, COLORS.text.primary)}>
          liked tracks:
        </h3>
      </div>

      <ScrollArea.Root className="relative z-0 w-full overflow-x-auto px-2">
        <ScrollArea.Viewport className="w-full">
          <div
            className={cn(
              "flex min-w-max flex-row",
              LAYOUT.padding.section.sm,
              LAYOUT.spacing.micro,
            )}
          >
            {likedTracks.length === 0 ? (
              <div className={cn(LAYOUT.container.center, LAYOUT.padding.xl)}>
                <div className="text-center">
                  <p className={cn(TYPOGRAPHY.body.lg, COLORS.text.muted)}>
                    No liked tracks found.
                  </p>
                  <p
                    className={cn(
                      "mt-2",
                      TYPOGRAPHY.body.sm,
                      COLORS.text.muted,
                    )}
                  >
                    Start liking tracks to see them here!
                  </p>
                </div>
              </div>
            ) : (
              likedTracks.map((track) => (
                <SpotifyMiniPlayer
                  key={track.id}
                  track={{
                    id: track.id,
                    title: track.title,
                    artist: track.artist,
                    album: track.album,
                    albumArt: track.albumArt,
                    albumArtFallback: track.albumArtFallback,
                    duration: track.duration,
                    previewUrl: track.previewUrl,
                    externalUrl: track.externalUrl,
                    uri: track.uri,
                    tags: track.tags,
                  }}
                  className="w-[280px] flex-shrink-0"
                  onClick={() => handleTrackPlay(track)}
                />
              ))
            )}
          </div>
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar orientation="horizontal" className="h-2">
          <ScrollArea.Thumb className="rounded-full bg-slate-600" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}
