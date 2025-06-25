import { AuthService } from "./AuthService";
import type {
  Track,
  QueueState,
  SearchResponse,
  PlaybackState,
  SavedTracksResponse,
  RecommendationsResponse,
  RecommendationOptions,
  SavedTrack,
} from "@/types/spotify-api-types";
import type { TrackMetadata } from "@/types/queue-types";

// === WEATHER-TO-MUSIC MAPPING (from recommendations.ts) ===

export interface AudioFeatures {
  valence?: number;
  energy?: number;
  danceability?: number;
  acousticness?: number;
  instrumentalness?: number;
  tempo?: number;
}

export interface WeatherMusicMapping {
  genres: string[];
  audioFeatures: AudioFeatures;
  seedKeywords: string[];
}

class WeatherMusicMapper {
  private static readonly weatherMappings: Record<string, WeatherMusicMapping> =
    {
      "clear sky": {
        genres: ["pop", "indie-pop", "tropical", "summer", "funk"],
        audioFeatures: { valence: 0.7, energy: 0.8, danceability: 0.7, acousticness: 0.3, tempo: 120 },
        seedKeywords: ["happy", "upbeat", "sunny", "bright", "energetic"],
      },
      sunny: {
        genres: ["pop", "reggae", "tropical", "beach", "surf"],
        audioFeatures: { valence: 0.8, energy: 0.7, danceability: 0.8, acousticness: 0.4, tempo: 115 },
        seedKeywords: ["sunshine", "beach", "summer", "warm", "tropical"],
      },
      clouds: {
        genres: ["indie", "alternative", "shoegaze", "dream-pop", "ambient"],
        audioFeatures: { valence: 0.5, energy: 0.5, danceability: 0.4, acousticness: 0.6, tempo: 90 },
        seedKeywords: ["cloudy", "overcast", "contemplative", "mellow"],
      },
      "few clouds": {
        genres: ["indie-pop", "folk", "acoustic", "chill"],
        audioFeatures: { valence: 0.6, energy: 0.6, danceability: 0.5, acousticness: 0.7, tempo: 100 },
        seedKeywords: ["partly cloudy", "breezy", "peaceful"],
      },
      "scattered clouds": {
        genres: ["indie", "alternative", "folk-rock", "soft-rock"],
        audioFeatures: { valence: 0.4, energy: 0.5, danceability: 0.4, acousticness: 0.6, tempo: 95 },
        seedKeywords: ["scattered", "variable", "changing"],
      },
      "broken clouds": {
        genres: ["alternative", "grunge", "indie-rock", "post-rock"],
        audioFeatures: { valence: 0.3, energy: 0.6, danceability: 0.3, acousticness: 0.4, tempo: 85 },
        seedKeywords: ["broken", "dramatic", "moody"],
      },
      overcast: {
        genres: ["ambient", "post-rock", "slowcore", "drone"],
        audioFeatures: { valence: 0.2, energy: 0.3, danceability: 0.2, acousticness: 0.8, tempo: 70 },
        seedKeywords: ["grey", "overcast", "heavy", "atmospheric"],
      },
      rain: {
        genres: ["jazz", "blues", "lo-fi", "neo-soul", "r&b"],
        audioFeatures: { valence: 0.3, energy: 0.4, danceability: 0.3, acousticness: 0.7, tempo: 80 },
        seedKeywords: ["rain", "drops", "cozy", "intimate", "melancholy"],
      },
      "light rain": {
        genres: ["acoustic", "folk", "singer-songwriter", "indie-folk"],
        audioFeatures: { valence: 0.4, energy: 0.3, danceability: 0.2, acousticness: 0.8, tempo: 75 },
        seedKeywords: ["gentle", "light", "soft", "drizzle"],
      },
      "moderate rain": {
        genres: ["jazz", "blues", "soul", "lo-fi"],
        audioFeatures: { valence: 0.3, energy: 0.4, danceability: 0.3, acousticness: 0.7, tempo: 80 },
        seedKeywords: ["steady", "moderate", "consistent"],
      },
      "heavy rain": {
        genres: ["ambient", "post-rock", "classical", "dark-ambient"],
        audioFeatures: { valence: 0.2, energy: 0.3, danceability: 0.1, acousticness: 0.8, tempo: 60 },
        seedKeywords: ["heavy", "intense", "powerful", "storm"],
      },
      drizzle: {
        genres: ["lo-fi", "chillhop", "ambient", "downtempo"],
        audioFeatures: { valence: 0.4, energy: 0.2, danceability: 0.2, acousticness: 0.9, tempo: 70 },
        seedKeywords: ["mist", "light", "gentle", "soft"],
      },
      snow: {
        genres: ["classical", "ambient", "folk", "winter"],
        audioFeatures: { valence: 0.4, energy: 0.3, danceability: 0.2, acousticness: 0.8, tempo: 65 },
        seedKeywords: ["snow", "winter", "peaceful", "serene", "quiet"],
      },
      "light snow": {
        genres: ["folk", "acoustic", "classical", "new-age"],
        audioFeatures: { valence: 0.5, energy: 0.2, danceability: 0.1, acousticness: 0.9, tempo: 60 },
        seedKeywords: ["gentle", "falling", "soft", "delicate"],
      },
      "heavy snow": {
        genres: ["classical", "ambient", "drone", "post-rock"],
        audioFeatures: { valence: 0.3, energy: 0.2, danceability: 0.1, acousticness: 0.8, tempo: 50 },
        seedKeywords: ["blizzard", "heavy", "intense", "white"],
      },
      thunderstorm: {
        genres: ["metal", "rock", "electronic", "industrial", "dark-ambient"],
        audioFeatures: { valence: 0.2, energy: 0.9, danceability: 0.4, acousticness: 0.2, tempo: 140 },
        seedKeywords: ["thunder", "lightning", "storm", "power", "intensity"],
      },
      "thunderstorm with rain": {
        genres: ["progressive-rock", "post-metal", "shoegaze", "noise"],
        audioFeatures: { valence: 0.1, energy: 0.8, danceability: 0.3, acousticness: 0.1, tempo: 130 },
        seedKeywords: ["dramatic", "intense", "electric", "powerful"],
      },
      fog: {
        genres: ["ambient", "drone", "dark-ambient", "minimal"],
        audioFeatures: { valence: 0.3, energy: 0.2, danceability: 0.1, acousticness: 0.6, tempo: 55 },
        seedKeywords: ["fog", "mist", "mysterious", "ethereal", "obscure"],
      },
      mist: {
        genres: ["ambient", "new-age", "minimal", "soundscape"],
        audioFeatures: { valence: 0.4, energy: 0.1, danceability: 0.1, acousticness: 0.7, tempo: 50 },
        seedKeywords: ["misty", "ethereal", "floating", "soft"],
      },
      hail: {
        genres: ["experimental", "noise", "industrial", "breakcore"],
        audioFeatures: { valence: 0.1, energy: 0.9, danceability: 0.2, acousticness: 0.1, tempo: 160 },
        seedKeywords: ["chaos", "intense", "harsh", "aggressive"],
      },
      tornado: {
        genres: ["mathcore", "technical-metal", "breakcore", "harsh-noise"],
        audioFeatures: { valence: 0.0, energy: 1.0, danceability: 0.1, acousticness: 0.0, tempo: 200 },
        seedKeywords: ["chaos", "destruction", "whirlwind", "extreme"],
      },
      default: {
        genres: ["pop", "indie", "alternative", "rock"],
        audioFeatures: { valence: 0.5, energy: 0.6, danceability: 0.5, acousticness: 0.5, tempo: 100 },
        seedKeywords: ["general", "mixed", "varied"],
      },
    };

