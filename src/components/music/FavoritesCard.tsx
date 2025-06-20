import { useEffect, useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { COLORS, TYPOGRAPHY, LAYOUT } from "@/lib/unifiedStyles";
import { cn } from "@/lib/lib-utils";
import { useAuth } from "@/hooks/hooks-index";
import { SpotifyMiniPlayer } from "./SpotifyMiniPlayer";
import { useCurrentTrackContext } from "@/hooks/useCurrentTrack";
import type { TrackMetadata } from "@/types/queue-types";

interface FavoritesCardProps {
  className?: string;
}

interface FavoriteTrack {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  albumArtFallback?: string;
  tags?: string[];
}

/**
 * User's liked tracks display component with horizontal scrolling
 * Uses unified styling system for consistent appearance
 */
export function FavoritesCard({ className = "" }: FavoritesCardProps) {
  const { user } = useAuth();
  const [likedTracks, setLikedTracks] = useState<FavoriteTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { updateTrack } = useCurrentTrackContext();

  /**
   * Handle track selection from mini player
   */
  const handleTrackPlay = async (track: FavoriteTrack) => {
    try {
      await updateTrack(track.id);
    } catch (error) {
      console.error("Failed to play track:", error);
    }
  };

  useEffect(() => {
    async function fetchLikedTracks() {
      // Only fetch if user is authenticated
      if (!user) {
        setLikedTracks([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/liked`,
          {
            credentials: "include",
          },
        );
        if (!res.ok)
          throw new Error(`Error fetching liked tracks: ${res.status}`);
        const data = await res.json();
        setLikedTracks(data.favorites || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchLikedTracks();
  }, [user]); // Add user dependency

  // Show login prompt when not authenticated
  if (!user) {
    return (
      <div
        className={cn(LAYOUT.container.center, LAYOUT.padding.xl, className)}
      >
        <div className="text-center">
          <p className={cn(TYPOGRAPHY.body.lg, COLORS.text.muted)}>
            Please log into Spotify to view your liked tracks.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={cn(LAYOUT.container.center, LAYOUT.padding.xl, className)}
      >
        <div className="text-center">
          <div className={cn("mb-2", TYPOGRAPHY.body.lg, COLORS.text.muted)}>
            Loading liked tracks...
          </div>
          <div className={cn(TYPOGRAPHY.body.sm, COLORS.text.muted)}>
            Fetching your favorites
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    if (error.includes("401")) {
      return (
        <div
          className={cn(LAYOUT.container.center, LAYOUT.padding.xl, className)}
        >
          <div className="text-center">
            <p className={cn(TYPOGRAPHY.body.lg, COLORS.text.muted)}>
              Please log into Spotify to view your liked tracks.
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className={cn(
                "mt-4 rounded-xl bg-[#1DB954] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#1ED760]",
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
      <div
        className={cn(LAYOUT.container.center, LAYOUT.padding.xl, className)}
      >
        <p className="text-center text-red-500">
          Error loading liked tracks: {error}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full", className)}>
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
                    albumArt: track.albumArt,
                    albumArtFallback: track.albumArtFallback,
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
