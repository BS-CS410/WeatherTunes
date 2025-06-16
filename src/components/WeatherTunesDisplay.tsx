import React from "react";
import { SunriseIcon, SunsetIcon } from "@/components/icons";
import type { WeatherDisplayData } from "@/types/weather";
import { SectionWrapper } from "./layout/SectionWrapper";
import { createElementStyles } from "./styles/ElementStyles";
import { colorTheme } from "./styles/WeatherTunesStyles";

/**
 * STYLE CUSTOMIZATION GUIDE
 *
 * To modify visual appearance of this component, edit one of these 3 files:
 *
 * FILE 1: ./styles/WeatherTunesStyles.ts
 *    -> HOVER EFFECTS & ANIMATIONS: interactionEffects section
 *    -> COLORS & THEME: colorTheme section
 *    -> TYPOGRAPHY & FONTS: fontStyles section (uses Tailwind responsive classes)
 *    -> SHADOWS & DEPTH: shadowEffects section
 *
 * FILE 2: ./styles/ElementStyles.ts
 *    -> ELEMENT-SPECIFIC STYLES: createElementStyles() function
 *    -> Individual element combinations with responsive spacing
 *    -> Album art sizing and music section layout
 *
 * FILE 3: ./layout/SectionWrapper.tsx
 *    -> LAYOUT & SPACING: Section alignment with consistent line-height
 *    -> Uses unitless line-height values to prevent spacing issues during resize
 *
 * RESPONSIVE DESIGN: All sizing uses Tailwind responsive classes with explicit unitless
 * line-height values to prevent line spacing from resetting during window resizing
 */

interface WeatherTunesDisplayProps {
  weatherData: WeatherDisplayData;
  songTitle?: string;
  artistName?: string;
  albumArtUrl?: string;
}

/**
 * Integrated weather and music display component using 2x1 grid layout
 * Maximizes maintainability through centralized styling and clear separation of concerns
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

  // Single source of truth for all element styles
  const elementStyles = createElementStyles();

  return (
    <div className="grid aspect-[2/1] h-full w-full grid-cols-2 grid-rows-1">
      {/* Weather Section - Left Grid Cell */}
      <div className="relative">
        <SectionWrapper alignment="start" padding="0 0 0 1em">
          {/* Location */}
          <h1 className={elementStyles.weatherLocation}>{location}</h1>

          {/* Temperature */}
          <div
            className={elementStyles.weatherTemperature}
            style={{ transformOrigin: "left top" }}
          >
            {temperature}
            <span className="align-super text-xs leading-[1] sm:text-sm md:text-base lg:text-lg xl:text-xl">
              °{unit.replace("°", "")}
            </span>
          </div>

          {/* Condition */}
          <span className={elementStyles.weatherCondition}>{condition}</span>

          {/* Sunrise/Sunset */}
          <div className={elementStyles.timeContainer}>
            <span
              className={`${elementStyles.timeElement} ${colorTheme.timeText}`}
            >
              <SunriseIcon className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              {sunrise}
            </span>
            <span className={`mx-2 ${colorTheme.separatorText}`}>|</span>
            <span
              className={`${elementStyles.timeElement} ${colorTheme.timeTextAlt}`}
            >
              <SunsetIcon className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              {sunset}
            </span>
          </div>
        </SectionWrapper>

        {/* Subtle divider */}
        <div className="absolute top-[10%] right-0 bottom-[10%] w-px bg-gradient-to-b from-transparent via-gray-300/40 to-transparent dark:via-slate-400/30"></div>
      </div>

      {/* Music Section - Right Grid Cell */}
      <SectionWrapper alignment="center" padding="1em">
        {/* Album Art */}
        <div className={elementStyles.albumContainer}>
          <img
            src={albumArtUrl}
            alt={`${songTitle} album art`}
            className={elementStyles.albumImage}
          />
        </div>

        {/* Song Information */}
        <div className={elementStyles.musicInfo}>
          <h2 className={elementStyles.musicTitle}>{songTitle}</h2>
          <p className={elementStyles.musicArtist}>{artistName}</p>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default WeatherTunesDisplay;
