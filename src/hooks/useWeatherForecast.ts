import { useState, useEffect, useCallback } from "react";
import { useSettings } from "@/hooks/common";
import { useAuth } from "@/hooks/useAuth";
import { WeatherService } from "@/services/WeatherService";
import type { DailyForecast } from "@/services/WeatherService";

interface ForecastState {
  forecast: DailyForecast[];
  isLoading: boolean;
  error: string | null;
}

export function useWeatherForecast() {
  const { settings } = useSettings();
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<ForecastState>({
    forecast: [],
    isLoading: true,
    error: null,
  });

  const fetchForecast = useCallback(
    async (location: { lat: number; lon: number }) => {
      if (!location) return;

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const weatherService = WeatherService.getInstance();
        const forecast = await weatherService.getForecast(
          location,
          settings.temperatureUnit,
        );

        setState({
          forecast,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching forecast:", error);
        setState({
          forecast: [],
          isLoading: false,
          error: "Failed to load forecast data. Please try again later.",
        });
      }
    },
    [settings.temperatureUnit],
  );

  // Effect to handle location changes
  useEffect(() => {
    if (!isAuthenticated) return;

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchForecast({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Geolocation error:", error);
            // Default to a fallback location if geolocation is denied
            fetchForecast({ lat: 40.7128, lon: -74.006 }); // New York as fallback
          },
        );
      } else {
        // Fallback if geolocation is not supported
        fetchForecast({ lat: 40.7128, lon: -74.006 }); // New York as fallback
      }
    };

    getLocation();
  }, [fetchForecast, isAuthenticated]);

  return {
    forecast: state.forecast,
    isLoading: state.isLoading,
    error: state.error,
    refetch: fetchForecast,
  };
}
