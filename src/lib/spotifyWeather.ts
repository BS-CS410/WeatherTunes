import { getUserLocationAndFetch } from "./weather";
import type { WeatherApiResponse } from "@/types/weather";
import songs from "./spotifySongs.json";
import trackMetadata from "./trackMetadata.json";

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

    // Calculate local hour using current time
    const localHour = new Date().getHours();
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

// Request cache and throttling
interface CachedTrackMetadata {
  title: string;
  artist: string;
  albumArt: string;
}

const metadataCache = new Map<string, { data: CachedTrackMetadata; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes (increased from 10)
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests (increased from 1)
const failedRequests = new Map<string, number>(); // Track failed requests for backoff

/**
 * Fetches track metadata from Spotify Web API
 * Returns simplified track info for display purposes
 * Falls back to local metadata if API is unavailable
 */
export async function getSpotifyTrackMetadata(trackId: string): Promise<{
  title: string;
  artist: string;
  albumArt: string;
} | null> {
  try {
    // Check cache first
    const cached = metadataCache.get(trackId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    // First check local metadata cache
    const localTrack = trackMetadata.find(track => track.id === trackId);
    if (localTrack) {
      const result = {
        title: localTrack.title,
        artist: localTrack.artist,
        albumArt: localTrack.albumArt
      };
      metadataCache.set(trackId, { data: result, timestamp: Date.now() });
      return result;
    }

    // Check if this track has failed recently (exponential backoff)
    const failureCount = failedRequests.get(trackId) || 0;
    if (failureCount > 0) {
      const backoffDelay = Math.min(1000 * Math.pow(2, failureCount), 60000); // Max 1 minute
      const lastFailure = metadataCache.get(`${trackId}_failure`)?.timestamp || 0;
      if (Date.now() - lastFailure < backoffDelay) {
        console.log(`Skipping request for ${trackId} due to backoff (${failureCount} failures)`);
        throw new Error("Rate limited - using backoff");
      }
    }

    // Throttle API requests
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
    }
    lastRequestTime = Date.now();

    // Try Spotify oEmbed API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(
      `https://open.spotify.com/oembed?url=https://open.spotify.com/track/${trackId}&format=json`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch track metadata`);
    }
    
    const data = await response.json();
    
    // Parse title which comes in format "Song Title by Artist Name"
    const titleMatch = data.title?.match(/^(.+?) by (.+)$/);
    const result = titleMatch ? {
      title: titleMatch[1],
      artist: titleMatch[2], 
      albumArt: data.thumbnail_url || "https://via.placeholder.com/300x300"
    } : {
      title: data.title || "Unknown Track",
      artist: "Unknown Artist",
      albumArt: data.thumbnail_url || "https://via.placeholder.com/300x300"
    };
    
    // Cache the result
    metadataCache.set(trackId, { data: result, timestamp: Date.now() });
    // Clear any previous failures on success
    failedRequests.delete(trackId);
    return result;
  } catch (error) {
    console.warn("Could not fetch Spotify track metadata, using fallback:", error);
    
    // Track failures for exponential backoff
    const currentFailures = failedRequests.get(trackId) || 0;
    failedRequests.set(trackId, currentFailures + 1);
    metadataCache.set(`${trackId}_failure`, { data: {} as CachedTrackMetadata, timestamp: Date.now() });
    
    // Return generic info - this will display nicely until the API works
    const fallback = {
      title: "Loading track info...",
      artist: "Spotify",
      albumArt: "https://via.placeholder.com/300x300"
    };
    
    // Cache fallback briefly to prevent rapid retries
    metadataCache.set(trackId, { data: fallback, timestamp: Date.now() });
    return fallback;
  }
}
