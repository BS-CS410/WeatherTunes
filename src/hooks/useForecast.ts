import { useState, useEffect, useCallback } from "react";
import type {
  ForecastState,
  DailyForecast,
  ForecastApiResponse,
} from "@/types/weather";
import { getUserLocationAndFetchForecast } from "@/lib/weather";
import { formatTemperature } from "@/lib/utils";
import { useSettings } from "@/hooks";

// Helper function to process forecast data into daily forecasts
function processForecastData(
  data: ForecastApiResponse,
  temperatureUnit: "F" | "C" | "K",
): DailyForecast[] {
  // Group forecast items by date
  const dailyData = new Map<
    string,
    {
      date: Date;
      temps: number[];
      conditions: { main: string; description: string; icon: string }[];
    }
  >();

  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD

    if (!dailyData.has(dateKey)) {
      dailyData.set(dateKey, {
        date,
        temps: [],
        conditions: [],
      });
    }

    const dayData = dailyData.get(dateKey)!;
    dayData.temps.push(item.main.temp);
    dayData.conditions.push({
      main: item.weather[0].main,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
    });
  });

  // Sort entries by date to ensure chronological order
  const sortedEntries = Array.from(dailyData.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 5); // Take first 5 chronological days

  const result: DailyForecast[] = [];
  const today = new Date();
  const todayDateKey = today.toISOString().split("T")[0];

  sortedEntries.forEach(([dateKey, dayData]) => {
    const tempHigh = Math.max(...dayData.temps);
    const tempLow = Math.min(...dayData.temps);

    // Get the most common condition for the day (or first one)
    const primaryCondition = dayData.conditions[0];

    // For today, show "Today" instead of day name to avoid duplicate "Monday"
    let dayName: string;
    if (dateKey === todayDateKey) {
      dayName = "Today";
    } else {
      dayName = dayData.date.toLocaleDateString("en-US", {
        weekday: "long",
      });
    }

    // Format date
    const formattedDate = dayData.date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    result.push({
      date: formattedDate,
      dayName,
      condition:
        primaryCondition.description.charAt(0).toUpperCase() +
        primaryCondition.description.slice(1),
      tempHigh: formatTemperature(tempHigh, temperatureUnit),
      tempLow: formatTemperature(tempLow, temperatureUnit),
      icon: primaryCondition.icon,
    });
  });

  return result;
}

export function useForecastData() {
  const { settings } = useSettings();
  const [forecastState, setForecastState] = useState<ForecastState>({
    forecast: [],
    isLoading: true,
    error: null,
  });

  const processForecast = useCallback(
    (data: ForecastApiResponse | null, error?: Error) => {
      if (error || !data) {
        setForecastState({
          forecast: [],
          isLoading: false,
          error: error || new Error("Failed to fetch forecast data"),
        });
        return;
      }

      try {
        const processedForecast = processForecastData(
          data,
          settings.temperatureUnit,
        );
        setForecastState({
          forecast: processedForecast,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        setForecastState({
          forecast: [],
          isLoading: false,
          error:
            err instanceof Error
              ? err
              : new Error("Failed to process forecast data"),
        });
      }
    },
    [settings.temperatureUnit],
  );

  useEffect(() => {
    const apiKey = import.meta.env.VITE_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      processForecast(null, new Error("API key is missing."));
      return;
    }

    setForecastState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    getUserLocationAndFetchForecast(apiKey)
      .then((data) => processForecast(data))
      .catch((err) => {
        processForecast(null, err);
      });
  }, [processForecast]);

  return forecastState;
}
