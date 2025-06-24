/**
 * Spotify API client - Functional implementation
 * Makes direct API calls to Spotify using functional auth
 */

import type {
  SpotifySearchResult,
  WeatherRecommendationRequest,
  WeatherRecommendationResponse,
  TrackMetadata,
} from "./spotify-types";
import {
  WeatherMusicMapper,
  getTimeBasedAdjustments,
  getTemperatureBasedAdjustments,
  AudioFeatures,
} from "./recommendations";
import type { AuthService } from "@/services/AuthService";

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

interface SpotifyAudioFeatures {
  id: string;
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

/**
 * Spotify API client
 */
const baseUrl = "https://api.spotify.com/v1";

/**
 * Search for tracks
 */
export const searchTracks = async (
  authService: AuthService,
  query: string,
  limit = 20,
): Promise<SpotifySearchResult> => {
  const token = await authService.getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${baseUrl}/search?${new URLSearchParams({
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
    throw new Error(`Search failed: ${response.statusText}`);
  }

  const data = await response.json();
  const tracks = data.tracks.items.map(transformTrack);

  return {
    tracks,
    query,
    count: tracks.length,
  };
};

/**
 * Get track by ID
 */
export const getTrack = async (
  authService: AuthService,
  id: string,
): Promise<TrackMetadata> => {
  const token = await authService.getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${baseUrl}/tracks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Get track failed: ${response.statusText}`);
  }

  const track = await response.json();
  return transformTrack(track);
};

/**
 * Get multiple tracks by IDs
 */
export const getTracks = async (
  authService: AuthService,
  ids: string[],
): Promise<TrackMetadata[]> => {
  const token = await authService.getAccessToken();
  if (!token) throw new Error("Not authenticated");

  // Spotify API allows max 50 IDs per request
  const chunks = chunkArray(ids, 50);
  const results: TrackMetadata[] = [];

  for (const chunk of chunks) {
    const response = await fetch(
      `${baseUrl}/tracks?${new URLSearchParams({
        ids: chunk.join(","),
      })}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Get tracks failed: ${response.statusText}`);
    }

    const data = await response.json();
    const tracks = data.tracks.map(transformTrack);
    results.push(...tracks);
  }

  return results;
};

/**
 * Get audio features for tracks
 */
export const getAudioFeatures = async (
  authService: AuthService,
  ids: string[],
): Promise<Record<string, SpotifyAudioFeatures>> => {
  const token = await authService.getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${baseUrl}/audio-features?${new URLSearchParams({
      ids: ids.join(","),
    })}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Get audio features failed: ${response.statusText}`);
  }

  const data = await response.json();
  const features: Record<string, SpotifyAudioFeatures> = {};

  data.audio_features.forEach((feature: SpotifyAudioFeatures | null) => {
    if (feature) {
      features[feature.id] = feature;
    }
  });

  return features;
};

/**
 * Get recommendations based on weather
 */
export const getWeatherRecommendations = async (
  authService: AuthService,
  request: WeatherRecommendationRequest,
): Promise<WeatherRecommendationResponse> => {
  const token = await authService.getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const weatherMapping = WeatherMusicMapper.getMapping(
    request.weather_condition,
  );
  const timeAdjustments = getTimeBasedAdjustments(
    request.time_of_day || "afternoon",
  );
  const tempAdjustments = getTemperatureBasedAdjustments(
    request.temperature || 20,
  );

  // Apply adjustments to base audio features
  const combinedAudioFeatures: AudioFeatures = {
    ...weatherMapping.audioFeatures,
  };

  // Helper to apply adjustments
  const applyAdjustments = (
    features: AudioFeatures,
    adjustments: Partial<AudioFeatures>,
  ) => {
    for (const key in adjustments) {
      if (Object.prototype.hasOwnProperty.call(adjustments, key)) {
        const featureKey = key as keyof AudioFeatures;
        const currentValue = (features[featureKey] as number) || 0;
        const adjustmentValue = (adjustments[featureKey] as number) || 0;
        (features[featureKey] as number) = currentValue + adjustmentValue;
      }
    }
  };

  applyAdjustments(combinedAudioFeatures, timeAdjustments);
  applyAdjustments(combinedAudioFeatures, tempAdjustments);

  // Ensure values are within Spotify's expected range (0-1 for most, tempo can vary)
  const normalizedAudioFeatures: Record<string, string> = {};
  for (const key in combinedAudioFeatures) {
    if (Object.prototype.hasOwnProperty.call(combinedAudioFeatures, key)) {
      const value = combinedAudioFeatures[key as keyof AudioFeatures];
      if (value === undefined) continue;

      if (
        key === "valence" ||
        key === "energy" ||
        key === "danceability" ||
        key === "acousticness" ||
        key === "instrumentalness"
      ) {
        normalizedAudioFeatures[key] = Math.min(
          1,
          Math.max(0, value),
        ).toString();
      } else if (key === "tempo") {
        normalizedAudioFeatures[key] = Math.min(
          200,
          Math.max(50, value),
        ).toString();
      } else {
        normalizedAudioFeatures[key] = value.toString();
      }
    }
  }

  const params = new URLSearchParams({
    limit: (request.limit || 20).toString(),
    seed_genres: weatherMapping.genres.slice(0, 5).join(","), // Max 5 genres
    ...normalizedAudioFeatures,
  });

  const response = await fetch(`${baseUrl}/recommendations?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Get recommendations failed: ${response.statusText}`);
  }

  const data = await response.json();
  const tracks = data.tracks.map(transformTrack);

  return {
    tracks,
    weather_condition: request.weather_condition,
    temperature: request.temperature,
    time_of_day: request.time_of_day || "day",
    count: tracks.length,
  };
};

/**
 * Search for tracks by genre and audio features
 */
export const searchByGenreAndFeatures = async (
  authService: AuthService,
  genre: string,
  audioFeatures: Record<string, number>,
  limit = 20,
): Promise<SpotifySearchResult> => {
  const token = await authService.getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const params = new URLSearchParams({
    limit: limit.toString(),
    seed_genres: genre,
    ...Object.fromEntries(
      Object.entries(audioFeatures).map(([key, value]) => [
        key,
        value.toString(),
      ]),
    ),
  });

  const response = await fetch(`${baseUrl}/recommendations?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Search by genre failed: ${response.statusText}`);
  }

  const data = await response.json();
  const tracks = data.tracks.map(transformTrack);

  return {
    tracks,
    query: `genre:${genre}`,
    count: tracks.length,
  };
};

/**
 * Transform Spotify track to our TrackMetadata format
 */
const transformTrack = (track: SpotifyTrack): TrackMetadata => {
  return {
    id: track.id,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    album: track.album.name,
    albumArt: track.album.images[0]?.url,
    duration: track.duration_ms,
    previewUrl: track.preview_url || undefined,
    externalUrl: track.external_urls.spotify,
    uri: track.uri,
  };
};

/**
 * Utility to chunk array
 */
const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};
