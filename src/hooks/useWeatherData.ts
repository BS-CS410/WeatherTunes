import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  WeatherApiResponse,
  EnhancedWeatherState,
} from "@/types/weather-types";
import { getUserLocationAndFetch } from "@/lib";
import {
  getTimePeriod,
  formatUnixTimeToLocalString,
  formatTemperature,
} from "@/lib/core";
import { useSettings } from "@/hooks/common";

// Helper function to format weather condition for display
// Moved to common.ts - keeping here for backward compatibility
function formatWeatherConditionLocal(
  condition: string,
  description?: string,
): string {
  // Use the more descriptive description if available, otherwise use main condition
  const displayCondition = description || condition;

  // Safety check for empty/undefined values
  if (!displayCondition || displayCondition.trim() === "") {
    return "Unknown";
  }

  // Capitalize first letter and make it more user-friendly
  return (
    displayCondition.charAt(0).toUpperCase() +
    displayCondition.slice(1).toLowerCase()
  );
}

/**
 * Unified weather data hook with enhanced error handling and memoization
 * Manages weather API calls, processing, and state management
 * @returns EnhancedWeatherState with TimePeriod information
 */
export function useWeatherData(): EnhancedWeatherState {
  const { settings } = useSettings();

  const initialState = useMemo<EnhancedWeatherState>(
    () => ({
      data: {
        displayData: {
          location: "Loading...",
          temperature: 0,
          condition: "Loading...",
          unit: settings.temperatureUnit,
        },
        timePeriod: null,
        rawResponse: null,
      },
      isLoading: true,
      error: null,
    }),
    [settings.temperatureUnit],
  );

  const [weatherState, setWeatherState] =
    useState<EnhancedWeatherState>(initialState);

  const processWeatherData = useCallback(
    (data: WeatherApiResponse | null, error?: Error) => {
      if (error || !data) {
        setWeatherState({
          data: null,
          isLoading: false,
          error: error?.message || "Failed to fetch weather data",
        });
        return;
      }

      // Validate essential data fields
      if (!data.weather?.length) {
        setWeatherState({
          data: null,
          isLoading: false,
          error: "Invalid weather data format",
        });
        return;
      }

      const now = new Date();
      const period = getTimePeriod(now);

      // Process successful data
      setWeatherState({
        data: {
          displayData: {
            location: data.name || "Unknown Location",
            temperature: formatTemperature(
              data.main.temp,
              settings.temperatureUnit,
            ),
            condition: formatWeatherConditionLocal(
              data.weather[0].main,
              data.weather[0].description,
            ),
            unit: settings.temperatureUnit,
            sunrise: formatUnixTimeToLocalString(
              data.sys?.sunrise,
              "en-US", // always use a valid locale
              {
                hour: "numeric",
                minute: "2-digit",
                hour12: settings.timeFormat === "12h",
              },
            ),
            sunset: formatUnixTimeToLocalString(
              data.sys?.sunset,
              "en-US", // always use a valid locale
              {
                hour: "numeric",
                minute: "2-digit",
                hour12: settings.timeFormat === "12h",
              },
            ),
          },
          timePeriod: period,
          rawResponse: data,
        },
        isLoading: false,
        error: null,
      });
    },
    [settings.temperatureUnit, settings.timeFormat],
  );

  // Fetch weather data on mount and when settings change
  useEffect(() => {
    let mounted = true;

    const fetchWeather = async () => {
      const apiKey = import.meta.env.VITE_PUBLIC_OPENWEATHER_API_KEY;
      if (!apiKey) {
        if (mounted) {
          processWeatherData(null, new Error("API key is missing."));
        }
        return;
      }

      try {
        const data = await getUserLocationAndFetch(apiKey);
        if (mounted) {
          processWeatherData(data);
        }
      } catch (error) {
        if (mounted) {
          processWeatherData(
            null,
            error instanceof Error ? error : new Error("Unknown error"),
          );
        }
      }
    };

    fetchWeather();

    return () => {
      mounted = false;
    };
  }, [processWeatherData]);

  return weatherState;
}
