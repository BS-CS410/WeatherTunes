import { useState, useEffect, useCallback } from 'react';
import { useSpotifyService } from './useSpotifyService';
import type { TrackMetadata } from '@/types/queue-types';

export function useSpotifyLikedTracks(limit = 50) {
  const [tracks, setTracks] = useState<TrackMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const spotifyService = useSpotifyService();

  const fetchLikedTracks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await spotifyService.getSavedTracks(limit);
      const tracks: TrackMetadata[] = response.items.map(item => ({
        id: item.track.id,
        title: item.track.name,
        artist: item.track.artists[0]?.name || 'Unknown Artist',
        album: item.track.album?.name || 'Unknown Album',
        albumArt: item.track.album.images[0]?.url || '',
        albumArtFallback: item.track.album.images[item.track.album.images.length - 1]?.url,
        duration: item.track.duration_ms,
        previewUrl: item.track.preview_url || undefined,
        externalUrl: item.track.external_urls.spotify,
        uri: item.track.uri,
      }));
      setTracks(tracks);
      return tracks;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch liked tracks');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [spotifyService, limit]);

  useEffect(() => {
    fetchLikedTracks();
  }, [fetchLikedTracks]);

  const refetch = useCallback(() => {
    return fetchLikedTracks();
  }, [fetchLikedTracks]);

  return {
    tracks,
    isLoading,
    error,
    refetch,
  };
}
