# Location-Based Unit Defaults Implementation

## Overview

This feature automatically sets default measurement units based on the user's geographic location:

- **US users**: Default to Fahrenheit (°F) and miles per hour (mph)
- **Non-US users**: Default to Celsius (°C) and kilometers per hour (kmh)

## Implementation Details

### Files Modified/Created

1. **`src/lib/units.ts`** (NEW)

   - Contains logic to determine appropriate units based on country code
   - Includes countries that use imperial vs metric systems
   - Provides test functions for development

2. **`src/hooks/useLocationBasedDefaults.ts`** (NEW)

   - Hook that determines user's location and returns appropriate default units
   - Uses browser geolocation + OpenWeatherMap API to get country code
   - Falls back to metric units if location detection fails

3. **`src/contexts/SettingsContext.tsx`** (MODIFIED)

   - Updated to use location-based defaults instead of hard-coded defaults
   - Only applies location defaults for new users (respects existing preferences)
   - Updated resetToDefaults to use location-appropriate defaults

4. **`src/types/weather.ts`** (MODIFIED)

   - Added optional country field to weather API response

5. **`src/lib/weather.ts`** (MODIFIED)

   - Updated error data structure to include country field

6. **`src/components/SettingsMenu.tsx`** (MODIFIED)
   - Added debug information in development mode

## How It Works

1. When the app loads, the `useLocationBasedDefaults` hook attempts to:

   - Get user's geographic coordinates via browser geolocation
   - Fetch weather data for those coordinates to get the country code
   - Determine appropriate default units based on the country

2. The `SettingsContext` checks if the user has existing preferences:

   - If NO existing preferences: Apply location-based defaults
   - If existing preferences: Keep user's current settings

3. The "Reset to Defaults" button now uses location-appropriate defaults

## Countries Using Imperial Units

- United States (US)
- Bahamas (BS)
- Belize (BZ)
- Cayman Islands (KY)
- Liberia (LR)
- Palau (PW)
- Federated States of Micronesia (FM)
- Marshall Islands (MH)

All other countries default to metric units.

## Testing

### Browser Console Testing

Open developer tools and run:

```javascript
// Test all country mappings
testCountryUnits();

// Test specific country
simulateCountryDefaults("US"); // or 'CA', 'GB', etc.
```

### Manual Testing

1. Clear localStorage in browser dev tools
2. Reload the page and allow location access
3. Check console logs to see location detection process
4. Verify units in settings menu match your location
5. Test "Reset to Defaults" button

### Debug Information

In development mode, the Settings menu shows:

- Whether location detection is still loading
- What the detected location defaults are

## Fallback Behavior

- If geolocation is not supported: Uses metric defaults
- If geolocation permission denied: Uses metric defaults
- If API call fails: Uses metric defaults
- If no country code returned: Uses metric defaults

This ensures the app always works, even if location detection fails.
