import { useMemo } from "react";
import { useWeatherData } from "./useWeather";
import { SpotifyApiService } from "@/lib/spotifyApiService";
import type { TrackMetadata } from "@/types/queue";

/**
 * Hook that provides weather-based music recommendations
 * Combines current weather data with Spotify music suggestions
 */
export function useWeatherMusic() {
  const weatherState = useWeatherData();

  // Extract weather conditions for music matching
  const musicWeatherConditions = useMemo(() => {
    if (
      !weatherState.rawResponse ||
      weatherState.isLoading ||
      weatherState.error
    ) {
      // Default conditions if weather is unavailable
      return {
        condition: "clear",
        temperature: 20,
        timeOfDay: getCurrentTimeOfDay(),
      };
    }

    const weatherData = weatherState.rawResponse;
    const condition = extractConditionFromWeather(weatherData.weather[0].main);
    const temperature = weatherData.main.temp;
    const timeOfDay = getCurrentTimeOfDay();

    return {
      condition,
      temperature,
      timeOfDay,
    };
  }, [weatherState]);

  /**
   * Generate weather-based track queue
   */
  const generateWeatherQueue = async (
    maxTracks: number = 12,
  ): Promise<string[]> => {
    const { condition, temperature, timeOfDay } = musicWeatherConditions;

    try {
      const tracks =
        await SpotifyApiService.getRecommendationsForCurrentWeather(
          condition,
          temperature,
          maxTracks,
          timeOfDay,
        );
      return tracks.map((track) => track.id);
    } catch (error) {
      console.error("Failed to generate weather queue:", error);
      return [];
    }
  };

  /**
   * Get personalized weather-based recommendations
   */
  const getPersonalizedRecommendations = async (
    limit: number = 20,
  ): Promise<TrackMetadata[]> => {
    const { condition, temperature, timeOfDay } = musicWeatherConditions;

    try {
      return await SpotifyApiService.getPersonalizedWeatherRecommendations(
        condition,
        temperature,
        timeOfDay,
        limit,
      );
    } catch (error) {
      console.error(
        "Failed to get personalized weather recommendations:",
        error,
      );
      return [];
    }
  };

  /**
   * Search for weather-appropriate tracks
   */
  const searchWeatherTracks = async (
    query: string,
    limit: number = 10,
  ): Promise<TrackMetadata[]> => {
    try {
      return await SpotifyApiService.searchTracks(query, limit);
    } catch (error) {
      console.error("Failed to search weather tracks:", error);
      return [];
    }
  };

  return {
    // Weather conditions for music
    weatherConditions: musicWeatherConditions,

    // Music generation functions
    generateWeatherQueue,
    getPersonalizedRecommendations,
    searchWeatherTracks,

    // Weather state
    isWeatherLoading: weatherState.isLoading,
    weatherError: weatherState.error,
    hasValidWeather:
      !weatherState.isLoading &&
      !weatherState.error &&
      !!weatherState.rawResponse,
  };
}

/**
 * Get current time of day for music matching
 */
function getCurrentTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

/**
 * Extract condition from weather API response for music matching
 */
function extractConditionFromWeather(weatherMain: string): string {
  const conditionMap: Record<string, string> = {
    Clear: "clear",
    Clouds: "cloudy",
    Rain: "rainy",
    Drizzle: "drizzle",
    Thunderstorm: "thunderstorm",
    Snow: "snow",
    Mist: "mist",
    Fog: "fog",
    Haze: "haze",
  };

  return conditionMap[weatherMain] || weatherMain.toLowerCase();
}
