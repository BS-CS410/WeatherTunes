/**
 * Spotify Web Player Component
 * Custom playback interface with full controls and queue integration
 */

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSpotifyPlayer } from "@/hooks/useSpotifyPlayer";
import { useAuth } from "@/hooks/useAuth";
import { useSpotifyQueue } from "@/hooks/useSpotifyQueue";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
} from "lucide-react";

interface SpotifyWebPlayerProps {
  className?: string;
  showQueueInfo?: boolean;
}

/**
 * Main Spotify Web Player component with full playback controls
 */
export const SpotifyWebPlayer: React.FC<SpotifyWebPlayerProps> = ({
  className = "",
  showQueueInfo = true,
}) => {
  const { state, controls, initialize } = useSpotifyPlayer();
  const { user, login } = useAuth();

  // Get queue data from Spotify queue hook
  const { currentTrack, upcomingTracks, playNext } = useSpotifyQueue();
  const trackMetadata = currentTrack;
  const currentTrackId = currentTrack?.id || null;
  const songQueue = upcomingTracks;

  const [isInitialized, setIsInitialized] = useState(false);
  const [userVolume, setUserVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  /**
   * Handle next track - integrates with queue system
   */
  const handleNextTrack = useCallback(async () => {
    try {
      // Use CurrentTrackProvider's queue management
      await playNext();

      // If that fails, try player's next track
      if (!(await controls.nextTrack())) {
        console.warn("Failed to advance to next track");
      }
    } catch (error) {
      console.error("Error advancing to next track:", error);
    }
  }, [playNext, controls]);

  /**
   * Initialize player on mount
   */
  useEffect(() => {
    if (!isInitialized && user) {
      setAuthError(null);
      initialize()
        .then((success) => {
          setIsInitialized(success);
          if (!success) {
            // User check is already handled by useAuth hook
            if (!user) {
              setAuthError("Authentication expired. Please log in again.");
            }
          }
        })
        .catch((error) => {
          console.error("Player initialization error:", error);
          setIsInitialized(true); // Set to true to stop loading state

          // Check for auth-related errors
          if (
            error.message.includes("not authenticated") ||
            error.message.includes("401")
          ) {
            setAuthError("Authentication required. Please log in again.");
            // User needs to log in again
          } else {
            setAuthError("Player initialization failed. Please try again.");
          }
        });
    }
  }, [isInitialized, initialize, user]);

  /**
   * Handle track advancement when song ends
   */
  useEffect(() => {
    if (
      state.isReady &&
      state.currentTrack &&
      !state.isPlaying &&
      state.position > 0
    ) {
      // Check if track finished (position near duration)
      const progressPercent = (state.position / state.duration) * 100;
      if (progressPercent > 95) {
        console.log("Track finished, advancing to next track");
        handleNextTrack();
      }
    }
  }, [
    state.isPlaying,
    state.position,
    state.duration,
    state.isReady,
    state.currentTrack,
    handleNextTrack,
  ]);

  /**
   * Sync with CurrentTrackProvider when track changes externally
   * Using refs to prevent infinite loops
   */
  const lastTrackIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (state.isReady && currentTrackId) {
      // Only trigger if track ID actually changed
      if (lastTrackIdRef.current !== currentTrackId) {
        lastTrackIdRef.current = currentTrackId;

        // Check if we need to play a new track
        if (state.currentTrack?.id !== currentTrackId) {
          // Track changes are handled through the queue system
          console.log("Track changed externally, handled by queue system");
        }
      }
    } else {
      lastTrackIdRef.current = currentTrackId;
    }
  }, [currentTrackId, state.isReady, state.currentTrack?.id]);

  /**
   * Handle previous track
   */
  const handlePreviousTrack = useCallback(async () => {
    if (!(await controls.previousTrack())) {
      console.warn("Failed to go to previous track");
    }
  }, [controls]);

  /**
   * Handle play/pause toggle
   */
  const handlePlayPause = useCallback(async () => {
    if (state.isPlaying) {
      await controls.pause();
    } else {
      await controls.play();
    }
  }, [state.isPlaying, controls]);

  /**
   * Handle seek
   */
  const handleSeek = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const percent = (event.clientX - rect.left) / rect.width;
      const newPosition = percent * state.duration;
      controls.seek(newPosition);
    },
    [state.duration, controls],
  );

  /**
   * Handle volume change
   */
  const handleVolumeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const volume = parseInt(event.target.value, 10);
      setUserVolume(volume);
      if (!isMuted) {
        controls.setVolume(volume / 100);
      }
    },
    [isMuted, controls],
  );

  /**
   * Handle mute toggle
   */
  const handleMuteToggle = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      controls.setVolume(userVolume / 100);
    } else {
      setIsMuted(true);
      controls.setVolume(0);
    }
  }, [isMuted, userVolume, controls]);

  /**
   * Format time for display
   */
  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  /**
   * Render loading state
   */
  if (!user) {
    return (
      <div className={`flex items-center justify-center p-6 ${className}`}>
        <p className="text-muted-foreground">
          Please log in to use the music player
        </p>
      </div>
    );
  }

  if (state.isLoading || !isInitialized) {
    return (
      <div className={`flex items-center justify-center p-6 ${className}`}>
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
        <span className="text-muted-foreground ml-3">
          Initializing player...
        </span>
      </div>
    );
  }

  /**
   * Render error state
   */
  if (state.error || authError) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-4">
          <p className="text-destructive text-sm">
            {authError
              ? `Auth Error: ${authError}`
              : `Player Error: ${state.error}`}
          </p>
          <button
            onClick={() => {
              if (authError) {
                login();
              } else {
                initialize();
              }
            }}
            className="text-destructive mt-2 text-xs hover:underline"
          >
            {authError ? "Log In Again" : "Retry"}
          </button>
        </div>
      </div>
    );
  }

  /**
   * Render no track state
   */
  if (!state.currentTrack && !trackMetadata) {
    return (
      <div className={`flex items-center justify-center p-6 ${className}`}>
        <p className="text-muted-foreground">No track selected</p>
      </div>
    );
  }

  const displayTrack = state.currentTrack || {
    name: trackMetadata?.title || "Unknown Track",
    artists: [trackMetadata?.artist || "Unknown Artist"],
    album: "Unknown Album",
    image: trackMetadata?.albumArt || "",
  };

  const progressPercent =
    state.duration > 0 ? (state.position / state.duration) * 100 : 0;

  return (
    <div
      className={`bg-background/95 rounded-lg border p-6 backdrop-blur-sm ${className}`}
    >
      {/* Track Info */}
      <div className="mb-4 flex items-center space-x-4">
        {displayTrack.image && (
          <img
            src={displayTrack.image}
            alt={displayTrack.album}
            className="h-16 w-16 rounded-lg object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-foreground truncate font-semibold">
            {displayTrack.name}
          </h3>
          <p className="text-muted-foreground truncate text-sm">
            {Array.isArray(displayTrack.artists)
              ? displayTrack.artists.join(", ")
              : displayTrack.artists}
          </p>
          <p className="text-muted-foreground truncate text-xs">
            {displayTrack.album}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="text-muted-foreground mb-1 flex items-center space-x-2 text-xs">
          <span>{formatTime(state.position)}</span>
          <span className="flex-1"></span>
          <span>{formatTime(state.duration)}</span>
        </div>
        <div
          className="bg-muted h-2 w-full cursor-pointer rounded-full"
          onClick={handleSeek}
        >
          <div
            className="bg-primary h-2 rounded-full transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Previous Track */}
          <button
            onClick={handlePreviousTrack}
            className="hover:bg-muted rounded-full p-2 transition-colors"
            title="Previous Track"
          >
            <SkipBack className="h-5 w-5" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={handlePlayPause}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-3 transition-colors"
            title={state.isPlaying ? "Pause" : "Play"}
          >
            {state.isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </button>

          {/* Next Track */}
          <button
            onClick={handleNextTrack}
            className="hover:bg-muted rounded-full p-2 transition-colors"
            title="Next Track"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleMuteToggle}
            className="hover:bg-muted rounded p-1 transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={userVolume}
            onChange={handleVolumeChange}
            className="bg-muted slider h-2 w-20 cursor-pointer appearance-none rounded-lg"
            title="Volume"
          />
        </div>
      </div>

      {/* Queue Info */}
      {showQueueInfo && songQueue.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <p className="text-muted-foreground text-xs">
            Queue: {songQueue.length} tracks remaining
          </p>
        </div>
      )}
    </div>
  );
};
