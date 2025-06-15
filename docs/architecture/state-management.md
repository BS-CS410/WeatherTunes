# State Management

WeatherTunes manages application state using React Context for global settings, custom hooks for external data, and local component state for UI interactions. This document explains the state management patterns for developers new to React applications.

## State Management Overview

React applications manage different types of state at different levels of the component tree. WeatherTunes uses a layered approach:

**Global State**: User preferences that persist across browser sessions
**External Data State**: Weather information from APIs with loading and error handling
**Local UI State**: Component-specific interactions like animations and form inputs

## Global State with React Context

### SettingsContext Implementation

React Context provides a way to share state between components without passing props through every level of the component tree.

**Location**: `src/contexts/SettingsContext.tsx`

**Settings Interface**:

```typescript
interface Settings {
  temperatureUnit: "F" | "C";
  timeFormat: "12h" | "24h";
  speedUnit: "mph" | "kmh" | "ms";
  themeMode: "auto" | "light" | "dark";
}
```

**Context Type Definition**:

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

### Context Provider Setup

The SettingsProvider component wraps the entire application to make settings available everywhere:

```typescript
// From src/main.tsx
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </BrowserRouter>
);
```

### Settings Persistence Strategy

Settings automatically save to localStorage and restore on page reload:

**Persistence Hook**: `src/hooks/useLocalStorage.ts`

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

### Location-Based Defaults

WeatherTunes automatically selects appropriate default units based on user location:

**Implementation**: `src/hooks/useLocationBasedDefaults.ts`

**Process**:

1. Request geolocation permission from browser
2. Use coordinates to determine country via reverse geocoding
3. Set appropriate defaults (US uses Fahrenheit/mph, others use Celsius/km/h)
4. Apply defaults only for new users, preserve existing preferences

**Usage in SettingsContext**:

```typescript
const { locationDefaults, isLoading: locationLoading } =
  useLocationBasedDefaults();

// Update defaults when location is determined (only if not already set)
useEffect(() => {
  if (!locationLoading && locationDefaults && !defaultsInitialized) {
    const hasExistingPrefs =
      localStorage.getItem("temperatureUnit") ||
      localStorage.getItem("speedUnit");

    if (!hasExistingPrefs) {
      setTemperatureUnit(locationDefaults.temperatureUnit);
      setSpeedUnit(locationDefaults.speedUnit);
    }
    setDefaultsInitialized(true);
  }
}, [locationLoading, locationDefaults, defaultsInitialized]);
```

## External Data Management

### Weather Data Hook

**Location**: `src/hooks/useWeather.ts`

The weather hook manages API calls, loading states, and error handling for current weather conditions.

**State Interface**:

```typescript
interface EnhancedWeatherState {
  displayData: {
    location: string;
    temperature: string;
    condition: string;
    unit: string;
    isError: boolean;
  };
  timePeriod: TimePeriod | null;
  isLoading: boolean;
  error: Error | null;
  rawResponse: WeatherApiResponse | null;
}
```

**Hook Implementation Pattern**:

```typescript
export function useWeatherData() {
  const { settings } = useSettings();
  const [weatherState, setWeatherState] = useState<EnhancedWeatherState>({
    displayData: {
      location: "Loading...",
      temperature: "--",
      condition: "Loading...",
      unit: `°${settings.temperatureUnit}`,
      isError: false,
    },
    timePeriod: null,
    isLoading: true,
    error: null,
    rawResponse: null,
  });

  const processWeatherData = useCallback(
    (data, error) => {
      if (error || !data) {
        setWeatherState({
          displayData: {
            location: "Error",
            temperature: "--",
            condition: "Unable to load",
            unit: `°${settings.temperatureUnit}`,
            isError: true,
          },
          // ... error state
        });
        return;
      }
      // ... process successful data
    },
    [settings.temperatureUnit],
  );

  // ... useEffect for data fetching
}
```

### Forecast Data Hook

**Location**: `src/hooks/useForecast.ts`

Manages 5-day weather forecast data with similar error handling patterns.

**Features**:

- Automatic data refresh
- Temperature unit conversion
- Loading state management
- Error boundary integration

## Custom Hook Patterns

### Hook Composition Strategy

WeatherTunes uses specialized hooks for different concerns:

**Settings Access**: `useSettings()` - Global settings from Context
**Data Persistence**: `useLocalStorage()` - localStorage integration
**External APIs**: `useWeather()`, `useForecast()` - Weather data management
**Location Services**: `useLocationBasedDefaults()` - Geolocation and defaults

### Hook Development Pattern

Custom hooks follow a consistent pattern for data management:

```typescript
export function useCustomHook() {
  // 1. State initialization
  const [data, setData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Data fetching effect
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const result = await apiCall();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err);
        setData(fallbackData);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [dependencies]);

  // 3. Return interface
  return { data, isLoading, error };
}
```

## Local Component State

### UI State Management

