# Weather System

The weather system provides real-time weather data and forecasts through OpenWeatherMap API integration. This is a production-ready feature with comprehensive error handling and responsive design.

## System Overview

The weather system automatically detects user location and displays current conditions with a 5-day forecast. All weather data adapts to user-selected temperature and speed units, persisting preferences across browser sessions.

### Core Features

- **Current weather conditions** with detailed meteorological data
- **5-day weather forecast** with interactive daily cards
- **Dynamic video backgrounds** that change based on weather and time
- **Automatic location detection** with graceful fallback handling
- **Unit conversion** supporting Fahrenheit/Celsius and mph/km/h/m/s
- **Responsive design** optimized for mobile and desktop viewing

## Technical Implementation

### API Integration

**Provider**: OpenWeatherMap API
**Endpoints Used**:

- Current weather: `https://api.openweathermap.org/data/2.5/weather`
- 5-day forecast: `https://api.openweathermap.org/data/2.5/forecast`

**Authentication**: API key via environment variable `VITE_PUBLIC_OPENWEATHER_API_KEY`

**API Client**: `src/lib/weather.ts`

```typescript
export async function fetchWeatherByCoords(
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
```

### Location Detection System

**Primary Method**: Browser Geolocation API with user permission
**Fallback Coordinates**: Bellevue, WA (47.585°N, 122.148°W)
**Timeout**: 10 seconds before fallback activation

**Implementation**: `src/hooks/useLocationBasedDefaults.ts`

```typescript
useEffect(() => {
  if (!navigator.geolocation) {
    setLocationDefaults(getDefaultsForLocation("US"));
    setIsLoading(false);
    return;
  }

  const timeoutId = setTimeout(() => {
    if (!position) {
      setLocationDefaults(getDefaultsForLocation("US"));
      setIsLoading(false);
    }
  }, 10000);

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setPosition(pos);
      clearTimeout(timeoutId);
    },
    () => {
      setLocationDefaults(getDefaultsForLocation("US"));
      setIsLoading(false);
      clearTimeout(timeoutId);
    },
  );

  return () => clearTimeout(timeoutId);
}, []);
```

## Component Architecture

### WeatherDisplay Component

**Location**: `src/components/WeatherDisplay.tsx`
**Displays**: Current temperature, location, weather condition, sunrise/sunset times
**Features**: Dynamic text sizing, responsive design, custom icons

### ForecastCard Component

**Location**: `src/components/ForecastCard.tsx`
**Data Source**: `useForecast()` hook
**Displays**: 5-day forecast with daily highs/lows and weather icons
**Features**: Interactive cards, loading states, error handling

### VideoBackground Component

**Location**: `src/components/VideoBackground.tsx`
**Asset Count**: 24 videos covering different weather conditions and times of day
**Features**: Automatic video selection based on weather and time

## Error Handling

### API Failures

- Retry logic with exponential backoff
- Graceful fallback to cached data
- User-friendly error messages

### Location Errors

- Automatic fallback to default coordinates
- Clear user feedback for permission issues
- Timeout handling for unresponsive geolocation

### Asset Management

**Video Lazy Loading**: Background videos load only when needed
**Icon Optimization**: Weather icons load from CDN with caching
**Bundle Splitting**: Weather utilities separate from main bundle

The weather system provides a robust foundation for the application's core functionality, with production-ready error handling, performance optimizations, and user experience considerations.
