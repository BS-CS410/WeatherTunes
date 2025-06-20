/**
 * Spotify Web Playback SDK types for testing and future implementation
 */

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    name: string;
    uri: string;
  }>;
  album: {
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  duration_ms: number;
  uri: string;
  preview_url: string | null;
}

export interface SpotifyPlaybackState {
  context: {
    uri: string;
    metadata: Record<string, unknown>;
  };
  disallows: {
    pausing: boolean;
    peeking_next: boolean;
    peeking_prev: boolean;
    resuming: boolean;
    seeking: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
  };
  paused: boolean;
  position: number;
  repeat_mode: number;
  shuffle: boolean;
  track_window: {
    current_track: SpotifyTrack;
    next_tracks: SpotifyTrack[];
    previous_tracks: SpotifyTrack[];
  };
}

export interface SpotifyPlayer {
  connect(): Promise<boolean>;
  disconnect(): void;
  addListener(event: string, callback: (data: unknown) => void): void;
  removeListener(event: string, callback?: (data: unknown) => void): void;
  getCurrentState(): Promise<SpotifyPlaybackState | null>;
  setName(name: string): Promise<void>;
  getVolume(): Promise<number>;
  setVolume(volume: number): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  togglePlay(): Promise<void>;
  seek(position: number): Promise<void>;
  previousTrack(): Promise<void>;
  nextTrack(): Promise<void>;
}

export interface SpotifyPlayerConstructor {
  new (options: {
    name: string;
    getOAuthToken: (callback: (token: string) => void) => void;
    volume?: number;
  }): SpotifyPlayer;
}

export interface SpotifySDK {
  Player: SpotifyPlayerConstructor;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  tracks: {
    total: number;
    items: Array<{
      track: SpotifyTrack;
    }>;
  };
}

export interface SpotifyRecommendations {
  tracks: SpotifyTrack[];
  seeds: Array<{
    afterFilteringSize: number;
    afterRelinkingSize: number;
    href: string;
    id: string;
    initialPoolSize: number;
    type: string;
  }>;
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

// Music recommendation types based on weather
export interface WeatherMusicMapping {
  clear: string[];
  clouds: string[];
  rain: string[];
  snow: string[];
  thunderstorm: string[];
  drizzle: string[];
  mist: string[];
  fog: string[];
}

export interface MusicPreferences {
  genres: string[];
  audioFeatures: Partial<SpotifyAudioFeatures>;
  explicitContent: boolean;
  market: string;
}

// Extend global to include Spotify SDK
declare global {
  interface Window {
    Spotify?: SpotifySDK;
  }
}
