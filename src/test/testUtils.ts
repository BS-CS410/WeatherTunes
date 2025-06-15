import type { WeatherApiResponse } from "../types/weather";
import type {
  SpotifyTrack,
  SpotifyPlaylist,
  SpotifyRecommendations,
} from "../types/spotify";

/**
 * Mock weather data for testing
 */
export const mockWeatherData: WeatherApiResponse = {
  name: "San Francisco",
  weather: [
    {
      main: "Clear",
      description: "clear sky",
      id: 800,
    },
  ],
  main: {
    temp: 20,
    pressure: 1013,
    humidity: 65,
  },
  wind: {
    speed: 3.5,
  },
  clouds: {
    all: 0,
  },
  visibility: 10000,
  sys: {
    country: "US",
    sunrise: 1638360000,
    sunset: 1638396000,
  },
};

/**
 * Mock Spotify track data for testing
 */
export const mockSpotifyTrack: SpotifyTrack = {
  id: "4iV5W9uYEdYUVa79Axb7Rh",
  name: "Song Name",
  artists: [
    {
      name: "Artist Name",
      uri: "spotify:artist:1234567890",
    },
  ],
  album: {
    name: "Album Name",
    images: [
      {
        url: "https://i.scdn.co/image/ab67616d0000b273...",
        height: 640,
        width: 640,
      },
    ],
  },
  duration_ms: 240000,
  uri: "spotify:track:4iV5W9uYEdYUVa79Axb7Rh",
  preview_url: "https://p.scdn.co/mp3-preview/...",
};

/**
 * Mock Spotify playlist data for testing
 */
export const mockSpotifyPlaylist: SpotifyPlaylist = {
  id: "37i9dQZF1DX0XUsuxWHRQd",
  name: "RapCaviar",
  description: "New music from Lil Wayne, Juice WRLD and more.",
  images: [
    {
      url: "https://i.scdn.co/image/ab67616d0000b273...",
      height: 640,
      width: 640,
    },
  ],
  tracks: {
    total: 50,
    items: [
      {
        track: mockSpotifyTrack,
      },
    ],
  },
};

/**
 * Mock Spotify recommendations data for testing
 */
export const mockSpotifyRecommendations: SpotifyRecommendations = {
  tracks: [mockSpotifyTrack],
  seeds: [
    {
      afterFilteringSize: 1000,
      afterRelinkingSize: 1000,
      href: "https://api.spotify.com/v1/recommendations?seed_genres=chill",
      id: "chill",
      initialPoolSize: 1000,
      type: "GENRE",
    },
  ],
};

/**
 * Mock weather scenarios for testing different conditions
 */
export const mockWeatherScenarios = {
  clear: {
    ...mockWeatherData,
    weather: [
      { main: "Clear", description: "clear sky", icon: "01d", id: 800 },
    ],
  },
  cloudy: {
    ...mockWeatherData,
    weather: [
      { main: "Clouds", description: "broken clouds", icon: "04d", id: 803 },
    ],
  },
  rainy: {
    ...mockWeatherData,
    weather: [
      { main: "Rain", description: "light rain", icon: "10d", id: 500 },
    ],
  },
  snowy: {
    ...mockWeatherData,
    weather: [
      { main: "Snow", description: "light snow", icon: "13d", id: 600 },
    ],
  },
  stormy: {
    ...mockWeatherData,
    weather: [
      {
        main: "Thunderstorm",
        description: "thunderstorm",
        icon: "11d",
        id: 200,
      },
    ],
  },
};

/**
 * Mock Spotify API responses
 */
export const mockSpotifyApiResponses = {
  token: {
    access_token: "mock_access_token",
    token_type: "Bearer",
    expires_in: 3600,
  },
  search: {
    tracks: {
      items: [mockSpotifyTrack],
      total: 1,
      limit: 20,
      offset: 0,
    },
  },
  recommendations: mockSpotifyRecommendations,
  playlists: {
    items: [mockSpotifyPlaylist],
    total: 1,
    limit: 20,
    offset: 0,
  },
  user: {
    id: "test_user",
    display_name: "Test User",
    email: "test@example.com",
    country: "US",
  },
};

/**
 * Create a mock fetch response
 */
export const createMockResponse = (data: unknown, status = 200): Response => {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  } as Response;
};

/**
 * Weather-based music genre mappings for testing
 */
export const mockWeatherMusicMappings = {
  clear: ["pop", "indie-pop", "summer", "happy"],
  clouds: ["chill", "ambient", "indie", "alternative"],
  rain: ["jazz", "blues", "acoustic", "sad"],
  snow: ["classical", "ambient", "chill", "winter"],
  thunderstorm: ["rock", "metal", "electronic", "intense"],
  drizzle: ["indie", "folk", "acoustic", "melancholy"],
  mist: ["ambient", "chill", "atmospheric", "ethereal"],
  fog: ["ambient", "mysterious", "atmospheric", "deep"],
};

/**
 * Mock user settings for testing
 */
export const mockUserSettings = {
  temperatureUnit: "celsius" as const,
  windSpeedUnit: "kmh" as const,
  timeFormat: "24h" as const,
  theme: "auto" as const,
  location: {
    latitude: 37.7749,
    longitude: -122.4194,
  },
  spotifyEnabled: true,
  autoPlay: false,
  explicitContent: false,
};

/**
 * Mock geolocation data
 */
export const mockGeolocation = {
  coords: {
    latitude: 37.7749,
    longitude: -122.4194,
    accuracy: 10,
  },
  timestamp: Date.now(),
};
