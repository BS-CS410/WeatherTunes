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
  CARD_STYLES,
} from "@/lib";
import { memo } from "react";
import { cn } from "@/lib";

interface ForecastDayProps {
  dayName: string;
  date: string;
  condition: string;
  tempHigh: number;
  tempLow: number;
  icon: string;
  unit: string;
}

// Memoized forecast day component for performance
const ForecastDay = memo(function ForecastDay({
  dayName,
  date,
  condition,
  tempHigh,
  tempLow,
  icon,
  unit,
}: ForecastDayProps) {
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div
      className={cn(
        "group flex flex-col items-center space-y-2 rounded-lg p-3 text-center",
        CARD_STYLES.sunken,
      )}
    >
      <div className={cn("font-bold", TYPOGRAPHY.body.sm, COLORS.text.primary)}>
        {dayName}
      </div>
      <div className={cn(TYPOGRAPHY.body.xs, COLORS.text.muted)}>{date}</div>
      <div className="flex h-14 w-14 items-center justify-center">
        <img
          src={iconUrl}
          alt={condition}
          className={cn(
            "h-12 w-12 object-contain",
            ANIMATIONS.transition.standard,
            "group-hover:scale-125",
          )}
          loading="lazy"
        />
      </div>
      <div
        className={cn(TYPOGRAPHY.body.sm, COLORS.text.secondary, "capitalize")}
      >
        {condition}
      </div>
      <div className="flex items-baseline space-x-1">
        <div
          className={cn(
            TYPOGRAPHY.body.lg,
            "font-semibold",
            COLORS.text.primary,
          )}
        >
          {tempHigh}
          {unit === "standard" ? "" : "°"}
        </div>
        <div className={cn(TYPOGRAPHY.body.sm, COLORS.text.muted)}>
          {tempLow}
          {unit === "standard" ? "" : "°"}
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
      <Card variant="interactive" className="w-full">
        <div className="flex h-48 items-center justify-center p-6">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  if (error || !forecast || forecast.length === 0) {
    return (
      <Card variant="interactive" className="w-full">
        <div className="p-6">
          <ErrorDisplay
            title="Forecast Unavailable"
            message={error || "No forecast data available"}
            className="h-48"
          />
        </div>
      </Card>
    );
  }

  return (
    <Card variant="interactive" className="w-full">
      <div className="p-4">
        <div className="mb-4">
          <h2
            className={cn(
              TYPOGRAPHY.heading.h4,
              "font-semibold",
              COLORS.text.primary,
            )}
          >
            5-Day Forecast
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {forecast.map((day, index) => (
            <ForecastDay
              key={`${day.dayName}-${index}`}
              dayName={day.dayName}
              date={new Date(day.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
              condition={day.condition}
              tempHigh={day.tempHigh}
              tempLow={day.tempLow}
              icon={day.icon}
              unit={day.unit}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
