/**
 * Consolidated Spotify hooks
 * Combines all Spotify-related functionality to reduce fragmentation
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { useServices } from "@/hooks/common";
import { SpotifyService } from "@/services/SpotifyService";
import type { TrackMetadata } from "@/types/queue-types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
          results: results,
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

export function useSpotifyLikedTracks(
  options: { limit?: number; enabled?: boolean } = {},
): UseSpotifyLikedTracksReturn {
  const { limit = 50, enabled = true } = options;
  const spotifyService = useSpotifyService();
  const queryClient = useQueryClient();

  const {
    data: tracks,
    isLoading,
    error,
  } = useQuery<TrackMetadata[], string>({
    queryKey: ["spotifyLikedTracks", limit],
    queryFn: async () => {
      const response = await spotifyService.getSavedTracks(limit);
      return response;
    },
    enabled: !!spotifyService && enabled,
    staleTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const refetch = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ["spotifyLikedTracks", limit],
    });
  }, [queryClient, limit]);

  return {
    tracks: tracks || [],
    isLoading,
    error,
    refetch,
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
    async (trackId: string) => {
      try {
        setError(null);
        const trackToPlay = upcomingTracks.find(
          (track) => track.id === trackId,
        );
        if (trackToPlay) {
          await spotifyService.play([trackToPlay.uri]);
          setCurrentTrack(trackToPlay);
          setUpcomingTracks((prev) =>
            prev.filter((track) => track.id !== trackId),
          );
        } else {
          console.warn("Track not found in upcoming queue:", trackId);
          // If track not in upcoming, try playing directly (e.g., from search)
          // This might require fetching track details first if only ID is available
          // For now, assume it's from the queue.
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to play track");
      }
    },
    [spotifyService, upcomingTracks],
  );

  const playNext = useCallback(async () => {
    try {
      setError(null);
      if (upcomingTracks.length > 0) {
        const nextTrack = upcomingTracks[0];
        await spotifyService.play([nextTrack.uri]);
        setCurrentTrack(nextTrack);
        setUpcomingTracks((prev) => prev.slice(1));
      } else {
        console.log("Queue is empty, attempting to replenish.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to skip to next track",
      );
    }
  }, [spotifyService, upcomingTracks]);

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
    playTrack: () => Promise<void>;
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
    playTrack: async () => {
      // Implementation would depend on SpotifyService having a playTrack method
      console.log("Playing track");
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
  play: () => Promise<void>; // Changed to Promise<void>
  pause: () => Promise<void>; // Changed to Promise<void>
  resume: () => Promise<void>; // Changed to Promise<void>
  seek: (position: number) => Promise<void>; // Changed to Promise<void>
  nextTrack: () => Promise<void>; // Changed to Promise<void>
  previousTrack: () => Promise<void>; // Changed to Promise<void>
  setVolume: (volume: number) => Promise<void>; // Changed to Promise<void>
  togglePlay: () => Promise<void>; // Changed to Promise<void>
  playTrack: (trackId: string) => Promise<boolean>; // This one remains boolean as it's a custom implementation
}

interface UseSpotifyPlayerReturn {
  state: UseSpotifyPlayerState;
  controls: UseSpotifyPlayerControls;
  initialize: () => Promise<boolean>;
}

export function useSpotifyPlayer(): UseSpotifyPlayerReturn {
  const spotifyService = useSpotifyService();
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

  const playerRef = useRef<Spotify.Player | null>(null);

  const initialize = useCallback(async (): Promise<boolean> => {
    if (playerRef.current) {
      console.log("Spotify player already initialized.");
      return true;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    // Ensure Spotify SDK is loaded
    if (!window.Spotify) {
      console.error("Spotify SDK not loaded.");
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Spotify SDK not loaded.",
      }));
      return false;
    }

    try {
      const token = await spotifyService.getAccessToken();
      if (!token) {
        throw new Error("No Spotify access token available.");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const player = new (window.Spotify.Player as any)({
        // Cast to any
        name: "WeatherTunes Player",
        getOAuthToken: (cb: (token: string) => void) => {
          // Explicitly type cb
          cb(token);
        },
        volume: state.volume,
      });

      // Ready
      player.addListener(
        "ready",
        ({ device_id }: Spotify.WebPlaybackInstance) => {
          // Explicitly type data
          console.log("Ready with Device ID", device_id);
          setState((prev) => ({
            ...prev,
            isReady: true,
            device_id,
            isLoading: false,
          }));
          // Transfer playback to this device
          spotifyService
            .transferPlayback([device_id], true)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch((err: any) => {
              // Explicitly type err
              console.error("Failed to transfer playback:", err);
            });
        },
      );

      // Not Ready
      player.addListener(
        "not_ready",
        ({ device_id }: Spotify.WebPlaybackInstance) => {
          // Explicitly type data
          console.log("Device ID has gone offline", device_id);
          setState((prev) => ({
            ...prev,
            isReady: false,
            device_id: null,
            isLoading: false,
          }));
        },
      );

      // Player State Changed
      player.addListener(
        "player_state_changed",
        (playerState: Spotify.PlaybackState) => {
          // Explicitly type playerState
          if (!playerState) {
            setState((prev) => ({
              ...prev,
              isPlaying: false,
              currentTrack: null,
              position: 0,
              duration: 0,
            }));
            return;
          }

          const {
            paused,
            position,
            duration,
            track_window: { current_track },
          } = playerState;

          const newTrack: TrackMetadata | null = current_track
            ? {
                id: current_track.id,
                title: current_track.name,
                artist: current_track.artists[0]?.name || "Unknown Artist",
                album: current_track.album.name,
                albumArt: current_track.album.images[0]?.url || "",
                albumArtFallback:
                  current_track.album.images[
                    current_track.album.images.length - 1
                  ]?.url,
                duration: current_track.duration_ms,
                previewUrl: current_track.preview_url || undefined,
                externalUrl: current_track.external_urls.spotify,
                uri: current_track.uri,
              }
            : null;

          setState((prev) => ({
            ...prev,
            isPlaying: !paused,
            position: position,
            duration: duration,
            currentTrack: newTrack,
            isReady: true, // Ensure ready state is maintained
          }));
        },
      );

      // Errors
      player.addListener(
        "initialization_error",
        ({ message }: Spotify.Error) => {
          // Explicitly type data
          console.error("Failed to initialize:", message);
          setState((prev) => ({ ...prev, error: message, isLoading: false }));
        },
      );
      player.addListener(
        "authentication_error",
        ({ message }: Spotify.Error) => {
          // Explicitly type data
          console.error("Authentication error:", message);
          setState((prev) => ({ ...prev, error: message, isLoading: false }));
        },
      );
      player.addListener("account_error", ({ message }: Spotify.Error) => {
        // Explicitly type data
        console.error("Account error:", message);
        setState((prev) => ({ ...prev, error: message, isLoading: false }));
      });
      player.addListener("playback_error", ({ message }: Spotify.Error) => {
        // Explicitly type data
        console.error("Playback error:", message);
        setState((prev) => ({ ...prev, error: message, isLoading: false }));
      });

      await player.connect();
      playerRef.current = player;
      console.log("Spotify Web Player connected.");
      return true;
    } catch (error) {
      console.error("Failed to initialize Spotify player:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown player error",
      }));
      return false;
    }
  }, [spotifyService, state.volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        console.log("Disconnecting Spotify Web Player.");
        playerRef.current.disconnect();
        playerRef.current = null;
      }
    };
  }, []);

  const controls: UseSpotifyPlayerControls = {
    play: async () => {
      if (playerRef.current) {
        await playerRef.current.resume();
        setState((prev) => ({ ...prev, isPlaying: true }));
      }
    },
    pause: async () => {
      if (playerRef.current) {
        await playerRef.current.pause();
        setState((prev) => ({ ...prev, isPlaying: false }));
      }
    },
    resume: async () => {
      if (playerRef.current) {
        await playerRef.current.resume();
        setState((prev) => ({ ...prev, isPlaying: true }));
      }
    },
    seek: async (position: number) => {
      if (playerRef.current) {
        await playerRef.current.seek(position);
        setState((prev) => ({ ...prev, position }));
      }
    },
    nextTrack: async () => {
      if (playerRef.current) {
        await playerRef.current.nextTrack();
      }
    },
    previousTrack: async () => {
      if (playerRef.current) {
        await playerRef.current.previousTrack();
      }
    },
    setVolume: async (volume: number) => {
      if (playerRef.current) {
        await playerRef.current.setVolume(volume);
        setState((prev) => ({ ...prev, volume }));
      }
    },
    togglePlay: async () => {
      if (playerRef.current) {
        await playerRef.current.togglePlay();
        setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
      }
    },
    playTrack: async () => {
      // This method is typically handled by the SpotifyService.play method
      // which takes URIs. The player itself doesn't have a direct playTrackById.
      // If we need to play a specific track on this device, we'd use transferPlayback
      // or the SpotifyService.play method.
      console.warn(
        "useSpotifyPlayer.playTrack is not directly implemented via SDK. Use spotifyService.play with URIs.",
      );
      return false; // Still returns boolean as it's a custom warning/fallback
    },
  };

  return { state, controls, initialize };
}
