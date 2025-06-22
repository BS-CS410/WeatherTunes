import type {
  WeatherApiResponse,
  ForecastApiResponse,
} from "@/types/weather-types";

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
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`,
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

// Fetch forecast data from OpenWeatherMap API
export async function fetchForecastByCoords(
  lat: number,
  lon: number,
  apiKey: string,
): Promise<ForecastApiResponse> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`,
  );
  if (!res.ok) throw new Error("Forecast API error");
  return res.json();
}

// Get user location and fetch forecast
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

// Weather condition mapping utilities
export const WEATHER_ICONS: Record<string, string> = {
  "01d": "☀️", // clear sky day
  "01n": "🌙", // clear sky night
  "02d": "⛅", // few clouds day
  "02n": "☁️", // few clouds night
  "03d": "☁️", // scattered clouds
  "03n": "☁️", // scattered clouds
  "04d": "☁️", // broken clouds
  "04n": "☁️", // broken clouds
  "09d": "🌧️", // shower rain
  "09n": "🌧️", // shower rain
  "10d": "🌦️", // rain day
  "10n": "🌧️", // rain night
  "11d": "⛈️", // thunderstorm
  "11n": "⛈️", // thunderstorm
  "13d": "❄️", // snow
  "13n": "❄️", // snow
  "50d": "🌫️", // mist
  "50n": "🌫️", // mist
};

export function getWeatherIcon(iconCode: string): string {
  return WEATHER_ICONS[iconCode] || "🌤️";
}

export function getWeatherCondition(weatherMain: string): string {
  const conditions: Record<string, string> = {
    Clear: "clear",
    Clouds: "cloudy",
    Rain: "rain",
    Drizzle: "rain",
    Thunderstorm: "stormy",
    Snow: "snow",
    Mist: "fog",
    Smoke: "fog",
    Haze: "fog",
    Dust: "fog",
    Fog: "fog",
    Sand: "fog",
    Ash: "fog",
    Squall: "stormy",
    Tornado: "stormy",
  };

  return conditions[weatherMain]?.toLowerCase() || "clear";
}
