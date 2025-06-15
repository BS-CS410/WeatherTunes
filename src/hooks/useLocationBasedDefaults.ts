import { useEffect, useState } from "react";
import { getDefaultUnitsForCountry } from "@/lib/units";

type TemperatureUnit = "F" | "C";
type SpeedUnit = "mph" | "kmh" | "ms";

interface LocationBasedDefaults {
  temperatureUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
}

/**
 * Hook to determine default units based on user's location
 * This hook will try to get the user's country from their geolocation
 * and return appropriate default units
 */
export function useLocationBasedDefaults(): {
  locationDefaults: LocationBasedDefaults | null;
  isLoading: boolean;
} {
  const [locationDefaults, setLocationDefaults] =
    useState<LocationBasedDefaults | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function determineLocationDefaults() {
      console.log("🔍 Starting location-based unit detection...");

      try {
        // Try to get user's location
        if (!navigator.geolocation) {
          console.log("❌ No geolocation support, using metric defaults");
          setLocationDefaults(getDefaultUnitsForCountry());
          setIsLoading(false);
          return;
        }

        console.log("📍 Requesting geolocation permission...");
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                console.log("✅ Geolocation permission granted");
                resolve(pos);
              },
              (err) => {
                console.log("❌ Geolocation error:", err.message);
                reject(err);
              },
              {
                timeout: 10000,
                enableHighAccuracy: false,
                maximumAge: 300000, // 5 minutes
              },
            );
          },
        );

        // Use reverse geocoding to get country from coordinates
        const { latitude, longitude } = position.coords;
        console.log(`📍 Got coordinates: ${latitude}, ${longitude}`);

        const apiKey = import.meta.env.VITE_PUBLIC_OPENWEATHER_API_KEY;

        if (!apiKey) {
          console.log("❌ No API key available, using metric defaults");
          setLocationDefaults(getDefaultUnitsForCountry());
          setIsLoading(false);
          return;
        }

        console.log("🌤️ Fetching weather data to get country code...");
        // Fetch weather data to get country code
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`,
        );

        if (response.ok) {
          const data = await response.json();
          const countryCode = data.sys?.country;
          console.log(`🏴 Detected country: ${countryCode}`);
          const defaults = getDefaultUnitsForCountry(countryCode);
          console.log(`⚙️ Setting default units:`, defaults);
          setLocationDefaults(defaults);
        } else {
          console.log(
            "❌ Weather API call failed:",
            response.status,
            response.statusText,
          );
          // Fallback to metric if API call fails
          setLocationDefaults(getDefaultUnitsForCountry());
        }
      } catch (error) {
        console.log(
          "❌ Could not determine location-based defaults, using metric:",
          error,
        );
        // Fallback to metric units
        setLocationDefaults(getDefaultUnitsForCountry());
      } finally {
        console.log("✅ Location detection complete");
        setIsLoading(false);
      }
    }

    determineLocationDefaults();
  }, []);

  return { locationDefaults, isLoading };
}
