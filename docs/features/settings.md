# Settings System

The settings system provides comprehensive user preference management with automatic location-based defaults, persistent browser storage, and real-time updates throughout the application.

## System Overview

The settings system manages four categories of user preferences that affect the entire application experience:

- **Temperature units**: Fahrenheit (°F) or Celsius (°C)
- **Time format**: 12-hour (12:30 PM) or 24-hour (12:30)
- **Speed units**: mph, km/h, or m/s for wind speed display
- **Theme mode**: automatic, light, or dark appearance

All settings persist across browser sessions and include intelligent location-based defaults for new users.

## Technical Architecture

### Global State Management

**Settings Context**: `src/contexts/SettingsContext.tsx`

The settings system uses React Context to provide global state accessible throughout the component tree. This pattern allows any component to read or update settings without prop drilling.

**Settings Interface**:

```typescript
interface Settings {
  temperatureUnit: "F" | "C";
  timeFormat: "12h" | "24h";
  speedUnit: "mph" | "kmh" | "ms";
  themeMode: "auto" | "light" | "dark";
}
```

**Context Provider Interface**:

```typescript
interface SettingsContextType {
  settings: Settings;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setTimeFormat: (format: TimeFormat) => void;
  setSpeedUnit: (unit: SpeedUnit) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTemperatureUnit: () => void;
  toggleTimeFormat: () => void;
  resetToDefaults: () => void;
  locationDefaults: LocationBasedDefaults | null;
  isLocationLoading: boolean;
}
```

### Persistence Strategy

**LocalStorage Integration**: `src/hooks/useLocalStorage.ts`

Settings automatically save to browser localStorage using a custom hook that handles JSON serialization and error recovery:

```typescript
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setStoredValue = (newValue: T) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [value, setStoredValue] as const;
}
```

**Storage Keys**:

- `temperatureUnit`: "F" or "C"
- `timeFormat`: "12h" or "24h"
- `speedUnit`: "mph", "kmh", or "ms"
- `themeMode`: "auto", "light", or "dark"

## Location-Based Defaults

### Geographic Unit Detection

**Implementation**: `src/hooks/useLocationBasedDefaults.ts`

The system automatically detects appropriate default units based on user location through a multi-step process:

1. **Geolocation Request**: Browser geolocation API with user permission
2. **Reverse Geocoding**: Coordinates converted to country code
3. **Unit Mapping**: Country code mapped to appropriate measurement system
4. **Fallback Handling**: Metric defaults if location unavailable

**Location Detection Process**:

```typescript
export function useLocationBasedDefaults(): {
  locationDefaults: LocationBasedDefaults | null;
  isLoading: boolean;
} {
  const [locationDefaults, setLocationDefaults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function determineLocationDefaults() {
      try {
        if (!navigator.geolocation) {
          setLocationDefaults(getDefaultUnitsForCountry());
          setIsLoading(false);
          return;
        }

        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: false,
            maximumAge: 300000, // 5 minutes
          });
        });

        // Reverse geocoding logic...
      } catch (error) {
        // Fallback to metric defaults
      }
    }
  }, []);
}
```

### Country-Based Unit Mapping

**Implementation**: `src/lib/units.ts`

**Imperial System Countries**:

```typescript
const IMPERIAL_COUNTRIES = new Set([
  "US", // United States
  "BS", // Bahamas
  "BZ", // Belize
  "KY", // Cayman Islands
  "LR", // Liberia
  "PW", // Palau
  "FM", // Federated States of Micronesia
  "MH", // Marshall Islands
]);
```

**Default Selection Logic**:

```typescript
export function getDefaultUnitsForCountry(countryCode?: string): UnitDefaults {
  if (!countryCode) {
    return { temperatureUnit: "C", speedUnit: "kmh" };
  }

  const isImperialCountry = IMPERIAL_COUNTRIES.has(countryCode.toUpperCase());

  return {
    temperatureUnit: isImperialCountry ? "F" : "C",
    speedUnit: isImperialCountry ? "mph" : "kmh",
  };
}
```

### Smart Default Application

Defaults only apply to new users who haven't set explicit preferences:

```typescript
// From SettingsContext.tsx
useEffect(() => {
  if (!locationLoading && locationDefaults && !defaultsInitialized) {
    const hasExistingPrefs =
      localStorage.getItem("temperatureUnit") ||
      localStorage.getItem("speedUnit");

    if (!hasExistingPrefs) {
      console.log("Applying location-based defaults");
      setTemperatureUnit(locationDefaults.temperatureUnit);
      setSpeedUnit(locationDefaults.speedUnit);
    } else {
      console.log("User has existing preferences, keeping them");
    }

    setDefaultsInitialized(true);
  }
}, [locationLoading, locationDefaults, defaultsInitialized]);
```

## User Interface Components

### SettingsMenu Component

**Location**: `src/components/SettingsMenu.tsx`

**Features**:

- Modal overlay with backdrop blur effect
- Toggle buttons for each setting category
- Visual feedback for current selections
- Reset to defaults functionality
- Development debug information

**UI Implementation Pattern**:

