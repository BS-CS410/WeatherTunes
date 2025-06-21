/**
 * Simple Spotify API client
 * Makes direct API calls to Spotify using the auth service
 */

import { spotifyAuth } from "./spotify-auth";
import type {
  SpotifySearchResult,
  WeatherRecommendationRequest,
  WeatherRecommendationResponse,
  TrackMetadata,
} from "./spotify-types";

/**
 * Simple Spotify API client
 */
class SpotifyApi {
  private baseUrl = "https://api.spotify.com/v1";

  /**
   * Search for tracks
   */
  async searchTracks(query: string, limit = 20): Promise<SpotifySearchResult> {
    const token = await spotifyAuth.getAccessToken();
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
    const token = await spotifyAuth.getAccessToken();
    if (!token) throw new Error("Not authenticated");

    const genres = this.getGenresForWeather(request.weather_condition);
    const audioFeatures = this.getAudioFeaturesForWeather(
      request.weather_condition,
    );

    const params = new URLSearchParams({
      seed_genres: genres.slice(0, 3).join(","),
      limit: (request.limit || 20).toString(),
      ...audioFeatures,
    });

    const response = await fetch(`${this.baseUrl}/recommendations?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Spotify recommendations failed: ${response.status}`,
        errorText,
      );
      throw new Error(
        `Recommendations failed: ${response.status} ${errorText}`,
      );
    }

    const data = await response.json();
    return {
      tracks: data.tracks.map(this.transformTrack),
      weather_condition: request.weather_condition,
      temperature: request.temperature,
      time_of_day: request.time_of_day || "day",
      count: data.tracks.length,
    };
  }

  /**
   * Get track by ID
   */
  async getTrackById(trackId: string): Promise<TrackMetadata | null> {
    const token = await spotifyAuth.getAccessToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(`${this.baseUrl}/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const track = await response.json();
    return this.transformTrack(track);
  }

  /**
   * Transform Spotify track to our format
   */
  private transformTrack(track: {
    id: string;
    name: string;
    artists: { name: string }[];
    album: { images: { url: string }[] };
  }): TrackMetadata {
    return {
      id: track.id,
      title: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      albumArt: track.album.images[0]?.url || "",
    };
  }

  /**
   * Get genres for weather condition
   */
  private getGenresForWeather(condition: string): string[] {
    const weatherGenres: Record<string, string[]> = {
      clear: ["indie-rock", "folk", "country", "acoustic", "pop"],
      sunny: ["pop", "indie-pop", "reggae", "funk", "disco"],
      cloudy: ["indie", "alternative", "chill", "ambient", "rock"],
      rainy: ["blues", "jazz", "acoustic", "indie", "folk"],
      storm: ["rock", "metal", "electronic", "alternative", "punk"],
      snow: ["classical", "ambient", "folk", "indie-folk", "chill"],
      fog: ["ambient", "downtempo", "electronic", "chill", "new-age"],
    };

    const normalizedCondition = condition.toLowerCase().replace(/\s+/g, "");
    return weatherGenres[normalizedCondition] || weatherGenres.clear;
  }

  /**
   * Get audio features for weather condition
   */
  private getAudioFeaturesForWeather(
    condition: string,
  ): Record<string, string> {
    const weatherFeatures: Record<string, Record<string, number>> = {
      clear: { valence: 0.7, energy: 0.6, danceability: 0.5 },
      sunny: { valence: 0.8, energy: 0.7, danceability: 0.7 },
      cloudy: { valence: 0.4, energy: 0.4, danceability: 0.3 },
      rainy: { valence: 0.3, energy: 0.3, danceability: 0.2 },
      storm: { valence: 0.2, energy: 0.8, danceability: 0.4 },
      snow: { valence: 0.5, energy: 0.2, danceability: 0.1 },
      fog: { valence: 0.3, energy: 0.2, danceability: 0.2 },
    };

    const features =
      weatherFeatures[condition.toLowerCase()] || weatherFeatures.clear;

    return Object.entries(features).reduce(
      (acc, [key, value]) => {
        acc[`target_${key}`] = value.toString();
        return acc;
      },
      {} as Record<string, string>,
    );
  }
}

// Export singleton instance
export const spotifyApi = new SpotifyApi();
