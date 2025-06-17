import WeatherTunesDisplay from "@/components/WeatherTunesDisplay";
import UpNext from "@/components/UpNext";
import CurrentlyPlaying from "@/components/CurrentlyPlaying";
import Favorites from "@/components/Favorites";
import { VideoBackground } from "@/components/VideoBackground";
import { SettingsButton } from "@/components/SettingsButton";
import { ForecastCard } from "@/components";
import { useWeatherData } from "@/hooks/useWeather";
import { useThemeManager } from "@/hooks/useThemeManager";
import { GlassCard } from "@/components/shared/GlassCard";
import { LoadingState, ErrorState } from "@/components/shared/StateComponents";
import { LAYOUT } from "@/lib/sharedStyles";

function MainPage() {
  const { displayData, timePeriod, isLoading, error } = useWeatherData();

  useThemeManager(timePeriod);

  // Loading State
  if (isLoading) {
    return <LoadingState message="Loading weather data..." />;
  }

  // Error State
  if (error || displayData.isError) {
    return (
      <ErrorState
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
      <VideoBackground
        condition={displayData.condition}
        timePeriod={timePeriod}
      />

      {/* Main Content Area (centered column) */}
      <div className={LAYOUT.container}>
        {/* App Header (left-aligned within centered column) */}
        <header className="-mb-5 py-6 text-left">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 transition-transform duration-200 will-change-transform select-none dark:text-slate-100">
            <span className="inline-block drop-shadow-[0_0_24px_rgba(240,240,240,0.9)] transition-transform duration-200 hover:scale-[1.03] hover:drop-shadow-[0_0_32px_rgba(240,240,240,0.95)] dark:drop-shadow-[0_0_24px_rgba(30,41,59,0.95)] dark:hover:drop-shadow-[0_0_32px_rgba(30,41,59,1)]">
              weathertunes
            </span>
          </h1>
        </header>

        {/* Unified Weather and Currently Playing Display */}
        <GlassCard withPadding={false}>
          <WeatherTunesDisplay weatherData={displayData} />
        </GlassCard>

        {/* Currently Playing Section */}
        <GlassCard>
          <CurrentlyPlaying />
        </GlassCard>

        {/* Next Up Scroll Area */}
        <GlassCard withPadding={false} className="">
          <UpNext />
        </GlassCard>

        {/* 5-Day Weather Forecast */}
        <ForecastCard />

        {/* Favorites List */}
        <GlassCard className="w-full" contentClassName="p-4">
          <Favorites />
        </GlassCard>

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
