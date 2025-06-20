/**
 * Spotify Web Playback SDK service
 * Manages player initialization, connection, and playback control
 */

import type {
  SpotifyPlayer,
  SpotifyWebPlaybackState,
} from "@/types/spotify-types";
import { authService } from "./auth-frontend";

type PlayerEventCallback = (data: unknown) => void;

interface PlayerEventListeners {
  ready: PlayerEventCallback[];
  not_ready: PlayerEventCallback[];
  player_state_changed: PlayerEventCallback[];
  initialization_error: PlayerEventCallback[];
  authentication_error: PlayerEventCallback[];
  account_error: PlayerEventCallback[];
  playback_error: PlayerEventCallback[];
}

/**
 * Centralized Spotify Web Playback SDK service
 * Singleton pattern for managing player instance and state
 */
export class SpotifyPlayerService {
  private static instance: SpotifyPlayerService;
  private player: SpotifyPlayer | null = null;
  private deviceId: string | null = null;
  private isReady = false;
  private isConnected = false;
  private accessToken: string | null = null;
  private eventListeners: PlayerEventListeners = {
    ready: [],
    not_ready: [],
    player_state_changed: [],
    initialization_error: [],
    authentication_error: [],
    account_error: [],
    playback_error: [],
  };

  static getInstance(): SpotifyPlayerService {
    if (!SpotifyPlayerService.instance) {
      SpotifyPlayerService.instance = new SpotifyPlayerService();
    }
    return SpotifyPlayerService.instance;
  }

  private constructor() {
    // Singleton pattern - private constructor
  }

  /**
   * Initialize the Spotify Web Playback SDK player
   */
  async initialize(): Promise<boolean> {
    try {
      console.log("🎵 Starting Spotify player initialization...");

      // Check if SDK is loaded
      if (!window.Spotify) {
        console.error("❌ Spotify Web Playback SDK not loaded");
        throw new Error("Spotify Web Playback SDK not loaded");
      }
      console.log("✅ Spotify SDK is available");

      // Check authentication first
      const isAuthenticated = await this.checkAuthentication();
      if (!isAuthenticated) {
        console.error("❌ User not authenticated");
        throw new Error("User not authenticated - please log in first");
      }

      // Get access token from backend with timeout
      console.log("🔑 Fetching access token...");
      await this.refreshAccessToken();

      if (!this.accessToken) {
        console.error("❌ No access token available");
        throw new Error("Failed to obtain access token");
      }
      console.log("✅ Access token obtained");

      // Create player instance
      console.log("🎮 Creating player instance...");
      this.player = new window.Spotify.Player({
        name: "WeatherTunes Web Player",
        getOAuthToken: (callback) => {
          console.log("🔄 SDK requesting token via callback...");
          if (this.accessToken) {
            console.log("✅ Providing token to SDK");
            callback(this.accessToken);
          } else {
            console.log("⚠️ No token available, refreshing...");
            this.refreshAccessToken().then(() => {
              if (this.accessToken) {
                console.log("✅ Token refreshed, providing to SDK");
                callback(this.accessToken);
              } else {
                console.error("❌ Failed to refresh token for SDK");
              }
            });
          }
        },
        volume: 0.5,
      });
      console.log("✅ Player instance created");

      // Set up event listeners
      console.log("📡 Setting up event listeners...");
      this.setupEventListeners();
      console.log("✅ Event listeners configured");

      // Connect to Spotify with timeout
      console.log("🔌 Connecting to Spotify...");
      const connectPromise = this.player.connect();
      const timeoutPromise = new Promise<boolean>((_, reject) => {
        setTimeout(
          () => reject(new Error("Connection timeout after 15 seconds")),
          15000,
        );
      });

      const connected = await Promise.race([connectPromise, timeoutPromise]);
      this.isConnected = connected;

      if (connected) {
        console.log("✅ Player connected successfully");
      } else {
        console.error("❌ Player connection failed");
      }

      return connected;
    } catch (error) {
      console.error("❌ Failed to initialize Spotify player:", error);
      this.emitEvent("initialization_error", {
        message: (error as Error).message,
      });
      return false;
    }
  }

