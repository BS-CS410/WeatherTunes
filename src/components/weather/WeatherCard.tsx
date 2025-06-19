import { SunriseIcon, SunsetIcon } from "@/components/icons";
import type { WeatherDisplayData } from "@/types/weather";
import { SectionWrapper } from "../layout/SectionWrapper";
import { useCurrentTrackContext } from "@/contexts/useCurrentTrackContext";
import { TYPOGRAPHY, COLORS } from "@/lib/unifiedStyles"; // Import unified styles

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
      <div className="relative flex h-full flex-col justify-between">
        <SectionWrapper scale={1.2} alignment="start" padding="0 0 0 1em">
          {/* Location */}
          <h1
            className={`${TYPOGRAPHY.weather.location} ${COLORS.text.weather}`}
          >
            {location}
          </h1>

          {/* Temperature */}
          <div
            className={`-ml-2.5 ${TYPOGRAPHY.weather.temperature} ${COLORS.text.weather} ${String(temperature).length >= 3 ? "font-light tracking-tight" : ""}`}
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
            className={`flex items-center gap-3 ${TYPOGRAPHY.weather.time} w-full max-w-full overflow-hidden pt-2 text-[0.95rem] whitespace-nowrap`}
            style={{}}
          >
            <span
              className={`flex items-center ${COLORS.text.weather} whitespace-nowrap`}
            >
              <SunriseIcon className="mr-1 h-[1em] w-[1em]" />
              {sunrise}
            </span>
            <span className={`mx-1 ${COLORS.text.muted}`}>|</span>
            <span
              className={`flex items-center ${COLORS.text.weather} whitespace-nowrap`}
            >
              <SunsetIcon className="mr-1 h-[1em] w-[1em]" />
              {sunset}
            </span>
          </div>
        </SectionWrapper>

        {/* Subtle divider */}
        <div className="absolute top-[10%] right-0 bottom-[10%] w-px bg-gradient-to-b from-transparent via-gray-300/40 to-transparent dark:via-slate-400/30"></div>
      </div>

      {/* Music Section - Right Grid Cell */}
      <div className="relative flex h-full w-full items-center justify-center">
        <SectionWrapper scale={1.1} alignment="center" padding="1em">
          <div className="flex h-full w-full flex-col items-center justify-center">
            <div
              className="flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-slate-700"
              style={{
                width: "82%",
                height: "82%",
                minWidth: 112,
                minHeight: 112,
                maxWidth: 320,
                maxHeight: 320,
              }}
            >
              <img
                src={albumArtUrl}
                alt={`${songTitle} album art`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="mt-3 flex w-full flex-col items-center text-center">
              <h2
                className="max-w-[18em] truncate text-lg font-semibold text-ellipsis sm:text-xl md:text-2xl"
                style={{ lineHeight: 1.2 }}
              >
                {songTitle}
              </h2>
              <p
                className="max-w-[20em] truncate text-base text-ellipsis text-gray-600 sm:text-lg md:text-xl dark:text-gray-300"
                style={{ lineHeight: 1.2 }}
              >
                {artistName}
              </p>
            </div>
          </div>
        </SectionWrapper>
      </div>
    </div>
  );
}
