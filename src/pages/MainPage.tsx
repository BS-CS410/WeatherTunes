import UnifiedDisplay from "@/components/UnifiedDisplay"; // Import the new unified component
import { Card, CardContent } from "@/components/ui/card";
import { UpNext } from "@/components/UpNext";
import { VideoBackground } from "@/components/VideoBackground";
import {
  useWeatherData,
  useThemeFromWeather,
  getWeatherDisplayData,
} from "@/hooks/useWeather";

function MainPage() {
  const weatherData = useWeatherData();
  const displayData = getWeatherDisplayData(weatherData);

  // PLACEHOLDER DATA FOR CURRENTLY PLAYING //
  const songData = {
    songTitle: "Angel's Fake",
    artistName: "DAZBEE",
    albumArtUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f9/3c/d1/f93cd16d-2329-561c-a851-672eea4e48c3/23UMGIM87924.rgb.jpg/800x800cc.jpg",
  };

  useThemeFromWeather(weatherData);

  // MainPage Component //
  return (
    <div className="flex min-h-dvh flex-col overflow-auto">
      {/* Video Background */}
      <VideoBackground weatherConditions={weatherData} />

      {/* Main Content Area (centered column) */}
      <div className="mx-auto flex w-full max-w-2xl flex-col items-stretch gap-4 px-4">
        {/* App Header (left-aligned within centered column) */}
        <header className="-mb-5 w-full py-6 text-left">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 transition-transform duration-200 will-change-transform select-none dark:text-slate-100">
            <span className="inline-block drop-shadow-[0_0_24px_rgba(240,240,240,0.9)] transition-transform duration-200 hover:scale-[1.03] hover:drop-shadow-[0_0_32px_rgba(240,240,240,0.95)] dark:drop-shadow-[0_0_24px_rgba(255,255,255,0.9)] dark:hover:drop-shadow-[0_0_32px_rgba(255,255,255,0.95)]">
              weathertunes
            </span>
          </h1>
        </header>
        {/* Unified Weather and Currently Playing Display */}
        <Card className="aspect-video w-full bg-white/80 md:aspect-[2/1] dark:bg-slate-900/75">
          <CardContent className="h-full w-full p-0">
            <UnifiedDisplay
              weatherData={displayData}
              songTitle={songData.songTitle}
              artistName={songData.artistName}
              albumArtUrl={songData.albumArtUrl}
            />
          </CardContent>
        </Card>

        <Card className="w-full bg-white/80 dark:bg-slate-900/75">
          <CardContent className="flex h-32 items-center justify-center text-4xl text-gray-700 dark:text-slate-300">
            [TODO: put spotify player here]
          </CardContent>
        </Card>

        {/* Next Up Scroll Area */}
        <Card className="w-full bg-white/80 dark:bg-slate-900/75">
          <CardContent className="h-full w-full p-0">
            <UpNext />
          </CardContent>
        </Card>
        {/* Bottom Padding */}
        <div className="h-16" />
        <footer className="w-full pb-4 text-center text-xs text-gray-900 drop-shadow-[0_0_16px_rgba(240,240,240,0.9)] dark:text-slate-400 dark:drop-shadow-[0_0_16px_rgba(255,255,255,0.9)]">
          © {new Date().getFullYear()} Team Meow Ltd. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default MainPage;
