import { useForecastData } from "@/hooks/useForecast";
import { BaseCard } from "@/components/shared/BaseCard";
import {
  LoadingSpinner,
  ErrorDisplay,
} from "@/components/shared/StatusComponents";
import {
  WEATHER_STYLES,
  COLORS,
  TYPOGRAPHY,
  ANIMATIONS,
} from "@/lib/unifiedStyles";
import { memo } from "react";
import { cn } from "@/lib/lib-utils";

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
export function ForecastCard() {
  const { forecast, isLoading, error } = useForecastData();

  if (isLoading) {
    return (
      <BaseCard>
        <LoadingSpinner message="Loading forecast..." className="py-8" />
      </BaseCard>
    );
  }

  if (error) {
    return (
      <BaseCard>
        <ErrorDisplay
          title="Could not load forecast"
          message={error.message}
          className="py-8"
        />
      </BaseCard>
    );
  }

  if (!forecast.length) {
    return (
      <BaseCard>
        <div className="py-8 text-center">
          <p className={cn(COLORS.text.muted)}>No forecast data available</p>
        </div>
      </BaseCard>
    );
  }

  return (
    <BaseCard enableLiquidGlass>
      <div className="space-y-4">
        <h3
          className={cn(
            TYPOGRAPHY.body.lg,
            "font-semibold",
            COLORS.text.primary,
          )}
        >
          5-Day Forecast
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {forecast.map((day, index) => (
            <ForecastDay
              key={`${day.date}-${index}`}
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
    </BaseCard>
  );
}

export default ForecastCard;
