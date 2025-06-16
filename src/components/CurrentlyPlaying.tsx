import React, { useEffect, useState } from "react";
import { getSpotifyTrackForWeather } from "@/lib/spotifyWeather";

const sampleQueue = [
  "2TpxZ7JUBn3uw46aR7qd6V", // Example tracks
  "7ouMYWpwJ422jRcDASZB7P",
  "1lDWb6b6ieDQ2xT7ewTC3G",
];

interface CurrentlyPlayingProps {
  className?: string;
}

/**
 * Spotify-integrated music player component that uses weather data to select tracks
 * Integrates seamlessly with the MUI-based design system
 */
const CurrentlyPlaying: React.FC<CurrentlyPlayingProps> = ({
  className = "",
}) => {
  const [queue, setQueue] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const apiKey = import.meta.env.VITE_PUBLIC_OPENWEATHER_API_KEY;

  useEffect(() => {
    getSpotifyTrackForWeather(apiKey)
      .then((weatherTrackId) => {
        // Build queue starting with weather track, followed by others without duplicates
        const newQueue = [
          weatherTrackId,
          ...sampleQueue.filter((t) => t !== weatherTrackId),
        ];
        setQueue(newQueue);
        setCurrentIndex(0);
        setLoading(false);
      })
      .catch(() => {
        setQueue(sampleQueue);
        setCurrentIndex(0);
        setLoading(false);
      });
  }, [apiKey]);

  const trackId = queue[currentIndex];

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

  const handleNext = () => {
    if (queue.length === 0) return;
    const nextIndex = (currentIndex + 1) % queue.length;
    setCurrentIndex(nextIndex);
    setMessage(null);
  };

  const handleBack = () => {
    if (queue.length === 0) return;
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentIndex(prevIndex);
    setMessage(null);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center text-gray-600 dark:text-slate-300">
          <div className="mb-2 text-lg">Loading Spotify player...</div>
          <div className="text-sm">Finding music for your weather</div>
        </div>
      </div>
    );
  }

  if (!trackId) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <p className="text-gray-600 dark:text-slate-300">No track to play.</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-4 ${className}`}
    >
      {/* Spotify Embed Player */}
      <div className="w-full max-w-md">
        <iframe
          key={trackId} // ensures iframe reloads when track changes
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
      <div className="flex space-x-3">
        <button
          onClick={handleBack}
          className="rounded-lg bg-white/40 px-4 py-2 font-medium text-gray-900 shadow-md backdrop-blur-md transition-all duration-200 hover:bg-white/60 hover:shadow-lg dark:bg-slate-900/75 dark:text-slate-100 dark:hover:bg-slate-900/90"
        >
          ◁ Back
        </button>

        <button
          onClick={handleLike}
          className="rounded-lg bg-white/40 px-4 py-2 font-medium text-gray-900 shadow-md backdrop-blur-md transition-all duration-200 hover:bg-white/60 hover:shadow-lg dark:bg-slate-900/75 dark:text-slate-100 dark:hover:bg-slate-900/90"
        >
          Like ♡
        </button>

        <button
          onClick={handleNext}
          className="rounded-lg bg-white/40 px-4 py-2 font-medium text-gray-900 shadow-md backdrop-blur-md transition-all duration-200 hover:bg-white/60 hover:shadow-lg dark:bg-slate-900/75 dark:text-slate-100 dark:hover:bg-slate-900/90"
        >
          Next ▷
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div className="max-w-md rounded-md bg-gray-100 p-2 text-center text-sm text-gray-700 dark:bg-slate-700 dark:text-slate-300">
          {message}
        </div>
      )}
    </div>
  );
};

export default CurrentlyPlaying;
