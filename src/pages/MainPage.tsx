import UnifiedDisplay from "@/components/UnifiedDisplay"; // Import the new unified component
import { Card, CardContent } from "@/components/ui/card";
import { UpNext } from "@/components/UpNext";
import { VideoBackground } from "@/components/VideoBackground";
import { useWeatherData, useThemeFromWeather } from "@/hooks/useWeather";

function MainPage() {
  const { displayData, timePeriod, isLoading, error } = useWeatherData();

  // PLACEHOLDER DATA FOR CURRENTLY PLAYING //
  const songData = {
    songTitle: "Angel's Fake",
    artistName: "DAZBEE",
    albumArtUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f9/3c/d1/f93cd16d-2329-561c-a851-672eea4e48c3/23UMGIM87924.rgb.jpg/800x800cc.jpg",
  };

  useThemeFromWeather(timePeriod);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center overflow-auto">
        <p className="text-2xl text-gray-700 dark:text-slate-300">
          Loading weather data...
        </p>
      </div>
    );
  }

  // Error State
  if (error || displayData.isError) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center overflow-auto">
        <p className="text-2xl text-red-500">
          Error: {displayData.condition || "Could not load weather data."}
        </p>
        {error && <p className="text-sm text-red-400">{error.message}</p>}
      </div>
    );
  }

  // MainPage Component //
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center overflow-auto">
      {/* Video Background */}
      <VideoBackground
        condition={displayData.condition}
        timePeriod={timePeriod}
      />

      {/* Main Content Area (centered column) */}
      <div className="flex h-full w-full max-w-2xl flex-col items-stretch gap-4 px-4">
        {/* App Header (left-aligned within centered column) */}
        <header className="-mb-5 py-6 text-left">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 transition-transform duration-200 will-change-transform select-none dark:text-slate-100">
            <span className="inline-block drop-shadow-[0_0_24px_rgba(240,240,240,0.9)] transition-transform duration-200 hover:scale-[1.03] hover:drop-shadow-[0_0_32px_rgba(240,240,240,0.95)] dark:drop-shadow-[0_0_24px_rgba(30,41,59,0.95)] dark:hover:drop-shadow-[0_0_32px_rgba(30,41,59,1)]">
              weathertunes
            </span>
          </h1>
        </header>

        {/* Unified Weather and Currently Playing Display */}
        <Card className="bg-white/40 backdrop-blur-md dark:bg-slate-900/75">
          <CardContent className="p-0">
            <UnifiedDisplay
              weatherData={displayData} // Pass the new displayData
              songTitle={songData.songTitle}
              artistName={songData.artistName}
              albumArtUrl={songData.albumArtUrl}
            />
          </CardContent>
        </Card>

        {/* Currently Playing Section */}
        <Card className="bg-white/40 backdrop-blur-md dark:bg-slate-900/75">
          <CardContent className="flex h-32 items-center justify-center text-4xl text-gray-700 dark:text-slate-300">
            [TODO: put spotify player here]
          </CardContent>
        </Card>

        {/* Next Up Scroll Area */}
        <Card className="bg-white/40 backdrop-blur-md dark:bg-slate-900/75">
          <CardContent className="p-0">
            <UpNext />
          </CardContent>
        </Card>

        {/* Favorites List */}
        <Card className="w-full bg-white/40 backdrop-blur-md dark:bg-slate-900/75">
          <CardContent className="flex h-32 items-center justify-center text-4xl text-gray-700 dark:text-slate-300">
            [TODO: put favorites list here]
          </CardContent>
        </Card>

        {/* Bottom Padding */}
        <div className="h-16" />
        <div className="w-full pb-2 text-center">
          <span className="-mb-6 block text-lg font-semibold tracking-wide text-gray-900 drop-shadow-[0_0_16px_rgba(240,240,240,0.9)] dark:text-slate-400 dark:drop-shadow-[0_0_16px_rgba(255,255,255,0.9)]">
            Blaze your glory<sup className="text-xs">™</sup>
          </span>
        </div>
        <footer className="w-full pb-4 text-center text-xs text-gray-900 drop-shadow-[0_0_16px_rgba(240,240,240,0.9)] dark:text-slate-400 dark:drop-shadow-[0_0_16px_rgba(255,255,255,0.9)]">
          © {new Date().getFullYear()} Team Meow Ltd. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default MainPage;
