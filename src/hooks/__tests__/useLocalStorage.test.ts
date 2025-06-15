import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../useLocalStorage";

describe("useLocalStorage", () => {
  let mockStorage: Record<string, string>;

  beforeEach(() => {
    // Clear storage before each test
    mockStorage = {};
    vi.clearAllMocks();

    // Mock localStorage
    const mockLocalStorage = {
      getItem: vi.fn((key: string) => mockStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStorage[key];
      }),
      clear: vi.fn(() => {
        mockStorage = {};
      }),
    };

    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
      writable: true,
    });
  });

  it("should return initial value when localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    expect(result.current[0]).toBe("initial");
  });

  it("should return stored value from localStorage", () => {
    mockStorage["test-key"] = JSON.stringify("stored-value");

    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    expect(result.current[0]).toBe("stored-value");
  });

  it("should update localStorage when value changes", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("new-value");
    });

    expect(result.current[0]).toBe("new-value");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "test-key",
      JSON.stringify("new-value"),
    );
  });

  it("should handle complex objects", () => {
    const initialObject = { name: "test", count: 0 };
    const { result } = renderHook(() =>
      useLocalStorage("test-object", initialObject),
    );

    const newObject = { name: "updated", count: 5 };
    act(() => {
      result.current[1](newObject);
    });

    expect(result.current[0]).toEqual(newObject);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "test-object",
      JSON.stringify(newObject),
    );
  });

  it("should update counter value", () => {
    const { result } = renderHook(() => useLocalStorage("counter", 0));

    act(() => {
      result.current[1](result.current[0] + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it("should handle invalid JSON gracefully", () => {
    mockStorage["test-key"] = "invalid-json{";

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "fallback"),
    );

    expect(result.current[0]).toBe("fallback");
  });

  it("should handle localStorage errors gracefully", () => {
    // Mock localStorage.setItem to throw an error
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = vi.fn().mockImplementation(() => {
      throw new Error("Storage quota exceeded");
    });

    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("new-value");
    });

    // Should still update the state even if localStorage fails
    expect(result.current[0]).toBe("new-value");

    // Restore original implementation
    localStorage.setItem = originalSetItem;
  });
});
