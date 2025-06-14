# Video Assets Structure

This folder contains weather-specific background videos organized by weather condition and time of day.

## File Naming Convention

Videos follow the pattern: `{weather}_{timeOfDay}.mp4`

### Weather Types:

- `clear` - Clear/sunny skies
- `rain` - Rain, drizzle, thunderstorm conditions
- `snow` - Snow conditions
- `fog` - Fog, mist conditions
- `cloudy` - Heavy cloud cover (>70%)

### Time Periods:

- `night` - Night time
- `morning` - Morning hours
- `day` - Daytime hours
- `evening` - Evening hours

## Current Status

### ✅ Available Videos (actual files):

- `clear_night.mp4` (24.4 MB)
- `clear_morning.mp4` (4.4 MB)
- `clear_day.mp4` (5.8 MB)
- `clear_evening.mp4` (16.0 MB)
- `rain_morning.mp4` (49.0 MB)
- `rain_night.mp4` (61.6 MB)

### 📝 Placeholder Videos (0 bytes - to be replaced):

- `rain_day.mp4`
- `rain_evening.mp4`
- `snow_night.mp4`
- `snow_morning.mp4`
- `snow_day.mp4`
- `snow_evening.mp4`
- `fog_night.mp4`
- `fog_morning.mp4`
- `fog_day.mp4`
- `fog_evening.mp4`
- `cloudy_night.mp4`
- `cloudy_morning.mp4`
- `cloudy_day.mp4`
- `cloudy_evening.mp4`

## Notes

- All videos should be in MP4 format
- Videos are automatically selected based on current weather conditions and time
- Placeholder files (0 bytes) will use fallback videos until replaced with actual content
- The VideoBackground component imports all these files for seamless weather transitions
