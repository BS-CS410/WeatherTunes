/**
 * Unit conversion utilities for temperature, speed, etc.
 */

import type { TemperatureUnit, SpeedUnit } from "@/types/units-types";

/**
 * Default unit settings based on country
 */
export interface UnitDefaults {
  temperatureUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
  pressure: "hpa" | "inhg" | "mmhg";
  distance: "km" | "mi";
}

/**
 * Get default unit settings based on country code
 */
export function getDefaultUnitsForCountry(countryCode?: string): UnitDefaults {
  // Countries that use imperial units
  const imperialCountries = ["US", "LR", "MM"]; // USA, Liberia, Myanmar

  const useImperial =
    countryCode && imperialCountries.includes(countryCode.toUpperCase());

  return {
    temperatureUnit: useImperial ? "F" : "C",
    speedUnit: useImperial ? "mph" : "kmh",
    pressure: "hpa", // Most commonly used worldwide
    distance: useImperial ? "mi" : "km",
  };
}

/**
 * Convert temperature between units
 */
export function convertTemperature(
  temp: number,
  from: TemperatureUnit,
  to: TemperatureUnit,
): number {
  if (from === to) return temp;

  // Convert to Celsius first
  let celsius: number;
  switch (from) {
    case "F":
      celsius = ((temp - 32) * 5) / 9;
      break;
    case "K":
      celsius = temp - 273.15;
      break;
    default:
      celsius = temp;
  }

  // Convert from Celsius to target
  switch (to) {
    case "F":
      return (celsius * 9) / 5 + 32;
    case "K":
      return celsius + 273.15;
    default:
      return celsius;
  }
}

/**
 * Convert wind speed between units
 */
export function convertSpeed(
  speed: number,
  from: SpeedUnit,
  to: SpeedUnit,
): number {
  if (from === to) return speed;

  // Convert to m/s first
  let ms: number;
  switch (from) {
    case "mph":
      ms = speed * 0.44704;
      break;
    case "kmh":
      ms = speed * 0.277778;
      break;
    default:
      ms = speed;
  }

  // Convert from m/s to target
  switch (to) {
    case "mph":
      return ms * 2.237;
    case "kmh":
      return ms * 3.6;
    default:
      return ms;
  }
}

/**
 * Format temperature with unit
 */
export function formatTemperature(
  temp: number,
  unit: TemperatureUnit,
  decimals = 0,
): string {
  const symbol = unit === "K" ? "K" : `°${unit}`;
  return `${temp.toFixed(decimals)}${symbol}`;
}

/**
 * Format wind speed with unit
 */
export function formatSpeed(
  speed: number,
  unit: SpeedUnit,
  decimals = 1,
): string {
  const labels = {
    mph: "mph",
    kmh: "km/h",
    ms: "m/s",
  };
  return `${speed.toFixed(decimals)} ${labels[unit]}`;
}
