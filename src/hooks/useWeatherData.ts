import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  WeatherApiResponse,
  EnhancedWeatherState,
  WeatherDisplayData,
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
      displayData: {
        location: "Loading...",
        temperature: 0,
        condition: "Loading...",
        unit: settings.temperatureUnit,
      },
      timePeriod: null,
      isLoading: true,
      error: null,
      rawResponse: null,
    }),
    [settings.temperatureUnit],
  );

  const [weatherState, setWeatherState] =
    useState<EnhancedWeatherState>(initialState);

  const processWeatherData = useCallback(
    (data: WeatherApiResponse | null, error?: Error) => {
      if (error || !data) {
        const errorData: WeatherDisplayData = {
          location: "Unknown Location",
          temperature: 0,
          condition: "Error",
          unit: "imperial",
          sunrise: "",
          sunset: "",
        };
        setWeatherState({
          displayData: {
            location: errorData.location,
            temperature: 0,
            condition: errorData.condition,
            unit: settings.temperatureUnit,
          },
          timePeriod: getTimePeriod(new Date()),
          isLoading: false,
          error: error || new Error("Failed to fetch weather data"),
          rawResponse: null,
        });
        return;
      }

      // Validate essential data fields
      if (!data.weather?.length) {
        setWeatherState({
          displayData: {
            location: data.name || "Unknown",
            temperature: 0,
            condition: "Weather data unavailable",
            unit: settings.temperatureUnit,
          },
          timePeriod: getTimePeriod(new Date()),
          isLoading: false,
          error: new Error("Invalid weather data format"),
          rawResponse: null,
        });
        return;
      }

      const now = new Date();
      const period = getTimePeriod(now);

      // Process successful data
      setWeatherState({
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
        isLoading: false,
        error: null,
        rawResponse: data,
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
