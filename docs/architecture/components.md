# Component Structure

This document outlines the frontend component architecture, showing how components are organized and how they interact with each other.

## Directory Structure

```
src/components/
├── CurrentlyPlaying.tsx      # Music player display component
├── ForecastCard.tsx          # 5-day weather forecast
├── NavBar.tsx                # Main navigation bar
├── SettingsButton.tsx        # Settings trigger component
├── SettingsMenu.tsx          # User preferences interface
├── UnifiedDisplay.tsx        # Combined weather/music display
├── UpNext.tsx                # Music queue component
├── VideoBackground.tsx       # Dynamic weather backgrounds
├── WeatherDisplay.tsx        # Current weather information
├── icons/                    # Custom icon components
│   ├── SettingsIcon.tsx      # Settings gear icon
│   ├── SunriseIcon.tsx       # Sunrise time icon
│   ├── SunsetIcon.tsx        # Sunset time icon
│   └── index.ts              # Icon exports
├── ui/                       # Base UI primitives
│   ├── button.tsx            # Styled button component
│   ├── card.tsx              # Card container component
│   ├── input.tsx             # Form input component
│   ├── label.tsx             # Form label component
│   └── navigation-menu.tsx   # Navigation menu component
└── index.ts                  # Component exports
```

## Component Categories

### Layout Components

**`NavBar.tsx`**

- Main application navigation
- Spotify login placeholder (awaiting backend)
- Responsive design with glassmorphism styling
- Contains settings access and app branding

**`UnifiedDisplay.tsx`**

- Central display combining weather and music information
- Responsive layout that adapts to screen size
- Orchestrates major content areas

### Weather Components

**`WeatherDisplay.tsx`**

- Current weather conditions display
- Temperature, humidity, pressure, wind speed
- Sunrise/sunset times with custom icons
- Real-time data from OpenWeatherMap API

**`ForecastCard.tsx`**

- 5-day weather forecast with interactive cards
- Weather icons and temperature ranges
- Hover effects and animations
- Loading and error state handling

**`VideoBackground.tsx`**

- Dynamic background videos based on weather/time
- 24 different weather/time combinations
- Automatic video selection and smooth transitions
- Performance optimized with lazy loading

### Music Components (UI Ready)

**`CurrentlyPlaying.tsx`**

- Current track display with album art
- Song title, artist, and playback progress
- Placeholder data structure ready for Spotify API
- Player control interface planned

**`UpNext.tsx`**

- Music queue display with upcoming tracks
- Track list with artist and title information
- Placeholder songs for development
- Queue management interface planned

### Settings Components

**`SettingsButton.tsx`**

- Animated settings gear icon
- Trigger for settings menu
- Consistent styling with app theme

**`SettingsMenu.tsx`**

- Complete user preferences interface
- Temperature, time, speed, and theme settings
- Location-based defaults and reset functionality
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
