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
  const {
    location = "Loading...",
    temperature = "--",
    condition = "Loading...",
    unit = "°",
  } = weatherData || {};

  return (
    <section className="flex w-full flex-col items-start">
      <h1 className="font-inter-tight mt-1 -mb-1.5 w-full pl-[4%] text-left text-[clamp(1rem,4vw,2rem)] font-semibold tracking-wider text-gray-800 uppercase transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:scale-105 hover:drop-shadow-md dark:text-slate-200">
        {location}
      </h1>
      <div className="font-inter-tight w-full text-left text-[clamp(5rem,12vw,8rem)] leading-none font-bold text-gray-900 drop-shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:scale-105 hover:drop-shadow-md dark:text-cyan-50">
        {`${temperature}${unit}`}
      </div>
      <span className="font-inter-tight -mt-2.5 w-full pl-[2%] text-left text-[clamp(2.5rem,8vw,5rem)] leading-none font-extralight tracking-tighter text-gray-600 lowercase transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:scale-105 hover:drop-shadow-md dark:text-cyan-100">
        {condition}
      </span>
    </section>
  );
}