  /**
   * Set up player event listeners
   */
  private setupEventListeners(): void {
    if (!this.player) return;

    // Player ready
    this.player.addListener("ready", (data) => {
      const { device_id } = data as { device_id: string };
      console.log("Spotify player ready with device ID:", device_id);
      this.deviceId = device_id;
      this.isReady = true;
      this.emitEvent("ready", { device_id });
    });

    // Player not ready
    this.player.addListener("not_ready", (data) => {
      const { device_id } = data as { device_id: string };
      console.log("Spotify player not ready:", device_id);
      this.isReady = false;
      this.emitEvent("not_ready", { device_id });
    });

    // Player state changed
    this.player.addListener("player_state_changed", (state) => {
      console.log("Player state changed:", state);
      this.emitEvent("player_state_changed", state);
    });

    // Error handlers
    this.player.addListener("initialization_error", (data) => {
      const { message } = data as { message: string };
      console.error("Spotify initialization error:", message);
      this.emitEvent("initialization_error", { message });
    });

    this.player.addListener("authentication_error", (data) => {
      const { message } = data as { message: string };
      console.error("Spotify authentication error:", message);
      this.emitEvent("authentication_error", { message });
      // Try to refresh token
      this.refreshAccessToken();
    });

    this.player.addListener("account_error", (data) => {
      const { message } = data as { message: string };
      console.error("Spotify account error:", message);
      this.emitEvent("account_error", { message });
    });

    this.player.addListener("playback_error", (data) => {
      const { message } = data as { message: string };
      console.error("Spotify playback error:", message);
      this.emitEvent("playback_error", { message });
    });
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  private async getValidAccessToken(): Promise<string | null> {
    if (!this.accessToken) {
      await this.refreshAccessToken();
    }
    return this.accessToken;
  }

  /**
   * Refresh access token from frontend auth service
   */
  private async refreshAccessToken(): Promise<void> {
    try {
      console.log("🔑 Requesting access token from auth service...");
      const token = await authService.getAccessToken();
      if (token) {
        this.accessToken = token;
        console.log("✅ Access token received successfully");
      } else {
        console.error("❌ No access token available");
        this.accessToken = null;
      }
    } catch (error) {
      console.error("❌ Failed to refresh access token:", error);
      this.accessToken = null;
    }
  }

  /**
   * Play a track by URI
   */
  async playTrack(trackUri: string): Promise<boolean> {
    if (!this.isReady || !this.deviceId) {
      console.warn("Player not ready or device ID not available");
      return false;
    }

    try {
      // Use direct Spotify Web API call instead of backend proxy
      const token = await this.getValidAccessToken();
      if (!token) {
        console.error("No valid access token available");
        return false;
      }

      const response = await fetch(
        "https://api.spotify.com/v1/me/player/play",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            device_id: this.deviceId,
            uris: [trackUri],
          }),
        },
      );

      if (!response.ok) {
        console.error(`Spotify API error: ${response.status}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Failed to play track:", error);
      return false;
    }
  }

  /**
   * Play multiple tracks (replace queue)
   */
  async playTracks(trackUris: string[]): Promise<boolean> {
    if (!this.isReady || !this.deviceId) {
      console.warn("Player not ready or device ID not available");
      return false;
    }

    try {
      // Use direct Spotify Web API call instead of backend proxy
      const token = await this.getValidAccessToken();
      if (!token) {
        console.error("No valid access token available");
        return false;
      }

      const response = await fetch(
        "https://api.spotify.com/v1/me/player/play",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            device_id: this.deviceId,
            uris: trackUris,
          }),
        },
      );

      if (!response.ok) {
        console.error(`Spotify API error: ${response.status}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Failed to play tracks:", error);
      return false;
    }
  }

