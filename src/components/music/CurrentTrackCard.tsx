import { useEffect, useState, useRef } from "react";
import { useCurrentTrackContext } from "@/contexts/useCurrentTrackContext";
import { useAuth } from "@/hooks/useAuth";
import { WeatherMusicService } from "@/lib/weatherMusicService";
import { useWeatherData } from "@/hooks/useWeather";
import { Button } from "@/components/ui/button";
import { COLORS, TYPOGRAPHY, LAYOUT } from "@/lib/unifiedStyles";
import { cn } from "@/lib/utils";

interface CurrentTrackCardProps {
  className?: string;
}

/**
 * Spotify-integrated music player component that uses weather data to select tracks
 * Uses unified styling system for consistent appearance
 */
export function CurrentTrackCard({ className = "" }: CurrentTrackCardProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isAutoLoading, setIsAutoLoading] = useState(false);
  const [isGeneratingPlaylist, setIsGeneratingPlaylist] = useState(false);
  const hasGeneratedInitialQueue = useRef(false);
  const {
    trackMetadata,
    currentTrackId,
    songQueue,
    updateTrack,
    setNextTrack,
    replaceQueueWithTracks,
    isLoading,
  } = useCurrentTrackContext();

  const { user, isLoading: authLoading, login } = useAuth();
  const { rawResponse: weatherData } = useWeatherData();

  // Generate initial queue and auto-select first track when conditions are met
  useEffect(() => {
    if (
      user &&
      !isLoading &&
      songQueue.length === 0 &&
      !currentTrackId &&
      weatherData &&
      !hasGeneratedInitialQueue.current
    ) {
      hasGeneratedInitialQueue.current = true;
      setIsAutoLoading(true);

      const generateInitialPlaylist = async () => {
        try {
          const weatherQueue =
            await WeatherMusicService.generateWeatherBasedQueue(
              weatherData.main.temp,
              weatherData.weather[0].main.toLowerCase(),
              "afternoon",
              10,
            );

          if (weatherQueue.length > 0) {
            // Replace the queue with new tracks
            await replaceQueueWithTracks(weatherQueue);
            // Automatically select the first track
            await updateTrack(weatherQueue[0]);
          }
        } catch (error) {
          console.error("Error generating initial playlist:", error);
        } finally {
          setIsAutoLoading(false);
        }
      };

      generateInitialPlaylist();
    }

    // Reset the flag if user logs out
    if (!user) {
      hasGeneratedInitialQueue.current = false;
      setIsAutoLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading, songQueue.length, currentTrackId, weatherData]); // Intentionally excluding replaceQueueWithTracks and updateTrack to prevent infinite loop

  const handleLike = async () => {
    if (!currentTrackId) return;

    if (!user) {
      setMessage("Please log in to like tracks");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/liked`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ track_id: currentTrackId }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error || "Failed to like track"}`);
        return;
      }

      setMessage("Track liked!");
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      setMessage("Network error while liking track");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleNext = async () => {
    if (!user) {
      setMessage("Please log in to control playback");
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    await setNextTrack();
  };

  const handleRefreshQueue = async () => {
    if (!user) {
      setMessage("Please log in to generate weather playlists");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (!weatherData) {
      setMessage("Weather data not available. Please wait and try again.");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setIsGeneratingPlaylist(true);
    console.log("Starting weather playlist generation...");
    console.log("Weather data:", weatherData);

    try {
      const timeOfDay = (() => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) return "morning";
        if (hour >= 12 && hour < 17) return "afternoon";
        if (hour >= 17 && hour < 21) return "evening";
        return "night";
      })();

      console.log("Time of day:", timeOfDay);
      console.log("Temperature:", weatherData.main.temp);
      console.log(
        "Weather condition:",
        weatherData.weather[0].main.toLowerCase(),
      );

      const newQueue = await WeatherMusicService.generateWeatherBasedQueue(
        weatherData.main.temp,
        weatherData.weather[0].main.toLowerCase(),
        timeOfDay,
        12,
      );

      console.log("Generated queue:", newQueue);

      if (newQueue.length === 0) {
        setMessage(
          "No tracks found for current weather conditions. The music service may be temporarily unavailable.",
        );
        setTimeout(() => setMessage(null), 5000);
        return;
      }

      console.log("Replacing queue with tracks:", newQueue);
      await replaceQueueWithTracks(newQueue);
      console.log(
        "Queue replacement completed, current queue length:",
        songQueue.length,
      );

      // Automatically select the first track if the queue was empty before
      if (songQueue.length === 0 && newQueue.length > 0) {
        await updateTrack(newQueue[0]);
      }

      setMessage(
        `${songQueue.length > 0 ? "Queue refreshed" : "Playlist generated"} with ${newQueue.length} weather-based tracks!`,
      );
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      console.error("Error refreshing queue:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      if (
        errorMessage.includes("401") ||
        errorMessage.includes("Authentication")
      ) {
        setMessage("Authentication expired. Please log in again.");
      } else {
        setMessage(
          `Failed to refresh queue: ${errorMessage}. Please try again.`,
        );
      }
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setIsGeneratingPlaylist(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div
        className={cn(LAYOUT.container.center, LAYOUT.padding.xl, className)}
      >
        <div className="text-center">
          <div className={cn("mb-2", TYPOGRAPHY.body.lg, COLORS.text.muted)}>
            Loading music player...
          </div>
          <div className={cn(TYPOGRAPHY.body.sm, COLORS.text.muted)}>
            {authLoading
              ? "Checking authentication..."
              : "Finding music for your weather"}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={cn(LAYOUT.container.center, LAYOUT.padding.xl, className)}
      >
        <div className="text-center">
          <div className={cn("mb-4", TYPOGRAPHY.body.lg, COLORS.text.muted)}>
            Please log in to access the music player
          </div>
          <Button
            onClick={login}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Login with Spotify
          </Button>
        </div>
      </div>
    );
  }

  if (!trackMetadata || !currentTrackId) {
    // Show loading state if we're auto-loading the first track
    if (
      isAutoLoading ||
      (user &&
        weatherData &&
        songQueue.length === 0 &&
        !hasGeneratedInitialQueue.current)
    ) {
      return (
        <div
          className={cn(LAYOUT.container.center, LAYOUT.padding.xl, className)}
        >
          <div className="text-center">
            <div className={cn("mb-2", TYPOGRAPHY.body.lg, COLORS.text.muted)}>
              Setting up your weather playlist...
            </div>
            <div className={cn(TYPOGRAPHY.body.sm, COLORS.text.muted)}>
              Finding the perfect music for your weather
            </div>
          </div>
        </div>
      );
    }

    // Only show the manual generation UI if auto-loading has completed but no track is selected
    return (
      <div
        className={cn(LAYOUT.container.center, LAYOUT.padding.xl, className)}
      >
        <div className="text-center">
          <p className={cn("mb-4", COLORS.text.muted)}>
            {songQueue.length > 0
              ? "Queue ready. Select a track to play."
              : "No track currently playing."}
          </p>
          <Button
            onClick={handleRefreshQueue}
            disabled={isLoading || isGeneratingPlaylist}
            variant="outline"
          >
            {isGeneratingPlaylist
              ? "Generating..."
              : songQueue.length > 0
                ? "Refresh Playlist"
                : "Generate Weather Playlist"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        LAYOUT.container.column,
        "items-center justify-center",
        LAYOUT.spacing.md,
        className,
      )}
    >
      {/* Track Information */}
      <div className="mb-4 w-full text-center">
        <h3 className={cn(TYPOGRAPHY.display.md, COLORS.text.primary, "mb-1")}>
          {trackMetadata.title}
        </h3>
        <p className={cn(TYPOGRAPHY.body.base, COLORS.text.secondary)}>
          {trackMetadata.artist}
        </p>
      </div>

      {/* Spotify Embed Player */}
      {currentTrackId && /^[a-zA-Z0-9]{22}$/.test(currentTrackId) ? (
        <div className="w-full">
          <iframe
            key={`${currentTrackId}`}
            src={`https://open.spotify.com/embed/track/${currentTrackId}`}
            width="100%"
            height="160"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            title="Spotify Player"
            className="rounded-lg shadow-lg"
          />
        </div>
      ) : (
        <div className="w-full py-8 text-center">
          <div className={cn(TYPOGRAPHY.body.lg, COLORS.text.muted)}>
            Unable to load this track. Please try another song.
          </div>
        </div>
      )}

      {/* Queue Status */}
      {songQueue.length > 0 && (
        <div className="w-full text-center">
          <p className={cn("text-xs", COLORS.text.muted)}>
            Queue: {songQueue.length} track{songQueue.length !== 1 ? "s" : ""}{" "}
            ready
          </p>
        </div>
      )}

      {/* Control Buttons */}
      <div className={cn("flex w-full gap-2", LAYOUT.spacing.md)}>
        <Button
          onClick={handleRefreshQueue}
          disabled={isLoading}
          variant="outline"
          className={cn("flex-1", songQueue.length > 1 ? "opacity-75" : "")}
        >
          {songQueue.length > 1 ? "🔄 Refresh Queue" : "🎵 Generate Playlist"}
        </Button>

        <Button
          onClick={handleLike}
          disabled={isLoading}
          variant="outline"
          className="flex-1"
        >
          ♡ Like
        </Button>

        <Button
          onClick={handleNext}
          disabled={isLoading || songQueue.length === 0}
          variant="outline"
          className="flex-1"
        >
          Next ▷
        </Button>
      </div>

      {/* Message Display */}
      {message && (
        <div className="w-full rounded-md bg-gray-100 p-3 text-center text-sm text-gray-700 dark:bg-slate-700 dark:text-slate-300">
          {message}
        </div>
      )}
    </div>
  );
}
