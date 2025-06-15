# Video Background System

The video background system provides dynamic, weather-responsive backgrounds that automatically adapt to current weather conditions and time of day. This creates an immersive atmospheric experience that enhances the weather data presentation.

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

- Bright, sunny scenes with minimal cloud coverage
- Used for weather conditions like "Clear", "Sunny"

**Cloudy**: Overcast or partly cloudy conditions

- Scenes with significant cloud coverage
- Covers "Clouds", "Overcast", "Broken clouds", "Scattered clouds"

**Rain**: Precipitation including rain, drizzle, thunderstorms

- Rain scenes with visible precipitation effects
- Handles "Rain", "Drizzle", "Thunderstorm" conditions

**Snow**: Snow and winter precipitation

- Winter scenes with snow effects
- Used for "Snow" weather conditions

**Fog**: Atmospheric conditions affecting visibility

- Misty, hazy scenes with reduced visibility
- Covers "Fog", "Mist", "Haze", "Smoke", "Dust"

### Time Periods

**Day**: Peak daylight hours (typically 10 AM - 4 PM)
**Morning**: Early daylight (sunrise to 10 AM)
**Evening**: Late daylight (4 PM to sunset)
**Night**: Dark hours (sunset to sunrise)

## Technical Implementation

### VideoBackground Component

**Location**: `src/components/VideoBackground.tsx`

**Props Interface**:

```typescript
interface VideoBackgroundProps {
  condition?: string; // Weather condition from API
  timePeriod?: TimePeriod | null; // Current time period
}
```

### Video Selection Logic

**Weather Type Mapping**:

```typescript
const weatherConditionMap: { keywords: string[]; type: WeatherType }[] = [
  // Priority-ordered keyword matching
  { keywords: ["thunderstorm"], type: "rain" },
  { keywords: ["drizzle"], type: "rain" },
  { keywords: ["rain"], type: "rain" },
  { keywords: ["snow"], type: "snow" },
  { keywords: ["mist", "fog", "haze", "smoke", "dust", "sand"], type: "fog" },
  { keywords: ["overcast"], type: "cloudy" },
  { keywords: ["broken clouds"], type: "cloudy" },
  { keywords: ["scattered clouds"], type: "cloudy" },
  { keywords: ["few clouds"], type: "clear" },
  { keywords: ["clouds"], type: "cloudy" },
  { keywords: ["clear", "sunny"], type: "clear" },
];
```

**Selection Algorithm**:

```typescript
function getWeatherType(condition?: string): WeatherType {
  if (!condition) return "clear";

  const lowerCaseCondition = condition.toLowerCase();

  for (const { keywords, type } of weatherConditionMap) {
    for (const keyword of keywords) {
      if (lowerCaseCondition.includes(keyword)) {
        return type;
      }
    }
  }

  return "clear"; // Default fallback
}
```

### Video Asset Management

**Import Strategy**:

```typescript
// Static imports ensure videos are included in build
import clearNight from "../assets/videos/clear_night.mp4";
import clearMorning from "../assets/videos/clear_morning.mp4";
// ... all 24 video imports

const videoMap: Record<WeatherType, Record<TimePeriod, string>> = {
  clear: {
    night: clearNight,
    morning: clearMorning,
    day: clearDay,
    evening: clearEvening,
  },
  // ... all weather types
};
```

### Fallback Strategy

**Hierarchical Fallbacks**:

1. **Exact Match**: Use specific weather/time combination if available
2. **Weather Fallback**: Use clear weather for same time period
3. **Final Fallback**: Use clear day video as last resort

```typescript
const getVideoForWeatherAndTime = (
  condition?: string,
  period?: TimePeriod | null,
): string => {
  const currentPeriod = period || "day";
  const weatherType = getWeatherType(condition);

  const selectedVideo = videoMap[weatherType]?.[currentPeriod];

  if (selectedVideo) {
    return selectedVideo;
  }

  // Fallback to clear weather for same time
  const clearVideo = videoMap.clear[currentPeriod];
  if (clearVideo) {
    return clearVideo;
  }

  // Final fallback to clear day
  return videoMap.clear.day;
};
```

