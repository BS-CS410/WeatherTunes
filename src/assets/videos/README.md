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

**Complete video set: 24 files (5 weather types × 4 time periods)**

All videos are properly named and follow the established naming convention. This provides comprehensive coverage for weather-based background video selection.

### Available Videos:

**Clear Weather:**

- `clear_night.mp4`
- `clear_morning.mp4`
- `clear_day.mp4`
- `clear_evening.mp4`

**Rain Weather:**

- `rain_night.mp4`
- `rain_morning.mp4`
- `rain_day.mp4`
- `rain_evening.mp4`

**Snow Weather:**

- `snow_night.mp4`
- `snow_morning.mp4`
- `snow_day.mp4`
- `snow_evening.mp4`

**Fog Weather:**

- `fog_night.mp4`
- `fog_morning.mp4`
- `fog_day.mp4`
- `fog_evening.mp4`

**Cloudy Weather:**

- `cloudy_night.mp4`
- `cloudy_morning.mp4`
- `cloudy_day.mp4`
- `cloudy_evening.mp4`

## Notes

- All videos should be in MP4 format
- Videos are automatically selected based on current weather conditions and time
- Placeholder files (0 bytes) will use fallback videos until replaced with actual content
- The VideoBackground component imports all these files for seamless weather transitions
