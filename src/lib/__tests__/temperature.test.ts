import { describe, it, expect } from "vitest";
import {
  formatTemperature,
  kelvinToCelsius,
  kelvinToFahrenheit,
} from "../temperature";

describe("temperature utilities", () => {
  it("should format kelvin temperature to kelvin", () => {
    expect(formatTemperature(293.15, "K")).toBe("293");
  });

  it("should format kelvin temperature to celsius", () => {
    expect(formatTemperature(293.15, "C")).toBe("20");
  });

  it("should format kelvin temperature to fahrenheit", () => {
    expect(formatTemperature(293.15, "F")).toBe("68");
  });

  it("should handle zero kelvin", () => {
    expect(formatTemperature(0, "K")).toBe("0");
    expect(formatTemperature(0, "C")).toBe("-273");
  });

  it("should handle decimal temperatures", () => {
    expect(formatTemperature(293.7, "C")).toBe("21");
    expect(formatTemperature(293.3, "C")).toBe("20");
  });

  it("should convert kelvin to celsius correctly", () => {
    expect(kelvinToCelsius(273.15)).toBe(0);
    expect(kelvinToCelsius(373.15)).toBe(100);
  });

  it("should convert kelvin to fahrenheit correctly", () => {
    expect(kelvinToFahrenheit(273.15)).toBe(32);
    expect(kelvinToFahrenheit(373.15)).toBe(212);
  });
});
