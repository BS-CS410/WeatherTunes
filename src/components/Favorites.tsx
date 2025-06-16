import React, { useEffect, useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";

interface FavoritesProps {
  className?: string;
}

/**
 * User's liked tracks display component with horizontal scrolling
 * Integrates with backend to fetch and display liked Spotify tracks
 */
const Favorites: React.FC<FavoritesProps> = ({ className = "" }) => {
  const [likedTracks, setLikedTracks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLikedTracks() {
      try {
        const res = await fetch("http://127.0.0.1:8000/liked", {
          credentials: "include",
        });
        if (!res.ok)
          throw new Error(`Error fetching liked tracks: ${res.status}`);
        const data = await res.json();
        setLikedTracks((data.favorites || []).reverse());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchLikedTracks();
  }, []);

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center text-gray-600 dark:text-slate-300">
          <div className="mb-2 text-lg">Loading liked tracks...</div>
          <div className="text-sm">Fetching your favorites</div>
        </div>
      </div>
    );
  }

  if (error) {
    if (error.includes("401")) {
      return (
        <div className={`flex items-center justify-center p-8 ${className}`}>
          <div className="text-center">
            <p className="text-lg text-gray-600 dark:text-slate-300">
              Please log into Spotify to view your liked tracks.
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="mt-4 rounded-lg bg-[#1DB954] px-6 py-2 text-white transition-colors hover:bg-[#1ED760]"
            >
              Login to Spotify
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <p className="text-center text-red-500">
          Error loading liked tracks: {error}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div className="px-4 pb-4 pl-2">
        <h3 className="text-5xl font-extralight tracking-wider text-gray-900 lowercase dark:text-slate-200">
          liked tracks:
        </h3>
      </div>

      <ScrollArea.Root className="relative z-0 w-full overflow-x-auto px-2">
        <ScrollArea.Viewport className="w-full">
          <div
            className="flex min-w-max flex-row px-2 py-4"
            style={{ gap: "2px" }}
          >
            {likedTracks.length === 0 ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-center text-gray-500 dark:text-slate-400">
                  <p className="text-lg">No liked tracks found.</p>
                  <p className="mt-2 text-sm">
                    Start liking tracks to see them here!
                  </p>
                </div>
              </div>
            ) : (
              likedTracks.map((trackId) => (
                <iframe
                  key={trackId}
                  src={`https://open.spotify.com/embed/track/${trackId}`}
                  width="280"
                  height="80"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  style={{ borderRadius: 12, flexShrink: 0, border: "none" }}
                  title={`Spotify Track ${trackId}`}
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
};

export default Favorites;
