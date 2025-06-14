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
    <div className="flex h-full w-full flex-col items-start">
      <div className="flex w-full flex-col items-start">
        {/* Location */}
        <h1 className="font-inter-tight mt-1 -mb-1.5 w-full pl-[4%] text-left text-[clamp(1rem,4vw,2rem)] font-semibold tracking-wider text-slate-200 uppercase">
          {weatherData.location || "Loading..."}
        </h1>
        {/* Temperature */}
        <div className="font-inter-tight w-full text-left text-[clamp(2.5rem,12vw,8rem)] leading-none font-bold text-cyan-50 drop-shadow-lg">
          {weatherData.temperature
            ? `${weatherData.temperature}${weatherData.unit}`
            : "--°"}
        </div>
        {/* Weather Condition */}
        <span className="font-inter-tight -mt-2.5 w-full pl-[2%] text-left text-[clamp(2.5rem,8vw,5rem)] leading-none font-extralight tracking-tighter text-cyan-100 lowercase">
          {weatherData.condition || "Loading..."}
        </span>
      </div>
    </div>
  );
}
