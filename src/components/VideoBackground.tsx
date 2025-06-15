import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import type { TimePeriod } from "@/lib/utils";
import type { WeatherType } from "@/types/weather";

// Video imports organized by weather type and time period
import clearNight from "../assets/videos/clear_night.mp4";
import clearMorning from "../assets/videos/clear_morning.mp4";
import clearDay from "../assets/videos/clear_day.mp4";
import clearEvening from "../assets/videos/clear_evening.mp4";

import rainNight from "../assets/videos/rain_night.mp4";
import rainMorning from "../assets/videos/rain_morning.mp4";
import rainDay from "../assets/videos/rain_day.mp4";
import rainEvening from "../assets/videos/rain_evening.mp4";

import snowNight from "../assets/videos/snow_night.mp4";
import snowMorning from "../assets/videos/snow_morning.mp4";
import snowDay from "../assets/videos/snow_day.mp4";
import snowEvening from "../assets/videos/snow_evening.mp4";

import fogNight from "../assets/videos/fog_night.mp4";
import fogMorning from "../assets/videos/fog_morning.mp4";
import fogDay from "../assets/videos/fog_day.mp4";
import fogEvening from "../assets/videos/fog_evening.mp4";

import cloudyNight from "../assets/videos/cloudy_night.mp4";
import cloudyMorning from "../assets/videos/cloudy_morning.mp4";
import cloudyDay from "../assets/videos/cloudy_day.mp4";
import cloudyEvening from "../assets/videos/cloudy_evening.mp4";

interface VideoBackgroundProps {
  condition?: string; // e.g., "Clear", "Rain", "Clouds"
  timePeriod?: TimePeriod | null;
}

// Video mapping for easy lookup
const videoMap: Record<WeatherType, Record<TimePeriod, string>> = {
  clear: {
    night: clearNight,
    morning: clearMorning,
    day: clearDay,
    evening: clearEvening,
  },
  rain: {
    night: rainNight,
    morning: rainMorning,
    day: rainDay,
    evening: rainEvening,
  },
  snow: {
    night: snowNight,
    morning: snowMorning,
    day: snowDay,
    evening: snowEvening,
  },
  fog: {
    night: fogNight,
    morning: fogMorning,
    day: fogDay,
    evening: fogEvening,
  },
  cloudy: {
    night: cloudyNight,
    morning: cloudyMorning,
    day: cloudyDay,
    evening: cloudyEvening,
  },
};

// Determine weather type from condition string
function getWeatherType(condition?: string): WeatherType {
  if (!condition) return "clear"; // Default if no condition

  const lowerCaseCondition = condition.toLowerCase();

  // Debug logging to see what we're getting
  console.log("Weather Type Debug:", {
    lowerCaseCondition,
  });

  if (
    ["thunderstorm", "rain", "drizzle"].some((c) =>
      lowerCaseCondition.includes(c),
    )
  )
    return "rain";
  if (lowerCaseCondition.includes("snow")) return "snow";
  if (["mist", "fog"].some((c) => lowerCaseCondition.includes(c))) return "fog";
  if (lowerCaseCondition.includes("clouds")) return "cloudy";
  // We can add other conditions as needed, e.g., "smoke", "haze", "dust", "sand", "ash", "tornado"
  // For now, we default to "clear" for "clear" or any unhandled conditions
  if (lowerCaseCondition.includes("clear")) return "clear";

  return "clear"; // Default for any other unhandled conditions
}

// Main function to get video for current weather and time
const getVideoForWeatherAndTime = (
  condition?: string,
  period?: TimePeriod | null,
): string => {
  // If period is not provided, default to "day" to ensure consistency
  // MainPage should always provide the calculated period
  const currentPeriod = period || "day"; // Simple fallback - MainPage should provide period
  const weatherType = getWeatherType(condition);

  console.log("Video Selection:", {
    period: currentPeriod,
    weatherType,
    selectedVideo: videoMap[weatherType]?.[currentPeriod],
    hasCondition: !!condition,
  });

  return videoMap[weatherType]?.[currentPeriod] || videoMap.clear.day; // Fallback to clear day video
};

export function VideoBackground({
  condition,
  timePeriod,
}: VideoBackgroundProps) {
  const video = useMemo(
    () => getVideoForWeatherAndTime(condition, timePeriod),
    [condition, timePeriod], // Dependencies are now condition and timePeriod
  );

  const [currentSrc, setCurrentSrc] = useState(video);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fade, setFade] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video changes with transition
  useEffect(() => {
    if (video === currentSrc) return;
    setIsTransitioning(true);
    const preloadVideo = document.createElement("video");
    preloadVideo.src = video;
    preloadVideo.preload = "auto";
    const handleCanPlay = () => {
      setTimeout(() => {
        setCurrentSrc(video);
        setTimeout(() => setIsTransitioning(false), 400);
      }, 50);
    };
    preloadVideo.addEventListener("canplaythrough", handleCanPlay);
    return () => {
      preloadVideo.removeEventListener("canplaythrough", handleCanPlay);
      preloadVideo.src = "";
    };
  }, [video, currentSrc]);

  // Fade out/in at loop point for subtle looping
  const handleTimeUpdate = useCallback(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !videoEl.duration) return;
    if (videoEl.currentTime > videoEl.duration - 0.25) {
      setFade(true);
    } else if (fade && videoEl.currentTime < 0.25) {
      setFade(false);
    }
  }, [fade]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    videoEl.addEventListener("timeupdate", handleTimeUpdate);
    return () => videoEl.removeEventListener("timeupdate", handleTimeUpdate);
  }, [currentSrc, handleTimeUpdate]);

  return (
    <>
      {/* Background to prevent flashes */}
      <div className="fixed inset-0 -z-20 bg-neutral-800" />

      {/* Main video */}
      <video
        ref={videoRef}
        className={`fixed inset-0 -z-10 h-full w-full object-cover transition-opacity duration-700 ${
          isTransitioning || fade ? "opacity-0" : "opacity-100"
        }`}
        src={currentSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{ pointerEvents: "none" }}
      />
    </>
  );
}
