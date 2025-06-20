/**
 * Time and date calculation utilities
 * Handles time periods, date formatting, and time-based logic
 */

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

    // Apply time period logic
    if (nowUtcSec < sunrise) {
      return "night";
    } else if (nowUtcSec < sunrise + 3600) {
      // Within 1 hour after sunrise = morning
      return "morning";
    } else if (nowUtcSec < eveningStart - 3600) {
      // More than 1 hour before evening = day
      return "day";
    } else if (nowUtcSec < eveningEnd) {
      return "evening";
    } else {
      return "night";
    }
  }

  // Fallback to hour-based calculation
  return getTimePeriodFromHour(now.getHours());
}

function getTimePeriodFromHour(hour: number): TimePeriod {
  if (hour >= 5 && hour < 10) return "morning";
  if (hour >= 10 && hour < 17) return "day";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

/**
 * Formats a Unix timestamp to a localized date string
 */
export function formatUnixTimeToLocalString(
  unixTime: number,
  locale: string = "en-US",
  options: Intl.DateTimeFormatOptions = {},
): string {
  const date = new Date(unixTime * 1000);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleDateString(locale, { ...defaultOptions, ...options });
}
