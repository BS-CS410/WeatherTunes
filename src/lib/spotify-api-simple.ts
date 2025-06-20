/**
 * Simplified Spotify API service using direct API calls
 * No backend proxy required
 */

import { spotifyAuth } from "./spotify-auth-simple";

export interface Track {
  id: string;
  name: string;
  artists: string[];
  album: string;
  albumArt: string;
  duration_ms: number;
  preview_url?: string;
  external_urls: { spotify: string };
}

export interface WeatherMoodMapping {
  weather_condition: string;
  temperature_range: [number, number];
  time_of_day: string;
  mood_tags: string[];
  energy_level: "low" | "medium" | "high";
  valence_range: [number, number];
}

class SimplifiedSpotifyService {
  private static instance: SimplifiedSpotifyService;

  static getInstance(): SimplifiedSpotifyService {
    if (!SimplifiedSpotifyService.instance) {
      SimplifiedSpotifyService.instance = new SimplifiedSpotifyService();
    }
    return SimplifiedSpotifyService.instance;
  }

  /**
   * Get track by ID
   */
  async getTrack(trackId: string): Promise<Track> {
    const data = await spotifyAuth.spotifyApiRequest<{
      id: string;
      name: string;
      artists: Array<{ name: string }>;
      album: { name: string; images: Array<{ url: string }> };
      duration_ms: number;
      preview_url?: string;
      external_urls: { spotify: string };
    }>(`/tracks/${trackId}`);

    return {
      id: data.id,
      name: data.name,
      artists: data.artists.map((artist) => artist.name),
      album: data.album.name,
      albumArt: data.album.images[0]?.url || "",
      duration_ms: data.duration_ms,
      preview_url: data.preview_url,
      external_urls: data.external_urls,
    };
  }

