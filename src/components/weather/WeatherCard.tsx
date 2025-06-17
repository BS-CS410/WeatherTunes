import { SunriseIcon, SunsetIcon } from "@/components/icons";
import type { WeatherDisplayData } from "@/types/weather";
import { SectionWrapper } from "../layout/SectionWrapper";
import { useCurrentTrackContext } from "@/contexts/useCurrentTrackContext";
import {
  TYPOGRAPHY,
  COLORS,
  MUSIC_STYLES,
  ANIMATIONS,
} from "@/lib/unifiedStyles"; // Import unified styles

/**
 * STYLE CUSTOMIZATION GUIDE
 *
 * To modify visual appearance of this component, edit this file:
 *
 * FILE 1: src/lib/unifiedStyles.ts
 *    -> COLORS & THEME: COLORS object
 *    -> TYPOGRAPHY & FONTS: TYPOGRAPHY object
 *
 * RESPONSIVE DESIGN: Uses Tailwind CSS utility classes for responsiveness.
 * Base font size is clamped for scalability.
 */

interface WeatherCardProps {
  weatherData: WeatherDisplayData;
}

/**
 * Integrated weather and music display component using 2x1 grid layout
 * Maximizes maintainability through centralized styling and clear separation of concerns
 */
export function WeatherCard({ weatherData }: WeatherCardProps) {
  const { trackMetadata, isLoading } = useCurrentTrackContext();

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

  return (
    <div className="grid aspect-[2/1] h-full w-full grid-cols-2 grid-rows-1 text-[clamp(1rem,3.5vw,1.6rem)]">
      {/* Weather Section - Left Grid Cell */}
      <div className="relative">
        <SectionWrapper scale={1.2} alignment="start" padding="0 0 0 1em">
          {/* Location */}
          <h1
            className={`${TYPOGRAPHY.weather.location} ${COLORS.text.weather}`}
          >
            {location}
          </h1>

          {/* Temperature */}
          <div
            className={`${TYPOGRAPHY.weather.temperature} ${COLORS.text.weather}`}
            style={{ transformOrigin: "left top" }}
          >
            {temperature}
            <span className="align-super text-[0.5em]">
              °{unit.replace("°", "")}
            </span>
          </div>

          {/* Condition */}
          <span
            className={`${TYPOGRAPHY.weather.condition} ${COLORS.text.condition}`}
          >
            {condition}
          </span>

          {/* Sunrise/Sunset */}
          <div
            className={`flex items-center ${TYPOGRAPHY.weather.time} mt-auto pb-[0.5em]`}
          >
            <span className={`flex items-center ${COLORS.text.weather}`}>
              <SunriseIcon className="mr-2 h-[1em] w-[1em]" />
              {sunrise}
            </span>
            <span className={`mx-2 ${COLORS.text.muted}`}>|</span>
            <span className={`flex items-center ${COLORS.text.weather}`}>
              <SunsetIcon className="mr-2 h-[1em] w-[1em]" />
              {sunset}
            </span>
          </div>
        </SectionWrapper>

        {/* Subtle divider */}
        <div className="absolute top-[10%] right-0 bottom-[10%] w-px bg-gradient-to-b from-transparent via-gray-300/40 to-transparent dark:via-slate-400/30"></div>
      </div>

      {/* Music Section - Right Grid Cell */}
      <div className="relative">
        <SectionWrapper scale={1.1} alignment="center" padding="1em">
          <div className={MUSIC_STYLES.albumContainer}>
            <img
              src={albumArtUrl}
              alt={`${songTitle} album art`}
              className={`aspect-square w-full object-cover ${ANIMATIONS.transition.slow} group-hover/album:scale-110`}
              loading="lazy"
            />
          </div>
          <div className={MUSIC_STYLES.trackInfo}>
            <h2 className={`${TYPOGRAPHY.music.title} ${COLORS.text.primary}`}>
              {songTitle}
            </h2>
            <p
              className={`${TYPOGRAPHY.music.artist} ${COLORS.text.secondary}`}
            >
              {artistName}
            </p>
          </div>
        </SectionWrapper>
      </div>
    </div>
  );
}
