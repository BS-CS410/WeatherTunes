import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useThemeManager } from "../useThemeManager";
import { SettingsProvider } from "../../contexts/SettingsContext";
import { createElement, type ReactNode } from "react";
import type { TimePeriod } from "../../lib/utils";

// Mock the useLocalStorage hook for settings
const mockSetters = {
  setTemperatureUnit: vi.fn(),
  setSpeedUnit: vi.fn(),
  setTimeFormat: vi.fn(),
  setThemeMode: vi.fn(),
};

vi.mock("../useLocalStorage", () => ({
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
}));

// Mock location based defaults
vi.mock("../useLocationBasedDefaults", () => ({
  useLocationBasedDefaults: vi.fn(() => ({
    locationDefaults: { temperatureUnit: "F", speedUnit: "mph" },
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
    // Reset DOM classes
    document.documentElement.className = "";
    document.documentElement.classList.remove("dark");
  });

  it("should apply light theme when theme mode is light", async () => {
    const { useLocalStorage } = await import("../useLocalStorage");
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
    const { useLocalStorage } = await import("../useLocalStorage");
    const mockUseLocalStorage = vi.mocked(useLocalStorage);

    mockUseLocalStorage.mockImplementation(
      (key: string, defaultValue: unknown) => {
        if (key === "themeMode") {
          return ["dark", vi.fn()];
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

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("should apply dark theme for evening/night in auto mode", async () => {
    // Ensure we have auto mode for this test
    const { useLocalStorage } = await import("../useLocalStorage");
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
    // Ensure we have auto mode for this test
    const { useLocalStorage } = await import("../useLocalStorage");
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

    renderHook(() => useThemeManager("morning" as TimePeriod), {
      wrapper: TestWrapper,
    });

    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("should fall back to system preference when timePeriod is null in auto mode", async () => {
    // Ensure we have auto mode for this test
    const { useLocalStorage } = await import("../useLocalStorage");
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
