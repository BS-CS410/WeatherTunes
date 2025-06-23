import { useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { COLORS, TYPOGRAPHY, CARD_STYLES } from "@/lib";
import { cn } from "@/lib";
import { useAuth } from "@/hooks/useAuth";
import { SpotifyMiniPlayer } from "@/components/music/SpotifyMiniPlayer";
import { useSpotifyLikedTracks, useSpotifyQueue } from "@/hooks/spotify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TrackMetadata } from "@/types/queue-types";
import { LoadingSpinner } from "@/components/shared/StatusComponents";
import { ErrorDisplay } from "@/components/shared/StatusComponents";

interface FavoritesCardProps {
  className?: string;
}

/**
 * Renders a card that displays the user's liked Spotify tracks.
 * Features a horizontally scrollable list of tracks.
 * Handles loading, error, and empty states gracefully.
 */
export function FavoritesCard({ className = "" }: FavoritesCardProps) {
  const { user } = useAuth();
  const {
    tracks: likedTracks,
    isLoading,
    error,
  } = useSpotifyLikedTracks({ enabled: user !== null, limit: 50 });
  const { playTrack } = useSpotifyQueue();
  const [playError, setPlayError] = useState<string | null>(null);

  const handleTrackPlay = async (track: TrackMetadata) => {
    try {
      await playTrack(track.id);
      setPlayError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to play track.";
      setPlayError(message);
    }
  };

  const renderContent = () => {
    if (!user) {
      return (
        <div className="flex h-48 flex-col items-center justify-center text-center">
          <p className={cn(TYPOGRAPHY.body.lg, COLORS.text.muted, "mb-4")}>
            Please log in to see your liked tracks.
          </p>
          <Button onClick={() => (window.location.href = "/login")}>
            Login with Spotify
          </Button>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex h-48 items-center justify-center">
          <LoadingSpinner message="Loading liked tracks..." />
        </div>
      );
    }

    if (error) {
      return (
        <ErrorDisplay
          title="Could not load liked tracks"
          message={error}
          className="h-48"
        />
      );
    }

    if (!likedTracks || likedTracks.length === 0) {
      return (
        <div className="flex h-48 items-center justify-center text-center">
          <p className={cn(TYPOGRAPHY.body.lg, COLORS.text.muted)}>
            No liked tracks found on your Spotify account.
          </p>
        </div>
      );
    }

    return (
      <>
        {playError && (
          <div className="mb-2 text-sm text-red-500">{playError}</div>
        )}
        <ScrollArea.Root className="w-full">
          <ScrollArea.Viewport className="w-full">
            <div className="flex space-x-2 py-2">
              {likedTracks.map((track) => (
                <div
                  key={track.id}
                  className="w-32 flex-shrink-0 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105"
                  onClick={() => handleTrackPlay(track)}
                >
                  <SpotifyMiniPlayer
                    track={track}
                    className={cn(CARD_STYLES.sunken, "rounded-lg p-3")}
                  />
                </div>
              ))}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            orientation="horizontal"
            className="flex-touch-scroll mt-2 h-2"
          >
            <ScrollArea.Thumb className="relative flex-1 rounded-full bg-slate-500/50" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </>
    );
  };

  return (
    <Card variant="interactive" className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle
          className={cn(
            TYPOGRAPHY.heading.h4,
            "font-semibold",
            COLORS.text.primary,
          )}
        >
          Liked Tracks
        </CardTitle>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