  /**
   * Search for tracks based on weather and mood
   */
  async searchForWeather(
    weatherCondition: string,
    temperature: number,
    timeOfDay: string,
  ): Promise<Track[]> {
    // Define mood mappings based on weather
    const moodMapping = this.getMoodMapping(
      weatherCondition,
      temperature,
      timeOfDay,
    );

    // Build search query
    const genreQueries = moodMapping.mood_tags
      .map((tag) => `genre:${tag}`)
      .join(" OR ");
    const query = `(${genreQueries}) year:2020-2024`;

    const searchParams = new URLSearchParams({
      q: query,
      type: "track",
      limit: "20",
      market: "US",
    });

    const data = await spotifyAuth.spotifyApiRequest<any>(
      `/search?${searchParams}`,
    );

    return data.tracks.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist: any) => artist.name),
      album: track.album.name,
      albumArt: track.album.images[0]?.url || "",
      duration_ms: track.duration_ms,
      preview_url: track.preview_url,
      external_urls: track.external_urls,
    }));
  }

  /**
   * Get user's top tracks for personalization
   */
  async getUserTopTracks(
    timeRange: "short_term" | "medium_term" | "long_term" = "medium_term",
  ): Promise<Track[]> {
    const data = await spotifyAuth.spotifyApiRequest<any>(
      `/me/top/tracks?time_range=${timeRange}&limit=20`,
    );

    return data.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist: any) => artist.name),
      album: track.album.name,
      albumArt: track.album.images[0]?.url || "",
      duration_ms: track.duration_ms,
      preview_url: track.preview_url,
      external_urls: track.external_urls,
    }));
  }

  /**
   * Get recommendations based on seed tracks and audio features
   */
  async getRecommendations(
    seedTracks: string[],
    audioFeatures: Partial<{
      valence: number;
      energy: number;
      danceability: number;
      acousticness: number;
    }> = {},
  ): Promise<Track[]> {
    const params = new URLSearchParams({
      seed_tracks: seedTracks.slice(0, 5).join(","),
      limit: "20",
      market: "US",
    });

    // Add audio feature targets
    if (audioFeatures.valence !== undefined) {
      params.append("target_valence", audioFeatures.valence.toString());
    }
    if (audioFeatures.energy !== undefined) {
      params.append("target_energy", audioFeatures.energy.toString());
    }
    if (audioFeatures.danceability !== undefined) {
      params.append(
        "target_danceability",
        audioFeatures.danceability.toString(),
      );
    }
    if (audioFeatures.acousticness !== undefined) {
      params.append(
        "target_acousticness",
        audioFeatures.acousticness.toString(),
      );
    }

    const data = await spotifyAuth.spotifyApiRequest<any>(
      `/recommendations?${params}`,
    );

    return data.tracks.map((track: any) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist: any) => artist.name),
      album: track.album.name,
      albumArt: track.album.images[0]?.url || "",
      duration_ms: track.duration_ms,
      preview_url: track.preview_url,
      external_urls: track.external_urls,
    }));
  }

  /**
   * Get weather-based music recommendations
   */
  async getWeatherBasedRecommendations(
    weatherCondition: string,
    temperature: number,
    timeOfDay: string,
  ): Promise<Track[]> {
    try {
      // First try to get user's top tracks for personalization
      const topTracks = await this.getUserTopTracks();

      if (topTracks.length > 0) {
        // Use top tracks as seeds with weather-based audio features
        const moodMapping = this.getMoodMapping(
          weatherCondition,
          temperature,
          timeOfDay,
        );
        const audioFeatures = {
          valence:
            (moodMapping.valence_range[0] + moodMapping.valence_range[1]) / 2,
          energy:
            moodMapping.energy_level === "high"
              ? 0.8
              : moodMapping.energy_level === "medium"
                ? 0.5
                : 0.2,
        };

        return await this.getRecommendations(
          topTracks.slice(0, 3).map((t) => t.id),
          audioFeatures,
        );
      }
    } catch (error) {
      console.warn(
        "Failed to get personalized recommendations, falling back to search:",
        error,
      );
    }

    // Fallback to search-based recommendations
    return await this.searchForWeather(
      weatherCondition,
      temperature,
      timeOfDay,
    );
  }

  /**
   * Map weather conditions to musical moods
   */
  private getMoodMapping(
    weatherCondition: string,
    temperature: number,
    timeOfDay: string,
  ): WeatherMoodMapping {
    const weatherMappings: Record<string, Partial<WeatherMoodMapping>> = {
      clear: {
        mood_tags: ["pop", "indie", "folk"],
        energy_level: "medium",
        valence_range: [0.6, 0.9],
      },
      rain: {
        mood_tags: ["jazz", "blues", "ambient"],
        energy_level: "low",
        valence_range: [0.2, 0.5],
      },
      snow: {
        mood_tags: ["classical", "ambient", "indie"],
        energy_level: "low",
        valence_range: [0.3, 0.6],
      },
      clouds: {
        mood_tags: ["indie", "alternative", "chill"],
        energy_level: "medium",
        valence_range: [0.4, 0.7],
      },
      fog: {
        mood_tags: ["ambient", "electronic", "downtempo"],
        energy_level: "low",
        valence_range: [0.2, 0.5],
      },
    };

    const timeModifiers = {
      morning: { energy_boost: 0.2, valence_boost: 0.1 },
      afternoon: { energy_boost: 0.1, valence_boost: 0.0 },
      evening: { energy_boost: -0.1, valence_boost: -0.1 },
      night: { energy_boost: -0.2, valence_boost: -0.2 },
    };

    const tempModifiers = {
      hot: { energy_boost: -0.1, mood_tags: ["tropical", "reggae"] },
      warm: { energy_boost: 0.1, mood_tags: ["pop", "rock"] },
      cool: { energy_boost: 0.0, mood_tags: ["indie", "folk"] },
      cold: { energy_boost: -0.1, mood_tags: ["ambient", "classical"] },
    };

    const base =
      weatherMappings[weatherCondition.toLowerCase()] ||
      weatherMappings["clear"];
    const timeModifier =
      timeModifiers[timeOfDay as keyof typeof timeModifiers] ||
      timeModifiers["afternoon"];

    let tempCategory: keyof typeof tempModifiers = "warm";
    if (temperature > 80) tempCategory = "hot";
    else if (temperature > 60) tempCategory = "warm";
    else if (temperature > 40) tempCategory = "cool";
    else tempCategory = "cold";

    const tempModifier = tempModifiers[tempCategory];

    return {
      weather_condition: weatherCondition,
      temperature_range: [temperature - 10, temperature + 10],
      time_of_day: timeOfDay,
      mood_tags: [...(base.mood_tags || []), ...(tempModifier.mood_tags || [])],
      energy_level: base.energy_level || "medium",
      valence_range: [
        Math.max(
          0,
          Math.min(
            1,
            (base.valence_range?.[0] || 0.5) + timeModifier.valence_boost,
          ),
        ),
        Math.max(
          0,
          Math.min(
            1,
            (base.valence_range?.[1] || 0.7) + timeModifier.valence_boost,
          ),
        ),
      ],
    };
  }
}

export const simplifiedSpotifyService = SimplifiedSpotifyService.getInstance();
