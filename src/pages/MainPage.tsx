"use client";

import { useState, useEffect } from "react"; //for API
import {} from "module";
import { WeatherDisplay } from "@/components/WeatherDisplay";
import { BigSun } from "@/components/BigSun";
import { Card, CardContent } from "@/components/ui/card";
import { UpNext } from "@/components/UpNext";

function MainPage() {
  // Hooks
  const [weatherData, setWeatherData] = useState({
    location: "",
    temperature: "",
    condition: "",
    unit: "°F",
  });

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

  return (
    <div className="flex min-h-dvh flex-col overflow-auto">
      {/* Main Content Area (centered column) */}
      <div className="mx-auto flex w-full max-w-2xl flex-col items-stretch gap-4 px-4">
        {/* App Header (left-aligned within centered column) */}
        <header className="-mb-5 w-full py-6 text-left">
          <h1 className="text-5xl font-bold tracking-tight text-slate-100 drop-shadow-lg transition-transform duration-200 will-change-transform select-none">
            <span className="inline-block transition-transform duration-200 hover:scale-[1.03] hover:drop-shadow-2xl">
              weathertunes
            </span>
          </h1>
        </header>
        {/* Location, Temperature, Current Conditions */}
        <Card className="aspect-[2/1] w-full bg-slate-900/75">
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

        <Card className="w-full bg-slate-900/75">
          <CardContent className="flex h-32 items-center justify-center text-4xl text-slate-300">
            [TODO: put spotify player here]
          </CardContent>
        </Card>

        {/* Next Up Scroll Area */}
        <Card className="w-full bg-slate-900/75">
          <CardContent className="h-full w-full p-0">
            <UpNext />
          </CardContent>
        </Card>
        {/* Bottom Padding */}
        <div className="h-16" />
        <footer className="w-full pb-4 text-center text-xs text-slate-500">
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
