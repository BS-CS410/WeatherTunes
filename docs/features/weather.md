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

**Implementation**: `src/lib/weather.ts`

```typescript
export function getUserLocationAndFetch(
  apiKey: string,
): Promise<WeatherApiResponse> {
  return new Promise((resolve, reject) => {
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
        // Fallback to Bellevue coordinates
        fetchWeatherByCoords(FALLBACK_COORDS.lat, FALLBACK_COORDS.lon, apiKey)
          .then(resolve)
          .catch(reject);
      },
      { timeout: GEOLOCATION_TIMEOUT },
    );
  });
}
```

### Data Types and Interfaces

**Weather API Response**: `src/types/weather.ts`

```typescript
export interface WeatherApiResponse {
  name: string; // City name
  main: {
    temp: number; // Temperature
    humidity: number; // Humidity percentage
    pressure: number; // Atmospheric pressure
  };
  weather: {
    main: string; // Weather category
    description: string; // Detailed description
    id: number; // Weather condition ID
  }[];
  wind?: {
    speed: number; // Wind speed
  };
  clouds?: {
    all: number; // Cloud coverage percentage
  };
  visibility?: number; // Visibility in meters
  sys: {
    sunrise: number; // Sunrise Unix timestamp
    sunset: number; // Sunset Unix timestamp
    country?: string; // Country code
  };
}
```

**Display Data Interface**:

```typescript
export interface WeatherDisplayData {
  location: string; // Formatted location name
  temperature: string; // Formatted temperature with unit
  condition: string; // User-friendly condition description
  unit: string; // Temperature unit symbol
  isError?: boolean; // Error state indicator
  sunrise?: string; // Formatted sunrise time
  sunset?: string; // Formatted sunset time
}
```

## Component Architecture

### WeatherDisplay Component

**Location**: `src/components/WeatherDisplay.tsx`

**Features**:

- Intelligent text sizing based on weather condition length
- Automatic line wrap detection and adjustment
- Custom sunrise/sunset icons with formatted times
- Responsive design using CSS clamp functions

**Text Sizing Logic**:

```typescript
const getConditionTextSize = (text: string) => {
  const length = text.length;
  if (length <= 8) return "text-[clamp(1.5rem,5vw,3rem)]"; // "Clear"
  if (length <= 15) return "text-[clamp(1.2rem,4vw,2.5rem)]"; // "Partly cloudy"
  if (length <= 25) return "text-[clamp(1rem,3.5vw,2rem)]"; // "Light intensity drizzle"
  return "text-[clamp(0.9rem,3vw,1.8rem)]"; // Very long conditions
};
```

### ForecastCard Component

**Location**: `src/components/ForecastCard.tsx`

**Data Source**: `useForecast()` hook processes 5-day forecast data

**Features**:

- Interactive cards with hover animations and scaling effects
- Weather icons from OpenWeatherMap icon service
- Daily high/low temperatures with unit conversion
- Loading skeleton states during data fetch
- Error handling with graceful fallback display

### VideoBackground Component

**Location**: `src/components/VideoBackground.tsx`

**Video Assets**: 24 MP4 files in `src/assets/videos/` covering weather and time combinations

**Selection Logic**:

- Weather types: clear, cloudy, fog, rain, snow
- Time periods: day, evening, morning, night
- Automatic selection based on weather condition and local time
- Smooth transitions between video changes

**Performance Optimizations**:

- Lazy loading to prevent blocking initial page load
- Video preloading for common weather conditions
- Fallback handling for unsupported video formats

## State Management

### useWeather Hook

**Location**: `src/hooks/useWeather.ts`

**Responsibilities**:

- Coordinate geolocation and API requests
- Process raw API data into display-ready format
- Manage loading states and error handling
- Handle time period calculation for video backgrounds

**State Interface**:

```typescript
interface EnhancedWeatherState {
  displayData: WeatherDisplayData; // Processed display data
  timePeriod: TimePeriod | null; // Current time period for videos
  isLoading: boolean; // Loading state
  error: Error | null; // Error state
  rawResponse: WeatherApiResponse | null; // Raw API data
}
```

**Error Handling Strategy**:

