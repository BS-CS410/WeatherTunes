# Component Architecture

WeatherTunes uses a component-based architecture where UI elements are built as reusable React components. This document explains the component organization and interaction patterns for developers new to React applications.

## Component Organization

React components are JavaScript functions that return UI elements. WeatherTunes organizes components into logical groups based on their functionality:

```
src/components/
├── Weather Domain
│   ├── WeatherDisplay.tsx      # Current weather conditions
│   ├── ForecastCard.tsx        # 5-day weather forecast
│   └── VideoBackground.tsx     # Dynamic weather videos
├── Music Domain
│   ├── CurrentlyPlaying.tsx    # Track display (placeholder data)
│   └── UpNext.tsx              # Music queue (placeholder data)
├── Layout Components
│   ├── NavBar.tsx              # Navigation and app header
│   ├── UnifiedDisplay.tsx      # Main content layout
│   ├── SettingsButton.tsx      # Settings trigger
│   └── SettingsMenu.tsx        # User preferences interface
├── UI Primitives (ui/)
│   ├── button.tsx              # Styled button variants
│   ├── card.tsx                # Glassmorphism containers
│   ├── input.tsx               # Form inputs
│   ├── label.tsx               # Accessible labels
│   └── navigation-menu.tsx     # Navigation primitives
├── Icons (icons/)
│   ├── SettingsIcon.tsx        # Animated settings icon
│   ├── SunriseIcon.tsx         # Custom sunrise icon
│   └── SunsetIcon.tsx          # Custom sunset icon
└── index.ts                    # Component exports
```

## Core Components

### WeatherDisplay Component

Displays current weather conditions with intelligent text sizing and responsive design.

**Location**: `src/components/WeatherDisplay.tsx`

**Props Interface**:

```typescript
interface WeatherDisplayProps {
  weatherData: WeatherDisplayData;
}

interface WeatherDisplayData {
  location: string;
  temperature: string;
  condition: string;
  unit: string;
  sunrise: string;
  sunset: string;
}
```

**Key Features**:

- Dynamic text sizing based on weather condition length
- Automatic line wrap detection and adjustment
- Custom sunrise/sunset icons with time display
- Responsive design with CSS clamp functions

**Implementation Example**:

```typescript
// From src/components/WeatherDisplay.tsx
const getConditionTextSize = (text: string) => {
  const length = text.length;
  if (length <= 8) return "text-[clamp(1.5rem,5vw,3rem)]";
  if (length <= 15) return "text-[clamp(1.2rem,4vw,2.5rem)]";
  return "text-[clamp(1rem,3.5vw,2rem)]";
};
```

### ForecastCard Component

Interactive weather forecast display with hover effects and loading states.

**Location**: `src/components/ForecastCard.tsx`

**Data Source**: `useForecast()` hook provides 5-day weather data from OpenWeatherMap API

**Features**:

- Interactive cards with hover animations
- Weather icons for each forecast day
- Temperature ranges with unit conversion
- Loading skeleton and error handling

### VideoBackground Component

Manages dynamic background videos based on weather conditions and time of day.

**Location**: `src/components/VideoBackground.tsx`

**Video Selection Logic**:

- 24 different videos covering weather types (clear, cloudy, fog, rain, snow)
- Time periods (day, evening, morning, night)
- Automatic selection based on weather data and local time

**Performance Features**:

- Lazy loading to prevent blocking page load
- Smooth transitions between video changes
- Fallback handling for unsupported formats

### CurrentlyPlaying Component

Music player interface ready for Spotify integration.

**Location**: `src/components/CurrentlyPlaying.tsx`

**Current State**: Uses placeholder data structure ready for backend integration

**Props Interface**:

```typescript
interface CurrentlyPlayingProps {
  songTitle?: string;
  artistName?: string;
  albumArtUrl?: string;
}
```

**Visual Features**:

