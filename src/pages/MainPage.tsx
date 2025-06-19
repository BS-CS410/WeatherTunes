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
  SpotifySearchCard,
} from "@/components";
import { useWeatherData } from "@/hooks/useWeather";
import { useThemeManager } from "@/hooks/useThemeManager";
import { LAYOUT } from "@/lib/unifiedStyles";

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
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 transition-transform duration-200 will-change-transform select-none dark:text-gray-100">
            <span className="group relative inline-block">
              <span className="bg-gradient-radial animate-glow-simple pointer-events-none absolute top-1/2 left-1/2 -z-10 block h-[220%] w-[220%] -translate-x-1/2 -translate-y-1/2 rounded-full from-yellow-100 via-white/80 to-blue-200/0 opacity-70 blur-3xl transition-all duration-700 group-hover:scale-110 group-hover:opacity-100 dark:from-blue-900/30 dark:via-slate-800/40 dark:to-transparent dark:opacity-50" />
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

        {/* Spotify Search */}
        <SpotifySearchCard />

        {/* 5-Day Weather Forecast */}
        <ForecastCard />

        {/* Favorites List */}
        <BaseCard className="w-full" contentClassName="p-4">
          <FavoritesCard />
        </BaseCard>

        {/* Bottom Padding */}
        <div className="h-16" />
        <div className="w-full pb-2 text-center">
          <span className="-mb-6 block text-lg font-semibold tracking-wide text-gray-900 drop-shadow-[0_0_24px_rgba(240,240,240,1)] dark:text-gray-300 dark:drop-shadow-[0_0_24px_rgba(0,0,0,0.8)]">
            Blaze your glory<sup className="text-xs">™</sup>
          </span>
        </div>
        <footer className="w-full pb-4 text-center text-xs text-gray-900 drop-shadow-[0_0_24px_rgba(240,240,240,1)] dark:text-gray-300 dark:drop-shadow-[0_0_24px_rgba(0,0,0,0.8)]">
          © {new Date().getFullYear()} Team Meow Ltd. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default MainPage;
