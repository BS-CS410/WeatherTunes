import React, { useState } from "react";
import { Search, Music, Plus, Loader2 } from "lucide-react";
import { useSpotifySearch, useSpotifyQueue } from "@/hooks/spotify";
import { useAuth } from "@/hooks/useAuth";
import type { TrackMetadata } from "@/types/queue-types";
import { COLORS, CARD_STYLES, INPUT_STYLES, BUTTON_STYLES } from "@/lib";
import { cn } from "@/lib";
import { Card } from "@/components/ui/card";

interface SpotifySearchCardProps {
  className?: string;
}

/**
 * Component for searching Spotify tracks and adding them to queue
 * Uses the new queue system for better performance
 */
export function SpotifySearchCard({ className = "" }: SpotifySearchCardProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    searchResults,
    isSearching,
    searchError,
    searchTracks,
    searchByMood,
    clearSearchResults,
  } = useSpotifySearch();
  const { addToQueue } = useSpotifyQueue();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await searchTracks(searchQuery.trim(), 10);
    }
  };

  const handleMoodSearch = async (mood: string) => {
    await searchByMood(mood, 8);
  };

  const handleAddToQueue = async (track: TrackMetadata) => {
    if (!addToQueue) {
      console.error("Add to queue function not available");
      return;
    }
    try {
      await addToQueue([track]);
    } catch (error) {
      console.error("Failed to add track to queue:", error);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    clearSearchResults();
  };

  if (!user) {
    return (
      <Card variant="interactive" className={cn("w-full", className)}>
        <div className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-300" />
            <h3 className={cn("text-lg font-semibold", COLORS.text.primary)}>
              Spotify Search
            </h3>
          </div>
          <p className={cn("py-8 text-center", COLORS.text.muted)}>
            Please log in to search for tracks on Spotify
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="interactive" className={cn("w-full", className)}>
      <div className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <Search className={cn("h-5 w-5", COLORS.text.secondary)} />
          <h3 className={cn("text-lg font-semibold", COLORS.text.primary)}>
            Spotify Search
          </h3>
          {isSearching && (
            <Loader2
              className="h-4 w-4 animate-spin"
              style={{ color: "var(--color-text-secondary)" }}
            />
          )}
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for songs, artists, or albums..."
              className={cn(
                INPUT_STYLES.base,
                INPUT_STYLES.glass,
                INPUT_STYLES.size.md,
                "flex-1",
                "placeholder-opacity-70",
              )}
              disabled={isSearching}
            />
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className={cn(
                "rounded-lg px-6 py-2 text-base font-semibold",
                BUTTON_STYLES.glass.primary,
              )}
            >
              Search
            </button>
          </div>
        </form>

        {/* Mood Search Buttons */}
        <div className="mb-4 flex flex-wrap gap-2">
          {["happy", "chill", "energetic", "sad", "romantic", "party"].map(
            (mood) => (
              <button
                key={mood}
                onClick={() => handleMoodSearch(mood)}
                disabled={isSearching}
                className={cn(
                  BUTTON_STYLES.glass.secondary,
                  "rounded-full px-3 py-1 text-sm capitalize",
                )}
              >
                {mood}
              </button>
            ),
          )}
        </div>

        {/* Clear Results */}
        {(searchResults.length > 0 || searchError) && (
          <button
            onClick={handleClear}
            className={cn(
              "mb-4 text-sm underline hover:text-inherit",
              COLORS.text.muted,
            )}
          >
            Clear results
          </button>
        )}

        {/* Error Display */}
        {searchError && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/20 p-3 text-sm text-red-700 dark:text-red-200">
            {searchError}
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="max-h-64 space-y-2 overflow-y-auto">
            <h4
              className={cn("mb-2 text-sm font-medium", COLORS.text.secondary)}
            >
              Found {searchResults.length} tracks:
            </h4>
            {searchResults.map((track, idx) => (
              <div
                key={`${track.id}-${idx}`}
                className={cn(
                  CARD_STYLES.interactive,
                  "flex items-center gap-3 p-2",
                )}
              >
                {track.albumArt ? (
                  <img
                    src={track.albumArt}
                    alt={`${track.title} album art`}
                    className="h-10 w-10 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-white/10">
                    <Music className={cn("h-5 w-5", COLORS.text.secondary)} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-sm font-medium",
                      COLORS.text.primary,
                    )}
                  >
                    {track.title}
                  </p>
                  <p className={cn("truncate text-xs", COLORS.text.secondary)}>
                    {track.artist}
                  </p>
                </div>

                <button
                  onClick={() => handleAddToQueue(track)}
                  className={cn(
                    BUTTON_STYLES.icon,
                    "rounded-full bg-green-500 p-1.5 text-white hover:bg-green-600",
                  )}
                  title="Add to queue"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Loading State */}
        {isSearching && searchResults.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 text-sm text-gray-500">Searching...</span>
          </div>
        )}
      </div>
    </Card>
  );
}
