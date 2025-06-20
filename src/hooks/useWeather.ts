import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  WeatherApiResponse,
  EnhancedWeatherState,
} from "@/types/weather-types";
import {
  getUserLocationAndFetch,
  createErrorWeatherData,
} from "@/lib/weather-api";
import {
  getTimePeriod,
  formatUnixTimeToLocalString,
  type TimePeriod,
} from "@/lib/time-helpers";
import { formatTemperature } from "@/lib/unit-converters";
import { useSettings } from "@/hooks";

// Helper function to format weather condition for display
function formatWeatherCondition(
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
 */
export function useWeatherData() {
  const { settings } = useSettings();

  const initialState = useMemo<EnhancedWeatherState>(
    () => ({
      displayData: {
        location: "Loading...",
        temperature: "--",
        condition: "Loading...",
        unit: `°${settings.temperatureUnit}`,
        isError: false,
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
        const errorData = createErrorWeatherData();
        setWeatherState({
          displayData: {
            location: errorData.name,
            temperature: "--",
            condition: errorData.weather[0].main,
            unit: `°${settings.temperatureUnit}`,
            isError: true,
          },
          timePeriod: getTimePeriod(new Date()),
          isLoading: false,
          error: error || new Error("Failed to fetch weather data"),
          rawResponse: errorData,
        });
        return;
      }

      // Validate essential data fields
      if (!data.weather?.length) {
        const errorData = createErrorWeatherData();
        setWeatherState({
          displayData: {
            location: data.name || "Unknown",
            temperature: "--",
            condition: "Weather data unavailable",
            unit: `°${settings.temperatureUnit}`,
            isError: true,
          },
          timePeriod: getTimePeriod(new Date()),
          isLoading: false,
          error: new Error("Invalid weather data format"),
          rawResponse: errorData,
        });
        return;
      }

      const now = new Date();
      const period = getTimePeriod(now, data.sys?.sunrise, data.sys?.sunset);

      // Process successful data
      setWeatherState({
        displayData: {
          location: data.name || "Unknown Location",
          temperature: formatTemperature(
            data.main.temp,
            settings.temperatureUnit,
          ),
          condition: formatWeatherCondition(
            data.weather[0].main,
            data.weather[0].description,
          ),
          unit:
            settings.temperatureUnit === "K"
              ? "K"
              : `°${settings.temperatureUnit}`,
          isError: false,
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

/**
 * Hook for managing theme based on weather time period
 * Separated for single responsibility and optional usage
 */
export function useThemeFromWeather(timePeriod: TimePeriod | null) {
  useEffect(() => {
    if (!timePeriod) return;

    const root = window.document.documentElement;
    if (timePeriod === "evening" || timePeriod === "night") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [timePeriod]);
}
