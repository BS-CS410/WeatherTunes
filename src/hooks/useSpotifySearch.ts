import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSpotifyService } from "./useSpotifyService";
import { useAuth } from "./useAuth";
import type { TrackMetadata } from "@/types/queue-types";
import type { Track } from "@/types/spotify-api-types";

interface UseSpotifySearchReturn {
  searchResults: TrackMetadata[];
  isSearching: boolean;
  searchError: string | null;
  searchTracks: (query: string, limit?: number) => Promise<void>;
  searchByMood: (mood: string, limit?: number) => Promise<void>;
  clearSearchResults: () => void;
}

// Helper function to transform Spotify API track to our TrackMetadata format
const transformTrack = (track: Track): TrackMetadata => ({
  id: track.id,
  title: track.name,
  artist: track.artists[0]?.name || 'Unknown Artist',
  album: track.album?.name || 'Unknown Album',
  albumArt: track.album?.images[0]?.url || '',
  duration: track.duration_ms,
  previewUrl: track.preview_url || undefined,
  externalUrl: track.external_urls.spotify,
  uri: track.uri,
});

/**
 * Hook for searching Spotify tracks
 * Provides both text search and mood-based search functionality
 * Uses React Query for data fetching and caching
 */
export const useSpotifySearch = (): UseSpotifySearchReturn => {
  const { user } = useAuth();
  const spotifyService = useSpotifyService();
  const queryClient = useQueryClient();
  
  const [searchResults, setSearchResults] = useState<TrackMetadata[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Mutation for searching tracks
  const searchMutation = useMutation({
    mutationFn: async ({ query, limit = 10 }: { query: string; limit?: number }) => {
      const result = await spotifyService.searchTracks(query, limit);
      return result.tracks?.items || [];
    },
    onMutate: () => {
      setIsSearching(true);
      setSearchError(null);
    },
    onSuccess: (tracks) => {
      const transformedTracks = tracks.map(transformTrack);
      setSearchResults(transformedTracks);
      if (transformedTracks.length === 0) {
        setSearchError("No tracks found for your search");
      }
    },
    onError: (error: Error) => {
      setSearchError(error.message || "Failed to search tracks. Please try again.");
      setSearchResults([]);
    },
    onSettled: () => {
      setIsSearching(false);
    },
  });

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

      await searchMutation.mutateAsync({ query, limit });
    },
    [user, searchMutation],
  );

  const searchByMood = useCallback(
    async (mood: string, limit: number = 10) => {
      if (!user) {
        setSearchError("Please log in to search for tracks");
        return;
      }

      await searchMutation.mutateAsync({ query: `mood:${mood}`, limit });
    },
    [user, searchMutation],
  );

  const clearSearchResults = useCallback(() => {
    setSearchResults([]);
    setSearchError(null);
    // Invalidate any related queries
    queryClient.invalidateQueries({ queryKey: ['spotify-search'] });
  }, [queryClient]);

  return {
    searchResults,
    isSearching,
    searchError,
    searchTracks,
    searchByMood,
    clearSearchResults,
  };
};