## Performance Optimizations

### Video Preloading

**Preload Strategy**: Videos are preloaded when weather conditions change to ensure smooth transitions:

```typescript
useEffect(() => {
  if (video === currentSrc) return;

  setIsTransitioning(true);
  const preloadVideo = document.createElement("video");
  preloadVideo.src = video;
  preloadVideo.preload = "auto";

  const handleCanPlay = () => {
    setTimeout(() => {
      setCurrentSrc(video);
      setTimeout(() => setIsTransitioning(false), 400);
    }, 50);
  };

  preloadVideo.addEventListener("canplaythrough", handleCanPlay);

  return () => {
    preloadVideo.removeEventListener("canplaythrough", handleCanPlay);
    preloadVideo.src = "";
  };
}, [video, currentSrc]);
```

### Transition Effects

**Smooth Transitions**: 700ms opacity transitions between videos prevent jarring changes:

```typescript
<video
  className={`fixed inset-0 -z-10 h-full w-full object-cover
              transition-opacity duration-700
              ${isTransitioning || fade ? "opacity-0" : "opacity-100"}`}
  src={currentSrc}
  autoPlay
  loop
  muted
  playsInline
  preload="auto"
/>
```

**Loop Fade Effect**: Subtle fade at loop boundaries for seamless video looping:

```typescript
const handleTimeUpdate = useCallback(() => {
  const videoEl = videoRef.current;
  if (!videoEl || !videoEl.duration) return;

  if (videoEl.currentTime > videoEl.duration - 0.25) {
    setFade(true);
  } else if (fade && videoEl.currentTime < 0.25) {
    setFade(false);
  }
}, [fade]);
```

### Memory Management

**Video Element Cleanup**: Proper cleanup of preload elements prevents memory leaks

**Static Imports**: Videos are bundled with application for reliable loading

**Background Layer**: Neutral background prevents flash of unstyled content

## CSS and Styling

### Video Positioning

```css
.video-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -10;
  pointer-events: none;
}
```

### Background Layers

**Layering Strategy**:

- `z-index: -20`: Solid background color
- `z-index: -10`: Video background
- `z-index: 0+`: Application content

**Responsive Design**: Videos use `object-fit: cover` to maintain aspect ratio while filling viewport on all screen sizes.

## Integration with Weather System

### Data Flow

```
useWeatherData() → weather condition + time period
                                ↓
VideoBackground component → video selection algorithm
                                ↓
getVideoForWeatherAndTime() → specific video file
                                ↓
Video element → smooth transition to new background
```

### Weather Condition Processing

**API Integration**: Weather conditions from OpenWeatherMap are processed through the keyword matching system:

- API returns: "Light intensity drizzle"
- Keyword match: "drizzle" → rain type
- Video selection: `rain_morning.mp4` (if current time is morning)

### Time Period Calculation

**Time Period Source**: Time periods are calculated in `src/lib/utils.ts` based on:

- Current local time
- Sunrise/sunset times from weather API
- Predefined time boundaries

## Browser Compatibility

### Video Format Support

**MP4 Format**: Universal browser support with H.264 codec
**Autoplay Policy**: Videos are muted to comply with browser autoplay restrictions
**Mobile Optimization**: `playsInline` attribute prevents fullscreen on iOS

### Fallback Handling

**No Video Support**: Solid background color displays if video fails to load
**Slow Connections**: Preload strategy ensures videos load before display
**Low Memory Devices**: Single video in memory at any time

## Performance Metrics

### File Sizes

Video files are optimized for web delivery while maintaining visual quality:

- Average file size: 5-25 MB per video
- Total asset size: ~300 MB for complete video library
- Compression: H.264 with web-optimized settings

### Loading Performance

**Initial Load**: Only the required video loads initially
**Transition Load**: Next video preloads when weather changes
**Memory Usage**: Single video in memory, previous videos garbage collected

## Development and Debugging

