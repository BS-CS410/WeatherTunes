import { useMemo } from "react";

import laNight from "../assets/LosAngelesNight.mp4";
import oregonSunset from "../assets/OregonSunset.mp4";
import hawaiiValley from "../assets/HawaiiValley.mp4";
import laSunset from "../assets/LosAngelesSunset.mp4";

const isNight = (hour: number) => hour >= 21 || hour < 5;
const isMorning = (hour: number) => hour >= 5 && hour < 11;
const isMidday = (hour: number) => hour >= 11 && hour < 18;
const isEvening = (hour: number) => hour >= 18 && hour < 21;

const getVideoForTime = () => {
  const hour: number = new Date().getHours();
  if (isNight(hour)) return laNight;
  else if (isMorning(hour)) return oregonSunset;
  else if (isMidday(hour)) return hawaiiValley;
  else if (isEvening(hour)) return laSunset;
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
