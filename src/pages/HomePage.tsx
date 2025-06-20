import {
  QueueCard,
  FavoritesCard,
  WeatherBackground,
  SettingsButton,
  ForecastCard,
  BaseCard,
  LoadingSpinner,
  ErrorDisplay,
  SpotifySearchCard,
  WeatherMusicCard,
  LoginPopup,
} from "@/components";
import { useWeatherData } from "@/hooks/useWeather";
import { useThemeManager } from "@/hooks/useThemeManager";
import { useAuth } from "@/hooks/hooks-index";
import { LAYOUT, COLORS } from "@/lib/unifiedStyles";
import { useState, useEffect } from "react";

function MainPage() {
  const { displayData, timePeriod, isLoading, error } = useWeatherData();
  const { user } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useThemeManager(timePeriod);

  // Show login popup if user is not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      setShowLoginPopup(true);
    }
  }, [user, isLoading]);

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

  // Don't render main content if user is not authenticated
  if (!user) {
    return (
      <>
        <div className="flex min-h-dvh flex-col items-center justify-center overflow-auto">
          <WeatherBackground
            condition={displayData.condition}
            timePeriod={timePeriod}
          />
        </div>
        <LoginPopup isOpen={showLoginPopup} />
      </>
    );
  }

  // MainPage Component //
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center overflow-auto">
      {/* Video Background */}
      <WeatherBackground
        condition={displayData.condition}
        timePeriod={timePeriod}
      />

      {/* Main Content Area (centered column) */}
      <div
        className={`flex w-full max-w-2xl items-stretch ${LAYOUT.container.column} ${LAYOUT.spacing.md} ${LAYOUT.padding.md}`}
      >
        {/* App Header with Settings Button (subtle, top-left) */}
        <header className="-mb-5 flex w-full items-center justify-between py-6 text-left">
          <SettingsButton />
          <h1
            className={`text-5xl font-bold tracking-tight transition-transform duration-200 will-change-transform select-none ${COLORS.text.primary}`}
          >
            <span className="group relative inline-block">
              <span className="bg-gradient-radial animate-glow-simple pointer-events-none absolute top-1/2 left-1/2 -z-10 block h-[220%] w-[220%] -translate-x-1/2 -translate-y-1/2 rounded-full from-yellow-100 via-white/80 to-blue-200/0 opacity-70 blur-3xl transition-all duration-700 group-hover:scale-110 group-hover:opacity-100 dark:from-blue-900/30 dark:via-slate-800/40 dark:to-transparent dark:opacity-50" />
              weathertunes
            </span>
          </h1>
        </header>

        {/* Unified Weather and Music Display */}
        <div className="transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
          <BaseCard withPadding={false} enableLiquidGlass>
            <WeatherMusicCard weatherData={displayData} />
          </BaseCard>
        </div>

        {/* Next Up Scroll Area */}
        <div className="transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
          <BaseCard withPadding={false} className="" enableLiquidGlass>
            <QueueCard />
          </BaseCard>
        </div>

        {/* Spotify Search */}
        <div className="transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
          <SpotifySearchCard />
        </div>

        {/* 5-Day Weather Forecast */}
        <div className="transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
          <ForecastCard />
        </div>

        {/* Favorites List */}
        <div className="transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
          <BaseCard className="w-full" contentClassName="p-4" enableLiquidGlass>
            <FavoritesCard />
          </BaseCard>
        </div>

        {/* Bottom Padding */}
        <div className="h-16" />
        <div className="w-full pb-2 text-center">
          <span
            className={`-mb-6 block text-lg font-semibold tracking-wide ${COLORS.text.primary}`}
          >
            Blaze your glory<sup className="text-xs">™</sup>
          </span>
        </div>
        <footer
          className={`w-full pb-4 text-center text-xs ${COLORS.text.primary}`}
        >
          © {new Date().getFullYear()} Team Meow Ltd. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default MainPage;
