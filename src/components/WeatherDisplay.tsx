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
    <div className="flex h-full w-full flex-col items-start transition-all duration-500 ease-in-out">
      <div className="flex w-full flex-col items-start transition-all duration-500 ease-in-out">
        {/* Location */}
        <h1 className="font-inter-tight mt-1 -mb-1.5 w-full pl-[4%] text-left text-[clamp(1rem,4vw,2rem)] font-semibold tracking-widest text-slate-200 uppercase transition-all duration-500 ease-in-out">
          {weatherData.location || "Loading..."}
        </h1>
        {/* Temperature */}
        <div className="font-inter-tight w-full text-left text-[clamp(2.5rem,12vw,8rem)] leading-none font-black text-cyan-50 drop-shadow-lg transition-all duration-500 ease-in-out">
          {weatherData.temperature
            ? `${weatherData.temperature}${weatherData.unit}`
            : "--°"}
        </div>
        {/* Weather Condition */}
        <span className="font-inter-tight -mt-1.5 w-full pl-[2%] text-left text-[clamp(1.5rem,6vw,4rem)] leading-none font-extralight text-cyan-100 lowercase transition-all duration-500 ease-in-out">
          {weatherData.condition || "Loading..."}
        </span>
      </div>
    </div>
  );
}