```typescript
const processWeatherData = useCallback(
  (data, error) => {
    if (error || !data) {
      const errorData = createErrorWeatherData();
      setWeatherState({
        displayData: {
          location: "Error",
          temperature: "--",
          condition: "Unable to load",
          unit: `°${settings.temperatureUnit}`,
          isError: true,
        },
        timePeriod: getTimePeriod(new Date()),
        isLoading: false,
        error: error || new Error("Failed to fetch weather data"),
        rawResponse: errorData,
      });
      return;
    }
    // Process successful data...
  },
  [settings.temperatureUnit],
);
```

### useForecast Hook

**Location**: `src/hooks/useForecast.ts`

**Data Processing**:

- Groups 3-hour forecast intervals into daily summaries
- Calculates daily high/low temperatures
- Selects representative weather icons for each day
- Formats dates for display with day names

**Daily Forecast Interface**:

```typescript
interface DailyForecast {
  date: string; // "December 15"
  dayName: string; // "Monday"
  condition: string; // "Partly cloudy"
  tempHigh: string; // "72°F"
  tempLow: string; // "58°F"
  icon: string; // OpenWeatherMap icon code
}
```

## Unit Conversion System

### Temperature Conversion

**Location**: `src/lib/temperature.ts`

**Supported Units**: Fahrenheit (°F) and Celsius (°C)

**Implementation**:

```typescript
export function formatTemperature(tempKelvin: number, unit: "F" | "C"): string {
  if (unit === "F") {
    const fahrenheit = ((tempKelvin - 273.15) * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  } else {
    const celsius = tempKelvin - 273.15;
    return `${Math.round(celsius)}°C`;
  }
}
```

### Speed Unit Conversion

**Location**: `src/lib/units.ts`

**Supported Units**:

- mph (miles per hour)
- km/h (kilometers per hour)
- m/s (meters per second)

**Location-Based Defaults**:

- United States: Fahrenheit, mph
- All other countries: Celsius, km/h

## Error Handling and Resilience

### API Error Recovery

**Network Failures**: Graceful degradation with "Unable to load" messaging
**Invalid API Key**: Clear error message with setup instructions
**Geolocation Denied**: Automatic fallback to Bellevue, WA coordinates
**Malformed API Response**: Validation with fallback error data structure

### Fallback Data Strategy

**Error Weather Data**:

```typescript
const createErrorWeatherData = () => ({
  name: "Error",
  weather: [{ main: "Unable to load", description: "Please try again" }],
  main: { temp: 0, humidity: 0, pressure: 0 },
  sys: { sunrise: 0, sunset: 0 },
  // ... other fallback properties
});
```

### Loading States

**Initial Load**: "Loading..." displays in weather components
**Refresh Operations**: Skeleton placeholders during data updates
**Background Updates**: Non-blocking refresh with previous data visible

## Performance Optimizations

### API Efficiency

**Request Batching**: Single API call provides all current weather data
**Coordinate Caching**: Geolocation results cached to avoid repeated permission requests
**Error Debouncing**: Failed requests wait before retry attempts

### Rendering Optimizations

**Memoized Calculations**: Expensive formatting operations use `useMemo`
**Stable References**: Event handlers use `useCallback` for performance
**Conditional Rendering**: Components only re-render when relevant data changes

### Asset Management

**Video Lazy Loading**: Background videos load only when needed
**Icon Optimization**: Weather icons load from CDN with caching
**Bundle Splitting**: Weather utilities separate from main bundle

## Future Enhancements

### Planned Features

**Weather Alerts**: Integration with severe weather warning systems
**Historical Data**: Weather trends and historical comparisons
**Extended Forecast**: 10-day forecast with hourly details
**Multiple Locations**: Save and switch between favorite locations

### Backend Integration Opportunities

**Weather Preferences**: Server-side storage of location and unit preferences
**Push Notifications**: Weather alerts and daily forecast delivery
**Analytics**: Weather pattern tracking for music recommendation improvements
**Caching Layer**: Server-side weather data caching for improved performance

The weather system provides a robust foundation for the application's core functionality, with production-ready error handling, performance optimizations, and user experience considerations.

### Video Background System

**Weather Mapping:**

