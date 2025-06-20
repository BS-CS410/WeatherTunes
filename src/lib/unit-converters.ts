/**
 * Unit conversion and localization utilities
 * Handles temperature, speed, and locale-based unit defaults
 */

import type { UnitDefaults } from "@/types/units-types";

/**
 * Countries that primarily use imperial (Fahrenheit) system
 */
const IMPERIAL_COUNTRIES = new Set([
  "US", // United States
  "BS", // Bahamas
  "BZ", // Belize
  "KY", // Cayman Islands
  "LR", // Liberia
  "PW", // Palau
  "FM", // Federated States of Micronesia
  "MH", // Marshall Islands
]);

/**
 * Determines the default units based on the country code
 */
export function getDefaultUnitsForCountry(countryCode?: string): UnitDefaults {
  if (!countryCode) {
    console.log("No country code provided, defaulting to metric");
    return {
      temperatureUnit: "C",
      speedUnit: "kmh",
    };
  }

  const normalizedCode = countryCode.toUpperCase();
  console.log(`Getting units for country: ${normalizedCode}`);

  const isImperial = IMPERIAL_COUNTRIES.has(normalizedCode);

  return {
    temperatureUnit: isImperial ? "F" : "C",
    speedUnit: isImperial ? "mph" : "kmh",
  };
}

/**
 * Temperature conversion utilities
 */
export function convertTemperature(
  temp: number,
  from: "celsius" | "fahrenheit",
  to: "celsius" | "fahrenheit",
): number {
  if (from === to) return temp;

  if (from === "celsius" && to === "fahrenheit") {
    return (temp * 9) / 5 + 32;
  } else if (from === "fahrenheit" && to === "celsius") {
    return ((temp - 32) * 5) / 9;
  }

  return temp;
}

/**
 * Wind speed conversion utilities
 */
export function convertWindSpeed(
  speed: number,
  from: "ms" | "kmh" | "mph",
  to: "ms" | "kmh" | "mph",
): number {
  if (from === to) return speed;

  // Convert to m/s first
  let speedInMs = speed;
  if (from === "kmh") speedInMs = speed / 3.6;
  else if (from === "mph") speedInMs = speed * 0.44704;

  // Convert to target unit
  if (to === "ms") return speedInMs;
  else if (to === "kmh") return speedInMs * 3.6;
  else if (to === "mph") return speedInMs / 0.44704;

  return speed;
}

/**
 * Format temperature with appropriate unit
 */
export function formatTemperature(
  kelvinTemp: number,
  unit: "C" | "F" | "K" = "C",
): string {
  let temp: number;
  let unitSymbol: string;

  switch (unit) {
    case "F":
      temp = convertTemperature(kelvinTemp - 273.15, "celsius", "fahrenheit");
      unitSymbol = "°F";
      break;
    case "K":
      temp = kelvinTemp;
      unitSymbol = "K";
      break;
    case "C":
    default:
      temp = kelvinTemp - 273.15;
      unitSymbol = "°C";
      break;
  }

  return `${Math.round(temp)}${unitSymbol}`;
}
