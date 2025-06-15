# WeatherTunes AI Codebase Index

**LAST_UPDATED**: 2025-06-15
**PURPOSE**: AI agent rapid context acquisition for WeatherTunes codebase
**SCOPE**: Complete architectural overview for AI assistance optimization

## Core Project Identity

**PROJECT_TYPE**: React + TypeScript SPA (weather + music streaming integration)
**BUILD_SYSTEM**: Vite 6.3.5
**MAIN_TECH_STACK**: React 19.1.0, TypeScript 5.8.3, Tailwind CSS 4.1.8, Radix UI
**PACKAGE_MANAGER**: npm
**NODE_REQUIREMENT**: 18+

## Critical Dependencies & Versions

```json
PRODUCTION_DEPS: {
  "react": "19.1.0", "react-dom": "19.1.0", "react-router-dom": "7.6.2",
  "@radix-ui/react-*": "1.2.x-2.1.x", "tailwindcss": "4.1.8",
  "class-variance-authority": "0.7.1", "clsx": "2.1.1", "tailwind-merge": "3.3.0",
  "lucide-react": "0.513.0"
}

DEV_DEPS: {
  "vite": "6.3.5", "@vitejs/plugin-react": "4.4.1",
  "eslint": "9.25.0", "typescript": "5.8.3", "prettier": "3.5.3"
}
```

## File System Architecture

```
PROJECT_ROOT: /Users/sirel/Desktop/weathertunes/
├── CRITICAL_CONFIG: components.json, tailwind.config.ts, vite.config.ts, tsconfig.json
├── ENTRY_POINTS: index.html, src/main.tsx, src/App.tsx
├── DOCUMENTATION: README.md, PROJECT_DOCUMENTATION.md, LOCATION_UNITS_IMPLEMENTATION.md
├── src/
│   ├── components/ [28 COMPONENTS - FULLY IMPLEMENTED UI]
│   │   ├── WEATHER_DOMAIN: VideoBackground.tsx, WeatherDisplay.tsx, ForecastCard.tsx
│   │   ├── MUSIC_DOMAIN: CurrentlyPlaying.tsx*, UpNext.tsx* (*=PLACEHOLDER_DATA)
│   │   ├── LAYOUT_DOMAIN: NavBar.tsx*, SettingsButton.tsx, SettingsMenu.tsx, UnifiedDisplay.tsx
│   │   ├── icons/: SettingsIcon.tsx, SunriseIcon.tsx, SunsetIcon.tsx + index.ts
│   │   └── ui/: button.tsx, card.tsx, input.tsx, label.tsx, navigation-menu.tsx
│   ├── contexts/: SettingsContext.tsx [COMPLETE_GLOBAL_STATE]
│   ├── hooks/ [11 HOOKS - WEATHER=COMPLETE, MUSIC=STUB]
│   │   ├── WEATHER_HOOKS: useWeather.ts, useForecast.ts [OPENWEATHER_API_INTEGRATED]
│   │   ├── SETTINGS_HOOKS: useSettings.ts, useLocalStorage.ts, useLocationBasedDefaults.ts
│   │   ├── UI_HOOKS: useCardOrder.ts, useThemeManager.ts
│   │   └── index.ts [EXPORT_BARREL]
│   ├── lib/ [UTILITY_LIBRARIES]
│   │   ├── weather.ts [OPENWEATHER_API_CLIENT], temperature.ts, units.ts
│   │   ├── utils.ts [TIME_UTILS], styles.ts [CSS_UTILS]
│   │   └── index.ts [EXPORT_BARREL]
│   ├── pages/: MainPage.tsx [PRIMARY_INTERFACE], Login.tsx [PLACEHOLDER]
│   ├── types/: weather.ts [COMPLETE_TYPE_DEFINITIONS]
│   └── assets/videos/ [24_WEATHER_VIDEOS: {clear,cloudy,fog,rain,snow}_{day,evening,morning,night}.mp4]
```

## Implementation Status Matrix

### ✅ FULLY_IMPLEMENTED (PRODUCTION_READY)

