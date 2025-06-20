import { useEffect, useState } from "react";
import { getDefaultUnitsForCountry } from "@/lib/units-utils";
import type { UnitDefaults } from "@/types/units-types";

type LocationBasedDefaults = UnitDefaults;

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
      try {
        // Try to get user's location
        if (!navigator.geolocation) {
          setLocationDefaults(getDefaultUnitsForCountry());
          setIsLoading(false);
          return;
        }

        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                resolve(pos);
              },
              (err) => {
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

        const apiKey = import.meta.env.VITE_PUBLIC_OPENWEATHER_API_KEY;

        if (!apiKey) {
          setLocationDefaults(getDefaultUnitsForCountry());
          setIsLoading(false);
          return;
        }

        // Fetch weather data to get country code
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`,
        );

        if (response.ok) {
          const data = await response.json();
          const countryCode = data.sys?.country;
          const defaults = getDefaultUnitsForCountry(countryCode);
          setLocationDefaults(defaults);
        } else {
          // Fallback to metric if API call fails
          setLocationDefaults(getDefaultUnitsForCountry());
        }
      } catch {
        // Fallback to metric units
        setLocationDefaults(getDefaultUnitsForCountry());
      } finally {
        setIsLoading(false);
      }
    }

    determineLocationDefaults();
  }, []);

  return { locationDefaults, isLoading };
}
