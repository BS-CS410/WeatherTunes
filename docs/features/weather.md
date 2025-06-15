# Weather System

The weather system is a fully implemented core feature that provides real-time weather data and forecasts using the OpenWeatherMap API.

## Overview

The weather system automatically detects the user's location and displays:
- Current weather conditions with detailed metrics
- 5-day weather forecast with interactive cards
- Sunrise and sunset times
- Weather-responsive video backgrounds
- Location-based unit defaults

## Architecture

### Core Components

**`WeatherDisplay.tsx`**
- Displays current weather conditions
- Shows temperature, humidity, pressure, wind speed
- Includes sunrise/sunset times with custom icons
- Responsive design with glassmorphism styling

**`ForecastCard.tsx`**
- 5-day weather forecast display
- Interactive forecast day cards with hover effects
- Weather icons from OpenWeatherMap
- Temperature highs and lows

**`VideoBackground.tsx`**
- Dynamic background videos based on weather and time
- 24 different weather/time combinations
- Automatic video selection logic
- Smooth transitions between videos

### Data Management

**`useWeather.ts` Hook**
- Fetches current weather data
- Handles geolocation and fallbacks
- Manages loading and error states
- Processes API response for display

**`useForecast.ts` Hook**
- Fetches 5-day weather forecast
- Formats data for display components
- Handles API errors gracefully
- Caches forecast data

### API Integration

**OpenWeatherMap Integration** (`src/lib/weather.ts`)
- Current weather endpoint: `/weather`
- 5-day forecast endpoint: `/forecast`
- Coordinate-based location lookup
- Country code detection for unit defaults

## Features

### Current Weather Display

**Data Points Shown:**
- Temperature (with unit conversion)
- Weather condition description
- Humidity percentage
- Atmospheric pressure
- Wind speed and direction
- Visibility distance
- Sunrise and sunset times

**Location Detection:**
1. Browser geolocation API
2. Fallback to Bellevue, WA coordinates
3. Country code extraction for unit defaults

### 5-Day Forecast

**Forecast Cards Display:**
- Day name and date
- Weather condition icon
- High and low temperatures
- Weather description
- Interactive hover effects

**Data Processing:**
- Filters daily high/low temperatures
- Formats dates for display
- Selects representative weather icons
- Handles missing or incomplete data

### Video Background System

**Weather Mapping:**
```javascript
// Weather condition to video mapping
clear: ['clear sky', 'few clouds']
cloudy: ['scattered clouds', 'broken clouds', 'overcast clouds']
rain: ['shower rain', 'rain', 'thunderstorm']
snow: ['snow']
fog: ['mist', 'fog', 'haze']
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
export function celsiusToFahrenheit(celsius: number): number
export function fahrenheitToCelsius(fahrenheit: number): number
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
console.log('Weather data:', weatherData);

// Test unit conversions
console.log('32°F to Celsius:', fahrenheitToCelsius(32));

// Test video selection
console.log('Video for rainy evening:', getVideoForWeather('rain', 'evening'));
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
