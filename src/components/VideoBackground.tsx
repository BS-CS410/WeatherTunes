import { useMemo } from "react";

import night from "../assets/videos/PM_1.mp4";
import morning from "../assets/videos/Sunny_AM3.mp4";
import midday from "../assets/videos/Sunny_AM2.mp4";
import evening from "../assets/videos/PM_3.mp4";

const isNight = (hour: number) => hour >= 21 || hour < 5;
const isMorning = (hour: number) => hour >= 5 && hour < 11;
const isMidday = (hour: number) => hour >= 11 && hour < 18;
const isEvening = (hour: number) => hour >= 18 && hour < 21;

const getVideoForTime = () => {
  const hour: number = new Date().getHours();
  if (isNight(hour)) return night;
  else if (isMorning(hour)) return morning;
  else if (isMidday(hour)) return midday;
  else if (isEvening(hour)) return evening;
};

export function VideoBackground() {
  const video = useMemo(getVideoForTime, []);
  return (
    <video
      className="fixed top-0 left-0 -z-10 h-full w-full object-cover"
      src={video}
      autoPlay
      loop
      muted
      playsInline
    />
  );
}
