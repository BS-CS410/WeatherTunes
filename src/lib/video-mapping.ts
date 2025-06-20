import type { TimePeriod } from "@/lib/lib-utils";
import type { WeatherType } from "@/types/weather-types";

// Video imports organized by weather type and time period
import clearNight from "../assets/videos/clear_night.mp4";
import clearMorning from "../assets/videos/clear_morning.mp4";
import clearDay from "../assets/videos/clear_day.mp4";
import clearEvening from "../assets/videos/clear_evening.mp4";

import rainNight from "../assets/videos/rain_night.mp4";
import rainMorning from "../assets/videos/rain_morning.mp4";
import rainDay from "../assets/videos/rain_day.mp4";
import rainEvening from "../assets/videos/rain_evening.mp4";

import snowNight from "../assets/videos/snow_night.mp4";
import snowMorning from "../assets/videos/snow_morning.mp4";
import snowDay from "../assets/videos/snow_day.mp4";
import snowEvening from "../assets/videos/snow_evening.mp4";

import fogNight from "../assets/videos/fog_night.mp4";
import fogMorning from "../assets/videos/fog_morning.mp4";
import fogDay from "../assets/videos/fog_day.mp4";
import fogEvening from "../assets/videos/fog_evening.mp4";

import cloudyNight from "../assets/videos/cloudy_night.mp4";
import cloudyMorning from "../assets/videos/cloudy_morning.mp4";
import cloudyDay from "../assets/videos/cloudy_day.mp4";
import cloudyEvening from "../assets/videos/cloudy_evening.mp4";

// Video mapping for easy lookup
const VIDEO_MAP: Record<WeatherType, Record<TimePeriod, string>> = {
  clear: {
    night: clearNight,
    morning: clearMorning,
    day: clearDay,
    evening: clearEvening,
  },
  rain: {
    night: rainNight,
    morning: rainMorning,
    day: rainDay,
    evening: rainEvening,
  },
  snow: {
    night: snowNight,
    morning: snowMorning,
    day: snowDay,
    evening: snowEvening,
  },
  fog: {
    night: fogNight,
    morning: fogMorning,
    day: fogDay,
    evening: fogEvening,
  },
  cloudy: {
    night: cloudyNight,
    morning: cloudyMorning,
    day: cloudyDay,
    evening: cloudyEvening,
  },
};

// Weather condition mapping - ordered by priority (most specific first)
const WEATHER_CONDITION_MAP: { keywords: string[]; type: WeatherType }[] = [
  // Rain conditions (most specific first)
  { keywords: ["thunderstorm"], type: "rain" },
  { keywords: ["drizzle"], type: "rain" },
  { keywords: ["rain"], type: "rain" },

  // Snow conditions
  { keywords: ["snow"], type: "snow" },

  // Atmospheric/visibility conditions
  {
    keywords: ["fog", "mist", "haze", "smoke", "dust", "ash", "sand"],
    type: "fog",
  },

  // Cloud conditions (broader matches)
  { keywords: ["clouds", "cloudy", "overcast"], type: "cloudy" },

  // Clear conditions (fallback)
  { keywords: ["clear", "sunny"], type: "clear" },
];

/**
 * Maps weather condition to appropriate weather type
 */
export function getWeatherType(condition?: string): WeatherType {
  if (!condition) return "clear";

  const lowerCondition = condition.toLowerCase();

  for (const { keywords, type } of WEATHER_CONDITION_MAP) {
    if (keywords.some((keyword) => lowerCondition.includes(keyword))) {
      return type;
    }
  }

  return "clear"; // Default fallback
}

/**
 * Gets the appropriate video source for weather and time
 */
export function getVideoSource(
  condition?: string,
  timePeriod?: TimePeriod | null,
): string {
  const weatherType = getWeatherType(condition);
  const period = timePeriod || "day";

  return VIDEO_MAP[weatherType][period];
}