Components manage their own UI interactions using React's built-in hooks:

**Loading States**:

```typescript
const [isLoading, setIsLoading] = useState(false);
```

**Form Inputs**:

```typescript
const [inputValue, setInputValue] = useState("");
```

**Animation States**:

```typescript
const [isAnimating, setIsAnimating] = useState(false);
```

### State Optimization

**Memoization for Expensive Calculations**:

```typescript
const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);
```

**Callback Optimization**:

```typescript
const handleClick = useCallback(() => {
  // Event handling logic
}, [dependencies]);
```

## Error Handling Strategy

### Global Error Boundaries

Error handling occurs at multiple levels:

**Context Level**: Settings errors are handled gracefully with fallback values
**Hook Level**: API errors return error states instead of crashing
**Component Level**: UI errors are caught and display fallback content

### Error State Patterns

**API Error Handling**:

```typescript
const { weatherData, isLoading, error } = useWeatherData();

if (error) {
  return <ErrorDisplay message="Weather data unavailable" />;
}

if (isLoading) {
  return <LoadingSpinner />;
}

return <WeatherContent data={weatherData} />;
```

**Fallback Data Strategy**:

```typescript
const createErrorWeatherData = () => ({
  name: "Error",
  weather: [{ main: "Unable to load", description: "Please try again" }],
  main: { temp: 0, humidity: 0, pressure: 0 },
  // ... other fallback properties
});
```

## State Debugging

### Development Tools

**Console Logging for State Changes**:

```typescript
useEffect(() => {
  console.log("Settings updated:", settings);
}, [settings]);
```

**Location Debug Information**:

```typescript
console.log("Location defaults:", locationDefaults);
console.log("Has existing preferences:", !!hasExistingPrefs);
```

**React DevTools Integration**: All custom hooks and Context values are visible in React DevTools for debugging state changes.

## Performance Considerations

### State Update Optimization

**Batched Updates**: React automatically batches state updates within event handlers
**Conditional Updates**: Only update state when values actually change
**Memoized Selectors**: Use useMemo for derived state calculations

### Memory Management

**Cleanup Effects**: Weather hooks clean up timers and API calls on unmount
**Reference Stability**: useCallback ensures stable function references
**Context Optimization**: Settings context value is memoized to prevent unnecessary re-renders
**Offline Support**: Service worker integration for offline state management

This state management architecture provides a scalable foundation that separates concerns while maintaining predictable data flow throughout the application.

- Manages loading, error, and success states
- Provides formatted data for display

```typescript
interface UseWeatherReturn {
  data: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const { data, isLoading, error } = useWeather();
```

**`useForecast.ts`**

- Fetches 5-day weather forecast
- Processes and formats forecast data
- Handles API errors gracefully
- Provides retry functionality

```typescript
interface UseForecastReturn {
  forecast: ForecastDay[];
  isLoading: boolean;
  error: string | null;
}

const { forecast, isLoading, error } = useForecastData();
```

### Utility Hooks

**`useLocalStorage.ts`**

- Generic localStorage operations
- JSON serialization/deserialization
- Type-safe storage access
- Error handling for storage failures

```typescript
const [storedValue, setStoredValue] = useLocalStorage<Settings>(
  "weathertunes-settings",
  defaultSettings,
);
```

**`useLocationBasedDefaults.ts`**

- Geographic location detection
- Country-based unit determination
- Fallback handling for detection failures
- Caching of location results

```typescript
const { defaults, isLoading } = useLocationBasedDefaults();
```

**`useThemeManager.ts`**

- Automatic theme switching based on time
- Manual theme override support
- CSS class application
- Sunrise/sunset time integration

```typescript
const { currentTheme, setTheme } = useThemeManager();
```

### Feature-Specific Hooks

**`useCardOrder.ts`**

- Manages display order of UI cards
- Responsive layout calculations
- User preference storage
- Dynamic reordering support

```typescript
const { cardOrder, updateOrder } = useCardOrder();
```

## Data Flow Patterns

### Weather Data Flow

```
1. useWeather() hook
   ↓
2. Browser geolocation API
   ↓
3. OpenWeatherMap API call
   ↓
4. Data processing and formatting
   ↓
5. Component updates (WeatherDisplay, VideoBackground)
```

### Settings Data Flow

```
1. User interaction (SettingsMenu)
   ↓
2. updateSettings() call
   ↓
3. SettingsContext state update
   ↓
4. localStorage persistence
   ↓
5. All consuming components re-render
```

### Error Handling Flow

```
1. API or operation failure
   ↓
2. Error captured in hook
   ↓
3. Error state updated
   ↓
4. Component displays error UI
   ↓
5. Retry mechanism available
```

## State Persistence

### Local Storage Strategy

**Settings Persistence:**

```typescript
// Automatic save on settings change
useEffect(() => {
  localStorage.setItem("weathertunes-settings", JSON.stringify(settings));
}, [settings]);

// Load on app initialization
useEffect(() => {
  const stored = localStorage.getItem("weathertunes-settings");
  if (stored) {
    setSettings(JSON.parse(stored));
  }
}, []);
```

