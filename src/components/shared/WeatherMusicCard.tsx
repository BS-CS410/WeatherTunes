import { useState } from "react";
import { SunriseIcon, SunsetIcon } from "@/components/icons";
import type { WeatherDisplayData } from "@/types/weather-types";
import { SectionWrapper } from "../layout/SectionWrapper";
import { useCurrentTrackContext } from "@/hooks/useCurrentTrack";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { TYPOGRAPHY, COLORS } from "@/lib/unifiedStyles";
import { cn } from "@/lib/lib-utils";
import { SpotifyWebPlayer } from "@/components/music/SpotifyWebPlayer";

interface WeatherMusicCardProps {
  weatherData: WeatherDisplayData;
  className?: string;
}

/**
 * Unified weather and music display component using 2x2 grid layout
 * Top row: weather info and album art
 * Bottom row: Spotify player and control buttons
 */
export function WeatherMusicCard({
  weatherData,
  className = "",
}: WeatherMusicCardProps) {
  const [message, setMessage] = useState<string | null>(null);
  const { trackMetadata, currentTrackId, songQueue, setNextTrack, isLoading } =
    useCurrentTrackContext();
  const { user } = useAuth();

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
    trackMetadata?.albumArt || "/public/placeholder-album.svg";

  const handleLike = async () => {
    if (!currentTrackId) return;

    if (!user) {
      setMessage("Please log in to like tracks");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/liked`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ track_id: currentTrackId }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error || "Failed to like track"}`);
        return;
      }

      setMessage("Track liked!");
      setTimeout(() => setMessage(null), 2000);
    } catch {
      setMessage("Network error while liking track");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleNext = async () => {
    if (!user) {
      setMessage("Please log in to control playback");
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    await setNextTrack();
  };

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col text-[clamp(1rem,3.5vw,1.6rem)]",
        className,
      )}
    >
      {/* Top Section - Weather and Album Art (2x1 grid, same as original) */}
      <div className="grid aspect-[2/1] h-full w-full grid-cols-2 grid-rows-1">
        {/* Weather Section - Left Grid Cell */}
        <div className="relative flex h-full flex-col justify-between">
          <SectionWrapper scale={1.2} alignment="start" padding="0 0 0 1.5em">
            {/* Location */}
            <h1
              className={`${TYPOGRAPHY.weather.location} ${COLORS.text.weather}`}
            >
              {location}
            </h1>

            {/* Temperature */}
            <div
              className={`-ml-2.5 ${TYPOGRAPHY.weather.temperature} ${COLORS.text.weather} ${String(temperature).length >= 3 ? "font-light" : ""}`}
              style={{
                transformOrigin: "left top",
                letterSpacing:
                  String(temperature).length >= 3 ? "-0.09em" : undefined,
              }}
            >
              {temperature}
              <span
                className={
                  String(temperature).length >= 3
                    ? "ml-2 align-super text-[0.5em]"
                    : "align-super text-[0.5em]"
                }
              >
                {unit.replace("°", "") === "K"
                  ? "K"
                  : `°${unit.replace("°", "")}`}
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

          {/* Vertical divider */}
          <div className="absolute top-[10%] right-0 bottom-[10%] w-px bg-gradient-to-b from-transparent via-gray-300/40 to-transparent dark:via-white/[0.1]"></div>
        </div>

        {/* Album Art Section - Right Grid Cell */}
        <div className="relative flex h-full w-full items-center justify-center">
          <SectionWrapper scale={1.1} alignment="center" padding="1em">
            <div className="flex h-full w-full flex-col items-center justify-center">
              <div
                className="flex-shrink-0 overflow-hidden rounded-xl bg-gray-200 dark:border dark:border-white/[0.08] dark:bg-black/20"
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
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/public/placeholder-album.svg";
                  }}
                />
              </div>
              <div className="mt-2 flex w-full flex-col items-center text-center">
                <h2
                  className={`max-w-[10em] truncate overflow-hidden text-base font-semibold text-ellipsis whitespace-nowrap ${COLORS.text.primary}`}
                  style={{ lineHeight: 1.3 }}
                >
                  {songTitle}
                </h2>
                <p
                  className={`max-w-[12em] truncate overflow-hidden text-xs text-ellipsis whitespace-nowrap ${COLORS.text.secondary}`}
                  style={{ lineHeight: 1.3 }}
                >
                  {artistName}
                </p>
              </div>
            </div>
          </SectionWrapper>
        </div>
      </div>

      {/* Bottom Section - Music Player and Controls (full width) */}
      <div className="flex w-full flex-col space-y-4 px-6 pb-6">
        {/* Spotify Player (full width) */}
        {user && currentTrackId ? (
          <div className="w-full">
            <SpotifyWebPlayer
              className="w-full"
              showQueueInfo={false}
              autoPlay={true}
            />
          </div>
        ) : (
          <div className="w-full text-center">
            <div className={cn(TYPOGRAPHY.body.sm, COLORS.text.muted)}>
              {!user ? "Login to access player" : "No track selected"}
            </div>
          </div>
        )}

        {/* Control Buttons (full width) */}
        <div className="flex w-full gap-2">
          <Button
            onClick={handleLike}
            disabled={isLoading || !user}
            variant="outline"
            className="flex-1"
          >
            ♡ Like
          </Button>

          <Button
            onClick={handleNext}
            disabled={isLoading || songQueue.length === 0 || !user}
            variant="outline"
            className="flex-1"
          >
            Next ▷
          </Button>
        </div>

        {/* Queue Status */}
        {songQueue.length > 0 && (
          <div className="w-full text-center">
            <p className={cn("text-xs", COLORS.text.muted)}>
              Queue: {songQueue.length} track{songQueue.length !== 1 ? "s" : ""}{" "}
              ready
            </p>
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div
            className={cn(
              "w-full rounded-lg border border-white/[0.15] bg-white/[0.07] p-2 text-center text-xs backdrop-blur-xl backdrop-saturate-[1.6] dark:border-white/[0.06] dark:bg-black/[0.15]",
              COLORS.text.muted,
            )}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
