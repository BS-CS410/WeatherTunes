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
      {/* Location, Temperature, Current Conditions */}
      <Card className="mx-auto aspect-[2/1] w-full max-w-2xl bg-slate-900/75">
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

      <Card className="mx-auto mt-6 w-full max-w-2xl bg-slate-900/75">
        <CardContent className="flex h-32 items-center justify-center text-4xl text-slate-300">
          [TODO: put spotify player here]
        </CardContent>
      </Card>

      {/* Next Up Scroll Area */}
      <Card className="mx-auto mt-6 w-full max-w-2xl bg-slate-900/75">
        <CardContent className="h-full w-full p-0">
          <UpNext />
        </CardContent>
      </Card>
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