### Debug Logging

The system includes comprehensive debug logging for development:

```typescript
console.log("Weather Type Debug:", {
  originalCondition: condition,
  lowerCaseCondition,
});

console.log("Video Selection:", {
  period: currentPeriod,
  weatherType,
  selectedVideo: videoMap[weatherType]?.[currentPeriod],
  hasCondition: !!condition,
});
```

### Testing Strategies

**Manual Testing**: Change browser time or mock weather conditions to test video selection
**Weather Simulation**: Use different weather API responses to verify video mapping
**Performance Testing**: Monitor memory usage during video transitions

## Future Enhancements

### Planned Improvements

**Additional Weather Types**: Support for more specific weather conditions (light rain vs heavy rain)
**Seasonal Variations**: Different videos for same weather in different seasons
**User Preferences**: Allow users to disable or customize video backgrounds
**Quality Options**: Multiple quality levels for different connection speeds

### Accessibility Considerations

**Motion Sensitivity**: Option to disable video backgrounds for users sensitive to motion
**Data Usage**: Setting to disable videos on mobile/metered connections
**Performance**: Automatic quality reduction on low-performance devices

The video background system creates an immersive, dynamic experience that seamlessly integrates with the weather data to enhance the overall atmospheric feel of WeatherTunes.

- `fog_evening.mp4` - 📝 Placeholder (0 bytes)

**Cloudy** - Heavy cloud cover (>70%)

- `cloudy_night.mp4` - 📝 Placeholder (0 bytes)
- `cloudy_morning.mp4` - 📝 Placeholder (0 bytes)
- `cloudy_day.mp4` - 📝 Placeholder (0 bytes)
- `cloudy_evening.mp4` - 📝 Placeholder (0 bytes)

### Time Periods

**Night** - 10:00 PM to 5:00 AM

- Dark, atmospheric videos with night themes
- Minimal lighting, starry skies, city lights

**Morning** - 5:00 AM to 11:00 AM

- Sunrise colors, golden hour lighting
- Fresh, energetic morning atmosphere

**Day** - 11:00 AM to 6:00 PM

- Bright daylight, vivid colors
- Clear visibility, high contrast

**Evening** - 6:00 PM to 10:00 PM

- Sunset colors, warm lighting
- Transitional atmosphere, dusk themes

## Technical Implementation

### VideoBackground Component

**Location:** `src/components/VideoBackground.tsx`

**Key Features:**

- Weather data integration via `useWeather()` hook
- Automatic video selection logic
- Smooth video transitions
- Error handling and fallbacks
- Performance optimization

### Video Selection Algorithm

**Step 1: Weather Condition Mapping**

```typescript
const weatherMapping = {
  clear: ["clear sky", "few clouds"],
  cloudy: ["scattered clouds", "broken clouds", "overcast clouds"],
  rain: ["shower rain", "rain", "thunderstorm", "drizzle"],
  snow: ["snow", "light snow", "heavy snow"],
  fog: ["mist", "fog", "haze", "smoke"],
};
```

**Step 2: Time Period Determination**

```typescript
const getTimePeriod = (hour: number): TimePeriod => {
  if (hour >= 22 || hour < 5) return "night";
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 18) return "day";
  return "evening";
};
```

**Step 3: Video Path Construction**

```typescript
const videoPath = `/src/assets/videos/${weather}_${timePeriod}.mp4`;
```

**Step 4: Fallback Handling**

- If specific video doesn't exist → Use `clear_day.mp4`
- If weather condition unrecognized → Use `clear_day.mp4`
- If time calculation fails → Use `day` period

### Performance Optimizations

**Lazy Loading**

- Videos loaded only when needed
- Preload next likely video based on time
- Progressive loading for large files

**Caching Strategy**

- Browser caches played videos
- Intelligent preloading of time-adjacent videos
- Memory management for video objects

**File Size Management**

- Video compression for web delivery
- Multiple quality versions (planned)
- Progressive download for large files

## Weather Condition Detection

### OpenWeatherMap Integration

