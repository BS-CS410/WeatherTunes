import React from "react";
import { WeatherDisplay } from "@/components/WeatherDisplay";

interface WeatherData {
  location: string;
  temperature: string;
  condition: string;
  unit: string;
}

interface UnifiedDisplayProps {
  weatherData: WeatherData;
}

const UnifiedDisplay: React.FC<UnifiedDisplayProps> = ({ weatherData }) => {
  return (
    <div className="flex flex-row items-center justify-center gap-2 p-4">
      <div className="flex items-center">
        <WeatherDisplay weatherData={weatherData} />
      </div>
    </div>
  );
};

export default UnifiedDisplay;
