import { describe, it, expect } from "vitest";
import {
  formatTemperature,
  fahrenheitToCelsius,
  celsiusToFahrenheit,
} from "../temperature";

describe("temperature utilities", () => {
  it("should format celsius temperature to celsius", () => {
    expect(formatTemperature(20, "C", "C")).toBe("20");
  });

  it("should format fahrenheit temperature to fahrenheit", () => {
    expect(formatTemperature(68, "F", "F")).toBe("68");
  });

  it("should convert celsius to fahrenheit", () => {
    expect(formatTemperature(20, "C", "F")).toBe("68");
  });

  it("should convert fahrenheit to celsius", () => {
    expect(formatTemperature(68, "F", "C")).toBe("20");
  });

  it("should handle zero temperature", () => {
    expect(formatTemperature(0, "C", "C")).toBe("0");
  });

  it("should handle negative temperature", () => {
    expect(formatTemperature(-5, "C", "C")).toBe("-5");
  });

  it("should round decimal temperatures", () => {
    expect(formatTemperature(20.7, "C", "C")).toBe("21");
    expect(formatTemperature(20.3, "C", "C")).toBe("20");
  });

  it("should convert celsius to fahrenheit correctly", () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
    expect(celsiusToFahrenheit(100)).toBe(212);
  });

  it("should convert fahrenheit to celsius correctly", () => {
    expect(fahrenheitToCelsius(32)).toBe(0);
    expect(fahrenheitToCelsius(212)).toBe(100);
  });
});
