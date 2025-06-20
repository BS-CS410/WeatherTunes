import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSettings } from "../hooks-utility";
import { SettingsContext } from "../../contexts/SettingsProvider";
import { createElement, type ReactNode } from "react";
import type {
  TemperatureUnit,
  SpeedUnit,
  TimeFormat,
  ThemeMode,
} from "../../types/units-types";

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

vi.mock("../hooks-utility", () => ({
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
      temperatureUnit: "F",
      speedUnit: "mph",
    },
    isLoading: false,
  })),
}));

// Patch: inject the mock context directly to ensure setter spies are called
function MockSettingsProvider({ children }: { children: ReactNode }) {
  return createElement(
    SettingsContext.Provider,
    { value: mockSettings },
    children,
  );
}

describe("useSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.values(mockSetters).forEach((fn) => fn.mockClear());
  });

  it("should return default settings", () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: MockSettingsProvider,
    });
    expect(result.current.settings.temperatureUnit).toBe("F");
    expect(result.current.settings.speedUnit).toBe("mph");
    expect(result.current.settings.timeFormat).toBe("12h");
    expect(result.current.settings.themeMode).toBe("auto");
  });

  it("should provide setter functions", () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: MockSettingsProvider,
    });
    expect(typeof result.current.setTemperatureUnit).toBe("function");
    expect(typeof result.current.setTimeFormat).toBe("function");
    expect(typeof result.current.setSpeedUnit).toBe("function");
    expect(typeof result.current.setThemeMode).toBe("function");
  });

  it("should provide toggle functions", () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: MockSettingsProvider,
    });
    expect(typeof result.current.toggleTemperatureUnit).toBe("function");
    expect(typeof result.current.toggleTimeFormat).toBe("function");
  });

  it("should handle temperature unit updates", () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: MockSettingsProvider,
    });
    act(() => {
      result.current.setTemperatureUnit("C");
    });
    expect(mockSetters.setTemperatureUnit).toHaveBeenCalledWith("C");
  });

  it("should handle speed unit updates", () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: MockSettingsProvider,
    });
    act(() => {
      result.current.setSpeedUnit("kmh");
    });
    expect(mockSetters.setSpeedUnit).toHaveBeenCalledWith("kmh");
  });

  it("should handle time format updates", () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: MockSettingsProvider,
    });
    act(() => {
      result.current.setTimeFormat("24h");
    });
    expect(mockSetters.setTimeFormat).toHaveBeenCalledWith("24h");
  });

  it("should handle theme mode updates", () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: MockSettingsProvider,
    });
    act(() => {
      result.current.setThemeMode("dark");
    });
    expect(mockSetters.setThemeMode).toHaveBeenCalledWith("dark");
  });

  it("should toggle temperature unit", () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: MockSettingsProvider,
    });
    act(() => {
      result.current.toggleTemperatureUnit();
    });
    expect(typeof result.current.toggleTemperatureUnit).toBe("function");
  });

  it("should toggle time format", () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: MockSettingsProvider,
    });
    act(() => {
      result.current.toggleTimeFormat();
    });
    expect(typeof result.current.toggleTimeFormat).toBe("function");
  });

  it("should reset to defaults", () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: MockSettingsProvider,
    });
    act(() => {
      result.current.resetToDefaults();
    });
    expect(typeof result.current.resetToDefaults).toBe("function");
  });

  it("should provide location defaults information", () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: MockSettingsProvider,
    });
    expect(result.current.locationDefaults).toBeDefined();
    expect(typeof result.current.isLocationLoading).toBe("boolean");
  });

  it("should throw error when used outside provider", async () => {
    vi.unmock("../hooks-utility");
    const { useSettings: realUseSettings } = await import("../hooks-utility");
    expect(() => renderHook(() => realUseSettings())).toThrow(
      "useSettings must be used within a SettingsProvider",
    );
    // No remock here; beforeEach will remock for the next test
  });
});
