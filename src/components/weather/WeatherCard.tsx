import { SunriseIcon, SunsetIcon } from "@/components/icons";
import type { WeatherDisplayData } from "@/types/weather";
import { SectionWrapper } from "../layout/SectionWrapper";
import { createElementStyles } from "../styles/ElementStyles";
import { colorTheme } from "../styles/WeatherTunesStyles";
import { useCurrentTrackContext } from "@/contexts/useCurrentTrackContext";

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
 *    -> LAYOUT & SPACING: Section scaling and alignment with consistent line-height
 *    -> Uses original em-based scaling (1.2x for weather, 1.1x for music)
 *
 * RESPONSIVE DESIGN: Original scaling restored with explicit unitless line-height
 * values to prevent line spacing from resetting during window resizing
 */

interface WeatherCardProps {
  weatherData: WeatherDisplayData;
}

/**
 * Integrated weather and music display component using 2x1 grid layout
 * Maximizes maintainability through centralized styling and clear separation of concerns
 */
export function WeatherCard({ weatherData }: WeatherCardProps) {
  const { trackMetadata, currentTrackId, isLoading } = useCurrentTrackContext();

  const {
    location = "Loading...",
    temperature = "--",
    condition = "Loading...",
    unit = "°",
    sunrise = "--",
    sunset = "--",
  } = weatherData || {};

  // Use track metadata from context or fallback to placeholders
  const isTrackLoading = isLoading || !trackMetadata;
  const songTitle =
    trackMetadata?.title ||
    (isTrackLoading ? "Loading track..." : "Unknown Track");
  const artistName =
    trackMetadata?.artist ||
    (isTrackLoading ? "Finding music..." : "Unknown Artist");
  const albumArtUrl =
    trackMetadata?.albumArt || "https://via.placeholder.com/300x300";

  // Single source of truth for all element styles
  const elementStyles = createElementStyles();

  return (
    <div className="grid aspect-[2/1] h-full w-full grid-cols-2 grid-rows-1 text-[clamp(1rem,3.5vw,1.6rem)]">
      {/* Weather Section - Left Grid Cell */}
      <div className="relative">
        <SectionWrapper scale={1.2} alignment="start" padding="0 0 0 1em">
          {/* Location */}
          <h1 className={elementStyles.weatherLocation}>{location}</h1>

          {/* Temperature */}
          <div
            className={elementStyles.weatherTemperature}
            style={{ transformOrigin: "left top" }}
          >
            {temperature}
            <span className="align-super text-[0.5em]">
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
              <SunriseIcon className="mr-2 h-[1em] w-[1em]" />
              {sunrise}
            </span>
            <span className={`mx-2 ${colorTheme.separatorText}`}>|</span>
            <span
              className={`${elementStyles.timeElement} ${colorTheme.timeTextAlt}`}
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

          {/* Development debug info */}
          {import.meta.env.DEV && currentTrackId && (
            <div className="mt-1 font-mono text-xs opacity-50">
              ID: {currentTrackId.substring(0, 8)}...{isLoading && " (loading)"}
            </div>
          )}
        </div>
      </SectionWrapper>
    </div>
  );
}
