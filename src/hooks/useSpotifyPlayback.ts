import { useState, useEffect, useCallback } from 'react';
import { useSpotifyService } from './useSpotifyService';
import { useAuth } from './useAuth';

interface PlaybackState {
  isPlaying: boolean;
  currentTrack: {
    id: string;
    name: string;
    artists: string[];
    album: string;
    image: string;
    uri: string;
  } | null;
  position: number;
  duration: number;
  volume: number;
  error: string | null;
}

/**
 * Hook for managing Spotify playback state and controls
 * Integrates with the SpotifyService for playback functionality
 */
export function useSpotifyPlayback() {
  const { user } = useAuth();
  const spotifyService = useSpotifyService();
  const [state, setState] = useState<PlaybackState>({
    isPlaying: false,
    currentTrack: null,
    position: 0,
    duration: 0,
    volume: 0.5,
    error: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch current playback state
  const fetchPlaybackState = useCallback(async () => {
    if (!user) return;
    
    try {
      const playback = await spotifyService.getPlaybackState();
      if (playback) {
        setState({
          isPlaying: playback.is_playing,
          currentTrack: playback.item ? {
            id: playback.item.id,
            name: playback.item.name,
            artists: playback.item.artists?.map(a => a.name) || [],
            album: playback.item.album?.name || '',
            image: playback.item.album?.images?.[0]?.url || '',
            uri: playback.item.uri,
          } : null,
          position: playback.progress_ms || 0,
          duration: playback.item?.duration_ms || 0,
          volume: playback.device?.volume_percent ? playback.device.volume_percent / 100 : 0.5,
          error: null,
        });
      }
    } catch (error) {
      console.error('Failed to fetch playback state:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch playback state',
      }));
    }
  }, [user, spotifyService]);

  // Set up polling for playback state
  useEffect(() => {
    if (!user) return;

    // Initial fetch
    fetchPlaybackState();
    
    // Poll every 2 seconds
    const interval = setInterval(fetchPlaybackState, 2000);
    
    return () => clearInterval(interval);
  }, [user, fetchPlaybackState]);

  // Playback controls
  const play = useCallback(async () => {
    if (!user) return false;
    
    try {
      setIsLoading(true);
      await spotifyService.play();
      setState(prev => ({ ...prev, isPlaying: true }));
      return true;
    } catch (error) {
      console.error('Failed to start playback:', error);
      setState(prev => ({ ...prev, error: 'Failed to start playback' }));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, spotifyService]);

  const pause = useCallback(async () => {
    if (!user) return false;
    
    try {
      setIsLoading(true);
      await spotifyService.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
      return true;
    } catch (error) {
      console.error('Failed to pause playback:', error);
      setState(prev => ({ ...prev, error: 'Failed to pause playback' }));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, spotifyService]);

  const togglePlay = useCallback(async () => {
    return state.isPlaying ? await pause() : await play();
  }, [state.isPlaying, play, pause]);

  const nextTrack = useCallback(async () => {
    if (!user) return false;
    
    try {
      setIsLoading(true);
      await spotifyService.next();
      // State will be updated by the polling effect
      return true;
    } catch (error) {
      console.error('Failed to skip to next track:', error);
      setState(prev => ({ ...prev, error: 'Failed to skip to next track' }));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, spotifyService]);

  const previousTrack = useCallback(async () => {
    if (!user) return false;
    
    try {
      setIsLoading(true);
      await spotifyService.previous();
      // State will be updated by the polling effect
      return true;
    } catch (error) {
      console.error('Failed to go to previous track:', error);
      setState(prev => ({ ...prev, error: 'Failed to go to previous track' }));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, spotifyService]);

  const seek = useCallback(async (position: number) => {
    if (!user) return false;
    
    try {
      await spotifyService.seek(position);
      setState(prev => ({ ...prev, position }));
      return true;
    } catch (error) {
      console.error('Failed to seek:', error);
      setState(prev => ({ ...prev, error: 'Failed to seek' }));
      return false;
    }
  }, [user, spotifyService]);

  const setVolume = useCallback(async (volume: number) => {
    if (!user) return false;
    
    try {
      await spotifyService.setVolume(volume * 100); // Convert to 0-100 range
      setState(prev => ({ ...prev, volume }));
      return true;
    } catch (error) {
      console.error('Failed to set volume:', error);
      setState(prev => ({ ...prev, error: 'Failed to set volume' }));
      return false;
    }
  }, [user, spotifyService]);

  const playTrack = useCallback(async (trackId: string) => {
    if (!user) return false;
    
    try {
      setIsLoading(true);
      await spotifyService.play([`spotify:track:${trackId}`]);
      // State will be updated by the polling effect
      return true;
    } catch (error) {
      console.error('Failed to play track:', error);
      setState(prev => ({ ...prev, error: 'Failed to play track' }));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, spotifyService]);

  return {
    state: {
      ...state,
      isLoading,
    },
    controls: {
      play,
      pause,
      togglePlay,
      nextTrack,
      previousTrack,
      seek,
      setVolume,
      playTrack,
    },
    refresh: fetchPlaybackState,
  };
}
