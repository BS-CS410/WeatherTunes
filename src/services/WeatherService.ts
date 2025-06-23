import { LocalStorage } from "@/services/storage";
import { fetchForecastByCoords } from "@/lib/weather/weather-api";
import { formatTemperature, getUnitSymbol } from "@/lib";
import type { TemperatureUnit } from "@/types/units-types";

// Weather condition types and utilities
export type WeatherType =
  | "clear"
  | "clouds"
  | "rain"
  | "snow"
  | "fog"
  | "thunderstorm"
  | "drizzle";

export interface WeatherCondition {
  main: string;
  description: string;
  icon: string;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  condition: string;
  tempHigh: number;
  tempLow: number;
  icon: string;
  unit: string;
}

export interface ForecastApiResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  }>;
}

export class WeatherService {
  private static instance: WeatherService;
  private localStorage: LocalStorage;
  private readonly CACHE_KEY = "weather_forecast";
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds
  private readonly DEFAULT_WEATHER: WeatherType = "clear";

  private constructor() {
    this.localStorage = LocalStorage.getInstance();
  }

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  /**
   * Fetches forecast data from the API or cache if still valid
   */
  public async getForecast(
    location: { lat: number; lon: number },
    temperatureUnit: TemperatureUnit,
    forceRefresh = false,
  ): Promise<DailyForecast[]> {
    const cacheKey = `${this.CACHE_KEY}_${location.lat}_${location.lon}`;

    // Try to get from cache first if not forcing refresh
    if (!forceRefresh) {
      const cached = this.getCachedForecast(cacheKey);
      if (cached) {
        return this.processForecastData(cached, temperatureUnit);
      }
    }

    // Fetch fresh data from API
    try {
      const apiKey = import.meta.env.VITE_PUBLIC_OPENWEATHER_API_KEY;
      if (!apiKey) {
        throw new Error("Weather API key is missing");
      }

      // Use the weather-api function with provided coordinates
      const data: ForecastApiResponse = await fetchForecastByCoords(
        location.lat,
        location.lon,
        apiKey,
      );

      // Cache the response
      this.cacheForecast(cacheKey, data);

      return this.processForecastData(data, temperatureUnit);
    } catch (error) {
      console.error("Error fetching forecast:", error);
      throw error;
    }
  }

  /**
   * Processes raw forecast API response into a more usable format
   */
  private processForecastData(
    data: ForecastApiResponse,
    temperatureUnit: TemperatureUnit,
  ): DailyForecast[] {
    const dailyData = new Map<
      string,
      {
        date: Date;
        temps: number[];
        conditions: WeatherCondition[];
      }
    >();

    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split("T")[0];

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

    // Sort entries by date and take first 5 days
    const sortedEntries = Array.from(dailyData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(0, 5);

    const today = new Date();
    const todayDateKey = today.toISOString().split("T")[0];

    return sortedEntries.map(([dateKey, dayData]) => {
      const tempHigh = Math.max(...dayData.temps);
      const tempLow = Math.min(...dayData.temps);
      const primaryCondition = dayData.conditions[0];

      const dayName =
        dateKey === todayDateKey
          ? "Today"
          : dayData.date.toLocaleDateString("en-US", { weekday: "long" });

      const formattedDate = dayData.date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      return {
        date: formattedDate,
        dayName,
        condition:
          primaryCondition.description.charAt(0).toUpperCase() +
          primaryCondition.description.slice(1),
        tempHigh: formatTemperature(tempHigh, temperatureUnit),
        tempLow: formatTemperature(tempLow, temperatureUnit),
        icon: primaryCondition.icon,
        unit: getUnitSymbol(temperatureUnit),
      };
    });
  }

  /**
   * Gets cached forecast if it exists and is not expired
   */
  private getCachedForecast(key: string): ForecastApiResponse | null {
    try {
      const cached = this.localStorage.getItem<{
        data: ForecastApiResponse;
        timestamp: number;
      }>(key);

      if (!cached) return null;

      const isExpired = Date.now() - cached.timestamp > this.CACHE_TTL;
      return isExpired ? null : cached.data;
    } catch (error) {
      console.error("Error reading cached forecast:", error);
      return null;
    }
  }

  /**
   * Caches forecast data with timestamp
   */
  private cacheForecast(key: string, data: ForecastApiResponse): void {
    try {
      this.localStorage.setItem(key, {
        data,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error caching forecast:", error);
    }
  }

  /**
   * Maps weather condition strings to our internal weather types
   */
  public getWeatherType(condition?: string): WeatherType {
    if (!condition) return this.DEFAULT_WEATHER;

    const conditionLower = condition.toLowerCase();

    if (conditionLower.includes("clear") || conditionLower.includes("sun")) {
      return "clear";
    }
    if (conditionLower.includes("cloud")) {
      return "clouds";
    }
    if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
      return "rain";
    }
    if (conditionLower.includes("snow")) {
      return "snow";
    }
    if (conditionLower.includes("fog") || conditionLower.includes("mist")) {
      return "fog";
    }
    if (conditionLower.includes("thunder")) {
      return "thunderstorm";
    }

    return this.DEFAULT_WEATHER;
  }
}
