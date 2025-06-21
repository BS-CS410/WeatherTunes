/**
 * Simple Spotify API client - Updated for new auth system
 * Makes direct API calls to Spotify using functional auth
 */

import { getValidAccessToken } from "./spotify-auth";
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
    const { seed_artists, seed_genres, seed_tracks } =
      await this.getWeatherSeeds(request.weather_condition, timeOfDay);

    // Only include non-empty seed parameters
    const paramsObj: Record<string, string> = {
      limit: request.limit?.toString() || "20",
      target_energy: this.getEnergyTarget(request.weather_condition, timeOfDay),
      target_valence: this.getValenceTarget(request.weather_condition),
      target_danceability: this.getDanceabilityTarget(
        request.weather_condition,
      ),
    };

    if (seed_artists.length > 0)
      paramsObj.seed_artists = seed_artists.join(",");
    if (seed_genres.length > 0) paramsObj.seed_genres = seed_genres.join(",");
    if (seed_tracks.length > 0) paramsObj.seed_tracks = seed_tracks.join(",");

    // Ensure at least one seed is present
    if (
      !paramsObj.seed_artists &&
      !paramsObj.seed_genres &&
      !paramsObj.seed_tracks
    ) {
      throw new Error("No valid seed parameters for recommendations");
    }

    const params = new URLSearchParams(paramsObj);

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
   * Get user's saved tracks (liked tracks)
   */
  async getUserSavedTracks(limit = 50): Promise<TrackMetadata[]> {
    const token = await getValidAccessToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(
      `${this.baseUrl}/me/tracks?${new URLSearchParams({
        limit: limit.toString(),
      })}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to get user saved tracks");
    }

    const data = await response.json();
    return data.items.map((item: { track: SpotifyTrack }) =>
      this.transformTrack(item.track),
    );
  }

  /**
   * Add tracks to user's saved tracks (like tracks)
   */
  async saveTracksForUser(trackIds: string[]): Promise<void> {
    const token = await getValidAccessToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(`${this.baseUrl}/me/tracks`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: trackIds }),
    });

    if (!response.ok) {
      throw new Error("Failed to save tracks");
    }
  }

  /**
   * Remove tracks from user's saved tracks (unlike tracks)
   */
  async removeTracksForUser(trackIds: string[]): Promise<void> {
    const token = await getValidAccessToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(`${this.baseUrl}/me/tracks`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: trackIds }),
    });

    if (!response.ok) {
      throw new Error("Failed to remove tracks");
    }
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
   * Get available genre seeds from Spotify API with fallback
   */
  private async getAvailableGenres(): Promise<string[]> {
    const token = await getValidAccessToken();
    if (!token) throw new Error("Not authenticated");

    try {
      const response = await fetch(
        `${this.baseUrl}/recommendations/available-genre-seeds`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to get available genres");
      }

      const data = await response.json();
      return data.genres;
    } catch (error) {
      console.warn(
        "Failed to fetch genres from Spotify, using fallback:",
        error,
      );
      // Fallback to commonly available genres
      return [
        "pop",
        "rock",
        "jazz",
        "classical",
        "electronic",
        "indie",
        "folk",
        "alternative",
        "blues",
        "ambient",
        "dance",
        "acoustic",
        "metal",
        "chill",
        "happy",
        "sad",
        "indie-pop",
        "hard-rock",
      ];
    }
  }

  /**
   * Get weather-appropriate seed data with error handling
   */
  private async getWeatherSeeds(condition: string, timeOfDay: string) {
    try {
      // Get current available genres from Spotify with fallback
      const availableGenres = await this.getAvailableGenres();

      // Define preferred genres for weather conditions
      const weatherSeeds: Record<string, string[]> = {
        "clear sky": ["pop", "indie-pop", "electronic", "dance", "happy"],
        cloudy: ["indie-pop", "alternative", "folk", "indie"],
        rain: ["jazz", "blues", "acoustic", "sad", "chill"],
        thunderstorm: ["rock", "metal", "electronic", "hard-rock"],
        snow: ["ambient", "classical", "folk", "chill"],
        fog: ["ambient", "indie-pop", "electronic", "atmospheric"],
      };

      const timeSeeds: Record<string, string[]> = {
        morning: ["pop", "indie-pop", "electronic", "happy"],
        afternoon: ["rock", "pop", "dance", "upbeat"],
        evening: ["jazz", "blues", "acoustic", "chill"],
        night: ["ambient", "electronic", "indie-pop", "sleep"],
      };

      const conditionGenres =
        weatherSeeds[condition.toLowerCase()] || weatherSeeds["clear sky"];
      const timeGenres = timeSeeds[timeOfDay] || timeSeeds["afternoon"];

      // Filter to only use available genres
      const allGenres = [...new Set([...conditionGenres, ...timeGenres])];
      const validGenres = allGenres.filter((g) => availableGenres.includes(g));

      // Ensure we have at least some genres (fallback to first available)
      const finalGenres =
        validGenres.length > 0
          ? validGenres.slice(0, 3)
          : availableGenres.slice(0, 3);

      return {
        seed_artists: [], // Could add popular artists here
        seed_genres: finalGenres,
        seed_tracks: [], // Could add popular tracks here
      };
    } catch (error) {
      console.warn("Error getting weather seeds, using basic fallback:", error);
      // Basic fallback with commonly available genres
      return {
        seed_artists: [],
        seed_genres: ["pop", "rock", "jazz"].slice(0, 3),
        seed_tracks: [],
      };
    }
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
