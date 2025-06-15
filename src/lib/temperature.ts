/**
 * Temperature conversion utilities
 */

export function fahrenheitToCelsius(fahrenheit: number): number {
  return Math.round((fahrenheit - 32) * (5 / 9));
}

export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

export function formatTemperature(
  temp: number,
  unit: "F" | "C",
  targetUnit: "F" | "C",
): string {
  if (unit === targetUnit) {
    return Math.round(temp).toString();
  }

  if (unit === "F" && targetUnit === "C") {
    return fahrenheitToCelsius(temp).toString();
  }

  if (unit === "C" && targetUnit === "F") {
    return celsiusToFahrenheit(temp).toString();
  }

  return Math.round(temp).toString();
}

/**
 * Time formatting utilities
 */
export function formatTime(unixTime: number, format: "12h" | "24h"): string {
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

/**
 * Speed conversion utilities
 */
export function convertSpeed(
  speed: number,
  from: "mph" | "kmh" | "ms",
  to: "mph" | "kmh" | "ms",
): number {
  if (from === to) return Math.round(speed);

  // Convert to m/s first, then to target
  let ms = speed;
  if (from === "mph") ms = speed * 0.44704;
  if (from === "kmh") ms = speed * 0.277778;

  if (to === "mph") return Math.round(ms * 2.23694);
  if (to === "kmh") return Math.round(ms * 3.6);
  return Math.round(ms);
}
