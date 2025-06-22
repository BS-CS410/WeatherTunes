// Common types for Spotify API responses

export interface Image {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SimplifiedArtist {
  id: string;
  name: string;
  type: 'artist';
  uri: string;
}

export interface SimplifiedAlbum {
  id: string;
  name: string;
  images: Image[];
  type: 'album';
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
  type: 'track';
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
  repeat_state: 'off' | 'track' | 'context';
  timestamp: number;
  context: {
    external_urls: {
      spotify: string;
    };
    href: string;
    type: 'playlist' | 'album' | 'artist' | 'show' | 'episode';
    uri: string;
  } | null;
}

export interface QueueState {
  currently_playing: Track | null;
  queue: Track[];
}

export interface SearchResponse {
  tracks: {
    href: string;
    items: Track[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
}

export interface SavedTrack {
  added_at: string;
  track: Track;
}

export interface SavedTracksResponse {
  href: string;
  items: SavedTrack[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

export interface RecommendationSeed {
  id: string;
  href: string;
  type: 'artist' | 'track' | 'genre';
  initialPoolSize: number;
  afterFilteringSize: number;
  afterRelinkingSize: number;
}

export interface RecommendationTrack extends Omit<Track, 'type' | 'is_local'> {
  // Additional fields specific to recommendation tracks
  explicit: boolean;
  external_urls: {
    spotify: string;
  };
  type: 'track';
  is_local: boolean;
}

export interface RecommendationsResponse {
  tracks: RecommendationTrack[];
  seeds: RecommendationSeed[];
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
}
