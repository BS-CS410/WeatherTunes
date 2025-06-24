import { AuthService } from "./AuthService";
import type {
  Track,
  QueueState,
  SearchResponse,
  PlaybackState,
  SavedTracksResponse,
  RecommendationsResponse,
  RecommendationOptions,
} from "@/types/spotify-api-types";
import type { TrackMetadata } from "@/types/queue-types";

export class SpotifyService {
  private baseUrl = "https://api.spotify.com/v1";
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public async getAccessToken(): Promise<string | null> {
    return this.authService.getAccessToken();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = await this.authService.getAccessToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token might be expired, try to refresh
      const newToken = await this.authService.getAccessToken();
      if (!newToken) {
        throw new Error("Authentication required");
      }
      // Retry the request with the new token
      return this.request(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || "Request failed");
    }

    // For 204 No Content responses
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // Queue Operations
  async getQueue(): Promise<QueueState> {
    return this.request<QueueState>("/me/player/queue");
  }

  async addToQueue(uri: string): Promise<void> {
    await this.request(`/me/player/queue?uri=${encodeURIComponent(uri)}`, {
      method: "POST",
    });
  }

  async playNext(): Promise<void> {
    await this.request("/me/player/next", { method: "POST" });
  }

  // Player Controls
  async play(urisToPlay?: string[]): Promise<void> {
    await this.request<void>("/me/player/play", {
      method: "PUT",
      body: urisToPlay ? JSON.stringify({ uris: urisToPlay }) : "{}",
    });
  }

  async pause(): Promise<void> {
    await this.request("/me/player/pause", { method: "PUT" });
  }

  async next(): Promise<void> {
    await this.request("/me/player/next", { method: "POST" });
  }

  async previous(): Promise<void> {
    await this.request("/me/player/previous", { method: "POST" });
  }

  async seek(positionMs: number): Promise<void> {
    await this.request(`/me/player/seek?position_ms=${positionMs}`, {
      method: "PUT",
    });
  }

  async setVolume(volumePercent: number): Promise<void> {
    await this.request(
      `/me/player/volume?volume_percent=${Math.round(volumePercent)}`,
      {
        method: "PUT",
      },
    );
  }

  // Search
  async searchTracks(query: string, limit = 20): Promise<SearchResponse> {
    const response = await this.request<SearchResponse>(
      `/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
    );
    return {
      tracks: {
        ...response.tracks,
        items: response.tracks.items.map(SpotifyService.transformTrack),
      },
    };
  }

  // User Library
  async getSavedTracks(limit = 50): Promise<SavedTracksResponse> {
    const response = await this.request<SavedTracksResponse>(
      `/me/tracks?limit=${limit}`,
    );
    return {
      ...response,
      items: response.items.map((item) => ({
        ...item,
        track: SpotifyService.transformTrack(item.track),
      })),
    };
  }

  async saveTracks(ids: string[]): Promise<void> {
    await this.request("/me/tracks", {
      method: "PUT",
      body: JSON.stringify({ ids }),
    });
  }

  async removeSavedTracks(ids: string[]): Promise<void> {
    await this.request("/me/tracks", {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });
  }

  // Recommendations
  async getRecommendations(
    options: RecommendationOptions,
  ): Promise<RecommendationsResponse> {
    // Convert options to query parameters
    const params = new URLSearchParams();

    // Add seed parameters
    if (options.seed_artists?.length) {
      params.append("seed_artists", options.seed_artists.join(","));
    }
    if (options.seed_genres?.length) {
      params.append("seed_genres", options.seed_genres.join(","));
    }
    if (options.seed_tracks?.length) {
      params.append("seed_tracks", options.seed_tracks.join(","));
    }

    // Add limit and market
    if (options.limit) {
      params.append("limit", options.limit.toString());
    }
    if (options.market) {
      params.append("market", options.market);
    }

    // Add audio features
    const audioFeatureParams = [
      "min_acousticness",
      "max_acousticness",
      "target_acousticness",
      "min_danceability",
      "max_danceability",
      "target_danceability",
      "min_energy",
      "max_energy",
      "target_energy",
      "min_instrumentalness",
      "max_instrumentalness",
      "target_instrumentalness",
      "min_liveness",
      "max_liveness",
      "target_liveness",
      "min_loudness",
      "max_loudness",
      "target_loudness",
      "min_popularity",
      "max_popularity",
      "target_popularity",
      "min_speechiness",
      "max_speechiness",
      "target_speechiness",
      "min_tempo",
      "max_tempo",
      "target_tempo",
      "min_valence",
      "max_valence",
      "target_valence",
    ] as const;

    for (const param of audioFeatureParams) {
      const value = options[param as keyof typeof options];
      if (value !== undefined) {
        params.append(param, value.toString());
      }
    }

    const response = await this.request<RecommendationsResponse>(
      `/recommendations?${params.toString()}`,
    );
    return {
      ...response,
      tracks: response.tracks.map(SpotifyService.transformTrack),
    };
  }

  async searchByGenreAndFeatures(
    genre: string,
    audioFeatures: Record<string, number>,
    limit = 20,
  ): Promise<SearchResponse> {
    const options: RecommendationOptions = {
      seed_genres: [genre],
      limit,
    };

    for (const key in audioFeatures) {
      if (Object.prototype.hasOwnProperty.call(audioFeatures, key)) {
        // Assuming audioFeatures keys directly map to target_X or min_X/max_X
        // For simplicity, mapping to target_X for now
        options[`target_${key}` as keyof RecommendationOptions] =
          audioFeatures[key];
      }
    }

    const response = await this.getRecommendations(options);
    return {
      tracks: {
        href: "", // Placeholder, as RecommendationResponse doesn't have href for tracks
        items: response.tracks.map(SpotifyService.transformTrack),
        limit: response.tracks.length, // Use actual count as limit
        next: null,
        offset: 0,
        previous: null,
        total: response.tracks.length,
      },
      query: `genre:${genre}`,
      count: response.tracks.length,
    };
  }

  // Player State
  async getPlaybackState(): Promise<PlaybackState | null> {
    try {
      return await this.request<PlaybackState>("/me/player");
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("No active device")
      ) {
        return null;
      }
      throw error;
    }
  }

  async transferPlayback(deviceIds: string[], play = false): Promise<void> {
    await this.request<void>("/me/player", {
      method: "PUT",
      body: JSON.stringify({
        device_ids: deviceIds,
        play: play,
      }),
    });
  }

  // Transform Spotify track to our TrackMetadata format
  static transformTrack(track: Track): TrackMetadata {
    return {
      id: track.id,
      title: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      album: track.album.name,
      albumArt: track.album.images[0]?.url || "",
      duration: track.duration_ms,
      previewUrl: track.preview_url || undefined,
      externalUrl: track.external_urls.spotify,
      uri: track.uri,
    };
  }
}