- Album art with pulsing glow effect using CSS animations
- Hover effects with scale and translate transforms
- Responsive sizing using CSS clamp functions
- Dark/light theme support

**CSS Animation Example**:

```css
@keyframes custom-pulse-brightness {
  0%,
  100% {
    filter: brightness(1.1);
  }
  50% {
    filter: brightness(0.7);
  }
}
```

### SettingsMenu Component

Complete user preferences interface with persistence.

**Location**: `src/components/SettingsMenu.tsx`

**Connected Hook**: `useSettings()` from SettingsContext

**Settings Options**:

- Temperature units (Fahrenheit/Celsius)
- Time format (12-hour/24-hour)
- Speed units (mph/km/h/m/s)
- Theme mode (automatic/light/dark)

**Features**:

- Location-based default unit selection
- localStorage persistence across sessions
- Reset to defaults functionality
- Real-time preference updates

## Component Interaction Patterns

### Data Flow Architecture

WeatherTunes follows a unidirectional data flow pattern where data flows down from parent components to children through props, and events flow up through callback functions.

```
App.tsx (React Router)
├── SettingsContext (Global State)
└── MainPage.tsx (Layout Root)
    ├── NavBar.tsx
    ├── VideoBackground.tsx ← useWeather() hook
    ├── UnifiedDisplay.tsx
    │   ├── WeatherDisplay.tsx ← useWeather() hook
    │   ├── ForecastCard.tsx ← useForecast() hook
    │   ├── CurrentlyPlaying.tsx (placeholder data)
    │   └── UpNext.tsx (placeholder data)
    ├── SettingsButton.tsx
    └── SettingsMenu.tsx ← useSettings() hook
```

### State Management Strategy

**Global State**: React Context provides user settings throughout the component tree

```typescript
// From src/contexts/SettingsContext.tsx
const { settings } = useSettings();
// settings.temperatureUnit, settings.timeFormat, etc.
```

**Local State**: Components manage their own UI state using React hooks

```typescript
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);
```

**External Data**: Custom hooks fetch and manage API data

```typescript
const { weatherData, isLoading, error } = useWeatherData();
const { forecastData } = useForecast();
```

### Component Communication

**Parent to Child**: Props pass data and callback functions down

```typescript
<WeatherDisplay weatherData={weatherData} />
<SettingsMenu onSettingChange={handleSettingChange} />
```

**Child to Parent**: Callback functions send events up

```typescript
// In child component
onClick={() => onSettingChange('temperatureUnit', 'C')}

// In parent component
const handleSettingChange = (key, value) => {
  updateSettings({ [key]: value });
};
```

**Sibling Communication**: Shared state through common parent or global context

```typescript
// Both components access same weather data
const { weatherData } = useWeatherData();
```

## Styling Architecture

### Glassmorphism Design System

WeatherTunes uses a consistent glassmorphism design pattern implemented with Tailwind CSS utilities.

**Base Card Pattern**:

```css
className="bg-white/40 backdrop-blur-lg dark:bg-slate-900/75
          border border-white/20 dark:border-white/10
          rounded-xl shadow-lg"
```

**Interactive Elements**:

```css
className="transition-all duration-300
          hover:scale-105 hover:brightness-110"
```

### Responsive Design

Components use CSS clamp functions for fluid responsive behavior:

```css
/* Text sizing that scales smoothly */
className="text-[clamp(1rem,4vw,2rem)]"

/* Spacing that adapts to screen size */
className="p-[clamp(1rem,3vw,2rem)]"

/* Grid layouts with breakpoints */
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### Theme Integration

All components support automatic dark/light theme switching:

```css
className="text-gray-900 dark:text-slate-200
          bg-white/60 dark:bg-slate-900/60"
