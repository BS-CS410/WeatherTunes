/**
 * Shared types for measurement units
 */

export type TemperatureUnit = "F" | "C" | "K";
export type SpeedUnit = "mph" | "kmh" | "ms";
export type TimeFormat = "12h" | "24h";
export type ThemeMode = "auto" | "light" | "dark";

export interface UnitDefaults {
  temperatureUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
}
