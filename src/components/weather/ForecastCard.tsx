import { useWeatherForecast } from "@/hooks/useWeatherForecast";
import { Card } from "@/components/ui/card";
import {
  LoadingSpinner,
  ErrorDisplay,
} from "@/components/shared/StatusComponents";
import {
  WEATHER_STYLES,
  COLORS,
  TYPOGRAPHY,
  ANIMATIONS,
} from "@/lib/design-system";
import { memo } from "react";
import { cn } from "@/lib/dom-helpers";

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
    <div className={cn("group", WEATHER_STYLES.forecastDay)}>
      <div
        className={cn(
          TYPOGRAPHY.body.sm,
          "font-medium",
          COLORS.text.primary,
          "transition-colors group-hover:text-gray-800 dark:group-hover:text-gray-100",
        )}
      >
        {dayName}
      </div>
      <div
        className={cn(
          TYPOGRAPHY.body.xs,
          COLORS.text.muted,
          "transition-colors group-hover:text-gray-500 dark:group-hover:text-gray-200",
        )}
      >
        {date}
      </div>
      <div className="flex h-12 w-12 items-center justify-center">
        <img
          src={iconUrl}
          alt={condition}
          className={cn(
            "h-10 w-10 object-contain",
            ANIMATIONS.transition.standard,
            "group-hover:scale-110",
          )}
          loading="lazy"
        />
      </div>
      <div
        className={cn(
          TYPOGRAPHY.body.xs,
          COLORS.text.secondary,
          "capitalize transition-colors group-hover:text-gray-600 dark:group-hover:text-gray-100",
        )}
      >
        {condition}
      </div>
      <div className="space-y-1">
        <div
          className={cn(
            TYPOGRAPHY.body.sm,
            "font-semibold",
            COLORS.text.primary,
            "transition-colors hover:text-gray-800 dark:hover:text-gray-100",
          )}
        >
          {tempHigh}°
        </div>
        <div
          className={cn(
            TYPOGRAPHY.body.xs,
            COLORS.text.muted,
            "transition-colors hover:text-gray-400 dark:hover:text-gray-300",
          )}
        >
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
export default function ForecastCard() {
  const { forecast, isLoading, error } = useWeatherForecast();

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex h-48 items-center justify-center">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  if (error || !forecast || forecast.length === 0) {
    return (
      <Card className="p-6">
        <ErrorDisplay
          title="Forecast Unavailable"
          message={error || 'No forecast data available'}
          className="h-48"
        />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className={cn(TYPOGRAPHY.display.md, COLORS.text.primary)}>
          5-Day Forecast
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Updated {new Date().toLocaleTimeString()}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {forecast.map((day, index) => (
          <ForecastDay
            key={`${day.dayName}-${index}`}
            dayName={day.dayName}
            date={day.date}
            condition={day.condition}
            tempHigh={day.tempHigh}
            tempLow={day.tempLow}
            icon={day.icon}
          />
        ))}
      </div>
    </Card>
  );
}