**Data Validation:**

```typescript
const validateStoredSettings = (data: any): Settings | null => {
  if (!data || typeof data !== "object") return null;

  // Validate each setting property
  const isValid =
    ["fahrenheit", "celsius"].includes(data.temperatureUnit) &&
    ["12h", "24h"].includes(data.timeFormat) &&
    ["mph", "kmh", "ms"].includes(data.speedUnit) &&
    ["auto", "light", "dark"].includes(data.themeMode);

  return isValid ? data : null;
};
```

### Cache Management

**Weather Data Caching:**

```typescript
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const cachedData = {
  weather: { data: null, timestamp: 0 },
  forecast: { data: null, timestamp: 0 },
};

const isCacheValid = (timestamp: number) =>
  Date.now() - timestamp < CACHE_DURATION;
```

**Location Caching:**

```typescript
const LOCATION_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Cache coordinates to avoid repeated geolocation requests
const cacheLocation = (coords: GeolocationCoordinates) => {
  localStorage.setItem(
    "cached-location",
    JSON.stringify({
      latitude: coords.latitude,
      longitude: coords.longitude,
      timestamp: Date.now(),
    }),
  );
};
```

## Performance Optimization

### Re-render Prevention

**Context Value Memoization:**

```typescript
const contextValue = useMemo(
  () => ({
    settings,
    updateSettings,
    resetToDefaults,
    isLoading,
  }),
  [settings, isLoading],
);
```

**Callback Memoization:**

```typescript
const updateSettings = useCallback((newSettings: Partial<Settings>) => {
  setSettings((prev) => ({ ...prev, ...newSettings }));
}, []);
```

### Selective Updates

**Granular State Updates:**

```typescript
// Only update specific settings to minimize re-renders
const updateTemperatureUnit = useCallback(
  (unit: TemperatureUnit) => {
    updateSettings({ temperatureUnit: unit });
  },
  [updateSettings],
);
```

**Conditional Effect Dependencies:**

```typescript
// Only fetch weather when location changes
useEffect(() => {
  if (coordinates) {
    fetchWeatherData(coordinates);
  }
}, [coordinates.latitude, coordinates.longitude]);
```

## Error Handling

### Global Error Boundaries

**Error Recovery:**

```typescript
const ErrorBoundary: React.FC = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  const resetError = () => setHasError(false);

  if (hasError) {
    return <ErrorFallback onReset={resetError} />;
  }

  return children;
};
```

### Hook-Level Error Handling

**API Error Management:**

```typescript
const useWeather = () => {
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const data = await weatherApi.getCurrentWeather(coords);
      setWeatherData(data);
    } catch (err) {
      setError("Failed to fetch weather data");
      console.error("Weather API error:", err);
    }
  };

  return { data, error, refetch: fetchData };
};
```

### Graceful Degradation

**Fallback Data:**

```typescript
const defaultWeatherData = {
  location: "Bellevue, WA",
  temperature: 20,
  condition: "clear sky",
  // ... other default values
};

// Use fallback when API fails
const weatherData = apiData || defaultWeatherData;
```

## Testing State Management

### Hook Testing

**Custom Hook Testing:**

```typescript
import { renderHook, act } from "@testing-library/react";
import { useSettings } from "../hooks/useSettings";

test("should update settings correctly", () => {
  const { result } = renderHook(() => useSettings());

  act(() => {
    result.current.updateSettings({ temperatureUnit: "celsius" });
  });

  expect(result.current.settings.temperatureUnit).toBe("celsius");
});
```

**Context Testing:**

```typescript
const renderWithContext = (component: React.ReactElement) => {
  return render(
    <SettingsProvider>
      {component}
    </SettingsProvider>
  );
};
```

### Integration Testing

**Data Flow Testing:**

```typescript
test('weather data updates video background', async () => {
  const { getByTestId } = render(<App />);

  // Mock weather data
  mockWeatherApi.mockResolvedValue({
    condition: 'rain',
    timeOfDay: 'evening'
  });

  // Wait for data to load and video to update
  await waitFor(() => {
    const video = getByTestId('background-video');
    expect(video.src).toContain('rain_evening.mp4');
  });
});
```

## Future Enhancements

### Planned State Improvements

**Redux Toolkit Integration (if needed):**

- For complex music player state
- Advanced undo/redo functionality
- Time-travel debugging
- Complex async action handling

**Server State Management:**

- React Query for API data
- Optimistic updates
- Background synchronization
- Offline support

**Enhanced Persistence:**

- IndexedDB for large data
- Cross-tab synchronization
- Cloud settings backup
- Migration handling for schema changes

### Performance Monitoring

**State Performance Metrics:**

- Re-render tracking
- Memory usage monitoring
- API call optimization
- Bundle size impact analysis
