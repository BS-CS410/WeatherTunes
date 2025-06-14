import { useMemo, useState, useEffect } from "react";

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

// Weather condition types from OpenWeatherMap API
interface WeatherConditions {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    main: string;
    description: string;
    id: number;
  }[];
  wind?: {
    speed: number;
  };
  clouds?: {
    all: number;
  };
  visibility?: number;
  sys: {
    sunrise: number;
    sunset: number;
  };
}

interface VideoBackgroundProps {
  weatherConditions?: WeatherConditions | null;
}

type TimePeriod = "night" | "morning" | "day" | "evening";
type WeatherType = "clear" | "rain" | "snow" | "fog" | "cloudy";

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

// Unified time period calculation
function getTimePeriod(
  weatherConditions?: WeatherConditions | null,
): TimePeriod {
  const now = new Date();

  // If we have weather data with sunrise/sunset, use dynamic calculation
  if (weatherConditions?.sys?.sunrise && weatherConditions?.sys?.sunset) {
    const nowUtcSec = Math.floor(now.getTime() / 1000);
    const { sunrise, sunset } = weatherConditions.sys;
    const dayLength = sunset - sunrise;
    const morningEnd = sunrise + dayLength / 3;
    const dayEnd = sunrise + (2 * dayLength) / 3;

    if (nowUtcSec < sunrise || nowUtcSec >= sunset) return "night";
    if (nowUtcSec < morningEnd) return "morning";
    if (nowUtcSec < dayEnd) return "day";
    return "evening";
  }

  // Fallback to local hour-based calculation
  const hour = now.getHours();
  if (hour >= 21 || hour < 5) return "night";
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 18) return "day";
  return "evening";
}

// Determine weather type from conditions
function getWeatherType(
  weatherConditions?: WeatherConditions | null,
): WeatherType {
  if (!weatherConditions?.weather?.[0]) return "clear";

  const weatherMain = weatherConditions.weather[0].main.toLowerCase();

  // Debug logging to see what we're getting
  console.log("Weather Debug:", {
    weatherMain,
    fullWeather: weatherConditions.weather[0],
  });

  if (["thunderstorm", "rain", "drizzle"].includes(weatherMain)) return "rain";
  if (weatherMain === "snow") return "snow";
  if (["mist", "fog"].includes(weatherMain)) return "fog";
  if (weatherMain === "clouds") return "cloudy";

  return "clear"; // Default for clear skies
}

// Main function to get video for current weather and time
const getVideoForWeatherAndTime = (
  weatherConditions?: WeatherConditions | null,
): string => {
  const period = getTimePeriod(weatherConditions);
  const weatherType = getWeatherType(weatherConditions);

  console.log("Video Selection:", {
    period,
    weatherType,
    selectedVideo: videoMap[weatherType][period],
    hasWeatherData: !!weatherConditions,
  });

  return videoMap[weatherType][period];
};

export function VideoBackground({ weatherConditions }: VideoBackgroundProps) {
  const video = useMemo(
    () => getVideoForWeatherAndTime(weatherConditions),
    [weatherConditions],
  );

  const [currentSrc, setCurrentSrc] = useState(video);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mountComplete, setMountComplete] = useState(false);

  // Mark mount as complete after first render
  useEffect(() => {
    setMountComplete(true);
  }, []);

  // Handle video changes
  useEffect(() => {
    // Update current source to match video on initial mount without transition
    if (!mountComplete) {
      setCurrentSrc(video);
      return;
    }

    // Skip if video hasn't changed
    if (video === currentSrc) return;

    setIsTransitioning(true);

    // Preload new video
    const preloadVideo = document.createElement("video");
    preloadVideo.src = video;
    preloadVideo.preload = "auto";

    const handleCanPlay = () => {
      // Switch to new video after preload
      setTimeout(() => {
        setCurrentSrc(video);
        setTimeout(() => setIsTransitioning(false), 400);
      }, 50);
    };

    preloadVideo.addEventListener("canplaythrough", handleCanPlay);

    // Cleanup
    return () => {
      preloadVideo.removeEventListener("canplaythrough", handleCanPlay);
      preloadVideo.src = "";
    };
  }, [video, currentSrc, mountComplete]);

  return (
    <>
      {/* Background to prevent flashes */}
      <div className="fixed inset-0 -z-20 bg-neutral-800" />

      {/* Main video */}
      <video
        className={`fixed inset-0 -z-10 h-full w-full object-cover transition-opacity duration-500 ${
          isTransitioning ? "opacity-0" : "opacity-100"
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
