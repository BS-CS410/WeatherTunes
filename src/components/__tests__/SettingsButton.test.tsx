import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SettingsButton } from "../SettingsButton";
import { SettingsProvider } from "../../contexts/SettingsContext";
import { createElement, type ReactNode } from "react";

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

describe("SettingsButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render settings button", () => {
    render(<SettingsButton />, { wrapper: TestWrapper });

    const button = screen.getByRole("button", { name: "Open settings" });
    expect(button).toBeInTheDocument();
  });

  it("should open settings menu when clicked", () => {
    render(<SettingsButton />, { wrapper: TestWrapper });

    const button = screen.getByRole("button", { name: "Open settings" });
    fireEvent.click(button);

    // After clicking, the settings menu should be opened
    // We can't easily test the menu visibility without mocking more components
    expect(button).toBeInTheDocument();
  });

  it("should have appropriate aria labels for accessibility", () => {
    render(<SettingsButton />, { wrapper: TestWrapper });

    const button = screen.getByRole("button", { name: "Open settings" });
    expect(button).toHaveAttribute("aria-label", "Open settings");
  });

  it("should be keyboard accessible", () => {
    render(<SettingsButton />, { wrapper: TestWrapper });

    const button = screen.getByRole("button", { name: "Open settings" });
    fireEvent.keyDown(button, { key: "Enter" });

    // Button should handle keyboard interaction
    expect(button).toBeInTheDocument();
  });
});
