/**
 * Consolidated Spotify hooks
 * Combines all Spotify-related functionality to reduce fragmentation
 */

import { useState, useEffect, useCallback } from "react";
import { useServices } from "./common";
import type { SpotifyService } from "@/services/SpotifyService";
import type { Track } from "@/types/spotify-api-types";
import type { TrackMetadata } from "@/types/queue-types";

// === SERVICE HOOK ===
export function useSpotifyService(): SpotifyService {
  const { spotify } = useServices();
  return spotify;
}

// === SEARCH HOOK ===
interface UseSpotifySearchState {
  query: string;
  results: TrackMetadata[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
}

interface UseSpotifySearchReturn extends UseSpotifySearchState {
  setQuery: (query: string) => void;
  performSearch: () => Promise<void>;
  clearResults: () => void;
  // Additional methods for compatibility
  searchResults: TrackMetadata[];
  isSearching: boolean;
  searchError: string | null;
  searchTracks: (query: string, limit?: number) => Promise<void>;
  searchByMood: (mood: string, limit?: number) => Promise<void>;
  clearSearchResults: () => void;
}

// Helper to transform Spotify track to TrackMetadata
const transformTrack = (track: Track): TrackMetadata => ({
  id: track.id,
  title: track.name,
  artist: track.artists[0]?.name || "Unknown Artist",
  album: track.album?.name || "Unknown Album",
  albumArt: track.album?.images[0]?.url || "",
  albumArtFallback: track.album?.images[track.album?.images?.length - 1]?.url,
  duration: track.duration_ms,
  previewUrl: track.preview_url || undefined,
  externalUrl: track.external_urls.spotify,
  uri: track.uri,
});

export function useSpotifySearch(): UseSpotifySearchReturn {
  const spotifyService = useSpotifyService();
  const [state, setState] = useState<UseSpotifySearchState>({
    query: "",
    results: [],
    isLoading: false,
    error: null,
    hasSearched: false,
  });

  const setQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, query }));
  }, []);

  const performSearch = useCallback(
    async (query?: string, limit = 20) => {
      const searchQuery = query || state.query;
      if (!searchQuery.trim()) {
        setState((prev) => ({ ...prev, error: "Please enter a search term" }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        query: searchQuery,
      }));

      try {
        const results = await spotifyService.searchTracks(searchQuery, limit);
        setState((prev) => ({
          ...prev,
          results: results.tracks?.items?.map(transformTrack) || [],
          isLoading: false,
          hasSearched: true,
        }));
      } catch (error) {
        console.error("Search failed:", error);
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Search failed",
          results: [],
          isLoading: false,
          hasSearched: true,
        }));
      }
    },
    [state.query, spotifyService],
  );

  const clearResults = useCallback(() => {
    setState((prev) => ({
      ...prev,
      results: [],
      hasSearched: false,
      error: null,
    }));
  }, []);

  return {
    ...state,
    setQuery,
    performSearch,
    clearResults,
    // Compatibility aliases
    searchResults: state.results,
    isSearching: state.isLoading,
    searchError: state.error,
    searchTracks: async (query: string, limit = 20) => {
      await performSearch(query, limit);
    },
    searchByMood: async (mood: string, limit = 20) => {
      await performSearch(`mood:${mood}`, limit);
    },
    clearSearchResults: clearResults,
  };
}

// === LIKED TRACKS HOOK ===
interface UseSpotifyLikedTracksReturn {
  tracks: TrackMetadata[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSpotifyLikedTracks(limit = 50): UseSpotifyLikedTracksReturn {
  const spotifyService = useSpotifyService();
  const [tracks, setTracks] = useState<TrackMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTracks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await spotifyService.getSavedTracks(limit);
      const transformedTracks =
        response.items?.map((item) => transformTrack(item.track)) || [];
      setTracks(transformedTracks);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch liked tracks",
      );
      setTracks([]);
    } finally {
      setIsLoading(false);
    }
  }, [spotifyService, limit]);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  return {
    tracks,
    isLoading,
    error,
    refetch: fetchTracks,
  };
}

