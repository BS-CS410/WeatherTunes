import React from "react";
import { WeatherDisplay } from "@/components/WeatherDisplay";
import CurrentlyPlaying from "@/components/CurrentlyPlaying"; // Assuming this is the new component
import type { WeatherDisplayData } from "@/types/weather";

interface UnifiedDisplayProps {
  weatherData: WeatherDisplayData;
  songTitle?: string;
  artistName?: string;
  albumArtUrl?: string;
}

const UnifiedDisplay: React.FC<UnifiedDisplayProps> = ({
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
        <CurrentlyPlaying
          songTitle={songTitle}
          artistName={artistName}
          albumArtUrl={albumArtUrl}
        />
      </div>
    </div>
  );
};

export default UnifiedDisplay;
