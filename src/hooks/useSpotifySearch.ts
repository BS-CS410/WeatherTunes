import { useState, useCallback } from "react";
import { spotifyApi } from "@/lib/spotify-api";
import { useAuth } from "./useAuth";
import type { TrackMetadata } from "@/types/queue-types";

interface UseSpotifySearchReturn {
  searchResults: TrackMetadata[];
  isSearching: boolean;
  searchError: string | null;
  searchTracks: (query: string, limit?: number) => Promise<void>;
  searchByMood: (mood: string, limit?: number) => Promise<void>;
  clearSearchResults: () => void;
}

/**
 * Hook for searching Spotify tracks
 * Provides both text search and mood-based search functionality
 */
export const useSpotifySearch = (): UseSpotifySearchReturn => {
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState<TrackMetadata[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchTracks = useCallback(
    async (query: string, limit: number = 10) => {
      if (!user) {
        setSearchError("Please log in to search for tracks");
        return;
      }

      if (!query.trim()) {
        setSearchError("Please enter a search query");
        return;
      }

      setIsSearching(true);
      setSearchError(null);

      try {
        const searchResult = await spotifyApi.searchTracks(query, limit);
        setSearchResults(searchResult.tracks);

        if (searchResult.tracks.length === 0) {
          setSearchError("No tracks found for your search");
        }
      } catch (error) {
        setSearchError(
          error instanceof Error
            ? error.message
            : "Failed to search tracks. Please try again.",
        );
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [user],
  );

  const searchByMood = useCallback(
    async (mood: string, limit: number = 10) => {
      if (!user) {
        setSearchError("Please log in to search for tracks");
        return;
      }

      setIsSearching(true);
      setSearchError(null);

      try {
        const searchResult = await spotifyApi.searchTracks(
          `mood:${mood}`,
          limit,
        );
        setSearchResults(searchResult.tracks);

        if (searchResult.tracks.length === 0) {
          setSearchError(`No tracks found for mood: ${mood}`);
        }
      } catch (error) {
        setSearchError(
          error instanceof Error
            ? error.message
            : "Failed to search by mood. Please try again.",
        );
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [user],
  );

  const clearSearchResults = useCallback(() => {
    setSearchResults([]);
    setSearchError(null);
  }, []);

  return {
    searchResults,
    isSearching,
    searchError,
    searchTracks,
    searchByMood,
    clearSearchResults,
  };
};
