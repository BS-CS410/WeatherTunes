import { LocalStorage } from "./storage";
import type { TemperatureUnit } from "@/types/units-types";
import { formatTemperature } from "@/lib/core";
import type { TimePeriod } from "@/lib/core";

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

// Video asset mapping type
type VideoAssetMap = Record<WeatherType, Record<TimePeriod, string>>;

export interface DailyForecast {
  date: string;
  dayName: string;
  condition: string;
  tempHigh: string;
  tempLow: string;
  icon: string;
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
  private readonly DEFAULT_TIME_PERIOD: TimePeriod = "day";

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
      const response = await fetch(
        `/api/weather/forecast?lat=${location.lat}&lon=${location.lon}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch forecast: ${response.statusText}`);
      }

      const data: ForecastApiResponse = await response.json();

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
   * Caches the forecast data with a timestamp
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
   * Gets the appropriate weather type based on condition string
   */
  public getWeatherType(condition?: string): WeatherType {
    if (!condition) return this.DEFAULT_WEATHER;

    const lowerCondition = condition.toLowerCase();

    if (lowerCondition.includes("clear")) return "clear";
    if (lowerCondition.includes("cloud")) return "clouds";
    if (lowerCondition.includes("rain")) return "rain";
    if (lowerCondition.includes("snow")) return "snow";
    if (
      lowerCondition.includes("fog") ||
      lowerCondition.includes("mist") ||
      lowerCondition.includes("haze")
    ) {
      return "fog";
    }
    if (
      lowerCondition.includes("thunder") ||
      lowerCondition.includes("storm")
    ) {
      return "thunderstorm";
    }
    if (
      lowerCondition.includes("drizzle") ||
      lowerCondition.includes("shower")
    ) {
      return "drizzle";
    }

    return this.DEFAULT_WEATHER;
  }

  /**
   * Gets the appropriate time period based on the current time
   */
  public getTimePeriod(hours: number): TimePeriod {
    if (hours >= 5 && hours < 12) return "morning";
    if (hours >= 12 && hours < 17) return "day";
    if (hours >= 17 && hours < 21) return "evening";
    return "night";
  }

  /**
   * Gets the appropriate video source for the current weather and time
   */
  public getVideoSource(
    condition?: string,
    timePeriod?: TimePeriod | null,
  ): string {
    const weatherType = this.getWeatherType(condition);
    const period = timePeriod || this.getTimePeriod(new Date().getHours());

    // Default video map - in a real app, this would be dynamically imported
    const defaultVideoMap: VideoAssetMap = {
      clear: {
        morning: "/videos/clear_morning.mp4",
        day: "/videos/clear_day.mp4",
        evening: "/videos/clear_evening.mp4",
        night: "/videos/clear_night.mp4",
      },
      clouds: {
        morning: "/videos/cloudy_morning.mp4",
        day: "/videos/cloudy_day.mp4",
        evening: "/videos/cloudy_evening.mp4",
        night: "/videos/cloudy_night.mp4",
      },
      rain: {
        morning: "/videos/rain_morning.mp4",
        day: "/videos/rain_day.mp4",
        evening: "/videos/rain_evening.mp4",
        night: "/videos/rain_night.mp4",
      },
      snow: {
        morning: "/videos/snow_morning.mp4",
        day: "/videos/snow_day.mp4",
        evening: "/videos/snow_evening.mp4",
        night: "/videos/snow_night.mp4",
      },
      fog: {
        morning: "/videos/fog_morning.mp4",
        day: "/videos/fog_day.mp4",
        evening: "/videos/fog_evening.mp4",
        night: "/videos/fog_night.mp4",
      },
      // Fallbacks for other weather types
      thunderstorm: {
        morning: "/videos/rain_morning.mp4",
        day: "/videos/rain_day.mp4",
        evening: "/videos/rain_evening.mp4",
        night: "/videos/rain_night.mp4",
      },
      drizzle: {
        morning: "/videos/rain_morning.mp4",
        day: "/videos/rain_day.mp4",
        evening: "/videos/rain_evening.mp4",
        night: "/videos/rain_night.mp4",
      },
    };

    return (
      defaultVideoMap[weatherType]?.[period] ||
      defaultVideoMap[this.DEFAULT_WEATHER][this.DEFAULT_TIME_PERIOD]
    );
  }
}
