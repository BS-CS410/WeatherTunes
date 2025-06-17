import { useState, useEffect, useCallback, useMemo } from "react";
import type { WeatherApiResponse, EnhancedWeatherState } from "@/types/weather";
import { getUserLocationAndFetch, createErrorWeatherData } from "@/lib/weather";
import {
  getTimePeriod,
  type TimePeriod,
  formatUnixTimeToLocalString,
} from "@/lib/utils";
import { formatTemperature } from "@/lib/temperature";
import { useSettings } from "@/hooks/useSettings";

// Helper function to format weather condition for display
function formatWeatherCondition(
  condition: string,
  description?: string,
): string {
  if (!condition) return "Unknown";

  // Use description if available and more descriptive
  if (description && description.length > condition.length) {
    return description.charAt(0).toUpperCase() + description.slice(1);
  }

  return condition;
}

/**
 * Optimized weather data hook with enhanced error handling and memoization
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
        console.error("Invalid weather data: missing weather array", data);
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
            "F",
            settings.temperatureUnit,
          ),
          condition: formatWeatherCondition(
            data.weather[0].main,
            data.weather[0].description,
          ),
          unit: `°${settings.temperatureUnit}`,
          isError: false,
          sunrise: formatUnixTimeToLocalString(
            data.sys?.sunrise,
            settings.timeFormat,
          ),
          sunset: formatUnixTimeToLocalString(
            data.sys?.sunset,
            settings.timeFormat,
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
        console.error("API key is missing.");
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
