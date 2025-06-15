# Architecture Overview

WeatherTunes is a React-based single-page application that integrates weather data with music streaming. This document explains the system design and technology choices for developers new to modern web applications.

## System Description

WeatherTunes displays weather data alongside music player interface components. The application shows current weather conditions with dynamic video backgrounds and contains music player UI components that currently display placeholder data.

## Technology Stack

### Core Technologies

**React 19.1.0** - JavaScript library for building user interfaces using components. Components are reusable pieces of UI that manage their own state and lifecycle.

**TypeScript 5.8.3** - JavaScript with static type checking. Prevents runtime errors by catching type mismatches during development.

**Vite 6.3.5** - Build tool that provides fast development server with hot module replacement (HMR) and optimized production builds.

### Styling and Components

**Tailwind CSS 4.1.8** - Utility-first CSS framework. Instead of writing custom CSS, developers use predefined classes like `bg-blue-500` or `p-4` for styling.

**Radix UI** - Collection of accessible component primitives. Provides complex components like navigation menus and labels with built-in keyboard navigation and screen reader support.

**Lucide React** - Icon library with consistent SVG icons optimized for React components.

### Development Tools

**ESLint** - Static code analysis tool that identifies problematic patterns and enforces coding standards.

**Prettier** - Code formatter that ensures consistent style across all files.

**React Router DOM** - Client-side routing library that enables navigation between different views without page refreshes.

## Architecture Patterns

### Component-Based Architecture

React applications are built using components, which are JavaScript functions that return UI elements. WeatherTunes follows this pattern:

```typescript
// Example component from src/components/WeatherDisplay.tsx
export function WeatherDisplay() {
  const { weatherData } = useWeatherData();

  return (
    <Card className="bg-white/40 backdrop-blur-lg">
      <CardContent>
        <h2>{weatherData.location}</h2>
        <p>{weatherData.temperature}</p>
      </CardContent>
    </Card>
  );
}
```

### State Management Strategy

**Global State**: React Context manages user settings that need to be accessed throughout the application.

**Local State**: Individual components manage their own data using React hooks like `useState` and `useEffect`.

**Persistence**: User preferences are saved to browser localStorage and restored on subsequent visits.

### Custom Hooks Pattern

Business logic is extracted into custom hooks, which are JavaScript functions that use React hooks internally. This separates concerns and makes components easier to test.

```typescript
// Example from src/hooks/useWeather.ts
export function useWeatherData() {
  const [weatherState, setWeatherState] = useState(initialState);

  useEffect(() => {
    fetchWeatherData().then(setWeatherState);
  }, []);

  return { weatherData: weatherState };
}
```

## Current Implementation Status

### Production Ready Features

**Weather System** - Complete integration with OpenWeatherMap API including current conditions, 5-day forecast, sunrise/sunset times, and comprehensive weather metrics.

**Settings Management** - Full user preference system with temperature units, time format, speed units, and theme mode options. Settings persist across browser sessions using localStorage.

**Responsive Design** - Mobile-first layout that adapts to different screen sizes using Tailwind CSS responsive utilities.

**Video Backgrounds** - Dynamic background system with 24 videos covering different weather conditions and time periods.

**Accessibility** - WCAG 2.1 compliance through Radix UI components with proper keyboard navigation and screen reader support.

### Components Using Placeholder Data

**Music Integration** - User interface components exist for music playback controls, track display, and queue management. These currently show static data.

**Authentication Flow** - Login page and navigation elements are implemented but do not connect to any authentication service.

## Data Flow Architecture

### Application Entry Point

The application starts in `src/main.tsx`, which renders the root component with necessary providers:

```typescript
// Simplified version of src/main.tsx
import { SettingsProvider } from "./contexts/SettingsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </BrowserRouter>
);
```

### Component Hierarchy

```
App.tsx (routing)
├── NavBar.tsx (navigation)
└── MainPage.tsx (main layout)
    ├── UnifiedDisplay.tsx (weather + music)
    ├── CurrentlyPlaying.tsx (music controls)
    ├── UpNext.tsx (music queue)
    ├── ForecastCard.tsx (weather forecast)
    └── SettingsMenu.tsx (user preferences)
```

### State Flow Pattern

1. **Settings Context** provides global configuration to all components
2. **Custom hooks** fetch external data (weather API) and manage local state
3. **Components** receive data through hooks and render UI elements
4. **User interactions** trigger state updates that flow down to child components

## Performance Considerations

**Bundle Optimization** - Vite automatically tree-shakes unused code and splits bundles for optimal loading.

**Asset Management** - Background videos (24 files, 2-5MB each) use lazy loading to prevent blocking initial page load.

**API Efficiency** - Weather data is cached to minimize API calls and improve response times.

**Error Handling** - Graceful fallbacks for API failures, geolocation errors, and missing environment variables.

## Development Environment

**Development Server** - `npm run dev` starts Vite development server with hot module replacement on localhost:5173.

**Production Build** - `npm run build` compiles TypeScript and creates optimized static files for deployment.

**Code Quality** - `npm run lint` runs ESLint checks and Prettier formatting.

The architecture emphasizes developer experience with fast build times, comprehensive error handling, and clear separation of concerns between UI components and business logic.