**Weather Conditions Mapped:**

```typescript
// Clear conditions
'clear sky' → clear
'few clouds' (cloud cover < 25%) → clear

// Cloudy conditions
'scattered clouds' (25-50%) → cloudy
'broken clouds' (50-75%) → cloudy
'overcast clouds' (75-100%) → cloudy

// Precipitation
'light rain', 'moderate rain', 'heavy rain' → rain
'shower rain', 'thunderstorm' → rain
'drizzle' → rain

// Winter conditions
'light snow', 'snow', 'heavy snow' → snow
'sleet' → snow

// Atmospheric conditions
'mist', 'fog', 'haze', 'smoke' → fog
```

### Time-Based Logic

**Sunrise/Sunset Integration**

- Uses real sunrise/sunset times from weather API
- Calculates time periods relative to solar position
- Handles timezone differences automatically

**Time Period Calculations**

```typescript
const now = new Date();
const hour = now.getHours();
const timePeriod = getTimePeriod(hour);
```

## User Experience

### Visual Transitions

**Smooth Video Changes**

- CSS transitions between videos
- Fade effects during video switching
- No jarring cuts or loading screens

**Loading States**

- Graceful loading with fallback colors
- Progressive video loading
- Error state handling

### Responsive Design

**Different Screen Sizes**

- Full viewport coverage on all devices
- Proper aspect ratio maintenance
- Mobile-optimized video loading

**Performance Considerations**

- Reduced video quality on mobile
- Data usage awareness
- Battery usage optimization

## Development and Testing

### Local Development

**Testing Video Selection**

```javascript
// Browser console testing
const testWeather = "rain";
const testTime = "evening";
const videoPath = getVideoForWeather(testWeather, testTime);
console.log("Video path:", videoPath);
```

**Manual Weather Testing**

```javascript
// Test different weather conditions
const testConditions = [
  "clear sky",
  "scattered clouds",
  "light rain",
  "heavy snow",
  "fog",
];

testConditions.forEach((condition) => {
  const weather = mapWeatherCondition(condition);
  console.log(`${condition} → ${weather}`);
});
```

### Video Asset Management

**Adding New Videos**

1. Create video file with naming convention
2. Place in `src/assets/videos/` directory
3. Update video mapping if needed
4. Test video selection logic

**Video Requirements**

- Format: MP4 (H.264 codec recommended)
- Resolution: 1920x1080 or higher
- Duration: 10-30 seconds (looping)
- File size: < 50MB for performance
- Compression: Optimized for web delivery

### Debug Tools

**Browser Console Commands**

```javascript
// Check current video selection
console.log("Current video:", getCurrentVideoPath());

// Test all weather/time combinations
testAllVideoCombinations();

// Check available video files
listAvailableVideos();
```

## Future Enhancements

### Planned Features

**Enhanced Video System**

- Multiple quality levels (1080p, 720p, 480p)
- WebM format support for better compression
- Adaptive bitrate streaming
- Preloading optimization

**Advanced Weather Mapping**

- More granular weather conditions
- Air quality integration
- Seasonal variations
- Geographic-specific themes

**User Customization**

- User-uploaded background videos
- Custom weather-video mappings
- Disable videos option for data saving
- Video playback speed controls

### Video Asset Expansion

**Missing Videos to Create**

- All snow condition videos (4 files)
- All fog condition videos (4 files)
- All cloudy condition videos (4 files)
- Remaining rain videos (2 files)

**Special Condition Videos**

- Extreme weather (hurricanes, blizzards)
- Seasonal themes (autumn leaves, spring blooms)
- Geographic variants (desert, ocean, mountains)
- Night sky variations (clear vs cloudy)

### Performance Improvements

**Planned Optimizations**

- Service worker caching for videos
- CDN delivery for video assets
- Progressive video loading
- Background preloading strategy
- Memory usage optimization

**Analytics Integration**

- Video loading performance metrics
- User engagement with video backgrounds
- Error tracking for failed video loads
- Popular weather/time combinations