  static getMapping(condition: string): WeatherMusicMapping {
    const normalizedCondition = condition.toLowerCase().trim();
    return this.weatherMappings[normalizedCondition] || this.weatherMappings.default;
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getTimeBasedAdjustments(timeOfDay: string): Partial<AudioFeatures> {
  const adjustments: Record<string, Partial<AudioFeatures>> = {
    morning: { valence: 0.1, energy: 0.1, tempo: 10 },
    afternoon: { valence: 0.0, energy: 0.0, tempo: 0 },
    evening: { valence: -0.1, energy: -0.2, tempo: -15 },
    night: { valence: -0.2, energy: -0.3, tempo: -25 },
  };
  return adjustments[timeOfDay] || adjustments.afternoon;
}

function getTemperatureBasedAdjustments(temperature: number): Partial<AudioFeatures> {
  if (temperature > 30) return { valence: 0.2, energy: 0.2, danceability: 0.2, tempo: 20 };
  if (temperature > 20) return { valence: 0.1, energy: 0.1, danceability: 0.1, tempo: 10 };
  if (temperature > 10) return {};
  if (temperature > 0) return { valence: -0.1, energy: -0.1, acousticness: 0.1, tempo: -10 };
  return { valence: -0.2, energy: -0.2, acousticness: 0.2, tempo: -20 };
}

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
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (response.status === 401) {
      const newToken = await this.authService.getAccessToken();
      if (!newToken) throw new Error("Authentication required");
      return this.request(endpoint, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${newToken}` },
      });
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || "Request failed");
    }

    if (response.status === 204) return undefined as T;
    return response.json();
  }

  // Queue Operations
  async getQueue(): Promise<QueueState> {
    return this.request<QueueState>("/me/player/queue");
  }

  async addToQueue(uri: string): Promise<void> {
    await this.request(`/me/player/queue?uri=${encodeURIComponent(uri)}`, { method: "POST" });
  }

  async play(uris?: string[]): Promise<void> {
    await this.request("/me/player/play", {
      method: "PUT",
      body: JSON.stringify({ uris }),
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
    await this.request(`/me/player/seek?position_ms=${positionMs}`, { method: "PUT" });
  }

  async setVolume(volumePercent: number): Promise<void> {
    await this.request(`/me/player/volume?volume_percent=${Math.round(volumePercent)}`, { method: "PUT" });
  }

  // Search
  async searchTracks(query: string, limit = 20): Promise<TrackMetadata[]> {
    const response = await this.request<SearchResponse>(
      `/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
    );
    return (response.tracks.items as Track[]).map(SpotifyService.transformTrack);
  }

  // User Library
  async getSavedTracks(limit = 50): Promise<TrackMetadata[]> {
    const response = await this.request<SavedTracksResponse>(`/me/tracks?limit=${limit}`);
    return response.items.map((item: SavedTrack) => SpotifyService.transformTrack(item.track));
  }

  async saveTracks(ids: string[]): Promise<void> {
    await this.request("/me/tracks", { method: "PUT", body: JSON.stringify({ ids }) });
  }

  async removeSavedTracks(ids: string[]): Promise<void> {
    await this.request("/me/tracks", { method: "DELETE", body: JSON.stringify({ ids }) });
  }

  // Recommendations
  public async getRecommendations(options: RecommendationOptions): Promise<Track[]> {
    const params = new URLSearchParams();
    if (options.seed_artists?.length) params.append("seed_artists", options.seed_artists.join(","));
    if (options.seed_genres?.length) params.append("seed_genres", options.seed_genres.join(","));
    if (options.seed_tracks?.length) params.append("seed_tracks", options.seed_tracks.join(","));
    if (options.limit) params.append("limit", options.limit.toString());
    if (options.market) params.append("market", options.market);

    const audioFeatureParams = [
      "min_acousticness", "max_acousticness", "target_acousticness",
      "min_danceability", "max_danceability", "target_danceability",
      "min_energy", "max_energy", "target_energy",
      "min_instrumentalness", "max_instrumentalness", "target_instrumentalness",
      "min_liveness", "max_liveness", "target_liveness",
      "min_loudness", "max_loudness", "target_loudness",
      "min_popularity", "max_popularity", "target_popularity",
      "min_speechiness", "max_speechiness", "target_speechiness",
      "min_tempo", "max_tempo", "target_tempo",
      "min_valence", "max_valence", "target_valence",
    ] as const;

    for (const param of audioFeatureParams) {
      const value = options[param as keyof typeof options];
      if (value != null) params.append(param, value.toString());
    }

    const response = await this.request<RecommendationsResponse>(`/recommendations?${params.toString()}`);
    return response.data.tracks;
  }

  public async getWeatherPlaylist(
    weatherCondition: string,
    temperature?: number,
    timeOfDay?: string,
    additionalGenres: string[] = [],
    limit = 30,
  ): Promise<TrackMetadata[]> {
    const mapping = WeatherMusicMapper.getMapping(weatherCondition);
    let tracks: Track[] = [];

    const combinedAudioFeatures: AudioFeatures = { ...mapping.audioFeatures };
    const applyAdjustments = (features: AudioFeatures, adjustments: Partial<AudioFeatures>) => {
      for (const key in adjustments) {
        if (Object.prototype.hasOwnProperty.call(adjustments, key)) {
          const featureKey = key as keyof AudioFeatures;
          const currentValue = (features[featureKey] as number) || 0;
          const adjustmentValue = (adjustments[featureKey] as number) || 0;
          (features[featureKey] as number) = currentValue + adjustmentValue;
        }
      }
    };

    applyAdjustments(combinedAudioFeatures, getTimeBasedAdjustments(timeOfDay || "afternoon"));
    applyAdjustments(combinedAudioFeatures, getTemperatureBasedAdjustments(temperature || 20));

    const baseRecommendationOptions: RecommendationOptions = {
      limit: Math.floor(limit * 0.6),
      seed_genres: mapping.genres.slice(0, 5),
    };

    for (const key in combinedAudioFeatures) {
      if (Object.prototype.hasOwnProperty.call(combinedAudioFeatures, key)) {
        const value = combinedAudioFeatures[key as keyof AudioFeatures];
        if (value !== undefined) {
          (baseRecommendationOptions as RecommendationOptions)[`target_${key}`] = value;
        }
      }
    }

    const weatherTracks = await this.getRecommendations(baseRecommendationOptions);
    tracks = tracks.concat(weatherTracks);

    for (const genre of additionalGenres.slice(0, 2)) {
      const genreTracks = await this.getRecommendations({
        seed_genres: [genre],
        limit: Math.floor(limit * 0.2),
        ...combinedAudioFeatures,
      });
      tracks = tracks.concat(genreTracks);
    }

    const uniqueTracks = tracks.filter((track, index, self) => index === self.findIndex((t) => t.id === track.id));
    return shuffleArray(uniqueTracks).slice(0, limit).map(SpotifyService.transformTrack);
  }

  // Player State
  async getPlaybackState(): Promise<PlaybackState | null> {
    try {
      return await this.request<PlaybackState>("/me/player");
    } catch (error) {
      if (error instanceof Error && error.message.includes("No active device")) {
        return null;
      }
      throw error;
    }
  }

  async transferPlayback(deviceIds: string[], play = false): Promise<void> {
    await this.request<void>("/me/player", {
      method: "PUT",
      body: JSON.stringify({ device_ids: deviceIds, play: play }),
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
