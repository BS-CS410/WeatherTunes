import { useCallback, useState } from 'react';
import { useSpotifyService } from './useSpotifyService';

export function useSpotifyLikes() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { saveTracks } = useSpotifyService();

  const likeTrack = useCallback(async (trackId: string) => {
    if (!trackId) {
      setError(new Error('No track ID provided'));
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      await saveTracks([trackId]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to like track'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [saveTracks]);

  return {
    likeTrack,
    isLoading,
    error,
  };
}
