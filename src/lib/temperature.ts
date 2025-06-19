/**
 * Temperature conversion utilities
 * All temperatures are stored and processed in Kelvin internally.
 */

export function kelvinToCelsius(kelvin: number): number {
  return Math.round(kelvin - 273.15);
}

export function kelvinToFahrenheit(kelvin: number): number {
  return Math.round((kelvin - 273.15) * (9 / 5) + 32);
}

/**
 * Format temperature from Kelvin to the user's display unit.
 * @param kelvin - The temperature value in Kelvin
 * @param to - The unit to display ("F", "C", or "K")
 * @returns The converted temperature as a rounded string
 */
export function formatTemperature(kelvin: number, to: "F" | "C" | "K"): string {
  if (to === "K") return Math.round(kelvin).toString();
  if (to === "C") return kelvinToCelsius(kelvin).toString();
  if (to === "F") return kelvinToFahrenheit(kelvin).toString();
  return Math.round(kelvin).toString();
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
