import { useEffect, useState } from "react";
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
  const {
    trackMetadata,
    currentTrackId,
    songQueue,
    setNextTrack,
    replaceQueueWithTracks,
    isLoading,
  } = useCurrentTrackContext();

  const { user, isLoading: authLoading, login } = useAuth();
  const { rawResponse: weatherData } = useWeatherData();

  useEffect(() => {
    // Generate initial weather-based queue if authenticated and no queue exists
    if (user && !isLoading && songQueue.length === 0 && weatherData) {
      const weatherQueue = WeatherMusicService.generateWeatherBasedQueue(
        weatherData.main.temp,
        weatherData.weather[0].main.toLowerCase(),
        "afternoon",
        10,
      );
      replaceQueueWithTracks(weatherQueue);
    }
  }, [user, isLoading, songQueue.length, weatherData, replaceQueueWithTracks]);

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

    if (!weatherData) return;

    const newQueue = WeatherMusicService.generateDynamicDayQueue(
      weatherData.main.temp,
      weatherData.weather[0].main.toLowerCase(),
      12,
    );
    await replaceQueueWithTracks(newQueue);
    setMessage("Queue refreshed with new weather-based tracks!");
    setTimeout(() => setMessage(null), 2000);
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
    return (
      <div
        className={cn(LAYOUT.container.center, LAYOUT.padding.xl, className)}
      >
        <div className="text-center">
          <p className={cn("mb-4", COLORS.text.muted)}>
            No track currently playing.
          </p>
          <Button
            onClick={handleRefreshQueue}
            disabled={isLoading}
            variant="outline"
          >
            Generate Weather Playlist
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

      {/* Control Buttons */}
      <div className={cn("flex w-full gap-2", LAYOUT.spacing.md)}>
        <Button
          onClick={handleRefreshQueue}
          disabled={isLoading}
          variant="outline"
          className="flex-1"
        >
          🔄 Refresh
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
