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
    <div className="relative z-10 container mx-auto px-4 pt-8 sm:px-6 sm:pt-10 md:px-8 md:pt-12">
      <h1 className="mb-4 text-3xl font-bold text-gray-800 md:text-5xl lg:text-6xl">
        {weatherData.location || "Loading..."}
      </h1>
      <div className="mb-2 text-4xl font-bold text-gray-800 md:text-6xl lg:text-8xl">
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
