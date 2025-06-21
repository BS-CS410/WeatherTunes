import { useMemo } from "react";
import { useWeatherData } from "./useWeather";
import { spotifyApi } from "@/lib/spotify-api";
import { getWeatherRecommendationParams } from "@/lib";
import type { TrackMetadata } from "@/types/queue-types";

/**
 * Hook that provides weather-based music recommendations
 * Combines current weather data with Spotify music suggestions using advanced weather mapping
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
        condition: "clear sky",
        temperature: 20,
        timeOfDay: getCurrentTimeOfDay(),
      };
    }

    const weatherData = weatherState.rawResponse;
    const condition = extractConditionFromWeather(weatherData.weather[0]);
    const temperature = weatherData.main.temp;
    const timeOfDay = getCurrentTimeOfDay();

    return {
      condition,
      temperature,
      timeOfDay,
    };
  }, [weatherState]);

  /**
   * Generate weather-based track queue using enhanced mapping system
   */
  const generateWeatherQueue = async (
    maxTracks: number = 12,
  ): Promise<TrackMetadata[]> => {
    const { condition, temperature, timeOfDay } = musicWeatherConditions;

    try {
      console.log(
        `Generating enhanced queue for: ${condition}, ${temperature}°C, ${timeOfDay}`,
      );

      // Use Spotify API to get weather-appropriate recommendations
      const recommendations = await spotifyApi.getWeatherRecommendations({
        weather_condition: condition,
        temperature,
        time_of_day: timeOfDay,
        limit: maxTracks,
      });
      const tracks = recommendations.tracks;

      console.log(
        `Generated ${tracks.length} enhanced tracks for weather conditions`,
      );

      // Filter out duplicates before returning
      const uniqueTracks = Array.from(
        new Set(tracks.map((t: TrackMetadata) => t.id)),
      ).map((id) => tracks.find((t: TrackMetadata) => t.id === id)!);
      return uniqueTracks;
    } catch (error) {
      console.error("Failed to generate enhanced weather queue:", error);

      // Try to get fallback recommendations if the main method fails
      try {
        console.log("Attempting fallback to basic weather recommendations...");
        const fallbackRecommendations =
          await spotifyApi.getWeatherRecommendations({
            weather_condition: condition,
            temperature,
            time_of_day: timeOfDay,
            limit: maxTracks,
          });

        if (fallbackRecommendations.tracks.length > 0) {
          console.log(
            `Fallback successful: ${fallbackRecommendations.tracks.length} tracks`,
          );
          // Filter out duplicates before returning
          const uniqueFallbackTracks = Array.from(
            new Set(fallbackRecommendations.tracks.map((t) => t.id)),
          ).map(
            (id) => fallbackRecommendations.tracks.find((t) => t.id === id)!,
          );
          return uniqueFallbackTracks;
        }
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }

      return [];
    }
  };

  /**
   * Get recommendation parameters for current weather (for debugging/info)
   */
  const getWeatherMusicParams = () => {
    const { condition, temperature, timeOfDay } = musicWeatherConditions;
    return getWeatherRecommendationParams(condition, temperature, timeOfDay);
  };

  /**
   * Get personalized weather-based recommendations
   */
  const getPersonalizedRecommendations = async (
    limit: number = 20,
  ): Promise<TrackMetadata[]> => {
    const { condition, temperature, timeOfDay } = musicWeatherConditions;

    try {
      const recommendations = await spotifyApi.getWeatherRecommendations({
        weather_condition: condition,
        temperature,
        time_of_day: timeOfDay,
        limit,
      });
      const tracks = recommendations.tracks;
      // Filter out duplicates before returning
      const uniqueTracks = Array.from(
        new Set(tracks.map((t: TrackMetadata) => t.id)),
      ).map((id) => tracks.find((t: TrackMetadata) => t.id === id)!);
      return uniqueTracks;
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
      const searchResult = await spotifyApi.searchTracks(query, limit);
      return searchResult.tracks;
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
    getWeatherMusicParams,

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
function extractConditionFromWeather(weather: {
  main: string;
  description: string;
}): string {
  // Use description for more specific condition matching
  const description = weather.description.toLowerCase();

  // Map specific descriptions to our weather conditions
  const conditionMap: Record<string, string> = {
    "clear sky": "clear sky",
    "few clouds": "clear sky",
    "scattered clouds": "broken clouds",
    "broken clouds": "broken clouds",
    "overcast clouds": "cloudy",
    "shower rain": "rain",
    "heavy intensity rain": "rain",
    "light rain": "drizzle",
    "moderate rain": "rain",
    thunderstorm: "thunderstorm",
    snow: "snow",
    "light snow": "snow",
    "heavy snow": "snow",
    mist: "mist",
    fog: "fog",
    haze: "fog",
  };

  // Try exact description match first
  if (conditionMap[description]) {
    return conditionMap[description];
  }

  // Fallback to main condition
  const mainConditionMap: Record<string, string> = {
    Clear: "clear sky",
    Clouds: "cloudy",
    Rain: "rain",
    Drizzle: "drizzle",
    Thunderstorm: "thunderstorm",
    Snow: "snow",
    Mist: "mist",
    Fog: "fog",
    Haze: "fog",
  };

  return mainConditionMap[weather.main] || weather.main.toLowerCase();
}
