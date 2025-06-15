/**
 * Utility functions for handling measurement units based on location
 */

type TemperatureUnit = "F" | "C";
type SpeedUnit = "mph" | "kmh" | "ms";

interface UnitDefaults {
  temperatureUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
}

/**
 * Countries that primarily use imperial (Fahrenheit) system
 * Based on common usage patterns
 */
const IMPERIAL_COUNTRIES = new Set([
  "US", // United States
  "BS", // Bahamas
  "BZ", // Belize
  "KY", // Cayman Islands
  "LR", // Liberia
  "PW", // Palau
  "FM", // Federated States of Micronesia
  "MH", // Marshall Islands
]);

/**
 * Determines the default units based on the country code
 * @param countryCode - ISO 3166-1 alpha-2 country code (e.g., 'US', 'CA', 'GB')
 * @returns Default units configuration for the country
 */
export function getDefaultUnitsForCountry(countryCode?: string): UnitDefaults {
  // Default to metric if no country code provided
  if (!countryCode) {
    console.log("No country code provided, defaulting to metric");
    return {
      temperatureUnit: "C",
      speedUnit: "kmh",
    };
  }

  const isImperialCountry = IMPERIAL_COUNTRIES.has(countryCode.toUpperCase());
  console.log(
    `Country ${countryCode} uses ${isImperialCountry ? "imperial" : "metric"} units`,
  );

  return {
    temperatureUnit: isImperialCountry ? "F" : "C",
    speedUnit: isImperialCountry ? "mph" : "kmh",
  };
}

/**
 * Checks if a country primarily uses imperial units
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns true if the country uses imperial units
 */
export function isImperialCountry(countryCode?: string): boolean {
  if (!countryCode) return false;
  return IMPERIAL_COUNTRIES.has(countryCode.toUpperCase());
}

/**
 * Test function to verify country code to unit mappings
 * This can be called from browser console for testing
 */
export function testCountryUnits() {
  const testCases = [
    "US", // Should be imperial
    "CA", // Should be metric
    "GB", // Should be metric
    "DE", // Should be metric
    "BS", // Should be imperial (Bahamas)
    "LR", // Should be imperial (Liberia)
    undefined, // Should be metric (default)
  ];

  console.log("Testing country unit mappings:");
  testCases.forEach((country) => {
    const units = getDefaultUnitsForCountry(country);
    console.log(
      `${country || "undefined"}: ${units.temperatureUnit}°, ${units.speedUnit}`,
    );
  });
}

/**
 * Test function to simulate location-based defaults with a specific country
 * Usage: simulateCountryDefaults('US')
 */
export function simulateCountryDefaults(countryCode: string) {
  console.log(`Simulating defaults for country: ${countryCode}`);
  const defaults = getDefaultUnitsForCountry(countryCode);
  console.log(`Would set defaults to:`, defaults);

  // You can manually apply these by calling:
  console.log(`To apply manually, run:`);
  console.log(`localStorage.removeItem('temperatureUnit')`);
  console.log(`localStorage.removeItem('speedUnit')`);
  console.log(`Then reload the page`);

  return defaults;
}

/**
 * Force apply location defaults for testing
 * Call this from browser console: window.forceApplyDefaults('US')
 */
export function forceApplyLocationDefaults(countryCode: string) {
  console.log(`🧪 Force applying defaults for ${countryCode}`);
  const defaults = getDefaultUnitsForCountry(countryCode);

  // Clear existing preferences
  localStorage.removeItem("temperatureUnit");
  localStorage.removeItem("speedUnit");

  console.log(`Applied defaults:`, defaults);
  console.log(`Reload the page to see the changes`);

  return defaults;
}

// Expose to window for testing (only in development)
if (typeof window !== "undefined" && import.meta.env.DEV) {
  (
    window as unknown as {
      testCountryUnits: typeof testCountryUnits;
      simulateCountryDefaults: typeof simulateCountryDefaults;
      forceApplyLocationDefaults: typeof forceApplyLocationDefaults;
    }
  ).testCountryUnits = testCountryUnits;
  (
    window as unknown as {
      testCountryUnits: typeof testCountryUnits;
      simulateCountryDefaults: typeof simulateCountryDefaults;
      forceApplyLocationDefaults: typeof forceApplyLocationDefaults;
    }
  ).simulateCountryDefaults = simulateCountryDefaults;
  (
    window as unknown as {
      testCountryUnits: typeof testCountryUnits;
      simulateCountryDefaults: typeof simulateCountryDefaults;
      forceApplyLocationDefaults: typeof forceApplyLocationDefaults;
    }
  ).forceApplyLocationDefaults = forceApplyLocationDefaults;
}