// === LIKES MANAGEMENT HOOK ===
interface UseSpotifyLikesReturn {
  likeTrack: (trackId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useSpotifyLikes(): UseSpotifyLikesReturn {
  const spotifyService = useSpotifyService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const likeTrack = useCallback(
    async (trackId: string) => {
      try {
        setIsLoading(true);
        setError(null);
        await spotifyService.saveTracks([trackId]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to like track");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [spotifyService],
  );

  return {
    likeTrack,
    isLoading,
    error,
  };
}

// === QUEUE MANAGEMENT HOOK ===
interface UseSpotifyQueueReturn {
  currentTrack: TrackMetadata | null;
  upcomingTracks: TrackMetadata[];
  isLoading: boolean;
  error: string | null;
  addToQueue: (tracks: TrackMetadata[]) => Promise<void>;
  playTrack: (trackUri: string) => Promise<void>;
  playNext: () => Promise<void>;
  replaceQueue: (tracks: TrackMetadata[]) => Promise<void>;
  clearQueue: () => Promise<void>;
}

export function useSpotifyQueue(): UseSpotifyQueueReturn {
  const spotifyService = useSpotifyService();
  const [currentTrack, setCurrentTrack] = useState<TrackMetadata | null>(null);
  const [upcomingTracks, setUpcomingTracks] = useState<TrackMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToQueue = useCallback(
    async (tracks: TrackMetadata[]) => {
      try {
        setError(null);
        for (const track of tracks) {
          await spotifyService.addToQueue(track.uri);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add to queue");
      }
    },
    [spotifyService],
  );

  const playTrack = useCallback(
    async (trackUri: string) => {
      try {
        setError(null);
        await spotifyService.play([trackUri]);
        // Update local state with placeholder track
        setCurrentTrack({ uri: trackUri } as TrackMetadata);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to play track");
      }
    },
    [spotifyService],
  );

  const playNext = useCallback(async () => {
    try {
      setError(null);
      await spotifyService.next();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to skip to next track",
      );
    }
  }, [spotifyService]);

  const replaceQueue = useCallback(
    async (tracks: TrackMetadata[]) => {
      try {
        setIsLoading(true);
        setError(null);
        if (tracks.length > 0) {
          const trackUris = tracks.map((track) => track.uri);
          await spotifyService.play(trackUris);
          setCurrentTrack(tracks[0]);
          setUpcomingTracks(tracks.slice(1));
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to replace queue",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [spotifyService],
  );

  const clearQueue = useCallback(async () => {
    try {
      setError(null);
      // Clear the local queue state
      setCurrentTrack(null);
      setUpcomingTracks([]);
      // If there's a method to clear the Spotify queue, call it here
      // For now, just clear the local state
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear queue");
    }
  }, []);

  return {
    currentTrack,
    upcomingTracks,
    isLoading,
    error,
    addToQueue,
    playTrack,
    playNext,
    replaceQueue,
    clearQueue,
  };
}

// === PLAYBACK CONTROL HOOK ===
interface PlaybackState {
  is_playing: boolean;
  isPlaying: boolean; // Alias for compatibility
  position_ms: number;
  duration_ms: number;
  track: TrackMetadata | null;
  currentTrack: TrackMetadata | null; // Alias for compatibility
  device: {
    id: string;
    name: string;
    type: string;
    volume_percent: number;
  } | null;
  shuffle_state: boolean;
  repeat_state: string;
}

interface UseSpotifyPlaybackReturn {
  state: PlaybackState;
  controls: {
    play: () => Promise<void>;
    pause: () => Promise<void>;
    next: () => Promise<void>;
    previous: () => Promise<void>;
    seek: (position_ms: number) => Promise<void>;
    setVolume: (volume: number) => Promise<void>;
    togglePlay: () => Promise<void>;
    playTrack: (trackId: string) => Promise<void>;
  };
}

export function useSpotifyPlayback(): UseSpotifyPlaybackReturn {
  const spotifyService = useSpotifyService();
  const [state, setState] = useState<PlaybackState>({
    is_playing: false,
    isPlaying: false,
    position_ms: 0,
    duration_ms: 0,
    track: null,
    currentTrack: null,
    device: null,
    shuffle_state: false,
    repeat_state: "off",
  });

  const controls = {
    play: async () => {
      await spotifyService.play();
      setState((prev) => ({ ...prev, is_playing: true, isPlaying: true }));
    },
    pause: async () => {
      await spotifyService.pause();
      setState((prev) => ({ ...prev, is_playing: false, isPlaying: false }));
    },
    next: async () => spotifyService.next(),
    previous: async () => spotifyService.previous(),
    seek: async (position_ms: number) => spotifyService.seek(position_ms),
    setVolume: async (volume: number) => spotifyService.setVolume(volume),
    togglePlay: async () => {
      if (state.is_playing) {
        await controls.pause();
      } else {
        await controls.play();
      }
    },
    playTrack: async (trackId: string) => {
      // Implementation would depend on SpotifyService having a playTrack method
      console.log("Playing track:", trackId);
      setState((prev) => ({ ...prev, is_playing: true, isPlaying: true }));
    },
  };

  return { state, controls };
}

// === PLAYER HOOK ===
interface UseSpotifyPlayerState {
  isReady: boolean;
  isActive: boolean;
  currentTrack: TrackMetadata | null;
  position: number;
  duration: number;
  isPlaying: boolean;
  volume: number;
  device_id: string | null;
  isLoading: boolean;
  error: string | null;
}

interface UseSpotifyPlayerControls {
  play: () => Promise<boolean>;
  pause: () => Promise<boolean>;
  resume: () => Promise<boolean>;
  seek: (position: number) => Promise<boolean>;
  nextTrack: () => Promise<boolean>;
  previousTrack: () => Promise<boolean>;
  setVolume: (volume: number) => Promise<boolean>;
  togglePlay: () => Promise<boolean>;
  playTrack: (trackId: string) => Promise<boolean>;
}

interface UseSpotifyPlayerReturn {
  state: UseSpotifyPlayerState;
  controls: UseSpotifyPlayerControls;
  initialize: () => Promise<boolean>;
}

export function useSpotifyPlayer(): UseSpotifyPlayerReturn {
  const [state, setState] = useState<UseSpotifyPlayerState>({
    isReady: false,
    isActive: false,
    currentTrack: null,
    position: 0,
    duration: 0,
    isPlaying: false,
    volume: 0.5,
    device_id: null,
    isLoading: false,
    error: null,
  });

  const initialize = useCallback(async (): Promise<boolean> => {
    try {
      // Web Playback SDK initialization logic would go here
      // This is a placeholder for the actual implementation
      console.log("Initializing Spotify Web Player...");
      setState((prev) => ({ ...prev, isLoading: false, isReady: true }));
      return true;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to initialize player",
      }));
      return false;
    }
  }, []);

  const controls: UseSpotifyPlayerControls = {
    play: async () => {
      try {
        setState((prev) => ({ ...prev, isPlaying: true }));
        return true;
      } catch {
        return false;
      }
    },
    pause: async () => {
      try {
        setState((prev) => ({ ...prev, isPlaying: false }));
        return true;
      } catch {
        return false;
      }
    },
    resume: async () => {
      try {
        setState((prev) => ({ ...prev, isPlaying: true }));
        return true;
      } catch {
        return false;
      }
    },
    seek: async (position: number) => {
      try {
        setState((prev) => ({ ...prev, position }));
        return true;
      } catch {
        return false;
      }
    },
    nextTrack: async () => {
      try {
        console.log("Next track");
        return true;
      } catch {
        return false;
      }
    },
    previousTrack: async () => {
      try {
        console.log("Previous track");
        return true;
      } catch {
        return false;
      }
    },
    setVolume: async (volume: number) => {
      try {
        setState((prev) => ({ ...prev, volume }));
        return true;
      } catch {
        return false;
      }
    },
    togglePlay: async () => {
      try {
        setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
        return true;
      } catch {
        return false;
      }
    },
    playTrack: async (trackId: string) => {
      try {
        console.log("Playing track:", trackId);
        setState((prev) => ({ ...prev, isPlaying: true }));
        return true;
      } catch {
        return false;
      }
    },
  };

  return { state, controls, initialize };
}
