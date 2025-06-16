import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useWeatherData } from "../useWeather";
import { mockWeatherData } from "../../test/testUtils";
import { SettingsProvider } from "../../contexts/SettingsContext";
import { createElement, type ReactNode } from "react";

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

// Mock the useLocalStorage hook for settings
vi.mock("../useLocalStorage", () => ({
  useLocalStorage: vi.fn((_key: string, defaultValue: unknown) => [
    defaultValue,
    vi.fn(),
  ]),
}));

// Mock location based defaults
vi.mock("../useLocationBasedDefaults", () => ({
  useLocationBasedDefaults: vi.fn(() => ({
    locationDefaults: { temperatureUnit: "F", speedUnit: "mph" },
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
    // Mock settings to use Celsius
    const { useLocalStorage } = await import("../useLocalStorage");
    const mockUseLocalStorage = vi.mocked(useLocalStorage);
    mockUseLocalStorage.mockImplementation(
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
      main: { ...mockWeatherData.main, temp: 77 }, // 77°F = 25°C
    });

    const { result } = renderHook(() => useWeatherData(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.displayData.temperature).toBe("25");
    expect(result.current.displayData.unit).toBe("°C");
  });

  it("should determine correct time period", async () => {
    const now = Math.floor(Date.now() / 1000);
    const sunrise = now - 3600; // 1 hour ago
    const sunset = now + 3600; // 1 hour from now

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
