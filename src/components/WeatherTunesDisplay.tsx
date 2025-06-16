import React from "react";
import { SunriseIcon, SunsetIcon } from "@/components/icons";
import type { WeatherDisplayData } from "@/types/weather";

interface WeatherTunesDisplayProps {
  weatherData: WeatherDisplayData;
  songTitle?: string;
  artistName?: string;
  albumArtUrl?: string;
}

// Reusable section wrapper component
interface SectionWrapperProps {
  scale: number;
  alignment: "start" | "center";
  padding?: string;
  children: React.ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  scale,
  alignment,
  padding = "1em",
  children,
}) => {
  const alignmentClass = alignment === "start" ? "items-start" : "items-center";
  const justifyClass =
    alignment === "start" ? "justify-center" : "justify-center";

  return (
    <section
      className={`group flex h-full w-full flex-col ${alignmentClass} ${justifyClass}`}
      style={{
        padding: padding,
        fontSize: `${scale}em`,
      }}
    >
      {children}
    </section>
  );
};

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
    unit = "°",
    sunrise = "--",
    sunset = "--",
  } = weatherData || {};

  // Common hover effect classes for consistency
  const baseTransition = "transition-all duration-300 ease-out";
  const textHoverClasses =
    "group-hover:text-gray-800 dark:text-slate-200 dark:group-hover:text-slate-100";
  const elementHoverClasses = `${baseTransition} group-hover:-translate-y-1 group-hover:scale-105`;
  const sunTimeClasses = `inline-flex items-center ${baseTransition} hover:-translate-y-0.5 hover:scale-105`;
  const shadowHoverClasses = "drop-shadow-lg group-hover:drop-shadow-xl";

  return (
    <div className="grid aspect-[2/1] h-full w-full grid-cols-2 grid-rows-1 text-[clamp(1rem,3.5vw,1.6rem)]">
      {/* Weather Section - Left Grid Cell */}
      <div className="relative">
        <SectionWrapper scale={1.2} alignment="start" padding="0 0 0 1em">
          {/* Location */}
          <h1
            className={`font-inter-tight w-full text-left text-[1em] font-semibold tracking-wider text-gray-900 uppercase ${baseTransition} hover:-translate-y-1 hover:scale-105 hover:text-gray-800 dark:text-slate-200 dark:hover:text-slate-100`}
          >
            {location}
          </h1>

          {/* Temperature */}
          <div
            className={`font-inter-tight -mt-[0.025em] mb-[0.035em] -ml-[0.1em] w-full text-left text-[5em] leading-[0.85] font-bold text-gray-900 ${shadowHoverClasses} ${baseTransition} hover:scale-105 dark:text-cyan-50`}
            style={{ transformOrigin: "left top" }}
          >
            {temperature}
            <span className="align-super text-[0.5em]">
              °{unit.replace("°", "")}
            </span>
          </div>

          {/* Condition */}
          <span
            className={`font-inter-tight mb-[0.2em] w-full text-left text-[1.3em] leading-[0.9] font-extralight tracking-tighter text-gray-800 lowercase ${baseTransition} hover:-translate-y-1 hover:scale-105 hover:text-gray-800 dark:text-cyan-100 dark:hover:text-slate-100`}
          >
            {condition}
          </span>

          {/* Sunrise/Sunset */}
          <div className="font-inter-tight w-full max-w-full overflow-hidden text-left text-[0.7em] font-light tracking-tight whitespace-nowrap">
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
        </SectionWrapper>

        {/* Subtle divider */}
        <div className="absolute top-[10%] right-0 bottom-[10%] w-px bg-gradient-to-b from-transparent via-gray-300/40 to-transparent dark:via-slate-400/30"></div>
      </div>

      {/* Music Section - Right Grid Cell */}
      <SectionWrapper scale={1.1} alignment="center" padding="1em">
        {/* Album Art */}
        <div
          className={`group/album relative mb-[0.2em] h-[8em] w-[8em] ${baseTransition}`}
        >
          <img
            src={albumArtUrl}
            alt={`${songTitle} album art`}
            className={`h-full w-full rounded-lg object-cover shadow-lg ${baseTransition} group-hover/album:-translate-y-2 group-hover/album:scale-110 group-hover/album:shadow-2xl`}
          />
        </div>

        {/* Song Information */}
        <div
          className={`w-full pt-1 text-center text-[0.8em] ${elementHoverClasses}`}
        >
          <h2
            className={`truncate text-[1.1em] leading-tight font-semibold text-gray-900 ${baseTransition} ${textHoverClasses}`}
          >
            {songTitle}
          </h2>

          <p
            className={`mt-[0.1em] truncate text-[0.9em] leading-snug text-gray-700 ${baseTransition} group-hover:text-gray-600 dark:text-slate-400 dark:group-hover:text-slate-300`}
          >
            {artistName}
          </p>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default WeatherTunesDisplay;
