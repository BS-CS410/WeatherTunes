declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady?: () => void;
    Spotify: Spotify.Spotify;
  }
}

declare namespace Spotify {
  interface Spotify {
    Player: typeof Player; // Reference the class directly
  }

  interface WebPlaybackInstance {
    device_id: string;
  }

  interface Error {
    message: string;
  }

  interface PlayerOptions {
    name: string;
    getOAuthToken: (callback: (token: string) => void) => void;
    volume?: number;
  }

  // Declare Player as a class
  class Player {
    constructor(options: PlayerOptions);
    addListener(
      event: "ready",
      callback: (data: WebPlaybackInstance) => void,
    ): boolean;
    addListener(
      event: "not_ready",
      callback: (data: WebPlaybackInstance) => void,
    ): boolean;
    addListener(
      event: "player_state_changed",
      callback: (state: PlaybackState) => void,
    ): boolean;
    addListener(
      event: "initialization_error",
      callback: (data: Error) => void,
    ): boolean;
    addListener(
      event: "authentication_error",
      callback: (data: Error) => void,
    ): boolean;
    addListener(
      event: "account_error",
      callback: (data: Error) => void,
    ): boolean;
    addListener(
      event: "playback_error",
      callback: (data: Error) => void,
    ): boolean;
    connect(): Promise<boolean>;
    disconnect(): void;
    getCurrentState(): Promise<PlaybackState | null>;
    getVolume(): Promise<number>;
    pause(): Promise<void>;
    play(): Promise<void>;
    resume(): Promise<void>;
    seek(position_ms: number): Promise<void>;
    setVolume(volume: number): Promise<void>;
    nextTrack(): Promise<void>;
    previousTrack(): Promise<void>;
    togglePlay(): Promise<void>;
  }

  interface PlaybackState {
    context: {
      uri: string | null;
      metadata: Record<string, unknown> | null;
    };
    disallows: {
      pausing: boolean;
      peeking_next: boolean;
      peeking_prev: boolean;
      resuming: boolean;
      seeking: boolean;
      skipping_next: boolean;
      skipping_prev: boolean;
      toggling_repeat_context: boolean;
      toggling_shuffle: boolean;
      toggling_repeat_track: boolean;
      transferring_playback: boolean;
    };
    duration: number;
    paused: boolean;
    position: number;
    repeat_mode: number;
    shuffle: boolean;
    timestamp: number;
    track_window: {
      current_track: Track;
      previous_tracks: Track[];
      next_tracks: Track[];
    };
    playback_id: string;
  }

  interface Track {
    uri: string;
    id: string | null;
    type: "track" | "episode" | "ad";
    media_type: "audio" | "video";
    name: string;
    is_playable: boolean;
    album: {
      uri: string;
      name: string;
      images: Image[];
    };
    artists: Artist[];
    duration_ms: number;
    explicit: boolean;
    external_urls: {
      spotify: string;
    };
    linked_from: {
      uri: string | null;
      id: string | null;
    };
    is_local: boolean;
    preview_url: string | null;
    track_number: number;
  }

  interface Artist {
    uri: string;
    name: string;
  }

  interface Image {
    url: string;
    size?: "small" | "medium" | "large";
    height?: number;
    width?: number;
  }
}
