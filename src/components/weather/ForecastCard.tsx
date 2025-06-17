import { useForecastData } from "@/hooks/useForecast";
import { GlassCard } from "@/components/shared/GlassCard";
import { LoadingState, ErrorState } from "@/components/shared/StateComponents";
import { memo } from "react";

interface ForecastDayProps {
  dayName: string;
  date: string;
  condition: string;
  tempHigh: string;
  tempLow: string;
  icon: string;
}

// Memoized forecast day component for performance
const ForecastDay = memo(function ForecastDay({
  dayName,
  date,
  condition,
  tempHigh,
  tempLow,
  icon,
}: ForecastDayProps) {
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div className="group grid grid-rows-[auto_auto_3rem_2rem_auto] items-center justify-items-center gap-1 rounded-lg border border-white/20 bg-white/10 p-3 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/20 dark:border-slate-600/30 dark:bg-slate-800/20 dark:hover:border-slate-500/40 dark:hover:bg-slate-700/30">
      <div className="text-sm font-medium text-gray-900 transition-colors group-hover:text-gray-800 dark:text-slate-200 dark:group-hover:text-slate-100">
        {dayName}
      </div>
      <div className="text-xs text-gray-600 transition-colors group-hover:text-gray-500 dark:text-slate-400 dark:group-hover:text-slate-300">
        {date}
      </div>
      <div className="flex h-12 w-12 items-center justify-center">
        <img
          src={iconUrl}
          alt={condition}
          className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <div className="text-xs text-gray-700 capitalize transition-colors group-hover:text-gray-600 dark:text-slate-300 dark:group-hover:text-slate-200">
        {condition}
      </div>
      <div className="space-y-1">
        <div className="text-sm font-semibold text-gray-900 transition-colors hover:text-gray-800 dark:text-slate-200 dark:hover:text-slate-100">
          {tempHigh}°
        </div>
        <div className="text-xs text-gray-500 transition-colors hover:text-gray-400 dark:text-slate-500 dark:hover:text-slate-400">
          {tempLow}°
        </div>
      </div>
    </div>
  );
});

/**
 * Optimized 5-day weather forecast component
 * Uses shared components and proper memoization for performance
 */
export function ForecastCard() {
  const { forecast, isLoading, error } = useForecastData();

  if (isLoading) {
    return (
      <GlassCard>
        <LoadingState message="Loading forecast..." className="py-8" />
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard>
        <ErrorState 
          title="Could not load forecast"
          message={error.message}
          className="py-8"
        />
      </GlassCard>
    );
  }

  if (!forecast.length) {
    return (
      <GlassCard>
        <div className="py-8 text-center">
          <p className="text-gray-600 dark:text-slate-400">
            No forecast data available
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
          5-Day Forecast
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {forecast.map((day) => (
            <ForecastDay
              key={day.date}
              dayName={day.dayName}
              date={day.date}
              condition={day.condition}
              tempHigh={day.tempHigh}
              tempLow={day.tempLow}
              icon={day.icon}
            />
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

export default ForecastCard;