- **WEATHER_SYSTEM**: OpenWeatherMap API integration, current + 5-day forecast, error handling
- **SETTINGS_SYSTEM**: Complete user preferences (temp units, time format, speed units, theme), localStorage persistence, location-based defaults
- **UI_SYSTEM**: Responsive design, glassmorphism styling, automatic dark/light themes, accessibility (Radix UI)
- **VIDEO_BACKGROUNDS**: 24 weather/time-specific videos with automatic selection logic
- **TYPESCRIPT_COVERAGE**: 100% typed, strict mode enabled

### 🔄 PARTIAL_IMPLEMENTATION (UI_READY_BACKEND_PENDING)

- **MUSIC_COMPONENTS**: CurrentlyPlaying.tsx, UpNext.tsx (placeholder data structures ready for Spotify API)
- **AUTH_FLOW**: Login.tsx, NavBar.tsx login button (OAuth structure planned)
- **USER_DATA**: Favorites system UI exists, backend persistence needed

### ❌ REQUIRES_BACKEND_DEVELOPMENT

- **SPOTIFY_INTEGRATION**: OAuth 2.0, Web API, player controls, playlist management
- **WEATHER_TO_MUSIC_LOGIC**: Algorithm for weather-based song selection
- **USER_PERSISTENCE**: Cross-device settings sync, favorites storage, listening history
- **REAL_AUTHENTICATION**: Currently open access, needs protected routes

## API Integration Points

### EXTERNAL_APIS_CURRENT

```typescript
OPENWEATHER_API: {
  endpoint: "https://api.openweathermap.org/data/2.5/",
  auth: "VITE_PUBLIC_OPENWEATHER_API_KEY",
  usage: ["weather", "forecast"],
  implementation: "src/lib/weather.ts"
}
```

### EXTERNAL_APIS_PLANNED

```typescript
SPOTIFY_WEB_API: {
  auth_flow: "OAuth 2.0 PKCE",
  scopes_needed: ["user-read-playback-state", "user-modify-playback-state", "user-read-currently-playing", "user-library-read"],
  endpoints_needed: ["/me/player/currently-playing", "/me/player/queue", "/me/player/play", "/me/player/pause"]
}
```

## Component Interaction Patterns

### DATA_FLOW_ARCHITECTURE

```
SettingsContext (Global)
  ↓ useSettings()
  ↓ [useWeather, useForecast, useThemeManager]
  ↓ [WeatherDisplay, ForecastCard, VideoBackground]

MainPage (Layout Root)
  ├── UnifiedDisplay (weather + music combined)
  ├── CurrentlyPlaying (Spotify data awaited)
  ├── UpNext (queue data awaited)
  ├── ForecastCard (OpenWeather data active)
  └── SettingsMenu (complete functionality)
```

### STATE_MANAGEMENT_PATTERN

- **GLOBAL**: React Context (SettingsContext) for user preferences
- **LOCAL**: useState/useEffect in custom hooks for feature-specific state
- **PERSISTENCE**: localStorage integration via useLocalStorage hook
- **ERROR_HANDLING**: Comprehensive try/catch with fallback data structures

## Critical Code Patterns & Conventions

### COMPONENT_STRUCTURE

```typescript
// Standard component pattern used throughout codebase
export function ComponentName({ prop }: ComponentProps) {
  const { settings } = useSettings(); // Global settings access
  const [localState, setLocalState] = useState<Type>(defaultValue);

  useEffect(() => {
    // Side effects with cleanup
  }, [dependencies]);

  return (
    <div className="glassmorphism-pattern">
      {/* UI with Tailwind utilities */}
    </div>
  );
}
```

### STYLING_CONVENTIONS

```css
/* Glassmorphism pattern used extensively */
.glass-card: "bg-white/40 backdrop-blur-md dark:bg-slate-900/75"
.hover-effect: "brightness-110 hover:brightness-125"
.responsive-text: "text-sm md:text-base lg:text-lg"
```

### TYPE_DEFINITIONS_PATTERN

