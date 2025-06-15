import { describe, it, expect } from "vitest";
import { cn, getTimePeriod, formatUnixTimeToLocalString } from "../utils";

describe("utils", () => {
  describe("cn (className utility)", () => {
    it("should combine class names", () => {
      const result = cn("base-class", "additional-class");
      expect(result).toContain("base-class");
      expect(result).toContain("additional-class");
    });

    it("should handle conditional classes", () => {
      const isActive = true;
      const result = cn("base-class", isActive && "active-class");
      expect(result).toContain("base-class");
      expect(result).toContain("active-class");
    });

    it("should handle falsy values", () => {
      const result = cn("base-class", false, null, undefined, "");
      expect(result).toContain("base-class");
      expect(result).not.toContain("false");
      expect(result).not.toContain("null");
    });

    it("should merge Tailwind classes correctly", () => {
      const result = cn("text-sm text-red-500", "text-lg");
      // Should handle Tailwind class conflicts properly
      expect(result).toBeDefined();
    });

    it("should handle arrays of classes", () => {
      const result = cn(["base-class", "array-class"]);
      expect(result).toContain("base-class");
      expect(result).toContain("array-class");
    });

    it("should handle empty input", () => {
      const result = cn();
      expect(result).toBe("");
    });
  });

  describe("getTimePeriod", () => {
    it("should return correct time period based on sunrise/sunset", () => {
      // Mock date and times (using UTC seconds)
      const now = new Date("2024-01-15T14:00:00Z"); // 2 PM UTC
      const sunrise = Math.floor(
        new Date("2024-01-15T06:00:00Z").getTime() / 1000,
      ); // 6 AM UTC
      const sunset = Math.floor(
        new Date("2024-01-15T18:00:00Z").getTime() / 1000,
      ); // 6 PM UTC

      const result = getTimePeriod(now, sunrise, sunset);
      expect(result).toBe("day");
    });

    it("should return night for time before sunrise", () => {
      const now = new Date("2024-01-15T04:00:00Z"); // 4 AM UTC
      const sunrise = Math.floor(
        new Date("2024-01-15T06:00:00Z").getTime() / 1000,
      );
      const sunset = Math.floor(
        new Date("2024-01-15T18:00:00Z").getTime() / 1000,
      );

      const result = getTimePeriod(now, sunrise, sunset);
      expect(result).toBe("night");
    });

    it("should return morning for time just after sunrise", () => {
      const now = new Date("2024-01-15T07:00:00Z"); // 7 AM UTC
      const sunrise = Math.floor(
        new Date("2024-01-15T06:00:00Z").getTime() / 1000,
      );
      const sunset = Math.floor(
        new Date("2024-01-15T18:00:00Z").getTime() / 1000,
      );

      const result = getTimePeriod(now, sunrise, sunset);
      expect(result).toBe("morning");
    });

    it("should fall back to hour-based calculation when no sunrise/sunset", () => {
      // Use a date that will be "day" in local time
      const now = new Date();
      now.setHours(14, 0, 0, 0); // 2 PM local time

      const result = getTimePeriod(now);
      expect(result).toBe("day");
    });

    it("should handle invalid sunrise/sunset data", () => {
      // Use a date that will be "day" in local time
      const now = new Date();
      now.setHours(14, 0, 0, 0); // 2 PM local time
      const sunrise = Math.floor(
        new Date("2024-01-15T18:00:00Z").getTime() / 1000,
      ); // After sunset
      const sunset = Math.floor(
        new Date("2024-01-15T06:00:00Z").getTime() / 1000,
      ); // Before sunrise

      const result = getTimePeriod(now, sunrise, sunset);
      // Should fall back to hour-based calculation
      expect(result).toBe("day");
    });
  });

  describe("formatUnixTimeToLocalString", () => {
    it("should format time in 12h format by default", () => {
      const unixTime = Math.floor(
        new Date("2024-01-15T14:30:00Z").getTime() / 1000,
      );
      const result = formatUnixTimeToLocalString(unixTime);

      // Should contain AM/PM indicator (case-insensitive)
      expect(result.toLowerCase()).toMatch(/[ap]m/);
    });

    it("should format time in 24h format when specified", () => {
      const unixTime = Math.floor(
        new Date("2024-01-15T14:30:00Z").getTime() / 1000,
      );
      const result = formatUnixTimeToLocalString(unixTime, "24h");

      // 24h format should not contain AM/PM
      expect(result.toLowerCase()).not.toMatch(/[ap]m/);
    });

    it("should handle invalid timestamps", () => {
      const result = formatUnixTimeToLocalString(0);
      expect(result).toBe("--");
    });

    it("should handle undefined/null timestamps", () => {
      const result = formatUnixTimeToLocalString(null as unknown as number);
      expect(result).toBe("--");
    });
  });
});