```typescript
// Temperature unit selection example
<div className="flex gap-2">
  <Button
    variant={settings.temperatureUnit === "F" ? "default" : "outline"}
    onClick={() => setTemperatureUnit("F")}
    className="flex-1"
  >
    Fahrenheit (°F)
  </Button>
  <Button
    variant={settings.temperatureUnit === "C" ? "default" : "outline"}
    onClick={() => setTemperatureUnit("C")}
    className="flex-1"
  >
    Celsius (°C)
  </Button>
</div>
```

### SettingsButton Component

**Location**: `src/components/SettingsButton.tsx`

**Features**:

- Animated gear icon with rotation on interaction
- Glassmorphism styling consistent with app design
- Accessible button with proper ARIA labels
- Hover and focus states

### Settings Access Hook

**Location**: `src/hooks/useSettings.ts`

**Usage Pattern**:

```typescript
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

// Component usage
const { settings, setTemperatureUnit } = useSettings();
const currentTemp = `${temperature}°${settings.temperatureUnit}`;
```

## Real-Time Application Integration

### Weather System Integration

Settings immediately affect weather data display:

**Temperature Display**: `src/lib/temperature.ts`

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

**Time Display**: Sunrise/sunset times adapt to 12h/24h format preference

**Speed Display**: Wind speed converts between mph, km/h, and m/s units

### Theme System Integration

**Automatic Theme Detection**:

- Uses CSS `@media (prefers-color-scheme)` queries
- Detects system dark/light mode preference
- Overrides with manual selection when user chooses specific theme

**CSS Implementation**:

```css
/* Automatic theme switching */
.theme-auto {
  @apply bg-white text-gray-900 dark:bg-slate-900 dark:text-slate-100;
}

/* Manual theme overrides */
.theme-light {
  @apply bg-white text-gray-900;
}

.theme-dark {
  @apply bg-slate-900 text-slate-100;
}
```

## Performance Optimizations

### Context Performance

**Memoized Context Value**: Prevents unnecessary re-renders when context value hasn't changed

**Split Contexts**: Settings separated from other global state to minimize re-render scope

**Selective Updates**: Components only re-render when relevant settings change

### Storage Performance

**Debounced Writes**: Rapid setting changes batched into single localStorage writes

**Error Recovery**: Storage failures fallback to in-memory state

**Cache Validation**: localStorage values validated against expected types

## Development and Debugging

### Debug Information

Settings menu displays debug information in development mode:

```typescript
{process.env.NODE_ENV === 'development' && (
  <div className="mt-4 p-2 bg-gray-100 dark:bg-slate-800 rounded text-xs">
    <p>Debug Info:</p>
    <p>Location Loading: {isLocationLoading.toString()}</p>
    <p>Location Defaults: {JSON.stringify(locationDefaults)}</p>
    <p>Current Settings: {JSON.stringify(settings)}</p>
  </div>
)}
```

### Console Logging

Location detection process includes detailed console output:

```typescript
console.log("🔍 Starting location-based unit detection...");
console.log("📍 Requesting geolocation permission...");
console.log("✅ Geolocation permission granted");
console.log(
  `Country ${countryCode} uses ${isImperialCountry ? "imperial" : "metric"} units`,
);
```

## Error Handling

### Geolocation Errors

- **Permission Denied**: Falls back to metric defaults
- **Position Unavailable**: Uses metric defaults with user notification
- **Timeout**: 10-second timeout before fallback activation

### Storage Errors

- **Quota Exceeded**: Graceful degradation to session-only storage
- **Serialization Errors**: Fallback to default values with error logging
- **Read Errors**: Default values used with warning messages

### Network Errors

- **Reverse Geocoding Failure**: Falls back to metric defaults
- **API Unavailable**: Uses cached location data if available

- Cross-device settings sync via backend
- User account integration
- Backup and restore functionality

**Advanced Location Features**:

- Multiple saved locations
- Location-specific preferences
- Automatic location switching

The settings system provides a robust, user-friendly foundation for personalizing the WeatherTunes experience while maintaining excellent performance and reliability.

- Country-based unit determination
- Fallback handling for location failures

**`useLocalStorage.ts`**

- Browser storage utilities
- JSON serialization/deserialization
- Storage event handling

## Features

### User Preferences

**Temperature Units**

- Fahrenheit (°F) - Default for US and territories
- Celsius (°C) - Default for rest of world
- Automatic conversion throughout app

**Time Format**

- 12-hour format (12:30 PM) - Default for US
- 24-hour format (12:30) - Default for most countries
- Affects sunrise/sunset display and any time stamps

**Speed Units**

- Miles per hour (mph) - Default for imperial countries
- Kilometers per hour (km/h) - Default for metric countries
- Meters per second (m/s) - Available as alternative

**Theme Mode**

- Automatic - Switches based on sunrise/sunset data
- Light - Forces light theme
- Dark - Forces dark theme

### Location-Based Defaults

**Imperial Countries** (Fahrenheit + mph):

- United States (US)
- Bahamas (BS)
- Belize (BZ)
- Cayman Islands (KY)
- Liberia (LR)
- Palau (PW)
- Federated States of Micronesia (FM)
- Marshall Islands (MH)

