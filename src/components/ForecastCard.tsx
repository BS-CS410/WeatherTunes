import { useForecastData } from "@/hooks/useForecast";
import { Card, CardContent } from "@/components/ui/card";

interface ForecastDayProps {
  dayName: string;
  date: string;
  condition: string;
  tempHigh: string;
  tempLow: string;
  icon: string;
}

function ForecastDay({
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
}

export function ForecastCard() {
  const { forecast, isLoading, error } = useForecastData();

  // Content based on state
  let content;
  if (isLoading) {
    content = (
      <div className="flex h-20 items-center justify-center">
        <p className="text-gray-600 dark:text-slate-400">Loading forecast...</p>
      </div>
    );
  } else if (error || forecast.length === 0) {
    content = (
      <div className="flex h-20 items-center justify-center">
        <p className="text-sm text-red-500">
          {error ? "Unable to load forecast" : "No forecast data available"}
        </p>
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-5 gap-3">
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
    );
  }

  return (
    <Card>
      <CardContent>
        <h3 className="mb-6 ml-2.5 text-5xl font-extralight tracking-wider text-gray-900 lowercase dark:text-slate-200">
          Your Forecast:
        </h3>
        {content}
      </CardContent>
    </Card>
  );
}
