import { getUserLocationAndFetch } from "./weather";
import type { WeatherApiResponse } from "@/types/weather";
import tracks from "./tracks.json"; // Updated import

// Define more specific types for the playlistMap
type TimeOfDay = "morning" | "afternoon" | "evening" | "night";
type TempRange = "cold" | "mild" | "hot";

interface WeatherConditionTimings {
  morning: string[];
  afternoon: string[];
  evening: string[];
  night: string[];
}

interface TempSpecificPlaylists {
  cold: WeatherConditionTimings;
  mild: WeatherConditionTimings;
  hot: WeatherConditionTimings;
}

interface AnyTempPlaylists {
  any: WeatherConditionTimings;
}

type PlaylistConditionMap = TempSpecificPlaylists | AnyTempPlaylists;

// Playlist tag mapping by weather + temp + time
const playlistMap: Record<string, PlaylistConditionMap> = {
  clear: {
    cold: {
      morning: ["cozy morning acoustic", "soft indie"],
      afternoon: ["warm indie", "relaxing pop"],
      evening: ["chill acoustic", "fireplace vibes"],
      night: ["sleepy indie", "winter lo-fi"],
    },
    mild: {
      morning: ["morning acoustic", "fresh pop"],
      afternoon: ["upbeat pop", "feel good hits"],
      evening: ["evening chill", "sunset vibes"],
      night: ["calm pop", "dreamy beats"],
    },
    hot: {
      morning: ["summer acoustic", "tropical morning"],
      afternoon: ["party hits", "summer dance"],
      evening: ["sunset pop", "beach chill"],
      night: ["late night summer vibes", "chill EDM"],
    },
  },
  rain: {
    any: {
      morning: ["lo-fi rainy morning", "cozy beats"],
      afternoon: ["chillhop rainy day", "rainy day acoustic"],
      evening: ["rainy night jazz", "soft rain indie"],
      night: ["sleepy lofi", "ambient rain sounds"],
    },
  },
  snow: {
    any: {
      morning: ["winter morning acoustic", "snowy indie vibes"],
      afternoon: ["soft piano", "cozy winter pop"],
      evening: ["fireplace jazz", "warm lo-fi"],
      night: ["winter sleep playlist", "calm ambient"],
    },
  },
  clouds: {
    any: {
      morning: ["mellow study beats", "morning lo-fi"],
      afternoon: ["chill beats to work", "ambient chill"],
      evening: ["slow lo-fi", "cloudy day indie"],
      night: ["nighttime lo-fi", "slow ambient"],
    },
  },
  wind: {
    // Assuming 'wind' should also use 'any' structure
    any: {
      morning: ["cinematic morning", "epic soundtrack"],
      afternoon: ["energetic indie rock", "uplifting beats"],
      evening: ["dramatic indie", "stormy vibes"],
      night: ["dark cinematic", "moody ambient"],
    },
  },
};

// Determine time of day from hour (local)
function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

// Categorize temp (Kelvin or Celsius based on your API)
// Assuming temp is in Celsius, adjust if needed.
function getTempRange(tempCelsius: number): TempRange {
  if (tempCelsius < 10) return "cold";
  if (tempCelsius >= 25) return "hot";
  return "mild";
}

// Main function to get Spotify track ID
export async function getSpotifyTrackForWeather(
  apiKey: string,
): Promise<string> {
  try {
    const weather: WeatherApiResponse = await getUserLocationAndFetch(apiKey);
    const conditionRaw = weather.weather[0].main.toLowerCase();

    const condition =
      conditionRaw === "fog" || conditionRaw === "mist"
        ? "clouds"
        : conditionRaw;

    const tempCelsius = weather.main.temp;
    const tempRange = getTempRange(tempCelsius);
    const now = new Date();
    const localHour = now.getHours();
    const timeOfDay = getTimeOfDay(localHour);

    let selectedTags: string[] = [];
    const conditionMap = playlistMap[condition];

    if (conditionMap) {
      if ("any" in conditionMap) {
        // Check if it's an AnyTempPlaylists type
        selectedTags = conditionMap.any[timeOfDay];
      } else if (tempRange in conditionMap) {
        // Check if it's a TempSpecificPlaylists type and tempRange is a valid key
        selectedTags = (conditionMap as TempSpecificPlaylists)[tempRange][
          timeOfDay
        ];
      }
    }

    if (selectedTags.length === 0) {
      console.warn(
        `No specific tags for ${condition}, ${tempRange}, ${timeOfDay}. Using default.`,
      );
      selectedTags = (playlistMap.clear as TempSpecificPlaylists).mild
        .afternoon;
    }

    const matchingSongs = tracks.filter((song) => {
      if (!song.tags) return false;
      return selectedTags.every((tag) => song.tags!.includes(tag));
    });

    if (matchingSongs.length > 0) {
      const randomIndex = Math.floor(Math.random() * matchingSongs.length);
      return matchingSongs[randomIndex].id;
    }

    // Fallback: find songs with at least one matching tag
    const fallbackSongs = tracks.filter((song) => {
      if (!song.tags) return false;
      return selectedTags.some((tag) => song.tags!.includes(tag));
    });

    if (fallbackSongs.length > 0) {
      const randomIndex = Math.floor(Math.random() * fallbackSongs.length);
      console.warn("Using fallback song (partial tag match)");
      return fallbackSongs[randomIndex].id;
    }

    // Final fallback: return a random song with tags
    const songsWithTags = tracks.filter(
      (song) => song.tags && song.tags.length > 0,
    );
    if (songsWithTags.length > 0) {
      const randomIndex = Math.floor(Math.random() * songsWithTags.length);
      console.warn("No matching songs found, picking random song with tags.");
      return songsWithTags[randomIndex].id;
    }

    // Last resort: any song
    console.warn("No songs with tags found, picking any random song.");
    const randomTrackIndex = Math.floor(Math.random() * tracks.length);
    return tracks[randomTrackIndex].id;
  } catch (error) {
    console.error("Error fetching weather or selecting track:", error);
    // Fallback to random track with tags
    const tracksWithTags = tracks.filter(
      (track) => track.tags && track.tags.length > 0,
    );
    const fallbackTracks = tracksWithTags.length > 0 ? tracksWithTags : tracks;

    if (fallbackTracks.length > 0) {
      const randomTrackIndex = Math.floor(
        Math.random() * fallbackTracks.length,
      );
      return fallbackTracks[randomTrackIndex].id;
    }

    // Absolute fallback
    const randomTrackIndex = Math.floor(Math.random() * tracks.length);
    return tracks[randomTrackIndex].id;
  }
}

