/**
 * Simple Spotify API client - Updated for new auth system
 * Makes direct API calls to Spotify using functional auth
 */

import { getValidAccessToken } from "./spotify-auth-new";
import type {
  SpotifySearchResult,
  WeatherRecommendationRequest,
  WeatherRecommendationResponse,
  TrackMetadata,
} from "./spotify-types";

// Spotify API response types (minimal)
interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  duration_ms: number;
  preview_url: string | null;
  external_urls: { spotify: string };
  uri: string;
  popularity: number;
  explicit: boolean;
}

/**
 * Simple Spotify API client
 */
class SpotifyApi {
  private baseUrl = "https://api.spotify.com/v1";

  /**
   * Search for tracks
   */
  async searchTracks(query: string, limit = 20): Promise<SpotifySearchResult> {
    const token = await getValidAccessToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(
      `${this.baseUrl}/search?${new URLSearchParams({
        q: query,
        type: "track",
        limit: limit.toString(),
      })}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Search failed");
    }

    const data = await response.json();
    return {
      tracks: data.tracks.items.map(this.transformTrack),
      query,
      count: data.tracks.items.length,
    };
  }

  /**
   * Get weather-based music recommendations
   */
  async getWeatherRecommendations(
    request: WeatherRecommendationRequest,
  ): Promise<WeatherRecommendationResponse> {
    const token = await getValidAccessToken();
    if (!token) throw new Error("Not authenticated");

    const timeOfDay = request.time_of_day || "afternoon";

    // Generate seed artists/genres based on weather and time
    const { seed_artists, seed_genres, seed_tracks } = this.getWeatherSeeds(
      request.weather_condition,
      timeOfDay,
    );

    // Get Spotify recommendations
    const params = new URLSearchParams({
      limit: request.limit?.toString() || "20",
      seed_artists: seed_artists.join(","),
      seed_genres: seed_genres.join(","),
      seed_tracks: seed_tracks.join(","),
      // Adjust audio features based on weather
      target_energy: this.getEnergyTarget(request.weather_condition, timeOfDay),
      target_valence: this.getValenceTarget(request.weather_condition),
      target_danceability: this.getDanceabilityTarget(
        request.weather_condition,
      ),
    });

    const response = await fetch(`${this.baseUrl}/recommendations?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Weather recommendations failed");
    }

    const data = await response.json();
    return {
      tracks: data.tracks.map(this.transformTrack),
      weather_condition: request.weather_condition,
      temperature: request.temperature,
      time_of_day: timeOfDay,
      count: data.tracks.length,
    };
  }

  /**
   * Get user's top tracks for fallback recommendations
   */
  async getUserTopTracks(limit = 20): Promise<TrackMetadata[]> {
    const token = await getValidAccessToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(
      `${this.baseUrl}/me/top/tracks?${new URLSearchParams({
        limit: limit.toString(),
        time_range: "medium_term",
      })}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to get user top tracks");
    }

    const data = await response.json();
    return data.items.map(this.transformTrack);
  }

  /**
   * Transform Spotify track to our format
   */
  private transformTrack(track: SpotifyTrack): TrackMetadata {
    return {
      id: track.id,
      title: track.name,
      artist: track.artists[0]?.name || "Unknown Artist",
      albumArt: track.album?.images?.[0]?.url || "",
      albumArtFallback: track.album?.images?.[1]?.url,
      tags: [track.album?.name || "Unknown Album"],
    };
  }

  /**
   * Get weather-appropriate seed data
   */
  private getWeatherSeeds(condition: string, timeOfDay: string) {
    const weatherSeeds: Record<string, string[]> = {
      "clear sky": ["pop", "indie", "electronic"],
      cloudy: ["indie", "alternative", "folk"],
      rain: ["jazz", "blues", "acoustic"],
      thunderstorm: ["rock", "metal", "electronic"],
      snow: ["ambient", "classical", "folk"],
      fog: ["ambient", "indie", "electronic"],
    };

    const timeSeeds: Record<string, string[]> = {
      morning: ["pop", "indie", "electronic"],
      afternoon: ["rock", "pop", "dance"],
      evening: ["jazz", "blues", "acoustic"],
      night: ["ambient", "electronic", "indie"],
    };

    const conditionGenres =
      weatherSeeds[condition.toLowerCase()] || weatherSeeds["clear sky"];
    const timeGenres = timeSeeds[timeOfDay] || timeSeeds["afternoon"];

    return {
      seed_artists: [], // Could add popular artists here
      seed_genres: [...new Set([...conditionGenres, ...timeGenres])].slice(
        0,
        3,
      ),
      seed_tracks: [], // Could add popular tracks here
    };
  }

  /**
   * Get energy target based on weather and time
   */
  private getEnergyTarget(condition: string, timeOfDay: string): string {
    const weatherEnergy: Record<string, number> = {
      "clear sky": 0.7,
      cloudy: 0.5,
      rain: 0.3,
      thunderstorm: 0.8,
      snow: 0.4,
      fog: 0.3,
    };

    const timeEnergy: Record<string, number> = {
      morning: 0.6,
      afternoon: 0.7,
      evening: 0.5,
      night: 0.3,
    };

    const weatherValue = weatherEnergy[condition.toLowerCase()] || 0.6;
    const timeValue = timeEnergy[timeOfDay] || 0.6;

    return ((weatherValue + timeValue) / 2).toFixed(1);
  }

  /**
   * Get valence (positivity) target based on weather
   */
  private getValenceTarget(condition: string): string {
    const valenceMap: Record<string, number> = {
      "clear sky": 0.8,
      cloudy: 0.5,
      rain: 0.3,
      thunderstorm: 0.4,
      snow: 0.6,
      fog: 0.4,
    };

    return (valenceMap[condition.toLowerCase()] || 0.6).toFixed(1);
  }

  /**
   * Get danceability target based on weather
   */
  private getDanceabilityTarget(condition: string): string {
    const danceabilityMap: Record<string, number> = {
      "clear sky": 0.7,
      cloudy: 0.5,
      rain: 0.4,
      thunderstorm: 0.6,
      snow: 0.4,
      fog: 0.3,
    };

    return (danceabilityMap[condition.toLowerCase()] || 0.5).toFixed(1);
  }
}

// Export singleton instance
export const spotifyApi = new SpotifyApi();
