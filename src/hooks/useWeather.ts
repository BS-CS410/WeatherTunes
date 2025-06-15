import { useState, useEffect, useCallback } from "react";
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

export function useWeatherData() {
  const { settings } = useSettings();
  const [weatherState, setWeatherState] = useState<EnhancedWeatherState>({
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
  });

  const processWeatherData = useCallback(
    (data: WeatherApiResponse | null, error?: Error) => {
      if (error || !data) {
        const errorData = createErrorWeatherData();
        setWeatherState({
          displayData: {
            location: errorData.name, // "Error"
            temperature: "--",
            condition: errorData.weather[0].main, // "Unable to load"
            unit: `°${settings.temperatureUnit}`,
            isError: true,
          },
          timePeriod: getTimePeriod(new Date()), // Fallback time period
          isLoading: false,
          error: error || new Error("Failed to fetch weather data"),
          rawResponse: errorData,
        });
        return;
      }

      // Validate essential data fields
      if (
        !data.weather ||
        !Array.isArray(data.weather) ||
        data.weather.length === 0
      ) {
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

      // Debug logging for weather condition
      console.log("Weather API Debug:", {
        apiCondition: data.weather[0].main,
        apiDescription: data.weather[0].description,
        weatherId: data.weather[0].id,
        fullWeatherArray: data.weather,
        location: data.name,
        temp: data.main.temp,
        sunrise: data.sys?.sunrise,
        sunset: data.sys?.sunset,
        calculatedPeriod: period,
      });

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

  useEffect(() => {
    const apiKey = import.meta.env.VITE_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      console.error("API key is missing.");
      processWeatherData(null, new Error("API key is missing."));
      return;
    }

    setWeatherState((prevState: EnhancedWeatherState) => ({
      ...prevState,
      isLoading: true,
    }));

    getUserLocationAndFetch(apiKey)
      .then((data) => processWeatherData(data))
      .catch((err) => {
        console.error("Error fetching weather:", err);
        processWeatherData(null, err);
      });
  }, [processWeatherData]); // processWeatherData is memoized

  return weatherState;
}

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
