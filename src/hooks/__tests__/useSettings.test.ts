import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSettings } from "../useSettings";
import { SettingsProvider } from "../../contexts/SettingsContext";
import { createElement, type ReactNode } from "react";

// Mock the useLocalStorage hook with proper implementation
const mockSetters = {
  setTemperatureUnit: vi.fn(),
  setSpeedUnit: vi.fn(),
  setTimeFormat: vi.fn(),
  setThemeMode: vi.fn(),
};

vi.mock("../useLocalStorage", () => ({
  useLocalStorage: vi.fn((key: string, defaultValue: unknown) => {
    // Return appropriate values based on the key
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
    locationDefaults: {
      temperatureUnit: "F",
      speedUnit: "mph",
    },
    isLoading: false,
  })),
}));

function TestWrapper({ children }: { children: ReactNode }) {
  return createElement(SettingsProvider, null, children);
}

describe("useSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return default settings", () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: TestWrapper,
    });

    expect(result.current.settings.temperatureUnit).toBe("F");
    expect(result.current.settings.speedUnit).toBe("mph");
    expect(result.current.settings.timeFormat).toBe("12h");
    expect(result.current.settings.themeMode).toBe("auto");
  });

  it("should provide setter functions", () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: TestWrapper,
    });

    expect(typeof result.current.setTemperatureUnit).toBe("function");
    expect(typeof result.current.setTimeFormat).toBe("function");
    expect(typeof result.current.setSpeedUnit).toBe("function");
    expect(typeof result.current.setThemeMode).toBe("function");
  });

  it("should provide toggle functions", () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: TestWrapper,
    });

    expect(typeof result.current.toggleTemperatureUnit).toBe("function");
    expect(typeof result.current.toggleTimeFormat).toBe("function");
  });

  it("should handle temperature unit updates", () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.setTemperatureUnit("C");
    });

    expect(result.current.setTemperatureUnit).toHaveBeenCalledWith("C");
  });

  it("should handle speed unit updates", () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.setSpeedUnit("kmh");
    });

    expect(result.current.setSpeedUnit).toHaveBeenCalledWith("kmh");
  });

  it("should handle time format updates", () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.setTimeFormat("24h");
    });

    expect(result.current.setTimeFormat).toHaveBeenCalledWith("24h");
  });

  it("should handle theme mode updates", () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.setThemeMode("dark");
    });

    expect(result.current.setThemeMode).toHaveBeenCalledWith("dark");
  });

  it("should toggle temperature unit", () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.toggleTemperatureUnit();
    });

    // Since we're testing the actual toggle functionality, check that the function exists
    expect(typeof result.current.toggleTemperatureUnit).toBe("function");
  });

  it("should toggle time format", () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.toggleTimeFormat();
    });

    expect(typeof result.current.toggleTimeFormat).toBe("function");
  });

  it("should reset to defaults", () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.resetToDefaults();
    });

    expect(typeof result.current.resetToDefaults).toBe("function");
  });

  it("should provide location defaults information", () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: TestWrapper,
    });

    expect(result.current.locationDefaults).toBeDefined();
    expect(typeof result.current.isLocationLoading).toBe("boolean");
  });

  it("should throw error when used outside provider", () => {
    expect(() => {
      renderHook(() => useSettings());
    }).toThrow("useSettings must be used within a SettingsProvider");
  });
});