  /**
   * Add track to queue
   */
  async addToQueue(trackUri: string): Promise<boolean> {
    if (!this.isReady || !this.deviceId) {
      console.warn("Player not ready or device ID not available");
      return false;
    }

    try {
      // Use direct Spotify Web API call instead of backend proxy
      const token = await this.getValidAccessToken();
      if (!token) {
        console.error("No valid access token available");
        return false;
      }

      const response = await fetch(
        `https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(trackUri)}&device_id=${this.deviceId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        console.error(`Spotify API error: ${response.status}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Failed to add track to queue:", error);
      return false;
    }
  }

  /**
   * Transfer playback to this device
   */
  async transferPlayback(): Promise<boolean> {
    if (!this.deviceId) {
      console.warn("Device ID not available");
      return false;
    }

    try {
      // Use direct Spotify Web API call instead of backend proxy
      const token = await this.getValidAccessToken();
      if (!token) {
        console.error("No valid access token available");
        return false;
      }

      const response = await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_ids: [this.deviceId],
          play: false,
        }),
      });

      if (!response.ok) {
        console.error(`Spotify API error: ${response.status}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Failed to transfer playback:", error);
      return false;
    }
  }

  /**
   * Get current playback state
   */
  async getCurrentState(): Promise<SpotifyWebPlaybackState | null> {
    if (!this.player) {
      return null;
    }

    try {
      const state = await this.player.getCurrentState();
      if (state) {
        return {
          ...state,
          duration: state.track_window.current_track.duration_ms,
          loading: false,
        };
      }
      return null;
    } catch (error) {
      console.error("Failed to get current state:", error);
      return null;
    }
  }

  /**
   * Player control methods
   */
  async resume(): Promise<boolean> {
    if (!this.player) return false;
    try {
      await this.player.resume();
      return true;
    } catch (error) {
      console.error("Failed to resume:", error);
      return false;
    }
  }

  async pause(): Promise<boolean> {
    if (!this.player) return false;
    try {
      await this.player.pause();
      return true;
    } catch (error) {
      console.error("Failed to pause:", error);
      return false;
    }
  }

  async togglePlay(): Promise<boolean> {
    if (!this.player) return false;
    try {
      await this.player.togglePlay();
      return true;
    } catch (error) {
      console.error("Failed to toggle play:", error);
      return false;
    }
  }

  async nextTrack(): Promise<boolean> {
    if (!this.player) return false;
    try {
      await this.player.nextTrack();
      return true;
    } catch (error) {
      console.error("Failed to skip to next track:", error);
      return false;
    }
  }

  async previousTrack(): Promise<boolean> {
    if (!this.player) return false;
    try {
      await this.player.previousTrack();
      return true;
    } catch (error) {
      console.error("Failed to skip to previous track:", error);
      return false;
    }
  }

  async seek(position: number): Promise<boolean> {
    if (!this.player) return false;
    try {
      await this.player.seek(position);
      return true;
    } catch (error) {
      console.error("Failed to seek:", error);
      return false;
    }
  }

  async setVolume(volume: number): Promise<boolean> {
    if (!this.player) return false;
    try {
      await this.player.setVolume(volume);
      return true;
    } catch (error) {
      console.error("Failed to set volume:", error);
      return false;
    }
  }

  async getVolume(): Promise<number> {
    if (!this.player) return 0.5;
    try {
      return await this.player.getVolume();
    } catch (error) {
      console.error("Failed to get volume:", error);
      return 0.5;
    }
  }

  /**
   * Event management
   */
  addEventListener(
    event: keyof PlayerEventListeners,
    callback: PlayerEventCallback,
  ): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event].push(callback);
    }
  }

  removeEventListener(
    event: keyof PlayerEventListeners,
    callback: PlayerEventCallback,
  ): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(
        (cb) => cb !== callback,
      );
    }
  }

  private emitEvent(event: keyof PlayerEventListeners, data: unknown): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach((callback) => callback(data));
    }
  }

  /**
   * Cleanup and disconnect
   */
  disconnect(): void {
    if (this.player) {
      this.player.disconnect();
      this.player = null;
    }
    this.isReady = false;
    this.isConnected = false;
    this.deviceId = null;
  }

  /**
   * Getters for state
   */
  get ready(): boolean {
    return this.isReady;
  }

  get connected(): boolean {
    return this.isConnected;
  }

  get device(): string | null {
    return this.deviceId;
  }

  /**
   * Check if user is authenticated
   */
  async checkAuthentication(): Promise<boolean> {
    try {
      console.log("🔐 Checking authentication status...");
      const token = await authService.getAccessToken();
      const isAuthenticated = !!token;
      console.log(
        `Authentication status: ${isAuthenticated ? "✅ Authenticated" : "❌ Not authenticated"}`,
      );
      return isAuthenticated;
    } catch (error) {
      console.error("❌ Failed to check authentication status:", error);
      return false;
    }
  }
}

// Export singleton instance
export const spotifyPlayerService = SpotifyPlayerService.getInstance();
