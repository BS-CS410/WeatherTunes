import { useEffect, useState, useRef } from "react";
import { getSpotifyTrackForWeather } from "@/lib/spotifyWeather";
import { useCurrentTrackContext } from "@/contexts/useCurrentTrackContext";
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
  const [queue, setQueue] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [isChangingTrack, setIsChangingTrack] = useState(false);
  const { updateTrack } = useCurrentTrackContext();
  const apiKey = import.meta.env.VITE_PUBLIC_OPENWEATHER_API_KEY;
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent re-running during navigation - only run once on mount
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    getSpotifyTrackForWeather(apiKey)
      .then((weatherTrackId) => {
        // Build queue starting with weather track, followed by others without duplicates
        // const newQueue = [ // Simplified queue logic, directly use weather track or fallback
        //   weatherTrackId,
        //   ...sampleQueue.filter((t) => t !== weatherTrackId),
        // ];
        // setQueue(newQueue);
        // setCurrentIndex(0);
        setQueue([weatherTrackId]); // Initialize queue with only the weather-based track
        setCurrentIndex(0);
        setLoading(false);
        // Update track metadata for the first track
        updateTrack(weatherTrackId);
      })
      .catch(() => {
        // setQueue(sampleQueue); // Fallback to an empty queue or a predefined default if API fails
        // setCurrentIndex(0);
        setQueue([]); // Set an empty queue on error
        setCurrentIndex(0); // Reset index
        setLoading(false);
        setMessage(
          "Failed to load weather-based track. Please try again later.",
        ); // Inform user of failure
        // Update track metadata for the first track in sample queue
        // if (sampleQueue.length > 0) { // No sample queue, so this is not needed
        //   updateTrack(sampleQueue[0]);
        // }
      });
  }, [apiKey, updateTrack]); // Keep dependencies but use ref guard

  const trackId = queue.length > 0 ? queue[currentIndex] : null; // Ensure trackId is null if queue is empty

  const handleLike = async () => {
    if (!trackId) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/liked", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ track_id: trackId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error || "Failed to like track"}`);
        return;
      }

      setMessage("Track liked!");
      setTimeout(() => setMessage(null), 2000); // Clear message after 2 seconds
    } catch (error) {
      setMessage("Network error while liking track");
    }
  };

  const handleNext = async () => {
    if (queue.length === 0 || isChangingTrack) return;
    setIsChangingTrack(true);

    // const nextIndex = (currentIndex + 1) % queue.length; // Simplified: only one track in queue for now
    // setCurrentIndex(nextIndex);
    // For now, with a single track queue, "Next" and "Back" might not be meaningful
    // or could re-fetch/refresh the current track or a new weather-based track.
    // This part needs clarification on desired behavior for a single-item or dynamic queue.
    setMessage(
      "Next track functionality is not yet fully implemented for the current queue setup.",
    );
    setTimeout(() => {
      // updateTrack(queue[nextIndex]);
      setIsChangingTrack(false);
      setMessage(null); // Clear message after a bit
    }, 1500); // Increased delay
  };

  const handleBack = async () => {
    if (queue.length === 0 || isChangingTrack) return;
    setIsChangingTrack(true);

    // const prevIndex = (currentIndex - 1 + queue.length) % queue.length; // Simplified
    // setCurrentIndex(prevIndex);
    setMessage(
      "Previous track functionality is not yet fully implemented for the current queue setup.",
    );
    setTimeout(() => {
      // updateTrack(queue[prevIndex]);
      setIsChangingTrack(false);
      setMessage(null); // Clear message
    }, 1500); // Increased delay
  };

  if (loading) {
    return (
      <div
        className={cn(LAYOUT.container.center, LAYOUT.padding.xl, className)}
      >
        <div className="text-center">
          <div className={cn("mb-2", TYPOGRAPHY.body.lg, COLORS.text.muted)}>
            Loading Spotify player...
          </div>
          <div className={cn(TYPOGRAPHY.body.sm, COLORS.text.muted)}>
            Finding music for your weather
          </div>
        </div>
      </div>
    );
  }

  if (!trackId) {
    return (
      <div
        className={cn(LAYOUT.container.center, LAYOUT.padding.xl, className)}
      >
        <p className={cn(COLORS.text.muted)}>No track to play.</p>
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
      {/* Spotify Embed Player */}
      <div className="w-full">
        <iframe
          key={`${trackId}`}
          src={`https://open.spotify.com/embed/track/${trackId}`}
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
      <div className={cn("flex w-full", LAYOUT.spacing.md)}>
        <Button
          onClick={handleBack}
          disabled={isChangingTrack}
          variant={isChangingTrack ? "ghost" : "outline"}
          className="flex-1"
        >
          ◁ Back
        </Button>

        <Button
          onClick={handleLike}
          disabled={isChangingTrack}
          variant={isChangingTrack ? "ghost" : "outline"}
          className="flex-1"
        >
          ♡ Like
        </Button>

        <Button
          onClick={handleNext}
          disabled={isChangingTrack}
          variant={isChangingTrack ? "ghost" : "outline"}
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
