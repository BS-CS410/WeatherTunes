import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Unified time period calculation for both MainPage and VideoBackground
export type TimePeriod = "night" | "morning" | "day" | "evening";

/**
 * Returns the time period based on current time and sunrise/sunset.
 * If weatherConditions is provided (with sys.sunrise/sunset), uses those.
 * Otherwise, can use direct sunrise/sunset values or fallback to hour-based.
 */
export function getTimePeriod(
  now: Date,
  sunrise?: number,
  sunset?: number,
): TimePeriod {
  const nowUtcSec = Math.floor(now.getTime() / 1000);

  if (sunrise && sunset && sunrise > 0 && sunset > 0) {
    // Validate that sunrise is before sunset
    if (sunrise >= sunset) {
      console.warn(
        "Invalid sunrise/sunset data: sunrise >= sunset, falling back to hour-based calculation",
      );
      return getTimePeriodFromHour(now.getHours());
    }

    // Convert sunset to local time to determine evening logic
    const sunsetLocal = new Date(sunset * 1000);
    const sunsetHour = sunsetLocal.getHours();

    // Determine evening start and end times
    let eveningStart: number;
    let eveningEnd: number;

    if (sunsetHour <= 20) {
      // sunset at or before 8pm
      eveningStart = sunset;
      // Evening ends at 8pm local time
      const eightPM = new Date(now);
      eightPM.setHours(20, 0, 0, 0);
      eveningEnd = Math.floor(eightPM.getTime() / 1000);
    } else {
      // sunset after 8pm
      // Evening starts at 6pm local time
      const sixPM = new Date(now);
      sixPM.setHours(18, 0, 0, 0);
      eveningStart = Math.floor(sixPM.getTime() / 1000);
      eveningEnd = sunset;
    }

    const dayLength = sunset - sunrise;
    const morningEnd = sunrise + Math.max(dayLength / 3, 3600); // At least 1 hour for morning

    if (nowUtcSec < sunrise) return "night";
    if (nowUtcSec < morningEnd) return "morning";
    if (nowUtcSec < eveningStart) return "day";
    if (nowUtcSec < eveningEnd) return "evening";
    return "night";
  }

  // Fallback to local hour-based calculation
  return getTimePeriodFromHour(now.getHours());
}

/**
 * Helper function for hour-based time period calculation
 */
function getTimePeriodFromHour(hour: number): TimePeriod {
  if (hour >= 21 || hour < 5) return "night";
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 18) return "day";
  return "evening";
}

/**
 * Converts a UTC unix timestamp (seconds) to a local time string
 * @param unixTime - Unix timestamp in seconds
 * @param format - Time format preference ('12h' or '24h')
 */
export function formatUnixTimeToLocalString(
  unixTime: number,
  format: "12h" | "24h" = "12h",
): string {
  if (!unixTime) return "--";
  const date = new Date(unixTime * 1000);

  if (format === "24h") {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  // 12h format
  const timeString = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return timeString.toLowerCase();
}
