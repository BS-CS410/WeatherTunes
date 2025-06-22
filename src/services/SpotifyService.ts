import { AuthService } from './AuthService';
import type { 
  Track, 
  QueueState, 
  SearchResponse, 
  PlaybackState,
  SavedTracksResponse,
  RecommendationsResponse,
  RecommendationOptions
} from '@/types/spotify-api-types';

export class SpotifyService {
  private baseUrl = 'https://api.spotify.com/v1';
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.authService.getAccessToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token might be expired, try to refresh
      const newToken = await this.authService.getAccessToken();
      if (!newToken) {
        throw new Error('Authentication required');
      }
      // Retry the request with the new token
      return this.request(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`,
        },
      });
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Request failed');
    }

    // For 204 No Content responses
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // Queue Operations
  async getQueue(): Promise<QueueState> {
    return this.request<QueueState>('/me/player/queue');
  }

  async addToQueue(uri: string): Promise<void> {
    await this.request(`/me/player/queue?uri=${encodeURIComponent(uri)}`, {
      method: 'POST',
    });
  }

  async playNext(): Promise<void> {
    await this.request('/me/player/next', { method: 'POST' });
  }

  // Player Controls
  async play(urisToPlay?: string[]): Promise<void> {
    await this.request<void>('/me/player/play', {
      method: 'PUT',
      body: urisToPlay ? JSON.stringify({ uris: urisToPlay }) : '{}',
    });
  }

  async pause(): Promise<void> {
    await this.request('/me/player/pause', { method: 'PUT' });
  }

  async next(): Promise<void> {
    await this.request('/me/player/next', { method: 'POST' });
  }

  async previous(): Promise<void> {
    await this.request('/me/player/previous', { method: 'POST' });
  }

  async seek(positionMs: number): Promise<void> {
    await this.request(`/me/player/seek?position_ms=${positionMs}`, {
      method: 'PUT',
    });
  }

  async setVolume(volumePercent: number): Promise<void> {
    await this.request(`/me/player/volume?volume_percent=${Math.round(volumePercent)}`, {
      method: 'PUT',
    });
  }

  // Search
  async searchTracks(query: string, limit = 20): Promise<SearchResponse> {
    return this.request<SearchResponse>(
      `/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`
    );
  }

  // User Library
  async getSavedTracks(limit = 50): Promise<SavedTracksResponse> {
    return this.request<SavedTracksResponse>(`/me/tracks?limit=${limit}`);
  }

  async saveTracks(ids: string[]): Promise<void> {
    await this.request('/me/tracks', {
      method: 'PUT',
      body: JSON.stringify({ ids }),
    });
  }

  async removeSavedTracks(ids: string[]): Promise<void> {
    await this.request('/me/tracks', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  }

  // Recommendations
  async getRecommendations(options: RecommendationOptions): Promise<RecommendationsResponse> {
    // Convert options to query parameters
    const params = new URLSearchParams();
    
    // Add seed parameters
    if (options.seed_artists?.length) {
      params.append('seed_artists', options.seed_artists.join(','));
    }
    if (options.seed_genres?.length) {
      params.append('seed_genres', options.seed_genres.join(','));
    }
    if (options.seed_tracks?.length) {
      params.append('seed_tracks', options.seed_tracks.join(','));
    }
    
    // Add limit and market
    if (options.limit) {
      params.append('limit', options.limit.toString());
    }
    if (options.market) {
      params.append('market', options.market);
    }
    
    // Add audio features
    const audioFeatureParams = [
      'min_energy', 'max_energy', 'target_energy',
      'min_tempo', 'max_tempo', 'target_tempo',
      'min_valence', 'max_valence', 'target_valence',
      'min_popularity', 'max_popularity', 'target_popularity'
    ] as const;
    
    for (const param of audioFeatureParams) {
      const value = options[param as keyof typeof options];
      if (value !== undefined) {
        params.append(param, value.toString());
      }
    }
    
    return this.request<RecommendationsResponse>(`/recommendations?${params.toString()}`);
  }

  // Player State
  async getPlaybackState(): Promise<PlaybackState | null> {
    try {
      return await this.request<PlaybackState>('/me/player');
    } catch (error) {
      if (error instanceof Error && error.message.includes('No active device')) {
        return null;
      }
      throw error;
    }
  }

  // Transform Spotify track to our TrackMetadata format
  static transformTrack(track: Track) {
    return {
      id: track.id,
      title: track.name,
      artist: track.artists[0]?.name || 'Unknown Artist',
      album: track.album.name,
      albumArt: track.album.images[0]?.url,
      duration: track.duration_ms,
      uri: track.uri,
      externalUrl: track.external_urls.spotify,
    };
  }
}
