import { useState, useEffect, useCallback } from "react";
import { WeatherService } from "@/services/WeatherService";
import type { TimePeriod } from "@/lib";

interface UseWeatherBackgroundProps {
  condition?: string;
  timePeriod?: TimePeriod | null;
}

export function useWeatherBackground({
  condition,
  timePeriod,
}: UseWeatherBackgroundProps = {}) {
  const [currentSrc, setCurrentSrc] = useState<string>("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const weatherService = WeatherService.getInstance();

  // Get the appropriate video source based on condition and time period
  const getVideoSource = useCallback(() => {
    return weatherService.getVideoSource(condition, timePeriod);
  }, [condition, timePeriod, weatherService]);

  // Handle video source changes with smooth transitions
  useEffect(() => {
    const newSrc = getVideoSource();

    // If source hasn't changed, do nothing
    if (newSrc === currentSrc) return;

    // If we don't have a source yet, set it immediately
    if (!currentSrc) {
      setCurrentSrc(newSrc);
      return;
    }

    // Otherwise, trigger a transition
    setIsTransitioning(true);

    const timer = setTimeout(() => {
      setCurrentSrc(newSrc);
      setIsTransitioning(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [condition, timePeriod, currentSrc, getVideoSource]);

  // Optimize video playback performance
  const handleTimeUpdate = useCallback((video: HTMLVideoElement) => {
    // Preload near end to ensure smooth loop
    if (video.duration - video.currentTime < 2) {
      video.load();
    }
  }, []);

  // Setup video event listeners for optimization
  const setupVideo = useCallback(
    (video: HTMLVideoElement | null) => {
      if (!video) return () => {};

      const timeUpdateHandler = () => handleTimeUpdate(video);
      const loadedDataHandler = () => {
        if (video.paused) {
          video.play().catch(console.error);
        }
      };

      video.addEventListener("timeupdate", timeUpdateHandler);
      video.addEventListener("loadeddata", loadedDataHandler);

      return () => {
        video.removeEventListener("timeupdate", timeUpdateHandler);
        video.removeEventListener("loadeddata", loadedDataHandler);
      };
    },
    [handleTimeUpdate],
  );

  return {
    currentSrc,
    isTransitioning,
    setupVideo,
  };
}