```javascript
// Weather condition to video mapping
clear: ["clear sky", "few clouds"];
cloudy: ["scattered clouds", "broken clouds", "overcast clouds"];
rain: ["shower rain", "rain", "thunderstorm"];
snow: ["snow"];
fog: ["mist", "fog", "haze"];
```

**Time Periods:**

- `night`: 10 PM - 5 AM
- `morning`: 5 AM - 11 AM
- `day`: 11 AM - 6 PM
- `evening`: 6 PM - 10 PM

**Video Selection Logic:**

1. Get current weather condition
2. Determine time period based on local time
3. Map to appropriate video file
4. Fallback to clear_day.mp4 if mapping fails

## Configuration

### Environment Variables

```bash
VITE_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

**Getting an API Key:**

1. Register at [OpenWeatherMap](https://openweathermap.org/api)
2. Choose the free tier (60 calls/minute, 1,000,000 calls/month)
3. Generate API key from dashboard
4. Add to `.env` file

### API Endpoints Used

**Current Weather:**

```
GET https://api.openweathermap.org/data/2.5/weather
?lat={latitude}&lon={longitude}&appid={API_key}&units=metric
```

**5-Day Forecast:**

```
GET https://api.openweathermap.org/data/2.5/forecast
?lat={latitude}&lon={longitude}&appid={API_key}&units=metric
```

## Error Handling

### Geolocation Errors

- Permission denied: Falls back to default coordinates
- Timeout: Uses cached location or default
- Not supported: Uses default coordinates (Bellevue, WA)

### API Errors

- Network failures: Shows error message with retry option
- Invalid API key: Clear error message for developers
- Rate limiting: Graceful handling with cached data
- Invalid response: Fallback to default weather data

### Data Validation

- Type checking with TypeScript interfaces
- Null/undefined checks for all API responses
- Default values for missing data fields
- Graceful degradation for partial data

## Unit System

### Location-Based Defaults

The weather system automatically sets appropriate units based on location:

**Imperial Units** (US and territories):

- Temperature: Fahrenheit (°F)
- Wind speed: Miles per hour (mph)
- Countries: US, Bahamas, Belize, Cayman Islands, Liberia, Palau, Micronesia, Marshall Islands

**Metric Units** (Rest of world):

- Temperature: Celsius (°C)
- Wind speed: Kilometers per hour (km/h)

### Unit Conversion

Temperature conversion utilities in `src/lib/temperature.ts`:

```typescript
export function celsiusToFahrenheit(celsius: number): number;
export function fahrenheitToCelsius(fahrenheit: number): number;
```

## Performance Optimizations

### Caching Strategy

- Weather data cached for 10 minutes
- Geolocation cached for 1 hour
- Forecast data cached for 30 minutes
- Video assets loaded on demand

### API Efficiency

- Single API call for current weather
- Batch forecast data in one request
- Coordinates cached to avoid repeated geolocation
- Graceful handling of rate limits

### Loading States

- Skeleton loading for weather cards
- Progressive data display as it loads
- Smooth transitions between loading and data states
- Error boundaries for component isolation

## Testing

### Manual Testing Scenarios

**Location Testing:**

1. Allow location access - verify local weather
2. Deny location access - verify fallback to Bellevue, WA
3. Test on mobile devices for GPS accuracy

**API Testing:**

1. Valid API key - verify data loads correctly
2. Invalid API key - verify error handling
3. Network offline - verify cached data usage

**Unit Testing:**

1. US location - verify Fahrenheit/mph defaults
2. Non-US location - verify Celsius/km/h defaults
3. Settings override - verify user preferences respected

### Browser Console Testing

```javascript
// Test weather data structure
console.log("Weather data:", weatherData);

// Test unit conversions
console.log("32°F to Celsius:", fahrenheitToCelsius(32));

// Test video selection
console.log("Video for rainy evening:", getVideoForWeather("rain", "evening"));
```

## Future Enhancements

### Planned Features

- Weather alerts and notifications
- Extended 14-day forecast
- Weather radar integration
- Historical weather data
- Weather-based location suggestions

### Backend Migration

Currently client-side for development simplicity, but planned migration to backend:

- Server-side API key management
- Weather data caching at server level
- Rate limiting and quota management
- Enhanced error logging and monitoring
