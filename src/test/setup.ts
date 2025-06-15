import "@testing-library/jest-dom";
import { beforeEach, vi } from "vitest";
import type { SpotifySDK } from "../types/spotify";

// Mock environment variables
vi.mock("../lib/weather", () => ({
  getUserLocationAndFetch: vi.fn(),
  getUserLocationAndFetchForecast: vi.fn(),
  createErrorWeatherData: vi.fn(() => ({
    name: "Error",
    weather: [{ main: "Unable to load", description: "Error" }],
    main: { temp: 0, humidity: 0, pressure: 0 },
    sys: { sunrise: 0, sunset: 0 },
  })),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock HTMLVideoElement methods
Object.defineProperty(HTMLVideoElement.prototype, "play", {
  writable: true,
  value: vi.fn().mockResolvedValue(undefined),
});

Object.defineProperty(HTMLVideoElement.prototype, "pause", {
  writable: true,
  value: vi.fn(),
});

// Mock Spotify Web Playback SDK
Object.defineProperty(window, "Spotify", {
  value: {
    Player: vi.fn().mockImplementation(() => ({
      connect: vi.fn().mockResolvedValue(true),
      disconnect: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      getCurrentState: vi.fn().mockResolvedValue(null),
      setName: vi.fn(),
      getVolume: vi.fn().mockResolvedValue(0.5),
      setVolume: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      togglePlay: vi.fn(),
      seek: vi.fn(),
      previousTrack: vi.fn(),
      nextTrack: vi.fn(),
    })),
  },
});

// Mock Spotify Web API
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock geolocation
const geolocationMock = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
};
Object.defineProperty(navigator, "geolocation", {
  value: geolocationMock,
});

// Clear all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
