// Common types for Spotify API responses

export interface Image {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SimplifiedArtist {
  id: string;
  name: string;
  type: "artist";
  uri: string;
}

export interface SimplifiedAlbum {
  id: string;
  name: string;
  images: Image[];
  type: "album";
  uri: string;
}

export interface Track {
  id: string;
  name: string;
  artists: SimplifiedArtist[];
  album: SimplifiedAlbum;
  duration_ms: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  uri: string;
  type: "track";
  is_local: boolean;
  popularity: number;
}

export interface PlaybackState {
  is_playing: boolean;
  item: Track | null;
  progress_ms: number;
  device: {
    id: string | null;
    is_active: boolean;
    name: string;
    type: string;
    volume_percent: number | null;
  };
  shuffle_state: boolean;
  repeat_state: "off" | "track" | "context";
  timestamp: number;
  context: {
    external_urls: {
      spotify: string;
    };
    href: string;
    type: "playlist" | "album" | "artist" | "show" | "episode";
    uri: string;
  } | null;
}

export interface QueueState {
  currently_playing: Track | null;
  queue: Track[];
}

import { PaginatedResponse, ApiResponse } from '.';

export interface SearchResponse {
  tracks: PaginatedResponse<Track>;
}

export interface SavedTrack {
  added_at: string;
  track: Track;
}

export type SavedTracksResponse = PaginatedResponse<SavedTrack>;

export interface RecommendationSeed {
  id: string;
  href: string;
  type: 'artist' | 'track' | 'genre';
  initialPoolSize: number;
  afterFilteringSize: number;
  afterRelinkingSize: number;
}

export type RecommendationsResponse = ApiResponse<{
  tracks: Track[];
  seeds: RecommendationSeed[];
}>;

export interface SpotifyDevice {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
  supports_volume: boolean;
}

export interface SpotifyWebPlaybackError {
  message: string;
  type:
    | 'account_error'
    | 'authentication_error'
    | 'initialization_error'
    | 'playback_error';
}

export interface SpotifyAudioFeatures {
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  duration_ms: number;
  time_signature: number;
}

export interface MusicPreferences {
  genres: string[];
  audioFeatures: Partial<SpotifyAudioFeatures>;
  explicitContent: boolean;
  market: string;
}

export interface RecommendationOptions {
  seed_artists?: string[];
  seed_genres?: string[];
  seed_tracks?: string[];
  limit?: number;
  market?: string;
  min_energy?: number;
  max_energy?: number;
  target_energy?: number;
  min_tempo?: number;
  max_tempo?: number;
  target_tempo?: number;
  min_valence?: number;
  max_valence?: number;
  target_valence?: number;
  min_popularity?: number;
  max_popularity?: number;
  target_popularity?: number;
  min_acousticness?: number;
  max_acousticness?: number;
  target_acousticness?: number;
  min_danceability?: number;
  max_danceability?: number;
  target_danceability?: number;
  min_instrumentalness?: number;
  max_instrumentalness?: number;
  target_instrumentalness?: number;
  min_liveness?: number;
  max_liveness?: number;
  target_liveness?: number;
  min_loudness?: number;
  max_loudness?: number;
  target_loudness?: number;
  min_speechiness?: number;
  max_speechiness?: number;
  target_speechiness?: number;
  [key: string]: unknown; // Add index signature
}
