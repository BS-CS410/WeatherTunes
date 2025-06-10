"use client";

import { useState, useEffect } from "react"; //for API
import { Cloud, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

function Home() {
  // Hooks
  const [weatherData, setWeatherData] = useState({
    location: "",
    temperature: "",
    condition: "",
    unit: "°F",
  });
  const [musicData, setMusicData] = useState({
    songName: "Song Name",
    artistName: "Artist Name",
    duration: "3:42",
    currentTime: "2:34",
    albumCover: "",
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);

  // Weather API call
  useEffect(() => {
    const apiKey = import.meta.env.VITE_PUBLIC_OPENWEATHER_API_KEY;
    getUserLocationAndFetch(apiKey)
      .then((data) => {
        setWeatherData({
          location: data.name,
          temperature: Math.round(data.main.temp).toString(),
          condition: data.weather[0].main,
          unit: "°F",
        });
      })
      .catch((error) => {
        console.error("Error fetching weather:", error);
        setWeatherData({
          location: "Error",
          temperature: "--",
          condition: "Unable to load",
          unit: "°F",
        });
      });
  }, []);

  // Music API call (placeholder )
  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        // Replace later
        const response = await fetch("https://api.example.com/current-track", {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_MUSIC_API_KEY}`,
          },
        });
        if (!response.ok) throw new Error("Music API error");
        const data = await response.json();

        setMusicData({
          songName: data.track?.name || "Unknown Song",
          artistName: data.track?.artist || "Unknown Artist",
          duration: data.track?.duration || "3:42",
          currentTime: data.track?.currentTime || "2:34",
          albumCover: data.track?.albumCover || "",
        });

        // Update progress based on currentTime and duration
        const [currentMins, currentSecs] = (data.track?.currentTime ?? "0:0")
          .split(":")
          .map(Number);
        const [totalMins, totalSecs] = (data.track?.duration || "0:0")
          .split(":")
          .map(Number);

        const current = currentMins * 60 + currentSecs;
        const total = totalMins * 60 + totalSecs;
        setProgress((current / total) * 100);
      } catch (error) {
        console.error("Error fetching music data:", error);
        setMusicData({
          songName: "Error",
          artistName: "Unable to load",
          duration: "0:00",
          currentTime: "0:00",
          albumCover: "",
        });
      }
    };

    // Optionally, poll for music updates
    fetchMusicData(); // ensures the music player displays data immediately when the component loads.
    const interval = setInterval(fetchMusicData, 5000); // Update every 5 seconds; keeps the music data fresh by periodically checking for updates (e.g., if the user skips to a new song)
    return () => clearInterval(interval); //prevents the interval from running after the component is gone, which is critical for performance and avoiding errors
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 to-sky-300 relative overflow-hidden">
      {/* Navigation */}
      <nav className="flex items-center p-6 relative z-10">
        <Cloud className="w-12 h-12 text-white" />
      </nav>

      {/* Weather Content */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 mt-8 sm:mt-10 md:mt-12 relative z-10">
        <h1 className="text-gray-800 text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
          {weatherData.location || "Loading..."}
        </h1>
        <div className="text-gray-800 text-4xl md:text-6xl lg:text-8xl font-bold mb-2">
          {weatherData.temperature
            ? `${weatherData.temperature}${weatherData.unit}`
            : "--°"}
        </div>
        <p className="text-gray-600 text-lg md:text-2xl">
          {weatherData.condition || "Loading..."}
        </p>
      </div>

      {/* Sun Illustration */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
        <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-yellow-300" />
      </div>

      {/* Music Player */}
      <div className="fixed bottom-4 inset-x-0 mx-auto w-full max-w-4xl px-4 sm:px-6 md:px-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            {/* Album Cover and Track Info */}
            <div className="flex items-center space-x-4">
              {/* Album Cover */}
              <div className="w-12 h-12 rounded-md flex items-center justify-center overflow-hidden">
                {musicData.albumCover ? (
                  <img
                    src={musicData.albumCover}
                    alt="Album cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[#494a4b] text-xs">Cover</span>
                )}
              </div>

              {/* Track Info */}
              <div className="flex flex-col">
                <span className="text-[#2e2e2e] font-medium text-sm">
                  {musicData.songName}
                </span>
                <span className="text-[#494a4b] text-xs">
                  {musicData.artistName}
                </span>
              </div>
            </div>

            {/* Time */}
            <div className="text-[#494a4b] text-sm font-mono">
              {musicData.currentTime} / {musicData.duration}
            </div>
          </div>

          <div className="flex items-center justify-center space-x-6 mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 text-gray-800 hover:bg-gray-300/50"
            >
              <SkipBack className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="w-16 h-16 text-gray-800 hover:bg-gray-300/50"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 text-[#2e2e2e] hover:bg-[#d9d9d9]/50"
            >
              <SkipForward className="w-6 h-6" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="w-full">
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div
                className="bg-gray-800 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fetch weather from OpenWeatherMap API using given coordinates
async function fetchWeatherByCoords(
  lat: number,
  lon: number,
  apiKey: string,
): Promise<WeatherApiResponse> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`,
  );
  if (!res.ok) throw new Error("Weather API error");
  return res.json();
}

// Interface to tell TypeScript what fetchWeatherbyCoords returns
interface WeatherApiResponse {
  name: string;
  main: { temp: number };
  weather: { main: string }[];
}

// Request user's location from browser and then send the coordinates to fetchWeatherByCoords above
function getUserLocationAndFetch(apiKey: string): Promise<WeatherApiResponse> {
  return new Promise<WeatherApiResponse>((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("Geolocation not supported"));
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const data = await fetchWeatherByCoords(latitude, longitude, apiKey);
          resolve(data);
        } catch (err) {
          reject(err);
        }
      },
      () => {
        // fallback to Seattle
        fetchWeatherByCoords(47.6062, -122.3321, apiKey)
          .then(resolve)
          .catch(reject);
      },
      { timeout: 10_000 },
    );
  });
}

export default Home;
