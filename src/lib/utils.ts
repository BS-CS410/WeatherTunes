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
  if (sunrise && sunset) {
    const dayLength = sunset - sunrise;
    const morningEnd = sunrise + dayLength / 3;
    const dayEnd = sunrise + (2 * dayLength) / 3;
    if (nowUtcSec < sunrise || nowUtcSec >= sunset) return "night";
    if (nowUtcSec < morningEnd) return "morning";
    if (nowUtcSec < dayEnd) return "day";
    return "evening";
  }
  // Fallback to local hour-based calculation
  const hour = now.getHours();
  if (hour >= 21 || hour < 5) return "night";
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 18) return "day";
  return "evening";
}
