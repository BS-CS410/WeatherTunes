import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ForecastCard } from "../ForecastCard";
import { SettingsProvider } from "../../contexts/SettingsContext";
import { createElement, type ReactNode } from "react";

// Mock the useForecastData hook
vi.mock("../../hooks/useForecast", () => ({
  useForecastData: vi.fn(() => ({
    forecast: [
      {
        dayName: "Monday",
        date: "Jan 15",
        condition: "clear sky",
        tempHigh: "25",
        tempLow: "18",
        icon: "01d",
      },
      {
        dayName: "Tuesday",
        date: "Jan 16",
        condition: "light rain",
        tempHigh: "22",
        tempLow: "15",
        icon: "10d",
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

    expect(screen.getByText("Your Forecast:")).toBeInTheDocument();
    expect(screen.getByText("Monday")).toBeInTheDocument();
    expect(screen.getByText("Jan 15")).toBeInTheDocument();
    expect(screen.getByText("clear sky")).toBeInTheDocument();
    expect(screen.getByText("25°")).toBeInTheDocument();
    expect(screen.getByText("18°")).toBeInTheDocument();
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

    expect(screen.getByText("Unable to load forecast")).toBeInTheDocument();
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
          dayName: "Monday",
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

    expect(screen.getByText("Monday")).toBeInTheDocument();
    expect(screen.getByText("Tuesday")).toBeInTheDocument();
    expect(screen.getByText("clear sky")).toBeInTheDocument();
    expect(screen.getByText("light rain")).toBeInTheDocument();
  });
});
