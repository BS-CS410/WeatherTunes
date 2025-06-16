import React, { useEffect, useState } from "react";
import { getSpotifyTrackForWeather } from "@/lib/spotifyWeather";

const sampleQueue = [
  "2TpxZ7JUBn3uw46aR7qd6V", // Example tracks
  "7ouMYWpwJ422jRcDASZB7P",
  "1lDWb6b6ieDQ2xT7ewTC3G",
];

const CurrentlyPlaying = () => {
  const [queue, setQueue] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  useEffect(() => {
    getSpotifyTrackForWeather(apiKey)
      .then((weatherTrackId) => {
        // Build queue starting with weather track, followed by others without duplicates
        const newQueue = [weatherTrackId, ...sampleQueue.filter((t) => t !== weatherTrackId)];
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
      const res = await fetch("http://localhost:8000/liked", {
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
      window.location.reload();
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

  if (loading) return <p>Loading Spotify player...</p>;

  if (!trackId) return <p>No track to play.</p>;

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-4">
      <iframe
        key={trackId} // ensures iframe reloads when track changes
        src={`https://open.spotify.com/embed/track/${trackId}`}
        width="100%"
        height="160"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        title="Spotify Player"
      />

      <div className="flex space-x-4">
        <button
          onClick={handleBack}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          ◀️ Back
        </button>

        <button
          onClick={handleLike}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Like ❤️
        </button>

        <button
          onClick={handleNext}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Next ▶️
        </button>
      </div>

      {message && <p className="mt-1 text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default CurrentlyPlaying;
