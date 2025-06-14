"use client";

import { useState, useEffect } from "react"; //for API calls and state management
import { WeatherDisplay } from "@/components/WeatherDisplay";
import { BigSun } from "@/components/BigSun";
import { Card, CardContent } from "@/components/ui/card";
import { UpNext } from "@/components/UpNext";
import { VideoBackground } from "@/components/VideoBackground";
import { getTimePeriod } from "@/lib/utils";

function MainPage() {
  // Hooks
  const [detailedWeatherData, setDetailedWeatherData] =
    useState<WeatherApiResponse | null>(null);

  // Derive display data from detailed weather data
  const weatherData = detailedWeatherData
    ? {
        location: detailedWeatherData.name,
        temperature:
          detailedWeatherData.name === "Error"
            ? "--"
            : Math.round(detailedWeatherData.main.temp).toString(),
        condition: detailedWeatherData.weather[0].main,
        unit: "°F",
      }
    : {
        location: "",
        temperature: "",
        condition: "",
        unit: "°F",
      };

  // Weather API call
  useEffect(() => {
    const apiKey = import.meta.env.VITE_PUBLIC_OPENWEATHER_API_KEY;
    getUserLocationAndFetch(apiKey)
      .then((data) => {
        setDetailedWeatherData(data);
      })
      .catch((error) => {
        console.error("Error fetching weather:", error);
        // Set error state in detailed data
        setDetailedWeatherData({
          name: "Error",
          main: { temp: 0, humidity: 0, pressure: 0 },
          weather: [{ main: "Unable to load", description: "Error", id: 0 }],
          sys: { sunrise: 0, sunset: 0 },
        });
      });
  }, []);

  // Theme switching based on time
  useEffect(() => {
    if (detailedWeatherData && detailedWeatherData.sys) {
      const now = new Date();
      const { sunrise, sunset } = detailedWeatherData.sys;
      const period = getTimePeriod(now, sunrise, sunset);
      const root = window.document.documentElement;

      if (period === "evening" || period === "night") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [detailedWeatherData]); // Rerun when weather data (and thus sunrise/sunset) is available or changes

  // MainPage Component //
  return (
    <div className="flex min-h-dvh flex-col overflow-auto">
      {/* Video Background */}
      <VideoBackground weatherConditions={detailedWeatherData} />

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
        {/* Location, Temperature, Current Conditions */}
        <Card className="aspect-[2/1] w-full bg-white/80 dark:bg-slate-900/75">
          <CardContent className="h-full w-full p-0">
            <div className="flex h-full w-full flex-row items-center justify-center gap-x-[2%]">
              {/* Weather Display */}
              <div className="h-auto w-[44%] flex-shrink-0">
                <WeatherDisplay weatherData={weatherData} />
              </div>
              {/* Sun Illustration */}
              <div className="h-auto w-[44%] flex-shrink-0">
                <BigSun />
              </div>
            </div>
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
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    main: string;
    description: string;
    id: number;
  }[];
  wind?: {
    speed: number;
  };
  clouds?: {
    all: number;
  };
  visibility?: number;
  sys: {
    sunrise: number;
    sunset: number;
  };
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
        // fallback to Bellevue and hope no one notices
        fetchWeatherByCoords(47.58531518716315, -122.14778448861998, apiKey)
          .then(resolve)
          .catch(reject);
      },
      { timeout: 10_000 },
    );
  });
}

export default MainPage;