**All Other Countries** (Celsius + km/h):

- Canada, UK, European Union, Asia, etc.
- Metric system as global standard

### Default Detection Process

1. **Geolocation Request**

   - Browser geolocation API call
   - User permission handling
   - Coordinate extraction

2. **Country Code Lookup**

   - OpenWeatherMap API call with coordinates
   - Country field extraction from response
   - Mapping to unit preferences

3. **Fallback Strategy**
   - Permission denied → Metric defaults
   - API failure → Metric defaults
   - No location support → Metric defaults
   - Invalid response → Metric defaults

## Implementation Details

### State Management

**Settings Interface:**

```typescript
interface Settings {
  temperatureUnit: "fahrenheit" | "celsius";
  timeFormat: "12h" | "24h";
  speedUnit: "mph" | "kmh" | "ms";
  themeMode: "auto" | "light" | "dark";
}
```

**Context Provider:**

```typescript
interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetToDefaults: () => void;
  isLoading: boolean;
}
```

### Storage Strategy

**Local Storage Key:** `weathertunes-settings`

**Storage Format:**

```json
{
  "temperatureUnit": "fahrenheit",
  "timeFormat": "12h",
  "speedUnit": "mph",
  "themeMode": "auto"
}
```

**Storage Events:**

- Automatic save on any setting change
- Cross-tab synchronization
- Invalid data validation and reset

### Integration Points

**Temperature Display:**

- Weather components respect temperature unit
- Automatic conversion in `temperature.ts` utilities
- Display formatting with proper symbols

**Time Display:**

- Sunrise/sunset times formatted per preference
- Clock displays (if added) follow format
- Consistent throughout application

**Theme Application:**

- CSS class application based on theme mode
- Time-based automatic switching
- Smooth transitions between themes

## User Interface

### Settings Menu Design

**Glassmorphism Styling:**

- Semi-transparent background with backdrop blur
- Consistent with app's visual design
- Smooth animations and transitions

**Control Types:**

- Toggle switches for binary choices
- Segmented controls for multiple options
- Visual feedback for all interactions

**Layout:**

```
Settings Menu
├── Temperature Unit [°F | °C]
├── Time Format [12h | 24h]
├── Speed Unit [mph | km/h | m/s]
├── Theme Mode [Auto | Light | Dark]
└── [Reset to Defaults Button]
```

### Debug Information

**Development Mode Features:**

- Location detection status display
- Detected default units shown
- Console logging for troubleshooting
- API response debugging

## Testing

### Manual Testing

**New User Experience:**

1. Clear browser localStorage
2. Reload application
3. Allow location access when prompted
4. Verify appropriate defaults applied
5. Check settings menu reflects defaults

**Existing User Experience:**

1. Set custom preferences
2. Reload application
3. Verify settings persistence
4. Test reset to defaults functionality

**Location Testing:**

1. Test from US location → Fahrenheit/mph
2. Test from non-US location → Celsius/km/h
3. Deny location → Metric defaults
4. Test offline → Cached or metric defaults

### Browser Console Testing

```javascript
// Test location defaults
testCountryUnits(); // Shows all country mappings

// Simulate specific country
simulateCountryDefaults("US"); // Test US defaults
simulateCountryDefaults("CA"); // Test Canadian defaults

// Check current settings
console.log(
  "Current settings:",
  JSON.parse(localStorage.getItem("weathertunes-settings")),
);
```

### Settings Validation

**Type Safety:**

- TypeScript interfaces prevent invalid values
- Runtime validation for localStorage data
- Graceful handling of corrupted settings

**Data Integrity:**

- Settings reset if invalid data detected
- Backward compatibility for settings schema changes
- Migration handling for future updates

## Error Handling

### Location Detection Errors

**Geolocation Failures:**

- Permission denied → Use metric defaults + user notification
- Timeout → Use cached location or metric defaults
- Position unavailable → Use metric defaults
- Not supported → Use metric defaults

**API Failures:**

- Network error → Use metric defaults
- Invalid response → Use metric defaults
- Rate limiting → Use cached country or defaults

### Storage Errors

**localStorage Issues:**

- Storage full → Clear and reset to defaults
- JSON parse error → Reset corrupted settings
- Access denied → Use in-memory settings only
- Browser incognito → Temporary session storage

## Performance Considerations

### Optimization Strategies

**Location Detection:**

- Cache coordinates for 1 hour
- Cache country code for 24 hours
- Single API call per session when possible
- Background detection without blocking UI

**Settings Access:**

- Context minimizes re-renders
- Memoized default calculations
- Efficient localStorage operations
- Debounced setting updates

### Memory Usage

**Minimal State:**

- Only store essential preferences
- Computed values derived on demand
- No unnecessary data persistence
- Clean component unmounting

## Future Enhancements

### Planned Features

**Advanced Preferences:**

- Language/locale selection
- Date format preferences
- Distance unit preferences
- Pressure unit options (hPa, inHg)

**Cloud Synchronization:**

- User account integration
- Cross-device settings sync
- Backup and restore functionality
- Settings history tracking
