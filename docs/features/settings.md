# Settings System

The settings system provides comprehensive user preference management with automatic defaults, persistent storage, and location-based configuration.

## Overview

The settings system manages:
- Temperature units (Fahrenheit/Celsius)
- Time format (12-hour/24-hour)
- Speed units (mph/km/h/m/s)
- Theme mode (automatic/light/dark)
- Location-based default unit selection
- Persistent browser storage

## Architecture

### Core Components

**`SettingsContext.tsx`**
- Global state management with React Context
- Persistent storage integration
- Location-based default detection
- Settings validation and type safety

**`SettingsMenu.tsx`**
- User interface for preference management
- Toggle controls for all settings
- Reset to defaults functionality
- Debug information in development mode

**`SettingsButton.tsx`**
- Settings access trigger
- Animated gear icon
- Glassmorphism styling consistent with app design

### Custom Hooks

**`useSettings.ts`**
- Context consumer hook
- Type-safe settings access
- Automatic re-rendering on changes

**`useLocationBasedDefaults.ts`**
- Geographic location detection
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
  temperatureUnit: 'fahrenheit' | 'celsius';
  timeFormat: '12h' | '24h';
  speedUnit: 'mph' | 'kmh' | 'ms';
  themeMode: 'auto' | 'light' | 'dark';
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
simulateCountryDefaults('US'); // Test US defaults
simulateCountryDefaults('CA'); // Test Canadian defaults

// Check current settings
console.log('Current settings:', JSON.parse(localStorage.getItem('weathertunes-settings')));
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

**Accessibility:**
- High contrast theme option
- Font size preferences
- Reduced motion settings
- Screen reader optimizations

### Backend Integration

**User Profiles:**
- Server-side settings storage
- Account-based preferences
- Settings sharing between devices
- Preference learning and suggestions
