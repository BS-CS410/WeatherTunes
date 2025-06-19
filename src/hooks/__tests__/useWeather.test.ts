import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useWeatherData } from "../useWeather";
import { mockWeatherData } from "../../test/testUtils";
import { SettingsProvider } from "../../contexts/SettingsContext";
import { createElement, type ReactNode } from "react";
import { useLocalStorage } from "../utility";
import type { TemperatureUnit, SpeedUnit } from "../../types/units";

// Mock the useLocalStorage and useSettings hooks from the new utility location
const mockSetters = {
  setTemperatureUnit: vi.fn(),
  setSpeedUnit: vi.fn(),
  setTimeFormat: vi.fn(),
  setThemeMode: vi.fn(),
};

const mockSettings = {
  settings: {
    temperatureUnit: "F" as TemperatureUnit,
    speedUnit: "mph" as SpeedUnit,
    timeFormat: "12h",
    themeMode: "auto",
  },
  setTemperatureUnit: mockSetters.setTemperatureUnit,
  setSpeedUnit: mockSetters.setSpeedUnit,
  setTimeFormat: mockSetters.setTimeFormat,
  setThemeMode: mockSetters.setThemeMode,
  toggleTemperatureUnit: vi.fn(),
  toggleTimeFormat: vi.fn(),
  resetToDefaults: vi.fn(),
  locationDefaults: {
    temperatureUnit: "F" as TemperatureUnit,
    speedUnit: "mph" as SpeedUnit,
  },
  isLocationLoading: false,
};

vi.mock("../utility", () => ({
  useLocalStorage: vi.fn((_key: string, defaultValue: unknown) => [
    defaultValue,
    vi.fn(),
  ]),
  useSettings: vi.fn(() => mockSettings),
}));

// Mock the weather utility functions
vi.mock("../../lib/weather", () => ({
  getUserLocationAndFetch: vi.fn(() => Promise.resolve(mockWeatherData)),
  createErrorWeatherData: vi.fn(() => ({
    name: "Error",
    weather: [{ main: "Unable to load", description: "Error", id: 0 }],
    main: { temp: 0, humidity: 0, pressure: 0 },
    sys: { sunrise: 0, sunset: 0 },
  })),
}));

// Mock location based defaults
vi.mock("../useLocationBasedDefaults", () => ({
  useLocationBasedDefaults: vi.fn(() => ({
    locationDefaults: {
      temperatureUnit: "F" as TemperatureUnit,
      speedUnit: "mph" as SpeedUnit,
    },
    isLoading: false,
  })),
}));

const mockGetUserLocationAndFetch = vi.mocked(
  (await import("../../lib/weather")).getUserLocationAndFetch,
);

function TestWrapper({ children }: { children: ReactNode }) {
  return createElement(SettingsProvider, null, children);
}

describe("useWeatherData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with loading state", () => {
    const { result } = renderHook(() => useWeatherData(), {
      wrapper: TestWrapper,
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.displayData.isError).toBe(false);
  });

  it("should fetch weather data successfully", async () => {
    mockGetUserLocationAndFetch.mockResolvedValueOnce(mockWeatherData);

    const { result } = renderHook(() => useWeatherData(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.displayData.location).toBe("San Francisco");
    expect(result.current.displayData.condition).toBe("Clear sky");
    expect(result.current.error).toBe(null);
  });

  it("should handle fetch errors", async () => {
    const error = new Error("Failed to fetch weather");
    mockGetUserLocationAndFetch.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useWeatherData(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(error);
    expect(result.current.displayData.isError).toBe(true);
  });

  it("should handle network errors gracefully", async () => {
    mockGetUserLocationAndFetch.mockRejectedValueOnce(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useWeatherData(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.displayData.isError).toBe(true);
  });

  it("should format temperature correctly for celsius", async () => {
    // Patch the mock to return Celsius for this test
    mockSettings.settings.temperatureUnit = "C";
    vi.mocked(useLocalStorage).mockImplementation(
      (key: string, defaultValue: unknown) => {
        if (key === "temperatureUnit") {
          return ["C", vi.fn()];
        }
        const values: Record<string, unknown> = {
          speedUnit: "kmh",
          timeFormat: "24h",
          themeMode: "auto",
        };
        return [values[key] || defaultValue, vi.fn()];
      },
    );
    mockGetUserLocationAndFetch.mockResolvedValueOnce({
      ...mockWeatherData,
      main: { ...mockWeatherData.main, temp: 298.15 }, // 298.15K = 25°C
    });
    const { result } = renderHook(() => useWeatherData(), {
      wrapper: TestWrapper,
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.displayData.temperature).toBe("25");
    expect(result.current.displayData.unit).toBe("°C");
    // Restore to F for other tests
    mockSettings.settings.temperatureUnit = "F";
  });

  it("should determine correct time period", async () => {
    // Create a fixed date for predictable testing (2 PM UTC - clearly day time)
    const fixedDate = new Date("2024-06-18T14:00:00Z");
    const now = Math.floor(fixedDate.getTime() / 1000);
    const sunrise = now - 28800; // 8 hours ago (6 AM)
    const sunset = now + 14400; // 4 hours from now (6 PM)

    // Use vitest's system time mocking
    vi.setSystemTime(fixedDate);

    mockGetUserLocationAndFetch.mockResolvedValueOnce({
      ...mockWeatherData,
      sys: { ...mockWeatherData.sys, sunrise, sunset },
    });

    const { result } = renderHook(() => useWeatherData(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.timePeriod).toBe("day");

    // Restore real time
    vi.useRealTimers();
  });

  it("should handle invalid weather data", async () => {
    mockGetUserLocationAndFetch.mockResolvedValueOnce({
      ...mockWeatherData,
      weather: [],
    });

    const { result } = renderHook(() => useWeatherData(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.displayData.condition).toBe(
      "Weather data unavailable",
    );
  });
});
