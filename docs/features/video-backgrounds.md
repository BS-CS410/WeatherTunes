# Video Background System

The video background system provides dynamic, weather-responsive backgrounds that automatically change based on current weather conditions and time of day.

## Overview

The system features:

- 24 unique weather/time video combinations
- Automatic video selection based on weather data
- Smooth transitions between videos
- Performance-optimized loading
- Fallback handling for missing videos

## Video Asset Structure

### File Organization

**Location:** `src/assets/videos/`

**Naming Convention:** `{weather}_{timeOfDay}.mp4`

### Weather Categories

**Clear** - Clear skies, sunny conditions

- `clear_night.mp4` - ✅ Available (24.4 MB)
- `clear_morning.mp4` - ✅ Available (4.4 MB)
- `clear_day.mp4` - ✅ Available (5.8 MB)
- `clear_evening.mp4` - ✅ Available (16.0 MB)

**Rain** - Rain, drizzle, thunderstorms

- `rain_night.mp4` - ✅ Available (61.6 MB)
- `rain_morning.mp4` - ✅ Available (49.0 MB)
- `rain_day.mp4` - 📝 Placeholder (0 bytes)
- `rain_evening.mp4` - 📝 Placeholder (0 bytes)

**Snow** - Snow conditions

- `snow_night.mp4` - 📝 Placeholder (0 bytes)
- `snow_morning.mp4` - 📝 Placeholder (0 bytes)
- `snow_day.mp4` - 📝 Placeholder (0 bytes)
- `snow_evening.mp4` - 📝 Placeholder (0 bytes)

**Fog** - Fog, mist, haze

- `fog_night.mp4` - 📝 Placeholder (0 bytes)
- `fog_morning.mp4` - 📝 Placeholder (0 bytes)
- `fog_day.mp4` - 📝 Placeholder (0 bytes)
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
