import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from "./useServices";
import type { 
  PlaybackState, 
  QueueState, 
  SearchResponse,
  SavedTracksResponse
} from '@/types/spotify-api-types';

export function useSpotify() {
  const { spotify } = useServices();
  const queryClient = useQueryClient();

  // Get current playback state
  const playbackState = useQuery<PlaybackState | null>({
    queryKey: ['playback-state'],
    queryFn: () => spotify.getPlaybackState(),
    refetchInterval: 5000, // Poll every 5 seconds
    enabled: true, // Always enabled
  });

  // Get user's queue
  const queue = useQuery<QueueState>({
    queryKey: ['queue'],
    queryFn: () => spotify.getQueue(),
    refetchInterval: 5000, // Poll every 5 seconds
    enabled: true, // Always enabled
  });

  // Search for tracks with debounce
  const useSearchTracks = (query: string) => {
    return useQuery<SearchResponse>({
      queryKey: ['search', query],
      queryFn: () => spotify.searchTracks(query),
      enabled: !!query,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Get user's saved tracks
  const { data: savedTracks, isLoading: isLoadingSavedTracks } = useQuery<SavedTracksResponse>({
    queryKey: ['saved-tracks'],
    queryFn: () => spotify.getSavedTracks(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Player controls with optimistic updates
  type PlaybackMutationContext = { previousState: PlaybackState | null };

  const playMutation = useMutation({
    mutationFn: async (urisToPlay?: string[]) => {
      await spotify.play(urisToPlay);
      return { success: true };
    },
    onMutate: async (): Promise<PlaybackMutationContext> => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['playback-state'] });
      
      // Snapshot the previous value
      const previousState = queryClient.getQueryData<PlaybackState>(['playback-state']) || null;
      
      // Optimistically update to the new value
      if (previousState) {
        queryClient.setQueryData(['playback-state'], {
          ...previousState,
          is_playing: true,
        });
      }
      
      return { previousState };
    },
    onError: (error: Error, _urisToPlay, context) => {
      console.error('Error playing track:', error);
      if (context?.previousState) {
        queryClient.setQueryData(['playback-state'], context.previousState);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['playback-state'] });
    },
  });

  const pauseMutation = useMutation<unknown, Error, void, { previousState: PlaybackState | null }>({
    mutationFn: () => spotify.pause(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['playback-state'] });
      const previousState = queryClient.getQueryData<PlaybackState>(['playback-state']) || null;
      
      if (previousState) {
        queryClient.setQueryData(['playback-state'], {
          ...previousState,
          is_playing: false,
        });
      }
      
      return { previousState };
    },
    onError: (error, _variables, context) => {
      console.error('Error pausing playback:', error);
      if (context?.previousState) {
        queryClient.setQueryData(['playback-state'], context.previousState);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['playback-state'] });
    },
  });

  const nextMutation = useMutation({
    mutationFn: () => spotify.next(),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['playback-state'] });
      queryClient.invalidateQueries({ queryKey: ['queue'] });
    },
  });

  const previousMutation = useMutation({
    mutationFn: () => spotify.previous(),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['playback-state'] });
      queryClient.invalidateQueries({ queryKey: ['queue'] });
    },
  });

  const addToQueueMutation = useMutation({
    mutationFn: (uri: string) => spotify.addToQueue(uri),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] });
    },
  });

  const seekMutation = useMutation({
    mutationFn: (positionMs: number) => spotify.seek(positionMs),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['playback-state'] });
    },
  });

  return {
    // Queries
    playbackState,
    queue,
    useSearchTracks,
    savedTracks: {
      data: savedTracks,
      isLoading: isLoadingSavedTracks,
    },
    
    // Mutations
    play: playMutation.mutate,
    pause: pauseMutation.mutate,
    next: nextMutation.mutate,
    previous: previousMutation.mutate,
    addToQueue: addToQueueMutation.mutate,
    seek: seekMutation.mutate,
    
    // Loading states
    isLoading: {
      play: playMutation.isPending,
      pause: pauseMutation.isPending,
      next: nextMutation.isPending,
      previous: previousMutation.isPending,
      addToQueue: addToQueueMutation.isPending,
      seek: seekMutation.isPending,
    },
  };
}
