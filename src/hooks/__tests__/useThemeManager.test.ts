import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useThemeManager } from "../useThemeManager";
import { SettingsProvider } from "../../contexts/SettingsContext";
import { createElement, type ReactNode } from "react";
import type { TimePeriod } from "../../lib/utils";
import type {
  TemperatureUnit,
  SpeedUnit,
  TimeFormat,
  ThemeMode,
} from "../../types/units";

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
    timeFormat: "12h" as TimeFormat,
    themeMode: "auto" as ThemeMode,
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

const utility = await import("../utility");

vi.mock("../utility", () => ({
  useLocalStorage: vi.fn((key: string, defaultValue: unknown) => {
    const values: Record<string, unknown> = {
      temperatureUnit: "F",
      speedUnit: "mph",
      timeFormat: "12h",
      themeMode: "auto",
    };
    const setterName =
      `set${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof typeof mockSetters;
    return [values[key] || defaultValue, mockSetters[setterName] || vi.fn()];
  }),
  useSettings: vi.fn(() => mockSettings),
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

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: query === "(prefers-color-scheme: dark)",
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

function TestWrapper({ children }: { children: ReactNode }) {
  return createElement(SettingsProvider, null, children);
}

describe("useThemeManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.values(mockSetters).forEach((fn) => fn.mockClear());
    // Reset DOM classes
    document.documentElement.className = "";
    document.documentElement.classList.remove("dark");
  });

  it("should apply light theme when theme mode is light", async () => {
    const { useLocalStorage } = await import("../utility");
    const mockUseLocalStorage = vi.mocked(useLocalStorage);

    mockUseLocalStorage.mockImplementation(
      (key: string, defaultValue: unknown) => {
        if (key === "themeMode") {
          return ["light", vi.fn()];
        }
        const values: Record<string, unknown> = {
          temperatureUnit: "F",
          speedUnit: "mph",
          timeFormat: "12h",
        };
        return [values[key] || defaultValue, vi.fn()];
      },
    );

    renderHook(() => useThemeManager("day" as TimePeriod), {
      wrapper: TestWrapper,
    });

    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("should apply dark theme when theme mode is dark", async () => {
    vi.mocked(utility.useSettings).mockReturnValue({
      ...mockSettings,
      settings: {
        ...mockSettings.settings,
        themeMode: "dark" as ThemeMode,
      },
    });
    renderHook(() => useThemeManager("day" as TimePeriod), {
      wrapper: TestWrapper,
    });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("should apply dark theme for evening/night in auto mode", async () => {
    // Ensure we have auto mode for this test
    const { useLocalStorage } = await import("../utility");
    const mockUseLocalStorage = vi.mocked(useLocalStorage);

    mockUseLocalStorage.mockImplementation(
      (key: string, defaultValue: unknown) => {
        if (key === "themeMode") {
          return ["auto", vi.fn()];
        }
        const values: Record<string, unknown> = {
          temperatureUnit: "F",
          speedUnit: "mph",
          timeFormat: "12h",
        };
        return [values[key] || defaultValue, vi.fn()];
      },
    );

    renderHook(() => useThemeManager("night" as TimePeriod), {
      wrapper: TestWrapper,
    });

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("should apply light theme for morning/day in auto mode", async () => {
    vi.mocked(utility.useSettings).mockReturnValue({
      ...mockSettings,
      settings: {
        ...mockSettings.settings,
        themeMode: "auto" as ThemeMode,
      },
    });
    renderHook(() => useThemeManager("morning" as TimePeriod), {
      wrapper: TestWrapper,
    });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("should fall back to system preference when timePeriod is null in auto mode", async () => {
    // Ensure we have auto mode for this test
    const { useLocalStorage } = await import("../utility");
    const mockUseLocalStorage = vi.mocked(useLocalStorage);

    mockUseLocalStorage.mockImplementation(
      (key: string, defaultValue: unknown) => {
        if (key === "themeMode") {
          return ["auto", vi.fn()];
        }
        const values: Record<string, unknown> = {
          temperatureUnit: "F",
          speedUnit: "mph",
          timeFormat: "12h",
        };
        return [values[key] || defaultValue, vi.fn()];
      },
    );

    renderHook(() => useThemeManager(null), {
      wrapper: TestWrapper,
    });

    // Should use system preference (mocked to prefer dark)
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
