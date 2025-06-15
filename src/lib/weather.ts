import type { WeatherApiResponse, ForecastApiResponse } from "@/types/weather";

// Fallback to Bellevue, WA and hope no one notices
const FALLBACK_COORDS = {
  lat: 47.58531518716315,
  lon: -122.14778448861998,
} as const;

const GEOLOCATION_TIMEOUT = 10_000;

// Fetch weather from OpenWeatherMap API using given coordinates
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

// Request user's location from browser and then send the coordinates to fetchWeatherByCoords
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
        // fallback to Bellevue coordinates and hope no one notices
        fetchWeatherByCoords(FALLBACK_COORDS.lat, FALLBACK_COORDS.lon, apiKey)
          .then(resolve)
          .catch(reject);
      },
      { timeout: GEOLOCATION_TIMEOUT },
    );
  });
}

// Create error state for weather data
export function createErrorWeatherData(): WeatherApiResponse {
  return {
    name: "Error",
    main: { temp: 0, humidity: 0, pressure: 0 },
    weather: [{ main: "Unable to load", description: "Error", id: 0 }],
    sys: { sunrise: 0, sunset: 0, country: undefined },
  };
}

// Fetch 5-day weather forecast from OpenWeatherMap API
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

// Request user's location and fetch forecast data
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
        // fallback to Bellevue coordinates
        fetchForecastByCoords(FALLBACK_COORDS.lat, FALLBACK_COORDS.lon, apiKey)
          .then(resolve)
          .catch(reject);
      },
      { timeout: GEOLOCATION_TIMEOUT },
    );
  });
}