```

## UI Primitives

### Radix UI Integration

WeatherTunes uses Radix UI for complex, accessible components:

**Button Component** (`src/components/ui/button.tsx`):

- Multiple variants (default, secondary, outline)
- Built-in accessibility features
- TypeScript prop interfaces

**Card Component** (`src/components/ui/card.tsx`):

- Glassmorphism styling
- CardHeader, CardContent, CardFooter composition
- Consistent spacing and borders

**Navigation Menu** (`src/components/ui/navigation-menu.tsx`):

- Keyboard navigation support
- Screen reader compatibility
- Smooth animations

### Custom Icons

Icons are implemented as React components for consistency and performance:

```typescript
// From src/components/icons/SunriseIcon.tsx
export function SunriseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      {/* SVG path data */}
    </svg>
  );
}
```

## Performance Optimizations

### React Optimization Patterns

**Memoization**: Prevent unnecessary re-renders for expensive components

```typescript
const MemoizedWeatherDisplay = React.memo(WeatherDisplay);
const memoizedCalculation = useMemo(() => expensiveCalculation(data), [data]);
```

**Callback Optimization**: Stable references for event handlers

```typescript
const handleClick = useCallback(() => {
  // Event handling logic
}, [dependencies]);
```

### Loading Strategies

**Progressive Enhancement**: Core functionality loads first, enhancements follow

**Lazy Loading**: Large assets load on demand

```typescript
// Video backgrounds load only when needed
const videoSrc = useMemo(() => getVideoForWeather(weather), [weather]);
```

## Error Handling

### Component-Level Error Boundaries

Each major component handles its own error states:

```typescript
if (error) {
  return (
    <Card className="bg-red-50 dark:bg-red-900/20">
      <CardContent>
        <p>Weather data temporarily unavailable</p>
      </CardContent>
    </Card>
  );
}
```

### Graceful Degradation

Components provide fallback experiences when data is unavailable:

- Weather components show "Loading..." states
- Music components display placeholder information
- Settings preserve last known good values

## Component Development Guidelines

### TypeScript Interfaces

All components define clear prop interfaces:

```typescript
interface ComponentProps {
  requiredProp: string;
  optionalProp?: number;
  children?: ReactNode;
}

export function Component({ requiredProp, optionalProp = 0 }: ComponentProps) {
  // Component implementation
}
```

### Accessibility Standards

Components follow WCAG 2.1 guidelines:

- Semantic HTML elements
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility

### Testing Patterns

Components are designed for testability:

- Pure functions for business logic
- Predictable prop interfaces
- Isolated state management
- Mock-friendly data dependencies

This component architecture emphasizes reusability, accessibility, and maintainability while providing a solid foundation for future feature expansion.

- Debug information in development mode

### Icon Components

**Custom Icons** (`icons/`)

- `SettingsIcon.tsx` - Animated gear icon
- `SunriseIcon.tsx` - Sunrise time indicator
- `SunsetIcon.tsx` - Sunset time indicator
- Consistent styling and SVG optimization

### UI Primitives

**Base Components** (`ui/`)

- `button.tsx` - Styled button with variants
- `card.tsx` - Glassmorphism card container
- `input.tsx` - Form input with styling
- `label.tsx` - Accessible form labels
- `navigation-menu.tsx` - Radix UI navigation

## Component Interaction Patterns

### Data Flow

```
App.tsx (Router)
  ↓
MainPage.tsx (Layout)
  ├── NavBar.tsx
  ├── VideoBackground.tsx ← useWeather()
  ├── UnifiedDisplay.tsx
  │   ├── WeatherDisplay.tsx ← useWeather()
  │   ├── ForecastCard.tsx ← useForecast()
  │   ├── CurrentlyPlaying.tsx (placeholder)
  │   └── UpNext.tsx (placeholder)
  ├── SettingsButton.tsx
  └── SettingsMenu.tsx ← useSettings()
```

### State Management

**Global State (Context):**

- Settings preferences via `SettingsContext`
- Accessed through `useSettings()` hook
- Persistent storage and location-based defaults

**Component State:**

- Weather data via `useWeather()` and `useForecast()` hooks
- Local UI state (modals, loading, animations)
- Error handling and retry logic

### Props and Communication

**Parent-Child Communication:**

```typescript
// Settings propagation
MainPage → SettingsMenu (settings, updateSettings)

