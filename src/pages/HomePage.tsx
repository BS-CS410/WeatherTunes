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
import { useSpotifyAuth } from "@/hooks/useSpotifyAuth";
import { LAYOUT, COLORS } from "@/lib/design-system";
import { useState, useEffect } from "react";

function MainPage() {
  const { displayData, timePeriod, isLoading, error } = useWeatherData();
  const {
    user,
    isLoading: authLoading,
    error: authError,
    login,
    logout,
  } = useSpotifyAuth();
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

      {/* Auth Debug Component - Remove in production */}
      <div className="fixed top-4 right-4 z-50">
        {authLoading ? (
          <div>Loading auth status...</div>
        ) : (
          <div className="rounded-lg bg-gray-100 p-4 text-sm text-black">
            <h3 className="mb-2 font-semibold">Auth Status</h3>
            <div className="space-y-1">
              <div>
                Status:{" "}
                {user
                  ? `✅ ${user.display_name || user.id}`
                  : "❌ Not authenticated"}
              </div>
              {authError && (
                <div className="text-red-600">Error: {authError}</div>
              )}
            </div>
            <div className="mt-3 space-x-2">
              {!user ? (
                <button
                  onClick={login}
                  className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                >
                  Login with Spotify
                </button>
              ) : (
                <button
                  onClick={logout}
                  className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>

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
