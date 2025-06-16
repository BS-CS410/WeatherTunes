import { SunriseIcon, SunsetIcon } from "@/components/icons";
import { useEffect, useRef, useState } from "react";
import type { WeatherDisplayData } from "@/types/weather";

interface WeatherDisplayProps {
  weatherData: WeatherDisplayData;
}

export function WeatherDisplay({ weatherData }: WeatherDisplayProps) {
  const {
    location = "Loading...",
    temperature = "--",
    condition = "Loading...",
    unit = "°",
    sunrise = "--",
    sunset = "--",
  } = weatherData || {};

  const conditionRef = useRef<HTMLSpanElement>(null);
  const [conditionClass, setConditionClass] = useState("");

  // Intelligent text sizing based on condition length and line wrapping
  const getConditionTextSize = (text: string) => {
    const length = text.length;
    if (length <= 8) return "text-[clamp(1.5rem,5vw,3rem)]"; // Short conditions like "Clear"
    if (length <= 15) return "text-[clamp(1.2rem,4vw,2.5rem)]"; // Medium conditions like "Partly cloudy"
    if (length <= 25) return "text-[clamp(1rem,3.5vw,2rem)]"; // Long conditions like "Light intensity drizzle"
    return "text-[clamp(0.9rem,3vw,1.8rem)]"; // Very long conditions
  };

  // Check if text wraps to multiple lines and adjust accordingly
  useEffect(() => {
    if (!conditionRef.current) return;

    const element = conditionRef.current;

    // Reset to measure natural size
    element.style.whiteSpace = "nowrap";
    element.style.overflow = "visible";

    const singleLineWidth = element.scrollWidth;
    const containerWidth = element.offsetWidth;

    // Reset styles
    element.style.whiteSpace = "";
    element.style.overflow = "";

    const ratio = singleLineWidth / containerWidth;

    let newClass = getConditionTextSize(condition);

    if (ratio > 2) {
      // If it would wrap to 3+ lines, use smaller text and truncation
      newClass =
        "text-[clamp(1rem,3.5vw,2rem)] overflow-hidden whitespace-nowrap text-ellipsis";
    } else if (ratio > 1.1) {
      // If it wraps to 2 lines, make it smaller but allow wrapping
      newClass = "text-[clamp(1.2rem,4vw,2.5rem)]";
    }

    setConditionClass(newClass);
  }, [condition]);

  return (
    <section className="relative flex w-full flex-col items-start">
      <h1 className="font-inter-tight mt-1 -mb-1.5 w-full pl-[3%] text-left text-[clamp(1rem,4vw,2rem)] font-semibold tracking-wider text-gray-900 uppercase transition-transform duration-200 ease-in-out hover:-translate-y-2 hover:scale-105 hover:drop-shadow-md dark:text-slate-200">
        {location}
      </h1>
      <div className="font-inter-tight w-full text-left text-[clamp(5rem,12vw,8rem)] leading-none font-bold text-gray-900 drop-shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-2 hover:scale-105 hover:drop-shadow-md dark:text-cyan-50">
        {`${temperature}${unit}`}
      </div>
      <span
        ref={conditionRef}
        className={`font-inter-tight -mt-1.5 w-full pl-[2%] text-left leading-none font-extralight tracking-tighter text-gray-800 lowercase transition-transform duration-200 ease-in-out hover:-translate-y-2 hover:scale-105 hover:drop-shadow-md dark:text-cyan-100 ${conditionClass || getConditionTextSize(condition)}`}
      >
        {condition}
      </span>
      {/* Sunrise and Sunset Times */}
      <div className="font-inter-tight mt-4 w-full pl-[3%] text-left text-[clamp(0.7rem,1.8vw,1.1rem)] leading-none font-light tracking-wider whitespace-nowrap">
        <span className="inline-block text-gray-700 transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:drop-shadow-sm dark:text-cyan-200">
          <SunriseIcon className="mr-2 inline-block h-5 w-5" />
          {sunrise}
        </span>
        &nbsp;|&nbsp;
        <span className="inline-block text-gray-800 transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:drop-shadow-sm dark:text-cyan-300">
          <SunsetIcon className="mx-2 inline-block h-5 w-5" />
          {sunset}
        </span>
      </div>
    </section>
  );
}

export default WeatherDisplay;
