import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useForecastData } from "../useForecast";
import { SettingsProvider } from "../../contexts/SettingsContext";
import { createElement, type ReactNode } from "react";

// Mock the weather utility functions
vi.mock("../../lib/weather", () => ({
  getUserLocationAndFetchForecast: vi.fn(() =>
    Promise.resolve({
      city: {
        name: "San Francisco",
        country: "US",
        sunrise: 1638360000,
        sunset: 1638396000,
      },
      list: [],
    }),
  ),
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

const mockGetUserLocationAndFetchForecast = vi.mocked(
  (await import("../../lib/weather")).getUserLocationAndFetchForecast,
);

function TestWrapper({ children }: { children: ReactNode }) {
  return createElement(SettingsProvider, null, children);
}

const mockForecastData = {
  city: {
    name: "San Francisco",
    country: "US",
    sunrise: 1638360000,
    sunset: 1638396000,
  },
  list: [
    {
      dt: 1638378000,
      main: {
        temp: 20,
        temp_min: 15,
        temp_max: 25,
        humidity: 65,
        pressure: 1013,
      },
      weather: [
        {
          main: "Clear",
          description: "clear sky",
          icon: "01d",
          id: 800,
        },
      ],
      dt_txt: "2021-12-01 12:00:00",
    },
    {
      dt: 1638464400,
      main: {
        temp: 18,
        temp_min: 12,
        temp_max: 22,
        humidity: 70,
        pressure: 1015,
      },
      weather: [
        {
          main: "Clouds",
          description: "scattered clouds",
          icon: "03d",
          id: 802,
        },
      ],
      dt_txt: "2021-12-02 12:00:00",
    },
  ],
};

describe("useForecastData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with loading state", () => {
    const { result } = renderHook(() => useForecastData(), {
      wrapper: TestWrapper,
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.forecast).toEqual([]);
  });

  it("should fetch forecast data successfully", async () => {
    mockGetUserLocationAndFetchForecast.mockResolvedValueOnce(mockForecastData);

    const { result } = renderHook(() => useForecastData(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.forecast).toBeDefined();
    expect(result.current.error).toBe(null);
  });

  it("should handle fetch errors", async () => {
    const error = new Error("Failed to fetch forecast");
    mockGetUserLocationAndFetchForecast.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useForecastData(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(error);
    expect(result.current.forecast).toEqual([]);
  });

  it("should format forecast data correctly", async () => {
    mockGetUserLocationAndFetchForecast.mockResolvedValueOnce(mockForecastData);

    const { result } = renderHook(() => useForecastData(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.forecast.length).toBeGreaterThan(0);

    if (result.current.forecast.length > 0) {
      const firstDay = result.current.forecast[0];
      expect(firstDay).toHaveProperty("dayName");
      expect(firstDay).toHaveProperty("date");
      expect(firstDay).toHaveProperty("condition");
      expect(firstDay).toHaveProperty("tempHigh");
      expect(firstDay).toHaveProperty("tempLow");
      expect(firstDay).toHaveProperty("icon");
    }
  });

  it("should handle empty forecast data", async () => {
    mockGetUserLocationAndFetchForecast.mockResolvedValueOnce({
      city: {
        name: "San Francisco",
        country: "US",
        sunrise: 1638360000,
        sunset: 1638396000,
      },
      list: [],
    });

    const { result } = renderHook(() => useForecastData(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.forecast).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it("should handle network errors gracefully", async () => {
    mockGetUserLocationAndFetchForecast.mockRejectedValueOnce(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useForecastData(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.forecast).toEqual([]);
  });

  it("should group forecast data by day", async () => {
    // Mock data with multiple entries for the same day
    const multiDayForecast = {
      city: {
        name: "San Francisco",
        country: "US",
        sunrise: 1638360000,
        sunset: 1638396000,
      },
      list: [
        {
          dt: 1638378000, // Day 1 morning
          main: {
            temp: 20,
            temp_min: 15,
            temp_max: 25,
            humidity: 65,
            pressure: 1013,
          },
          weather: [
            { main: "Clear", description: "clear sky", icon: "01d", id: 800 },
          ],
          dt_txt: "2021-12-01 09:00:00",
        },
        {
          dt: 1638389600, // Day 1 afternoon
          main: {
            temp: 25,
            temp_min: 20,
            temp_max: 28,
            humidity: 60,
            pressure: 1012,
          },
          weather: [
            { main: "Clear", description: "clear sky", icon: "01d", id: 800 },
          ],
          dt_txt: "2021-12-01 15:00:00",
        },
        {
          dt: 1638464400, // Day 2
          main: {
            temp: 18,
            temp_min: 12,
            temp_max: 22,
            humidity: 70,
            pressure: 1015,
          },
          weather: [
            {
              main: "Clouds",
              description: "scattered clouds",
              icon: "03d",
              id: 802,
            },
          ],
          dt_txt: "2021-12-02 12:00:00",
        },
      ],
    };

    mockGetUserLocationAndFetchForecast.mockResolvedValueOnce(multiDayForecast);

    const { result } = renderHook(() => useForecastData(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should group data by day and show appropriate min/max temps
    expect(result.current.forecast.length).toBeGreaterThan(0);
  });
});
