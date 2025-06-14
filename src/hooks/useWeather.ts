import { useState, useEffect } from "react";
import type { WeatherApiResponse, WeatherDisplayData } from "@/types/weather";
import { getUserLocationAndFetch, createErrorWeatherData } from "@/lib/weather";
import { getTimePeriod } from "@/lib/utils";

export function useWeatherData() {
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(
    null,
  );

  useEffect(() => {
    const apiKey = import.meta.env.VITE_PUBLIC_OPENWEATHER_API_KEY;

    getUserLocationAndFetch(apiKey)
      .then(setWeatherData)
      .catch((error) => {
        console.error("Error fetching weather:", error);
        setWeatherData(createErrorWeatherData());
      });
  }, []);

  return weatherData;
}

export function useThemeFromWeather(weatherData: WeatherApiResponse | null) {
  useEffect(() => {
    if (weatherData?.sys) {
      const now = new Date();
      const { sunrise, sunset } = weatherData.sys;
      const period = getTimePeriod(now, sunrise, sunset);
      const root = window.document.documentElement;

      if (period === "evening" || period === "night") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [weatherData]);
}

export function getWeatherDisplayData(
  weatherData: WeatherApiResponse | null,
): WeatherDisplayData {
  if (!weatherData) {
    return {
      location: "",
      temperature: "",
      condition: "",
      unit: "°F",
    };
  }

  return {
    location: weatherData.name,
    temperature:
      weatherData.name === "Error"
        ? "--"
        : Math.round(weatherData.main.temp).toString(),
    condition: weatherData.weather[0].main,
    unit: "°F",
  };
}
