import React from "react";
import { WeatherDisplay } from "@/components/WeatherDisplay";
import CurrentlyPlaying from "@/components/CurrentlyPlaying"; // Assuming this is the new component

interface WeatherData {
  location: string;
  temperature: string;
  condition: string;
  unit: string;
}

interface UnifiedDisplayProps {
  weatherData: WeatherData;
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
    <div className="flex h-auto w-full flex-col items-center justify-center gap-4 p-4 md:flex-row">
      <div className="flex w-full items-center justify-center md:w-1/2">
        <WeatherDisplay weatherData={weatherData} />
      </div>
      <div className="flex w-full items-center justify-center md:w-1/2">
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
