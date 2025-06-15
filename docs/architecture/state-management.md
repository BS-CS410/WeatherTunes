# State Management

WeatherTunes uses a combination of React Context, custom hooks, and local component state to manage application data efficiently and maintainably.

## Architecture Overview

### State Management Strategy

**Global State (React Context)**

- User settings and preferences
- Theme and UI configuration
- Persistent data across components

**Feature-Specific Hooks**

- Weather data management
- Music integration (planned)
- API call coordination
- Loading and error states

**Local Component State**

- UI interactions and animations
- Form inputs and temporary data
- Component-specific loading states

## Global State Management

### Settings Context

**Location:** `src/contexts/SettingsContext.tsx`

**Purpose:** Manages user preferences with persistence and location-based defaults.

**State Interface:**

```typescript
interface Settings {
  temperatureUnit: "fahrenheit" | "celsius";
  timeFormat: "12h" | "24h";
  speedUnit: "mph" | "kmh" | "ms";
  themeMode: "auto" | "light" | "dark";
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetToDefaults: () => void;
  isLoading: boolean;
}
```

**Key Features:**

- Automatic localStorage persistence
- Location-based default detection
- Type-safe settings updates
- Loading state management during initialization

**Usage Pattern:**

```typescript
const { settings, updateSettings } = useSettings();

// Update specific setting
updateSettings({ temperatureUnit: "celsius" });

// Access current settings
const isFahrenheit = settings.temperatureUnit === "fahrenheit";
```

### Context Provider Setup

**Location:** `src/main.tsx`

**Provider Hierarchy:**

```typescript
<BrowserRouter>
  <SettingsProvider>
    <App />
  </SettingsProvider>
</BrowserRouter>
```

**Benefits:**

- Settings available throughout app
- Single source of truth for preferences
- Automatic persistence and synchronization

## Custom Hooks

### Weather Data Hooks

**`useWeather.ts`**

- Fetches current weather data
- Handles geolocation and API calls
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
