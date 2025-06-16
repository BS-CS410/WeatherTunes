import React, { useEffect, useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";

export default function Favorites() {
  const [likedTracks, setLikedTracks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLikedTracks() {
      try {
        const res = await fetch("http://localhost:8000/liked", {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Error fetching liked tracks: ${res.status}`);
        const data = await res.json();
        setLikedTracks((data.favorites || []).reverse());
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLikedTracks();
  }, []);

  if (loading) return <p>Loading liked tracks...</p>;

  if (error) {
    if (error.includes("401")) {
      return (
        <p className="text-center text-lg text-gray-600 dark:text-slate-300">
          Please log into Spotify to view your liked tracks.
        </p>
      );
    }
    return (
      <p className="text-center text-red-500">Error loading liked tracks: {error}</p>
    );
  }

  return (
    <div className="relative w-full">
      <div className="px-4 pb-4 pl-6">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-slate-200">
          Liked Tracks
        </h3>
      </div>

      <ScrollArea.Root className="relative z-0 w-full overflow-x-auto px-6">
        <ScrollArea.Viewport className="w-full">
          <div
            className="flex min-w-max flex-row px-2 py-4"
            style={{ gap: "2px" }}
          >
            {likedTracks.length === 0 ? (
              <p className="text-gray-500">No liked tracks found.</p>
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
}
