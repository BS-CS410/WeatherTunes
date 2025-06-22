import { useRef, useEffect } from "react";
import { useWeatherBackground } from "@/hooks/useWeatherBackground";
import type { TimePeriod } from "@/lib";

interface VideoBackgroundProps {
  condition?: string;
  timePeriod?: TimePeriod | null;
}

/**
 * Optimized video background component with smooth transitions
 * Handles video loading, transitions, and performance optimization
 */
export function WeatherBackground({
  condition,
  timePeriod,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { currentSrc, isTransitioning, setupVideo } = useWeatherBackground({
    condition,
    timePeriod,
  });

  // Setup video element with event listeners
  useEffect(() => {
    return setupVideo(videoRef.current);
  }, [setupVideo]);

  return (
    <div className="fixed inset-0 -z-10">
      <video
        ref={videoRef}
        key={currentSrc}
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src={currentSrc} type="video/mp4" />
        <track kind="captions" />
      </video>

      {/* Loading overlay during transitions */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-black/20 transition-opacity duration-300" />
      )}
    </div>
  );
}
