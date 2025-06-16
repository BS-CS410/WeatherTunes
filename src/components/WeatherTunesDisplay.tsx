import React, { useRef, useEffect, useState } from "react";
import { SunriseIcon, SunsetIcon } from "@/components/icons";
import type { WeatherDisplayData } from "@/types/weather";

interface WeatherTunesDisplayProps {
  weatherData: WeatherDisplayData;
  songTitle?: string;
  artistName?: string;
  albumArtUrl?: string;
}

/**
 * Integrated weather and music display component using 2x1 grid layout
 * Each section completely fills its grid cell for perfect proportions
 */
const WeatherTunesDisplay: React.FC<WeatherTunesDisplayProps> = ({
  weatherData,
  songTitle = "Song Title",
  artistName = "Artist Name",
  albumArtUrl = "https://via.placeholder.com/150",
}) => {
  const conditionRef = useRef<HTMLSpanElement>(null);
  const [conditionTextSize, setConditionTextSize] = useState(
    "text-[clamp(1.5rem,4vw,2.8rem)]",
  );

  const {
    location = "Loading...",
    temperature = "--",
    condition = "Loading...",
    unit = "°",
    sunrise = "--",
    sunset = "--",
  } = weatherData || {};

  // Intelligent condition text sizing based on content length
  useEffect(() => {
    const length = condition.length;

    let newTextSize: string;
    if (length <= 8) {
      newTextSize = "text-[clamp(2.2rem,6vw,4rem)]";
    } else if (length <= 15) {
      newTextSize = "text-[clamp(1.8rem,5vw,3.2rem)]";
    } else if (length <= 25) {
      newTextSize = "text-[clamp(1.5rem,4.2vw,2.8rem)]";
    } else {
      newTextSize = "text-[clamp(1.2rem,3.8vw,2.4rem)]";
    }

    setConditionTextSize(newTextSize);
  }, [condition]);

  return (
    <div className="grid aspect-[2/1] h-full w-full grid-cols-2 grid-rows-1">
      {/* Weather Section - Left Grid Cell */}
      <section className="group flex h-full w-full transform flex-col items-start justify-center py-4 pr-2 pl-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02]">
        {/* Location */}
        <h1 className="font-inter-tight mb-[clamp(-0.8rem,-1.6vw,-1.76rem)] w-full text-left text-[clamp(1rem,4vw,2.2rem)] font-semibold tracking-wider text-gray-900 uppercase group-hover:text-gray-800 dark:text-slate-200 dark:group-hover:text-slate-100">
          {location}
        </h1>

        {/* Temperature */}
        <div className="font-inter-tight my-[clamp(0.2rem,0.8vw,1.76rem)] mb-[clamp(0.1rem,0.4vw,0.88rem)] -ml-[clamp(0.1rem,0.4vw,0.88rem)] w-full text-left text-[clamp(4rem,16vw,8.8rem)] leading-[0.85] font-bold text-gray-900 drop-shadow-lg group-hover:drop-shadow-xl dark:text-cyan-50">
          {temperature}
          <span className="align-super text-[clamp(2rem,8vw,4.4rem)]">°</span>
        </div>

        {/* Condition */}
        <span
          ref={conditionRef}
          className={`font-inter-tight mb-[clamp(0.1rem,0.4vw,0.88rem)] w-full text-left text-[clamp(1.2rem,5vw,2.8rem)] leading-[0.9] font-extralight tracking-tighter text-gray-800 lowercase dark:text-cyan-100`}
        >
          {condition}
        </span>

        {/* Sunrise/Sunset */}
        <div className="font-inter-tight mt-[clamp(0.1rem,0.4vw,0.88rem)] w-full max-w-full overflow-hidden text-left text-[clamp(0.7rem,2vw,1.4rem)] font-light tracking-tight text-ellipsis whitespace-nowrap">
          <span className="inline-flex items-center text-gray-700 hover:-translate-y-0.5 hover:scale-105 dark:text-cyan-200">
            <SunriseIcon className="mr-2 h-[clamp(0.9rem,2.5vw,1.6rem)] w-[clamp(0.9rem,2.5vw,1.6rem)]" />
            {sunrise}
          </span>
          <span className="mx-2 text-gray-500 dark:text-cyan-300">|</span>
          <span className="inline-flex items-center text-gray-800 hover:-translate-y-0.5 hover:scale-105 dark:text-cyan-300">
            <SunsetIcon className="mr-2 h-[clamp(0.9rem,2.5vw,1.6rem)] w-[clamp(0.9rem,2.5vw,1.6rem)]" />
            {sunset}
          </span>
        </div>
      </section>

      {/* Music Section - Right Grid Cell */}
      <section className="group flex h-full w-full transform flex-col items-center justify-center p-[clamp(0.3rem,1vw,1.2rem)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02]">
        {/* Album Art */}
        <div className="group/album relative mb-3 h-[clamp(8rem,28vw,12rem)] w-[clamp(8rem,28vw,12rem)] transition-all duration-300 ease-out">
          <img
            src={albumArtUrl}
            alt={`${songTitle} album art`}
            className="h-full w-full rounded-lg object-cover shadow-lg transition-all duration-300 ease-out group-hover/album:-translate-y-2 group-hover/album:scale-110 group-hover/album:shadow-2xl"
          />
        </div>

        {/* Song Information */}
        <div className="w-full text-center transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105">
          <h2 className="truncate text-[clamp(1.1rem,3.5vw,2.2rem)] leading-tight font-semibold text-gray-900 transition-colors duration-300 ease-out group-hover:text-gray-800 dark:text-slate-200 dark:group-hover:text-slate-100">
            {songTitle}
          </h2>

          <p className="mt-1 truncate text-[clamp(0.95rem,2.5vw,1.5rem)] leading-snug text-gray-700 transition-colors duration-300 ease-out group-hover:text-gray-600 dark:text-slate-400 dark:group-hover:text-slate-300">
            {artistName}
          </p>
        </div>
      </section>
    </div>
  );
};

export default WeatherTunesDisplay;
