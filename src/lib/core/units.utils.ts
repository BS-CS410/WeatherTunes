/**
 * Unit conversion utilities for temperature, speed, etc.
 */

import type { TemperatureUnit } from "@/types/units-types";

/**
 * Default unit settings based on country
 */
export interface UnitDefaults {
  temperatureUnit: TemperatureUnit;
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
    temperatureUnit: useImperial ? "imperial" : "metric",
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
    case "imperial":
      celsius = ((temp - 32) * 5) / 9;
      break;
    case "standard":
      celsius = temp - 273.15;
      break;
    default:
      celsius = temp;
  }

  // Convert from Celsius to target
  switch (to) {
    case "imperial":
      return (celsius * 9) / 5 + 32;
    case "standard":
      return celsius + 273.15;
    default:
      return celsius;
  }
}

/**
 * Converts Kelvin to Celsius.
 * @param kelvin - Temperature in Kelvin.
 * @returns Temperature in Celsius.
 */
export function kelvinToCelsius(kelvin: number): number {
  return kelvin - 273.15;
}

/**
 * Converts Kelvin to Fahrenheit.
 * @param kelvin - Temperature in Kelvin.
 * @returns Temperature in Fahrenheit.
 */
export function kelvinToFahrenheit(kelvin: number): number {
  return (kelvin - 273.15) * (9 / 5) + 32;
}

/**
 * Returns the numeric temperature value for a given unit.
 * @param kelvin - The temperature in Kelvin from the API.
 * @param unit - The target unit ('imperial' for °F, 'metric' for °C, 'standard' for K).
 * @returns The rounded numeric temperature.
 */
export function formatTemperature(
  kelvin: number,
  unit: TemperatureUnit,
): number {
  if (unit === "imperial") {
    return Math.round(kelvinToFahrenheit(kelvin));
  }
  if (unit === "metric") {
    return Math.round(kelvinToCelsius(kelvin));
  }
  return Math.round(kelvin);
}

/**
 * Returns the display symbol for a given temperature unit.
 * @param unit - The temperature unit.
 * @returns The corresponding symbol ('F', 'C', or 'K').
 */
export function getUnitSymbol(unit: TemperatureUnit): string {
  switch (unit) {
    case "imperial":
      return "F";
    case "metric":
      return "C";
    case "standard":
    default:
      return "K";
  }
}

/**
 * Format temperature with unit
 */
export function formatTemperatureWithUnit(
  temp: number,
  unit: TemperatureUnit,
  decimals = 0,
): string {
  const symbol = getUnitSymbol(unit);
  return `${temp.toFixed(decimals)}${symbol}`;
}

/**
 * Formats a Unix timestamp into a human-readable time string.
 * @param unixTimestamp - The Unix timestamp in seconds.
 * @param timezone - The IANA timezone name (e.g., 'America/New_York').
 * @returns Formatted time string (e.g., "5:30 PM").
 */
export function formatUnixTime(
  unixTimestamp: number,
  timezone: string,
): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: timezone,
  }).format(new Date(unixTimestamp * 1000));
}

/**
 * Formats a date from a forecast into a short month/day format.
 * @param date - The date string from the weather forecast.
 * @returns Formatted date string (e.g., "Jul 23").
 */
export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Formats a date from a forecast into a day of the week.
 * @param date - The date string from the weather forecast.
 * @returns The abbreviated day of the week (e.g., "Mon").
 */
export function formatDay(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { weekday: "short" });
}
