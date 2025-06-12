"use client";

import { useState, useEffect } from "react"; //for API
import {} from "module";
import { WeatherDisplay } from "@/components/WeatherDisplay";
import { MusicPlayer } from "@/components/MusicPlayer";
import { BigSun } from "@/components/BigSun";

function MainPage() {
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

  // Music API call (placeholder)
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
    <div className="flex min-h-dvh flex-col overflow-auto">
      {/* Location, Temperature, Current Conditions */}
      <WeatherDisplay weatherData={weatherData} />

      {/* Sun Illustration */}
      <BigSun />

      {/* Trackname, Pause, Play, etc. */}
      <MusicPlayer
        musicData={musicData}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        progress={progress}
      />
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

export default MainPage;
