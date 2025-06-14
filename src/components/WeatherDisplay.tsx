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
    <div className="font-inter-tight relative z-10 container mx-auto px-8 pt-8">
      <div className="flex flex-col items-start">
        <div className="fluid-title text-[120pt] leading-none font-black text-slate-800">
          {weatherData.temperature
            ? `${weatherData.temperature}${weatherData.unit}`
            : "--°"}
        </div>
        <span className="-mt-4 text-6xl leading-none text-slate-800 lowercase">
          {weatherData.condition || "loading..."}
        </span>
        <h1 className="mt-1 text-4xl leading-tight text-slate-800 lowercase italic">
          {weatherData.location || "loading..."}
        </h1>
      </div>
    </div>
  );
}
