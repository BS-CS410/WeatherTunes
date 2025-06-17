import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import type { TimePeriod } from "@/lib/utils";
import { getVideoSource } from "@/lib/videoMapping";

interface VideoBackgroundProps {
  condition?: string;
  timePeriod?: TimePeriod | null;
}

/**
 * Optimized video background component with smooth transitions
 * Handles video loading, transitions, and performance optimization
 */
export function VideoBackground({
  condition,
  timePeriod,
}: VideoBackgroundProps) {
  const videoSrc = useMemo(
    () => getVideoSource(condition, timePeriod),
    [condition, timePeriod],
  );

  const [currentSrc, setCurrentSrc] = useState(videoSrc);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fade, setFade] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video source changes with smooth transitions
  useEffect(() => {
    if (videoSrc === currentSrc) return;

    setIsTransitioning(true);
    setFade(true);

    const timer = setTimeout(() => {
      setCurrentSrc(videoSrc);
      setFade(false);
      setIsTransitioning(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [videoSrc, currentSrc]);

  // Optimize video playback performance
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // Preload near end to ensure smooth loop
    if (video.duration - video.currentTime < 2) {
      video.load();
    }
  }, []);

  // Setup video event listeners for optimization
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadeddata", () => {
      if (video.paused) {
        video.play().catch(console.error);
      }
    });

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [handleTimeUpdate]);

  return (
    <div className="fixed inset-0 -z-10">
      <video
        ref={videoRef}
        key={currentSrc}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          fade ? "opacity-0" : "opacity-100"
        }`}
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
