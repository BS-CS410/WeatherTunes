import type { TimePeriod } from "@/lib/utils"; // Added import for TimePeriod

export interface WeatherApiResponse {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    main: string;
    description: string;
    id: number;
  }[];
  wind?: {
    speed: number;
  };
  clouds?: {
    all: number;
  };
  visibility?: number;
  sys: {
    sunrise: number;
    sunset: number;
    country?: string;
  };
}

export interface WeatherDisplayData {
  location: string;
  temperature: string;
  condition: string;
  unit: string;
  isError?: boolean; // Added this line
  sunrise?: string; // formatted time string
  sunset?: string; // formatted time string
}

export interface EnhancedWeatherState {
  displayData: WeatherDisplayData;
  timePeriod: TimePeriod | null;
  isLoading: boolean;
  error: Error | null;
  rawResponse: WeatherApiResponse | null;
}

export type WeatherType = "clear" | "rain" | "snow" | "fog" | "cloudy";
