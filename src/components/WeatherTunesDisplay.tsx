import React from "react";
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
  const {
    location = "Loading...",
    temperature = "--",
    condition = "Loading...",
    sunrise = "--",
    sunset = "--",
  } = weatherData || {};

  // Common classes for reuse
  const sectionClasses =
    "group flex h-full w-full transform transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02]";
  const textHoverClasses =
    "group-hover:text-gray-800 dark:text-slate-200 dark:group-hover:text-slate-100";
  const sunTimeClasses =
    "inline-flex items-center hover:-translate-y-0.5 hover:scale-105";

  return (
    <div className="grid aspect-[2/1] h-full w-full grid-cols-2 grid-rows-1 text-[clamp(1rem,3.5vw,1.6rem)]">
      {/* Weather Section - Left Grid Cell */}
      <section
        className={`${sectionClasses} flex-col items-start justify-center py-[0.25em] pr-[0.125em] pl-[0.5em]`}
      >
        {/* Location */}
        <h1
          className={`font-inter-tight mb-[-0.5em] w-full text-left text-[1em] font-semibold tracking-wider text-gray-900 uppercase ${textHoverClasses}`}
        >
          {location}
        </h1>

        {/* Temperature */}
        <div className="font-inter-tight my-[0.3em] mb-[0.1em] -ml-[0.4em] w-full text-left text-[5em] leading-[0.85] font-bold text-gray-900 drop-shadow-lg group-hover:drop-shadow-xl dark:text-cyan-50">
          {temperature}
          <span className="align-super text-[0.5em]">°</span>
        </div>

        {/* Condition */}
        <span
          className={`font-inter-tight mb-[0.1em] w-full text-left text-[1.3em] leading-[0.9] font-extralight tracking-tighter text-gray-800 lowercase dark:text-cyan-100`}
        >
          {condition}
        </span>

        {/* Sunrise/Sunset */}
        <div className="font-inter-tight mt-[0.1em] w-full max-w-full overflow-hidden text-left text-[0.7em] font-light tracking-tight whitespace-nowrap">
          <span
            className={`${sunTimeClasses} text-gray-700 dark:text-cyan-200`}
          >
            <SunriseIcon className="mr-2 h-[1em] w-[1em]" />
            {sunrise}
          </span>
          <span className="mx-2 text-gray-500 dark:text-cyan-300">|</span>
          <span
            className={`${sunTimeClasses} text-gray-800 dark:text-cyan-300`}
          >
            <SunsetIcon className="mr-2 h-[1em] w-[1em]" />
            {sunset}
          </span>
        </div>
      </section>

      {/* Music Section - Right Grid Cell */}
      <section
        className={`${sectionClasses} flex-col items-center justify-center p-[1em]`}
      >
        {/* Album Art */}
        <div className="group/album relative mb-[0.2em] h-[8em] w-[8em] transition-all duration-300 ease-out">
          <img
            src={albumArtUrl}
            alt={`${songTitle} album art`}
            className="h-full w-full rounded-lg object-cover shadow-lg transition-all duration-300 ease-out group-hover/album:-translate-y-2 group-hover/album:scale-110 group-hover/album:shadow-2xl"
          />
        </div>

        {/* Song Information */}
        <div className="w-full text-center transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105">
          <h2
            className={`truncate text-[1.1em] leading-tight font-semibold text-gray-900 transition-colors duration-300 ease-out ${textHoverClasses}`}
          >
            {songTitle}
          </h2>

          <p className="mt-[0.1em] truncate text-[0.9em] leading-snug text-gray-700 transition-colors duration-300 ease-out group-hover:text-gray-600 dark:text-slate-400 dark:group-hover:text-slate-300">
            {artistName}
          </p>
        </div>
      </section>
    </div>
  );
};

export default WeatherTunesDisplay;
