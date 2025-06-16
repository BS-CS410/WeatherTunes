import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TimePeriod = "night" | "morning" | "day" | "evening";

function getTimePeriodFromHour(hour: number): TimePeriod {
  if (hour >= 21 || hour < 5) return "night";
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 18) return "day";
  return "evening";
}

export function getTimePeriod(
  now: Date,
  sunrise?: number,
  sunset?: number,
): TimePeriod {
  const nowUtcSec = Math.floor(now.getTime() / 1000);

  if (sunrise && sunset && sunrise > 0 && sunset > 0) {
    if (sunrise >= sunset) {
      console.warn(
        "Invalid sunrise/sunset data: sunrise >= sunset, falling back to hour-based calculation",
      );
      return getTimePeriodFromHour(now.getHours());
    }

    const sunsetLocal = new Date(sunset * 1000);
    const sunsetHour = sunsetLocal.getHours();

    let eveningStart: number;
    let eveningEnd: number;

    if (sunsetHour <= 20) {
      eveningStart = sunset;
      const eightPM = new Date(now);
      eightPM.setHours(20, 0, 0, 0);
      eveningEnd = Math.floor(eightPM.getTime() / 1000);
    } else {
      const sixPM = new Date(now);
      sixPM.setHours(18, 0, 0, 0);
      eveningStart = Math.floor(sixPM.getTime() / 1000);
      eveningEnd = sunset;
    }

    const dayLength = sunset - sunrise;
    const morningEnd = sunrise + Math.max(dayLength / 3, 3600);

    if (nowUtcSec < sunrise) return "night";
    if (nowUtcSec < morningEnd) return "morning";
    if (nowUtcSec < eveningStart) return "day";
    if (nowUtcSec < eveningEnd) return "evening";
    return "night";
  }

  const hour = now.getHours();
  if (hour >= 21 || hour < 5) return "night";
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 18) return "day";
  return "evening";
}

// ✅ NEW EXPORT HERE
export function formatUnixTimeToLocalString(unixTime: number): string {
  const date = new Date(unixTime * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export async function sendWeatherData(weatherData: {
  username: string;
  location: string;
  temperature: string;
  condition: string;
  time_period: string;
}) {
  try {
    const response = await fetch('/weather', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(weatherData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error sending weather data:', error);
  }
}

import type { WeatherApiResponse, ForecastApiResponse } from "@/types/weather";

const FALLBACK_COORDS = {
  lat: 47.58531518716315,
  lon: -122.14778448861998,
} as const;

const GEOLOCATION_TIMEOUT = 10_000;

export async function fetchWeatherByCoords(
  lat: number,
  lon: number,
  apiKey: string,
): Promise<WeatherApiResponse> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`,
  );
  if (!res.ok) throw new Error("Weather API error");
  return res.json();
}

export function getUserLocationAndFetch(
  apiKey: string,
): Promise<WeatherApiResponse> {
  return new Promise<WeatherApiResponse>((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("Geolocation not supported"));
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const data = await fetchWeatherByCoords(latitude, longitude, apiKey);
          resolve(data);
        } catch (err) {
          reject(err);
        }
      },
      () => {
        fetchWeatherByCoords(FALLBACK_COORDS.lat, FALLBACK_COORDS.lon, apiKey)
          .then(resolve)
          .catch(reject);
      },
      { timeout: GEOLOCATION_TIMEOUT },
    );
  });
}

export function createErrorWeatherData(): WeatherApiResponse {
  return {
    name: "Error",
    main: { temp: 0, humidity: 0, pressure: 0 },
    weather: [{ main: "Unable to load", description: "Error", id: 0 }],
    sys: { sunrise: 0, sunset: 0, country: undefined },
  };
}

export async function fetchForecastByCoords(
  lat: number,
  lon: number,
  apiKey: string,
): Promise<ForecastApiResponse> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`,
  );
  if (!res.ok) throw new Error("Forecast API error");
  return res.json();
}

export function getUserLocationAndFetchForecast(
  apiKey: string,
): Promise<ForecastApiResponse> {
  return new Promise<ForecastApiResponse>((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("Geolocation not supported"));
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const data = await fetchForecastByCoords(latitude, longitude, apiKey);
          resolve(data);
        } catch (err) {
          reject(err);
        }
      },
      () => {
        fetchForecastByCoords(FALLBACK_COORDS.lat, FALLBACK_COORDS.lon, apiKey)
          .then(resolve)
          .catch(reject);
      },
      { timeout: GEOLOCATION_TIMEOUT },
    );
  });
}
