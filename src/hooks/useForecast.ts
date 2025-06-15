import { useState, useEffect, useCallback } from "react";
import type {
  ForecastState,
  DailyForecast,
  ForecastApiResponse,
} from "@/types/weather";
import { getUserLocationAndFetchForecast } from "@/lib/weather";
import { formatTemperature } from "@/lib/temperature";
import { useSettings } from "@/hooks/useSettings";

// Helper function to process forecast data into daily forecasts
function processForecastData(
  data: ForecastApiResponse,
  temperatureUnit: "F" | "C",
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

  // Convert to DailyForecast array (take first 5 days)
  const result: DailyForecast[] = [];
  const entries = Array.from(dailyData.entries()).slice(0, 5);

  entries.forEach(([, dayData]) => {
    const tempHigh = Math.max(...dayData.temps);
    const tempLow = Math.min(...dayData.temps);

    // Get the most common condition for the day (or first one)
    const primaryCondition = dayData.conditions[0];

    // Format day name
    const dayName = dayData.date.toLocaleDateString("en-US", {
      weekday: "long",
    });

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
      tempHigh: formatTemperature(tempHigh, "F", temperatureUnit),
      tempLow: formatTemperature(tempLow, "F", temperatureUnit),
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
        console.error("Error processing forecast data:", err);
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
      console.error("API key is missing for forecast.");
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
        console.error("Error fetching forecast:", err);
        processForecast(null, err);
      });
  }, [processForecast]);

  return forecastState;
}
