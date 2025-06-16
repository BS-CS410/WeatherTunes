import React from "react";
import { WeatherDisplay } from "@/components/WeatherDisplayMui";
import CurrentlyPlayingMui from "@/components/CurrentlyPlayingMui";
import type { WeatherDisplayData } from "@/types/weather";

interface UnifiedDisplayProps {
  weatherData: WeatherDisplayData;
  songTitle?: string;
  artistName?: string;
  albumArtUrl?: string;
}

/**
 * Material UI version of UnifiedDisplay component
 * Maintains exact same interface and styling as original
 */
const UnifiedDisplayMui: React.FC<UnifiedDisplayProps> = ({
  weatherData,
  songTitle,
  artistName,
  albumArtUrl,
}) => {
  return (
    <div className="flex flex-row items-center justify-center gap-2 p-4">
      <div className="flex items-center">
        <WeatherDisplay weatherData={weatherData} />
      </div>
      <div className="flex items-center">
        <CurrentlyPlayingMui
          songTitle={songTitle}
          artistName={artistName}
          albumArtUrl={albumArtUrl}
        />
      </div>
    </div>
  );
};

export default UnifiedDisplayMui;
