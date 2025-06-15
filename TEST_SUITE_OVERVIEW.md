# WeatherTunes Test Suite

## Overview

This document provides a comprehensive overview of the test suite for the WeatherTunes application, covering both existing functionality and future Spotify API integration.

## Test Structure

### Hooks Tests

- **useLocalStorage.test.ts** - Tests for persistent localStorage functionality
- **useWeatherData.test.ts** - Tests for weather data fetching and processing
- **useSettings.test.ts** - Tests for user settings management
- **useForecast.test.ts** - Tests for weather forecast data
- **useSpotify.test.ts** - Tests for future Spotify API integration

### Component Tests

- **WeatherDisplay.test.tsx** - Tests for weather information display
- Future component tests for Spotify player, settings, etc.

### Utility Tests

- **temperature.test.ts** - Tests for temperature conversion utilities
- Future tests for weather utils, styling utils, etc.

## Current Implementation Status

### ✅ Completed Tests

1. **useLocalStorage** - Basic localStorage operations
2. **Temperature utilities** - Temperature conversion functions

### 🚧 Partially Implemented

1. **useWeatherData** - Weather data fetching (needs proper mocking)
2. **useSettings** - Settings management (needs context provider setup)
3. **useForecast** - Forecast data processing

### 🔮 Future Implementation (Spotify Features)

1. **useSpotifyAuth** - Authentication with Spotify
2. **useSpotifyPlayer** - Web Playback SDK integration
3. **useSpotifyRecommendations** - Weather-based music recommendations
4. **SpotifyService** - API service layer

## Test Configuration

### Setup Files

- `src/test/setup.ts` - Global test setup with mocks
- `src/test/testUtils.ts` - Mock data and utility functions

### Mock Data Available

- Weather API responses
- Spotify API responses
- User settings
- Geolocation data
- Weather-music mapping data

### Global Mocks

- IntersectionObserver
- ResizeObserver
- matchMedia
- HTMLVideoElement
- localStorage
- geolocation
- Spotify Web Playbook SDK
- fetch API

## Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test useLocalStorage

# Run tests in watch mode
npm test -- --watch
```

## Future Spotify Integration Test Plan

### Authentication Flow

- OAuth2 authorization code flow
- Token refresh handling
- User profile retrieval
- Error handling for authentication failures

### Music Playback

- Web Playback SDK initialization
- Player state management
- Playback controls (play, pause, skip, seek)
- Volume control
- Track information display

### Weather-Based Recommendations

- Genre mapping based on weather conditions
- Audio feature analysis for mood matching
- Playlist creation and management
- Track search and filtering

### API Integration

- Rate limiting handling
- Error recovery
- Offline functionality
- Cache management

## Test Data Scenarios

### Weather Conditions

- Clear/sunny weather
- Cloudy conditions
- Rainy weather
- Snowy conditions
- Stormy weather
- Foggy/misty conditions

### Music Preferences

- Different genres for different weather
- Time-of-day considerations
- User preference overrides
- Explicit content filtering

### Error Scenarios

- Network failures
- API rate limits
- Invalid authentication
- Missing permissions
- Device unavailability

## Best Practices

1. **Isolation** - Each test should be independent
2. **Mocking** - Mock external dependencies (APIs, DOM APIs)
3. **Coverage** - Aim for high test coverage on critical paths
4. **Performance** - Keep tests fast and reliable
5. **Readability** - Tests should be easy to understand and maintain

## Notes

- Tests are configured to work with TypeScript
- Using Vitest for testing framework
- React Testing Library for component testing
- MSW (Mock Service Worker) can be added for API mocking if needed
- Tests include both unit and integration test patterns
