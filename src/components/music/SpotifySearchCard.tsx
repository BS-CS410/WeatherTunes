import React, { useState } from "react";
import { Search, Music, Plus, Loader2 } from "lucide-react";
import { useSpotifySearch } from "@/hooks/useSpotifySearch";
import { useCurrentTrack } from "@/hooks/useCurrentTrack";
import { useAuth } from "@/hooks/useAuth";
import type { TrackMetadata } from "@/types/queue";

interface SpotifySearchCardProps {
  className?: string;
}

/**
 * Component for searching Spotify tracks and adding them to queue
 * Demonstrates the new live Spotify API integration
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
  const { addTrackToQueue } = useCurrentTrack();

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
    try {
      await addTrackToQueue(track.id);
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
      <div
        className={`rounded-xl bg-white/10 p-6 backdrop-blur-md ${className}`}
      >
        <div className="mb-4 flex items-center gap-3">
          <Search className="h-5 w-5 text-white/80" />
          <h3 className="text-lg font-semibold text-white">Spotify Search</h3>
        </div>
        <p className="py-8 text-center text-white/60">
          Please log in to search for tracks on Spotify
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl bg-white/10 p-6 backdrop-blur-md ${className}`}>
      <div className="mb-4 flex items-center gap-3">
        <Search className="h-5 w-5 text-white/80" />
        <h3 className="text-lg font-semibold text-white">Spotify Search</h3>
        {isSearching && (
          <Loader2 className="h-4 w-4 animate-spin text-white/60" />
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
            className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
            disabled={isSearching}
          />
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:bg-blue-500/50"
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
              className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80 capitalize transition-colors hover:bg-white/20 disabled:bg-white/5"
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
          className="mb-4 text-sm text-white/60 underline hover:text-white"
        >
          Clear results
        </button>
      )}

      {/* Error Display */}
      {searchError && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/20 p-3 text-sm text-red-200">
          {searchError}
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="max-h-64 space-y-2 overflow-y-auto">
          <h4 className="mb-2 text-sm font-medium text-white/80">
            Found {searchResults.length} tracks:
          </h4>
          {searchResults.map((track) => (
            <div
              key={track.id}
              className="flex items-center gap-3 rounded-lg bg-white/5 p-2 transition-colors hover:bg-white/10"
            >
              {track.albumArt ? (
                <img
                  src={track.albumArt}
                  alt={`${track.title} album art`}
                  className="h-10 w-10 rounded object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded bg-white/10">
                  <Music className="h-5 w-5 text-white/40" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {track.title}
                </p>
                <p className="truncate text-xs text-white/60">{track.artist}</p>
              </div>

              <button
                onClick={() => handleAddToQueue(track)}
                className="rounded-full bg-green-500 p-1.5 text-white transition-colors hover:bg-green-600"
                title="Add to queue"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isSearching && searchResults.length === 0 && !searchError && (
        <div className="py-8 text-center">
          <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-white/60" />
          <p className="text-sm text-white/60">Searching Spotify...</p>
        </div>
      )}

      {/* Empty State */}
      {!isSearching &&
        searchResults.length === 0 &&
        !searchError &&
        searchQuery === "" && (
          <div className="py-8 text-center">
            <Music className="mx-auto mb-2 h-8 w-8 text-white/40" />
            <p className="text-sm text-white/60">
              Search for tracks or try a mood to discover music
            </p>
          </div>
        )}
    </div>
  );
}
