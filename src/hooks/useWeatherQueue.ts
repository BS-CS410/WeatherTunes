/**
 * Weather-aware queue generation using the new queue system
 */

import { useWeatherData } from "./useWeatherData";
import { useCallback } from "react";
import { useSpotifyQueue, useSpotifyService } from "./spotify";
import type { TrackMetadata } from "@/types/queue-types";
import type { Track, RecommendationTrack } from "@/types/spotify-api-types";
import { getVideoForCondition } from "@/data/video-assets";

// Helper function to get tempo based on temperature
function getTempoForTemperature(temperature: number): number {
  // Warmer temperatures get higher tempo (BPM)
  return Math.min(Math.max(60, Math.round(temperature * 2)), 180);
}

// Helper function to get genres based on weather and time of day
function getGenresForWeather(condition: string, timeOfDay: string): string[] {
  const conditionLower = condition.toLowerCase();
  const isDaytime = ["morning", "afternoon"].includes(timeOfDay);

  if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
    return isDaytime
      ? ["chill", "acoustic", "piano"]
      : ["rainy-day", "ambient", "sleep"];
  }

  if (conditionLower.includes("snow") || conditionLower.includes("sleet")) {
    return ["winter", "christmas", "holidays"];
  }

  if (conditionLower.includes("sun") || conditionLower.includes("clear")) {
    return isDaytime
      ? ["pop", "indie-pop", "summer"]
      : ["chill", "indie", "acoustic"];
  }

  if (conditionLower.includes("cloud") || conditionLower.includes("overcast")) {
    return ["indie", "alternative", "indie-pop"];
  }

  if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
    return ["rock", "alternative", "hard-rock"];
  }

  // Default genres
  return ["pop", "indie", "chill"];
}

interface UseWeatherQueueReturn {
  generateWeatherQueue: (count?: number) => Promise<TrackMetadata[]>;
  replaceQueueWithWeatherTracks: (count?: number) => Promise<void>;
}

/**
 * Hook for generating weather-based queues
 */
export function useWeatherQueue(): UseWeatherQueueReturn {
  const weatherState = useWeatherData();
  const { replaceQueue } = useSpotifyQueue();
  const spotifyService = useSpotifyService();

  // Extract stable values to avoid unnecessary re-renders
  const condition = weatherState.displayData?.condition || "clear sky";
  const temperature = weatherState.rawResponse?.main.temp || 20;

  const generateWeatherQueue = useCallback(
    async (count = 15): Promise<TrackMetadata[]> => {
      try {
        const timeOfDay = getCurrentTimeOfDay();

        console.log(
          `Generating weather queue: ${condition}, ${temperature}°C, ${timeOfDay}`,
        );

        // Try weather-based recommendations first
        try {
          const seedGenres = getGenresForWeather(condition, timeOfDay);
          const targetTempo = getTempoForTemperature(temperature);

          // Get recommendations using available seeds
          const recommendations = await spotifyService.getRecommendations({
            seed_genres: seedGenres.slice(0, 5), // Max 5 seed genres
            target_tempo: targetTempo,
            limit: count,
            min_energy: 0.3,
            max_energy: 0.9,
            target_valence: 0.7, // More positive mood
          });

          if (recommendations.tracks && recommendations.tracks.length > 0) {
            console.log(
              `Generated ${recommendations.tracks.length} weather-based tracks`,
              { seedGenres, targetTempo },
            );
            return recommendations.tracks.map(
              (track: RecommendationTrack | Track) => {
                const videoAsset = getVideoForCondition(condition);
                return {
                  id: track.id,
                  title: track.name,
                  artist: track.artists[0]?.name || "Unknown Artist",
                  album: track.album?.name || "Unknown Album",
                  albumArt: track.album?.images?.[0]?.url || "",
                  duration: track.duration_ms,
                  uri: track.uri,
                  externalUrl: track.external_urls?.spotify || "",
                  videoUrl: videoAsset.path,
                  videoClass: videoAsset.className || "",
                };
              },
            );
          }
        } catch (weatherError) {
          console.warn("Weather recommendations failed:", weatherError);
        }

        // Fallback to search-based tracks
        const searchTerms = getSearchTermsForWeather(condition, timeOfDay);
        const searchResults = await spotifyService.searchTracks(
          searchTerms,
          count,
        );

        console.log(
          `Fallback: Generated ${searchResults.tracks?.items?.length || 0} search-based tracks`,
          { searchTerms },
        );

        if (!searchResults.tracks?.items) {
          return [];
        }

        const videoAsset = getVideoForCondition(condition);
        return searchResults.tracks.items.map((track: Track) => ({
          id: track.id,
          title: track.name,
          artist: track.artists[0]?.name || "Unknown Artist",
          album: track.album?.name || "Unknown Album",
          albumArt: track.album?.images?.[0]?.url || "",
          duration: track.duration_ms,
          uri: track.uri,
          externalUrl: track.external_urls?.spotify || "",
          videoUrl: videoAsset.path,
          videoClass: videoAsset.className || "",
        }));
      } catch (error) {
        console.error("Failed to generate weather queue:", error);
        return [];
      }
    },
    [condition, temperature, spotifyService],
  );

  const replaceQueueWithWeatherTracks = useCallback(
    async (count = 15): Promise<void> => {
      const tracks = await generateWeatherQueue(count);
      if (tracks.length > 0) {
        await replaceQueue(tracks);
      }
    },
    [generateWeatherQueue, replaceQueue],
  );

  return {
    generateWeatherQueue,
    replaceQueueWithWeatherTracks,
  };
}

/**
 * Get current time of day
 */
function getCurrentTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

/**
 * Get search terms based on weather conditions
 */
function getSearchTermsForWeather(
  condition: string,
  timeOfDay: string,
): string {
  const weatherTerms: Record<string, string[]> = {
    "clear sky": ["upbeat", "happy", "energetic"],
    sunny: ["summer", "tropical", "beach"],
    cloudy: ["indie", "mellow", "atmospheric"],
    rain: ["cozy", "acoustic", "peaceful"],
    snow: ["winter", "ambient", "calm"],
    fog: ["atmospheric", "dreamy", "ethereal"],
  };

  const timeTerms: Record<string, string[]> = {
    morning: ["fresh", "wake up", "energizing"],
    afternoon: ["upbeat", "productive", "focus"],
    evening: ["relaxing", "chill", "unwind"],
    night: ["ambient", "late night", "peaceful"],
  };

  const weather = weatherTerms[condition] || weatherTerms["clear sky"];
  const time = timeTerms[timeOfDay] || timeTerms["afternoon"];

  return [...weather, ...time].slice(0, 3).join(" ");
}
