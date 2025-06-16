import { useEffect, useMemo, useState } from "react";
import UnifiedDisplay from "@/components/UnifiedDisplay";
import { Card, CardContent } from "@/components/ui/card";
import { UpNext } from "@/components/UpNext";
import { VideoBackground } from "@/components/VideoBackground";
import { useWeatherData, useThemeFromWeather } from "@/hooks/useWeather";
import Favorites from "@/components/Favorites";
import CurrentlyPlaying from "@/components/CurrentlyPlaying";

// Helper function to send weather data
async function sendWeatherData(payload: {
  username: string;
  location: string;
  temperature: string;
  condition: string;
  time_period: string;
}) {
  try {
    const response = await fetch("/weather", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.json();
  } catch (err) {
    console.error("Failed to send weather data:", err);
    throw err;
  }
}

// Helper function to fetch logged-in user info from backend session
async function fetchUsername() {
  try {
    const res = await fetch("/session", {
      credentials: "include",
    });
    const data = await res.json();
    if (data.logged_in && data.spotify_username) {
      return data.spotify_username;
    }
    return null;
  } catch (err) {
    console.error("Failed to fetch user session:", err);
    return null;
  }
}

function MainPage() {
  const { displayData, timePeriod, isLoading, error } = useWeatherData();
  const [username, setUsername] = useState<string | null>(null);

  // Fetch username once on mount
  useEffect(() => {
    fetchUsername().then(setUsername);
  }, []);

  // Memoize current weather info for sending to backend
  const currentWeather = useMemo(() => ({
    location: displayData.location || "unknown",
    temperature: displayData.temperature || "",
    condition: displayData.condition || "",
    time_period: timePeriod || "",
  }), [displayData.location, displayData.temperature, displayData.condition, timePeriod]);

  // Send weather data whenever username or weather changes
  useEffect(() => {
    if (username && currentWeather.temperature && currentWeather.condition) {
      sendWeatherData({
        username,
        ...currentWeather,
      }).then((res) => {
        console.log("Weather data sent to backend:", res);
      });
    }
  }, [username, currentWeather]);


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

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center overflow-auto">
      {/* Settings Button
      <SettingsButton /> */}

      {/* Video Background */}
      <VideoBackground condition={displayData.condition} timePeriod={timePeriod} />

      {/* Main Content Area */}
      <div className="flex w-full max-w-2xl flex-col items-stretch gap-4 px-4">
        {/* App Header */}
        <header className="-mb-5 w-full py-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 transition-transform duration-200 will-change-transform select-none dark:text-slate-100">
            <span className="inline-block drop-shadow-[0_0_24px_rgba(240,240,240,0.9)] transition-transform duration-200 hover:scale-[1.03] hover:drop-shadow-[0_0_32px_rgba(240,240,240,0.95)] dark:drop-shadow-[0_0_24px_rgba(30,41,59,0.95)] dark:hover:drop-shadow-[0_0_32px_rgba(30,41,59,1)]">
              WEATHERTUNES
            </span>
          </h1>
        </header>

      {/* Unified Display */}
        <CardContent className="h-full w-full p-0">
          <UnifiedDisplay
            weatherData={displayData}
          />
        </CardContent>
      

        {/* Spotify Player */}
        <Card className="w-full bg-white/40 backdrop-blur-md dark:bg-slate-900/75">
          <CardContent className="flex flex-col items-center justify-center text-4xl text-gray-700 dark:text-slate-300">
            <CurrentlyPlaying />
          </CardContent>
        </Card>


        {/* Favorites */}
        <Card className="w-full bg-white/40 backdrop-blur-md dark:bg-slate-900/75">
          <CardContent className="flex h-32 items-center justify-center text-4xl text-gray-700 dark:text-slate-300">
            <Favorites />
          </CardContent>
        </Card>

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
