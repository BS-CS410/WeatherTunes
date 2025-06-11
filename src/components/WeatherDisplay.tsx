interface WeatherData {
  location: string;
  temperature: string;
  condition: string;
  unit: string;
}

interface WeatherDisplayProps {
  weatherData: WeatherData;
}

export function WeatherDisplay({ weatherData }: WeatherDisplayProps) {
  return (
    <div className="relative z-10 container mx-auto px-8 pt-8">
      <h1 className="mb-4 text-3xl font-bold text-gray-800">
        {weatherData.location || "Loading..."}
      </h1>
      <div className="fluid-title mb-2 text-9xl font-bold text-gray-800">
        {weatherData.temperature
          ? `${weatherData.temperature}${weatherData.unit}`
          : "--°"}
      </div>
      <p className="text-lg text-gray-600 md:text-2xl">
        {weatherData.condition || "Loading..."}
      </p>
    </div>
  );
}
