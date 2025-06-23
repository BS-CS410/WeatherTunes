/**
 * Shared types for measurement units
 */

export type TemperatureUnit = "imperial" | "metric" | "standard";
export type TimeFormat = "12h" | "24h";
export type ThemeMode = "auto" | "light" | "dark";

export interface UnitDefaults {
  temperatureUnit: TemperatureUnit;
}
