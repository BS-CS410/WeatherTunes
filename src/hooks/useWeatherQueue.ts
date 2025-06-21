/**
 * Weather-aware queue generation using the new queue system
 */

import { queueManager } from "@/lib/queue-manager";
import { useWeatherData } from "./useWeather";
import { useCallback } from "react";
import { spotifyApi } from "@/lib/spotify-api";
import type { TrackMetadata } from "@/types/queue-types";

interface UseWeatherQueueReturn {
  generateWeatherQueue: (count?: number) => Promise<TrackMetadata[]>;
  replaceQueueWithWeatherTracks: (count?: number) => Promise<void>;
}

/**
 * Hook for generating weather-based queues
 */
export function useWeatherQueue(): UseWeatherQueueReturn {
  const weatherState = useWeatherData();

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
          const recommendations = await spotifyApi.getWeatherRecommendations({
            weather_condition: condition,
            temperature,
            time_of_day: timeOfDay,
            limit: count,
          });

          if (recommendations.tracks.length > 0) {
            console.log(
              `Generated ${recommendations.tracks.length} weather-based tracks`,
            );
            return recommendations.tracks;
          }
        } catch (weatherError) {
          console.warn("Weather recommendations failed:", weatherError);
        }

        // Fallback to search-based tracks
        const searchTerms = getSearchTermsForWeather(condition, timeOfDay);
        const searchResults = await spotifyApi.searchTracks(searchTerms, count);

        console.log(
          `Fallback: Generated ${searchResults.tracks.length} search-based tracks`,
        );
        return searchResults.tracks;
      } catch (error) {
        console.error("Failed to generate weather queue:", error);
        return [];
      }
    },
    [condition, temperature], // Only depend on specific values, not entire weatherState
  );

  const replaceQueueWithWeatherTracks = useCallback(
    async (count = 15): Promise<void> => {
      const tracks = await generateWeatherQueue(count);
      if (tracks.length > 0) {
        await queueManager.replaceQueue(tracks);
      }
    },
    [generateWeatherQueue],
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
