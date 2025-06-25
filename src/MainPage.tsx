import {
  ErrorDisplay,
  WeatherMusicCard,
  ForecastCard,
  QueueCard,
  FavoritesCard,
  SpotifySearchCard,
} from "@/components";
import { SettingsButton } from "@/components/settings/SettingsButton";
import { WeatherBackground } from "@/components/weather/WeatherBackground";
import { LoadingSpinner } from "@/components/shared/StatusComponents";
import { useEffect } from "react";
import { useWeatherData } from "@/hooks/useWeatherData";
import { useThemeManager } from "@/hooks/useThemeManager";
import { useAuth } from "@/hooks/useAuth";
import { useWeatherQueue } from "@/hooks/useWeatherQueue";
import { useSpotifyQueue } from "@/hooks/spotify"; // Import useSpotifyQueue
import { LAYOUT, COLORS } from "@/lib";

function MainPage() {
  const weatherState = useWeatherData();
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const { data: weatherData, isLoading, error } = weatherState;
  const { displayData, timePeriod } = weatherData || {};
  const { replaceQueueWithWeatherTracks, generateWeatherQueue } =
    useWeatherQueue(); // Use the hook
  const { upcomingTracks, addToQueue } = useSpotifyQueue();

  // Set theme based on time of day
  useThemeManager(timePeriod || "day");

  // Generate queue on initial load if authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log("User authenticated, generating initial weather queue...");
      replaceQueueWithWeatherTracks(15); // Generate a queue of 15 tracks
    }
  }, [isAuthenticated, authLoading, replaceQueueWithWeatherTracks]);

  // Replenish queue when it falls below the target length
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      if (upcomingTracks.length < 5) {
        const tracksNeeded = 15 - upcomingTracks.length;
        console.log(
          `Queue length (${upcomingTracks.length}) below target, replenishing ${tracksNeeded} tracks...`,
        );
        generateWeatherQueue(tracksNeeded).then((newTracks) => {
          addToQueue(newTracks);
          console.log(`Replenished queue with ${newTracks.length} tracks.`);
        });
      }
    }
  }, [
    isAuthenticated,
    authLoading,
    upcomingTracks,
    generateWeatherQueue,
    addToQueue,
  ]);

  // Loading State
  if (isLoading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <ErrorDisplay
        title={error || "Could not load weather data."}
        message="Please try again later or check your connection."
      />
    );
  }

  // If no weather data is available
  if (!weatherData || !displayData) {
    return (
      <ErrorDisplay
        title="No weather data available"
        message="We couldn't retrieve weather information for your location."
      />
    );
  }

  // Don't render main content if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen">
        {/* Dynamic Weather Background */}
        <WeatherBackground
          condition={displayData?.condition}
          timePeriod={timePeriod}
        />

        {/* Login Content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="w-full max-w-md rounded-lg border border-white/20 bg-white/10 p-8 text-center backdrop-blur-md">
            <h1 className="mb-4 text-3xl font-bold text-white">
              Welcome to WeatherTunes
            </h1>
            <p className="mb-6 text-white/90">Please log in to continue.</p>
            <button
              onClick={login}
              className="w-full rounded-lg bg-green-500/80 px-6 py-3 font-semibold text-white transition-all hover:bg-green-500/90 hover:shadow-lg hover:shadow-green-500/25"
            >
              Log in with Spotify
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        {/* App Header with Settings Button (top-left) */}
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

        {/* Weather and Music Card */}
        <div>
          <WeatherMusicCard weatherData={displayData} />
        </div>

        {/* Queue Display */}
        <div>
          <QueueCard />
        </div>

        {/* Spotify Search */}
        <div>
          <SpotifySearchCard />
        </div>

        {/* 5-Day Forecast */}
        <div>
          <ForecastCard />
        </div>

        {/* Favorites List */}
        <div>
          <FavoritesCard />
        </div>

        {/* Bottom Padding */}
        <div className="h-16" />

        {/* Footer */}
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
