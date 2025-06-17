import {
  WeatherCard,
  QueueCard,
  CurrentTrackCard,
  FavoritesCard,
  WeatherBackground,
  SettingsButton,
  ForecastCard,
  BaseCard,
  LoadingSpinner,
  ErrorDisplay,
} from "@/components";
import { useWeatherData } from "@/hooks/useWeather";
import { useThemeManager } from "@/hooks/useThemeManager";
import { LAYOUT } from "@/lib/unifiedStyles"; // Updated import

function MainPage() {
  const { displayData, timePeriod, isLoading, error } = useWeatherData();

  useThemeManager(timePeriod);

  // Loading State
  if (isLoading) {
    return <LoadingSpinner message="Loading weather data..." />;
  }

  // Error State
  if (error || displayData.isError) {
    return (
      <ErrorDisplay
        title={`Error: ${displayData.condition || "Could not load weather data."}`}
        message={error?.message}
      />
    );
  }

  // MainPage Component //
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center overflow-auto">
      {/* Settings Button */}
      <SettingsButton />

      {/* Video Background */}
      <WeatherBackground
        condition={displayData.condition}
        timePeriod={timePeriod}
      />

      {/* Main Content Area (centered column) */}
      <div
        className={`flex w-full max-w-2xl items-stretch ${LAYOUT.container.column} ${LAYOUT.spacing.md} ${LAYOUT.padding.md}`}
      >
        {/* App Header (left-aligned within centered column) */}
        <header className="-mb-5 py-6 text-left">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 transition-transform duration-200 will-change-transform select-none dark:text-slate-100">
            <span className="inline-block drop-shadow-[0_0_24px_rgba(240,240,240,0.9)] transition-transform duration-200 hover:scale-[1.03] hover:drop-shadow-[0_0_32px_rgba(240,240,240,0.95)] dark:drop-shadow-[0_0_24px_rgba(30,41,59,0.95)] dark:hover:drop-shadow-[0_0_32px_rgba(30,41,59,1)]">
              weathertunes
            </span>
          </h1>
        </header>

        {/* Unified Weather and Currently Playing Display */}
        <BaseCard withPadding={false}>
          <WeatherCard weatherData={displayData} />
        </BaseCard>

        {/* Currently Playing Section */}
        <BaseCard>
          <CurrentTrackCard />
        </BaseCard>

        {/* Next Up Scroll Area */}
        <BaseCard withPadding={false} className="">
          <QueueCard />
        </BaseCard>

        {/* 5-Day Weather Forecast */}
        <ForecastCard />

        {/* Favorites List */}
        <BaseCard className="w-full" contentClassName="p-4">
          <FavoritesCard />
        </BaseCard>

        {/* Bottom Padding */}
        <div className="h-16" />
        <div className="w-full pb-2 text-center">
          <span className="-mb-6 block text-lg font-semibold tracking-wide text-gray-900 drop-shadow-[0_0_24px_rgba(240,240,240,1)] dark:text-slate-400 dark:drop-shadow-[0_0_24px_rgba(0,0,0,1)]">
            Blaze your glory<sup className="text-xs">™</sup>
          </span>
        </div>
        <footer className="w-full pb-4 text-center text-xs text-gray-900 drop-shadow-[0_0_24px_rgba(240,240,240,1)] dark:text-slate-400 dark:drop-shadow-[0_0_24px_rgba(0,0,0,1)]">
          © {new Date().getFullYear()} Team Meow Ltd. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default MainPage;
