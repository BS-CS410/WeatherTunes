# Video Background System

The video background system provides dynamic, weather-responsive backgrounds that automatically adapt to current weather conditions and time of day.

## System Overview

The video background system features:

- **24 unique video combinations** covering 5 weather types across 4 time periods
- **Automatic video selection** based on real-time weather data
- **Smooth transitions** between videos when conditions change
- **Performance optimization** with preloading and fallback strategies
- **Responsive design** that adapts to different screen sizes

## Video Asset Organization

### File Structure

**Location**: `src/assets/videos/`

**Available Video Files**: 24 MP4 files covering all weather and time combinations

```
Weather Types × Time Periods = 24 Videos
├── clear_day.mp4
├── clear_evening.mp4
├── clear_morning.mp4
├── clear_night.mp4
├── cloudy_day.mp4
├── cloudy_evening.mp4
├── cloudy_morning.mp4
├── cloudy_night.mp4
├── fog_day.mp4
├── fog_evening.mp4
├── fog_morning.mp4
├── fog_night.mp4
├── rain_day.mp4
├── rain_evening.mp4
├── rain_morning.mp4
├── rain_night.mp4
├── snow_day.mp4
├── snow_evening.mp4
├── snow_morning.mp4
└── snow_night.mp4
```

### Weather Categories

**Clear**: Clear skies, sunny conditions
- Used for weather conditions like "Clear", "Sunny"

**Cloudy**: Overcast or partly cloudy conditions
- Covers "Clouds", "Overcast", "Broken clouds", "Scattered clouds"

**Rain**: Precipitation including rain, drizzle, thunderstorms
- Handles "Rain", "Drizzle", "Thunderstorm" conditions

**Snow**: Snow and winter precipitation
- Used for "Snow" weather conditions

**Fog**: Atmospheric conditions affecting visibility
- Covers "Fog", "Mist", "Haze", "Smoke", "Dust"

### Time Periods

**Day**: Peak daylight hours (typically 10 AM - 4 PM)
**Morning**: Early daylight (sunrise to 10 AM)
**Evening**: Late daylight (4 PM to sunset)
**Night**: Dark hours (sunset to sunrise)

## Technical Implementation

### VideoBackground Component

**Location**: `src/components/VideoBackground.tsx`

**Video Selection Logic**:

```typescript
// From src/lib/weather.ts
export function getVideoForWeather(
  condition: string,
  timeOfDay: string,
): string {
  const weatherLower = condition.toLowerCase();

  // Time-specific mappings
  if (weatherLower.includes("clear")) {
    switch (timeOfDay) {
      case "morning": return "/src/assets/videos/clear_morning.mp4";
      case "day": return "/src/assets/videos/clear_day.mp4";
      case "evening": return "/src/assets/videos/clear_evening.mp4";
      case "night": return "/src/assets/videos/clear_night.mp4";
    }
  }

  // Weather condition mappings
  if (weatherLower.includes("cloud")) {
    return `/src/assets/videos/cloudy_${timeOfDay}.mp4`;
  }
  if (weatherLower.includes("rain")) {
    return `/src/assets/videos/rain_${timeOfDay}.mp4`;
  }
  if (weatherLower.includes("snow")) {
    return `/src/assets/videos/snow_${timeOfDay}.mp4`;
  }
  if (weatherLower.includes("fog") || weatherLower.includes("mist")) {
    return `/src/assets/videos/fog_${timeOfDay}.mp4`;
  }

  // Default fallback
  return `/src/assets/videos/clear_${timeOfDay}.mp4`;
}
```

### Performance Features

**Lazy Loading**: Videos load only when needed to prevent blocking page load
**Smooth Transitions**: Seamless changes between weather conditions
**Fallback Handling**: Default videos for unsupported weather types
**Asset Optimization**: Videos optimized for web playback
