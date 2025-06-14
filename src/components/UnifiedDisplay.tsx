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
    <div className="flex h-full w-full flex-col items-center justify-around gap-2 p-2 md:flex-row md:gap-4 md:p-4">
      <div className="h-full w-full md:w-1/2">
        <WeatherDisplay weatherData={weatherData} />
      </div>
      <div className="h-full w-full md:w-1/2">
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
