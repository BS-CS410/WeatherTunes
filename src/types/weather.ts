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
  };
}

export interface WeatherDisplayData {
  location: string;
  temperature: string;
  condition: string;
  unit: string;
  isError?: boolean; // Added this line
}

export interface EnhancedWeatherState {
  displayData: WeatherDisplayData;
  timePeriod: TimePeriod | null;
  isLoading: boolean;
  error: Error | null;
  rawResponse: WeatherApiResponse | null;
}