// Weather data sharing
WeatherDisplay ← useWeather() → VideoBackground

// Loading states
ForecastCard: {isLoading, error, data}
```

**Sibling Communication:**

- Through shared hooks (weather data)
- Via global settings context
- Event-based interactions (settings changes)

## Component Design Patterns

### Composition Pattern

**Card Components:**

```typescript
<Card>
  <CardContent>
    <WeatherDisplay />
  </CardContent>
</Card>
```

**Icon Usage:**

```typescript
<SunriseIcon className="w-4 h-4" />
<SettingsIcon isAnimating={isOpen} />
```

### Hook Integration

**Standard Pattern:**

```typescript
export function ComponentName() {
  const { settings } = useSettings();
  const { data, isLoading, error } = useWeather();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return <ContentDisplay />;
}
```

### Responsive Design

**Tailwind Breakpoints:**

```typescript
className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
className = "text-sm md:text-base lg:text-lg";
className = "p-4 md:p-6 lg:p-8";
```

### Error Boundaries

**Component-Level Error Handling:**

```typescript
try {
  // Component logic
} catch (error) {
  console.error('Component error:', error);
  return <FallbackUI />;
}
```

## Styling Conventions

### Glassmorphism Pattern

**Standard Card Styling:**

```css
.glass-card {
  @apply bg-white/40 backdrop-blur-lg dark:bg-slate-900/75;
  @apply border border-white/20 dark:border-white/10;
  @apply rounded-xl shadow-lg;
}
```

### Interactive Elements

**Hover Effects:**

```css
.interactive {
  @apply transition-all duration-300;
  @apply hover:scale-105 hover:brightness-110;
}
```

### Theme Integration

**Dark Mode Support:**

```css
.theme-aware {
  @apply text-gray-900 dark:text-slate-200;
  @apply bg-white/60 dark:bg-slate-900/60;
}
```

## Performance Optimizations

### Component Loading

**Lazy Loading:**

- Large components loaded on demand
- Video assets loaded progressively
- Dynamic imports for heavy features

**Memoization:**

```typescript
const MemoizedComponent = React.memo(Component);
const memoizedValue = useMemo(() => computation, [deps]);
const memoizedCallback = useCallback(fn, [deps]);
```

### Re-render Optimization

**Context Optimization:**

- Split contexts to minimize re-renders
- Memoize context values
- Use callback refs for performance

**State Updates:**

- Batch state updates where possible
- Debounce frequent updates
- Use functional updates for state

## Testing Strategy

### Component Testing

**Unit Tests:**

- Individual component rendering
- Props handling and validation
- Event handling and callbacks
- Error boundary testing

**Integration Tests:**

- Component interaction patterns
- Hook integration testing
- State management verification
- API integration testing

### Manual Testing

**Responsive Testing:**

- Mobile, tablet, desktop layouts
- Browser compatibility testing
- Touch interaction verification
- Accessibility testing

## Future Component Plans

### Planned Components

**Music Enhancement:**

- `PlaylistManager.tsx` - Playlist creation/management
- `MusicPlayer.tsx` - Full player controls
- `VolumeControl.tsx` - Audio level management

**User Features:**

- `UserProfile.tsx` - Account management
- `FavoritesManager.tsx` - Saved content
- `NotificationCenter.tsx` - User alerts

**Advanced Features:**

- `WeatherAlerts.tsx` - Weather warnings
- `LocationPicker.tsx` - Manual location selection
- `ThemeCustomizer.tsx` - Advanced theming

### Component Refactoring

**Planned Improvements:**

- Split large components into smaller pieces
- Extract common patterns into reusable hooks
- Improve TypeScript interfaces
- Enhance accessibility features
- Optimize bundle size and performance
