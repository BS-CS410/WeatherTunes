import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ForecastCard } from "../weather/ForecastCard";
import { SettingsProvider } from "../../contexts/SettingsContext";
import { createElement, type ReactNode } from "react";

// Mock the useForecastData hook
vi.mock("../../hooks/useForecast", () => ({
  useForecastData: vi.fn(() => ({
    forecast: [
      {
        dayName: "Today",
        date: "Jun 16",
        condition: "scattered clouds",
        tempHigh: "22",
        tempLow: "22",
        icon: "02d",
      },
      {
        dayName: "Tuesday",
        date: "Jun 17",
        condition: "scattered clouds",
        tempHigh: "26",
        tempLow: "12",
        icon: "02d",
      },
      {
        dayName: "Wednesday",
        date: "Jun 18",
        condition: "few clouds",
        tempHigh: "22",
        tempLow: "8",
        icon: "02d",
      },
      {
        dayName: "Thursday",
        date: "Jun 19",
        condition: "overcast clouds",
        tempHigh: "22",
        tempLow: "9",
        icon: "04d",
      },
    ],
    isLoading: false,
    error: null,
  })),
}));

// Mock the useLocalStorage hook for settings
vi.mock("../../hooks/useLocalStorage", () => ({
  useLocalStorage: vi.fn((_key: string, defaultValue: unknown) => [
    defaultValue,
    vi.fn(),
  ]),
}));

// Mock location based defaults
vi.mock("../../hooks/useLocationBasedDefaults", () => ({
  useLocationBasedDefaults: vi.fn(() => ({
    locationDefaults: { temperatureUnit: "F", speedUnit: "mph" },
    isLoading: false,
  })),
}));

function TestWrapper({ children }: { children: ReactNode }) {
  return createElement(SettingsProvider, null, children);
}

describe("ForecastCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render forecast information", () => {
    render(<ForecastCard />, { wrapper: TestWrapper });

    expect(screen.getByText("5-Day Forecast")).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Jun 16")).toBeInTheDocument();
    expect(screen.getByText("scattered clouds")).toBeInTheDocument();
    expect(screen.getByText("22°")).toBeInTheDocument();
  });

  it("should show loading state", async () => {
    const { useForecastData } = vi.mocked(
      await import("../../hooks/useForecast"),
    );
    useForecastData.mockReturnValue({
      forecast: [],
      isLoading: true,
      error: null,
    });

    render(<ForecastCard />, { wrapper: TestWrapper });

    expect(screen.getByText("Loading forecast...")).toBeInTheDocument();
  });

  it("should show error state", async () => {
    const { useForecastData } = vi.mocked(
      await import("../../hooks/useForecast"),
    );
    useForecastData.mockReturnValue({
      forecast: [],
      isLoading: false,
      error: new Error("Failed to fetch"),
    });

    render(<ForecastCard />, { wrapper: TestWrapper });

    expect(screen.getByText("Could not load forecast")).toBeInTheDocument();
  });

  it("should show no data message when forecast is empty", async () => {
    const { useForecastData } = vi.mocked(
      await import("../../hooks/useForecast"),
    );
    useForecastData.mockReturnValue({
      forecast: [],
      isLoading: false,
      error: null,
    });

    render(<ForecastCard />, { wrapper: TestWrapper });

    expect(screen.getByText("No forecast data available")).toBeInTheDocument();
  });

  it("should render multiple forecast days", async () => {
    const { useForecastData } = vi.mocked(
      await import("../../hooks/useForecast"),
    );
    useForecastData.mockReturnValue({
      forecast: [
        {
          dayName: "Today",
          date: "Dec 15",
          condition: "clear sky",
          tempHigh: "25",
          tempLow: "15",
          icon: "01d",
        },
        {
          dayName: "Tuesday",
          date: "Dec 16",
          condition: "light rain",
          tempHigh: "20",
          tempLow: "12",
          icon: "10d",
        },
      ],
      isLoading: false,
      error: null,
    });

    render(<ForecastCard />, { wrapper: TestWrapper });

    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Tuesday")).toBeInTheDocument();
    expect(screen.getByText("clear sky")).toBeInTheDocument();
    expect(screen.getByText("light rain")).toBeInTheDocument();
  });
});
