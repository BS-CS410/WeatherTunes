import { getUserLocationAndFetch } from "./weather";
import type { WeatherApiResponse } from "@/types/weather";
import songs from "./spotifySongs.json";

// Playlist tag mapping by weather + temp + time
const playlistMap = {
  clear: {
    cold: {
      morning: ["cozy morning acoustic", "soft indie"],
      afternoon: ["warm indie", "relaxing pop"],
      evening: ["chill acoustic", "fireplace vibes"],
      night: ["sleepy indie", "winter lo-fi"]
    },
    mild: {
      morning: ["morning acoustic", "fresh pop"],
      afternoon: ["upbeat pop", "feel good hits"],
      evening: ["evening chill", "sunset vibes"],
      night: ["calm pop", "dreamy beats"]
    },
    hot: {
      morning: ["summer acoustic", "tropical morning"],
      afternoon: ["party hits", "summer dance"],
      evening: ["sunset pop", "beach chill"],
      night: ["late night summer vibes", "chill EDM"]
    }
  },
  rain: {
    any: {
      morning: ["lo-fi rainy morning", "cozy beats"],
      afternoon: ["chillhop rainy day", "rainy day acoustic"],
      evening: ["rainy night jazz", "soft rain indie"],
      night: ["sleepy lofi", "ambient rain sounds"]
    }
  },
  snow: {
    any: {
      morning: ["winter morning acoustic", "snowy indie vibes"],
      afternoon: ["soft piano", "cozy winter pop"],
      evening: ["fireplace jazz", "warm lo-fi"],
      night: ["winter sleep playlist", "calm ambient"]
    }
  },
  clouds: {
    any: {
      morning: ["mellow study beats", "morning lo-fi"],
      afternoon: ["chill beats to work", "ambient chill"],
      evening: ["slow lo-fi", "cloudy day indie"],
      night: ["nighttime lo-fi", "slow ambient"]
    }
  },
  wind: {
    any: {
      morning: ["cinematic morning", "epic soundtrack"],
      afternoon: ["energetic indie rock", "uplifting beats"],
      evening: ["dramatic indie", "stormy vibes"],
      night: ["dark cinematic", "moody ambient"]
    }
  }
};

// Determine time of day from hour (local)
function getTimeOfDay(hour: number): "morning" | "afternoon" | "evening" | "night" {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

// Categorize temp (Kelvin or Celsius based on your API)
// Assuming temp is in Celsius, adjust if needed.
function getTempRange(tempCelsius: number): "cold" | "mild" | "hot" {
  if (tempCelsius < 10) return "cold";
  if (tempCelsius >= 25) return "hot";
  return "mild";
}

// Main function to get Spotify track ID
export async function getSpotifyTrackForWeather(apiKey: string): Promise<string> {
  try {
    const weather: WeatherApiResponse = await getUserLocationAndFetch(apiKey);
    const conditionRaw = weather.weather[0].main.toLowerCase();

    // Map fog/mist to clouds to match playlistMap keys
    const condition = (conditionRaw === "fog" || conditionRaw === "mist") ? "clouds" : conditionRaw;

    // Assuming weather.main.temp is in Celsius. If in Kelvin, convert:
    // const tempCelsius = weather.main.temp - 273.15;
    const tempCelsius = weather.main.temp;

    const tempRange = getTempRange(tempCelsius);

    // Calculate local hour using UTC timestamp + timezone offset
    const localUnix = weather.dt + weather.timezone;
    const localHour = new Date(localUnix * 1000).getUTCHours();
    const timeOfDay = getTimeOfDay(localHour);

    // Get playlist tags from map
    const mapForCondition = playlistMap[condition as keyof typeof playlistMap];
    let tags: string[] = [];

    if (mapForCondition) {
      if ("any" in mapForCondition) {
        tags = mapForCondition.any[timeOfDay];
      } else {
        tags = mapForCondition[tempRange][timeOfDay];
      }
    }

    // Pick random tag
    const chosenTag = tags[Math.floor(Math.random() * tags.length)];

    // Find song with that tag
    const matchedSong = songs.find(song => song.tags.includes(chosenTag));

    // Fallback random song if no match
    if (matchedSong) return matchedSong.id;
    return songs[Math.floor(Math.random() * songs.length)].id;

  } catch (error) {
    console.error("Error in getSpotifyTrackForWeather:", error);
    // Return random fallback
    return songs[Math.floor(Math.random() * songs.length)].id;
  }
}