```typescript
// Located in src/types/weather.ts - comprehensive weather typing
interface WeatherApiResponse {
  /* OpenWeather API shape */
}
interface WeatherDisplayData {
  /* Processed display data */
}
interface EnhancedWeatherState {
  /* Hook state management */
}
```

## Environment & Configuration

### ENVIRONMENT_VARIABLES

```bash
REQUIRED: VITE_PUBLIC_OPENWEATHER_API_KEY=<openweather_api_key>
PLANNED: VITE_SPOTIFY_CLIENT_ID=<spotify_client_id>
```

### BUILD_CONFIGURATION

- **DEV_SERVER**: `npm run dev` (Vite HMR on localhost:5173)
- **PRODUCTION_BUILD**: `npm run build` (TypeScript compile + Vite optimize)
- **CODE_QUALITY**: `npm run lint` (ESLint + Prettier)

## Integration Readiness Assessment

### BACKEND_INTEGRATION_POINTS

```typescript
// Primary integration locations requiring backend endpoints
src/components/NavBar.tsx:36        // Spotify OAuth trigger
src/components/CurrentlyPlaying.tsx:12 // Real music data replacement
src/components/UpNext.tsx:11        // Dynamic queue data
src/pages/MainPage.tsx:78           // Spotify player controls
src/pages/MainPage.tsx:92           // Favorites system
```

### FRONTEND_BACKEND_CONTRACT

```typescript
// Data structures already defined and ready for backend
interface CurrentTrack {
  songTitle: string;
  artistName: string;
  albumArtUrl: string;
  duration: number;
  progress: number;
  isPlaying: boolean;
}

interface UserSettings {
  temperatureUnit: "F" | "C";
  timeFormat: "12h" | "24h";
  speedUnit: "mph" | "kmh" | "ms";
  themeMode: "auto" | "light" | "dark";
}
```

## Performance & Quality Metrics

### OPTIMIZATION_STATUS

- **BUNDLE_SIZE**: Optimized via Vite tree-shaking and code splitting
- **ASSET_LOADING**: 24 video files (~2-5MB each) with lazy loading
- **API_EFFICIENCY**: Weather data cached, geolocation with fallback coordinates
- **ACCESSIBILITY**: WCAG 2.1 compliance through Radix UI primitives

### ERROR_HANDLING_COVERAGE

- **API_FAILURES**: Graceful fallbacks for weather API errors
- **GEOLOCATION**: Fallback to Bellevue, WA coordinates
- **MISSING_ENV**: Clear error messages for missing API keys
- **TYPE_SAFETY**: Strict TypeScript prevents runtime type errors

## Development Workflow

### COMMANDS_REFERENCE

```bash
npm run dev          # Start development (port 5173)
npm run build        # Production build
npm run lint         # ESLint check
npm run preview      # Preview production build
```

### FILE_EDITING_PATTERNS

- **COMPONENTS**: Use insert_edit_into_file for component modifications
- **TYPES**: Extend interfaces in src/types/weather.ts for new data structures
- **HOOKS**: Add new hooks to src/hooks/ with index.ts exports
- **STYLES**: Tailwind utilities preferred, custom CSS in src/index.css

## Architecture Philosophy

### DESIGN_PRINCIPLES

- **UTILITY_FIRST**: Tailwind CSS for rapid development
- **TYPE_FIRST**: TypeScript strict mode for reliability
- **COMPONENT_COMPOSITION**: Small, focused, reusable components
- **HOOK_ABSTRACTION**: Custom hooks for complex logic isolation
- **RESPONSIVE_MOBILE_FIRST**: Mobile experience as primary target
- **ACCESSIBILITY_NATIVE**: Radix UI ensures keyboard/screen reader support

### FUTURE_EXTENSIBILITY

- **MODULAR_ARCHITECTURE**: Easy to add new weather providers, music services
- **PLUGIN_READY**: Component structure supports additional integrations
- **THEME_EXTENSIBLE**: Design system supports custom themes/branding
- **API_AGNOSTIC**: Weather/music logic abstracted for provider flexibility

---

**END_AI_CODEBASE_INDEX**