// Function to get a full playlist based on weather
export async function getPlaylistForWeather(
  apiKey: string,
  count = 10,
): Promise<string[]> {
  try {
    const weather: WeatherApiResponse = await getUserLocationAndFetch(apiKey);
    const conditionRaw = weather.weather[0].main.toLowerCase();
    const condition =
      conditionRaw === "fog" || conditionRaw === "mist"
        ? "clouds"
        : conditionRaw;
    const tempCelsius = weather.main.temp;
    const tempRange = getTempRange(tempCelsius);
    const now = new Date();
    const localHour = now.getHours();
    const timeOfDay = getTimeOfDay(localHour);

    let selectedTags: string[] = [];
    const conditionMap = playlistMap[condition];

    if (conditionMap) {
      if ("any" in conditionMap) {
        selectedTags = conditionMap.any[timeOfDay];
      } else if (tempRange in conditionMap) {
        selectedTags = (conditionMap as TempSpecificPlaylists)[tempRange][
          timeOfDay
        ];
      }
    }

    if (selectedTags.length === 0) {
      console.warn(
        `No tags found for condition: ${condition}, temp: ${tempRange}, time: ${timeOfDay}`,
      );
      selectedTags = (playlistMap.clear as TempSpecificPlaylists).mild
        .afternoon;
    }

    // First try: exact tag matches
    let matchingSongs = tracks.filter((song) => {
      if (!song.tags) return false;
      return selectedTags.every((tag) => song.tags!.includes(tag));
    });

    // Second try: any tag match if exact matches are insufficient
    if (matchingSongs.length < count) {
      const additionalSongs = tracks.filter((song) => {
        if (!song.tags || matchingSongs.find((ms) => ms.id === song.id)) {
          return false;
        }
        return selectedTags.some((tag) => song.tags!.includes(tag));
      });
      matchingSongs = [...matchingSongs, ...additionalSongs];
    }

    // Shuffle the results
    matchingSongs.sort(() => 0.5 - Math.random());
    const playlistIds = matchingSongs.slice(0, count).map((song) => song.id);

    // Fill remaining slots with random songs if needed
    if (playlistIds.length < count) {
      const remainingCount = count - playlistIds.length;
      const availableTracks = tracks.filter(
        (song) =>
          song.tags && song.tags.length > 0 && !playlistIds.includes(song.id),
      );

      const randomFallbackSongs = availableTracks
        .sort(() => 0.5 - Math.random())
        .slice(0, remainingCount)
        .map((song) => song.id);
      playlistIds.push(...randomFallbackSongs);
    }

    // Final fallback if still no tracks
    if (playlistIds.length === 0 && tracks.length > 0) {
      console.warn(
        "No suitable songs found for weather, returning random tracks from library.",
      );
      const tracksWithTags = tracks.filter((t) => t.tags && t.tags.length > 0);
      const fallbackTracks =
        tracksWithTags.length > 0 ? tracksWithTags : tracks;
      return fallbackTracks
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(count, fallbackTracks.length))
        .map((s) => s.id);
    }

    return playlistIds;
  } catch (error) {
    console.error("Error fetching weather or generating playlist:", error);
    // Fallback to random tracks with tags
    const tracksWithTags = tracks.filter(
      (track) => track.tags && track.tags.length > 0,
    );
    const fallbackTracks = tracksWithTags.length > 0 ? tracksWithTags : tracks;

    if (fallbackTracks.length > 0) {
      return fallbackTracks
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(count, fallbackTracks.length))
        .map((s) => s.id);
    }
    return [];
  }
}

// Example usage (optional, for testing)
// async function test() {\n//   const apiKey = \"YOUR_API_KEY\"; // Replace with your actual API key\n//   const trackId = await getSpotifyTrackForWeather(apiKey);\n//   console.log(\"Selected track ID:\", trackId);\n\n//   const playlist = await getPlaylistForWeather(apiKey, 5);\n//   console.log(\"Selected playlist IDs:\", playlist);\n// }\n\n// test();
