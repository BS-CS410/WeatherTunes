/**
 * Time and date utilities
 */

export type TimePeriod = "morning" | "day" | "evening" | "night";

/**
 * Determine time period based on current hour
 */
export function getTimePeriod(date: Date = new Date()): TimePeriod {
  const hour = date.getHours();

  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "day";
  if (hour >= 18 && hour < 22) return "evening";
  return "night";
}

/**
 * Format time for display
 */
export function formatTime(
  date: Date,
  format: "12h" | "24h" = "12h",
  showSeconds = false,
): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    ...(showSeconds && { second: "2-digit" }),
    ...(format === "12h" && { hour12: true }),
  };

  return date.toLocaleTimeString("en-US", options);
}

/**
 * Format duration in milliseconds to readable format
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
  return `0:${remainingSeconds.toString().padStart(2, "0")}`;
}

/**
 * Format Unix timestamp to local string
 */
export function formatUnixTimeToLocalString(
  timestamp: number,
  locale?: string,
  options?: Intl.DateTimeFormatOptions,
): string;
export function formatUnixTimeToLocalString(
  timestamp: number,
  format?: "short" | "long" | "time",
): string;
export function formatUnixTimeToLocalString(
  timestamp: number,
  localeOrFormat?: string | "short" | "long" | "time",
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = new Date(timestamp * 1000);

  // If called with locale and options (new signature)
  if (typeof localeOrFormat === "string" && options) {
    return date.toLocaleTimeString(localeOrFormat, options);
  }

  // If called with format only (old signature)
  const format = (localeOrFormat as "short" | "long" | "time") || "short";

  switch (format) {
    case "long":
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    case "time":
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    case "short":
    default:
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
  }
}
