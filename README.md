# WeatherTunes 🌪️🎸😎👍

WeatherTunes is a React web application that displays real-time weather information alongside music interface components. The application uses modern web development patterns including React hooks for state management, TypeScript for type safety, and Tailwind CSS for styling.

## Documentation

This project maintains comprehensive documentation in the `docs/` directory to help developers understand the system architecture and implementation details.

### Available Documentation

- [Getting Started](docs/development/getting-started.md) - Installation and setup instructions
- [System Overview](docs/architecture/overview.md) - Architecture and technical details
- [Weather System](docs/features/weather.md) - Weather integration implementation
- [API Requirements](docs/backend/api-requirements.md) - Backend integration specifications

## Quick Start

### Prerequisites

- Node.js 18 or higher (JavaScript runtime environment)
- OpenWeatherMap API key (weather data service)

### Installation

Clone the repository and install dependencies using npm (Node Package Manager):

```bash
git clone https://github.com/cpond8/weathertunes.git
cd weathertunes
npm install
```

### Configuration

Create a `.env` file in the project root directory to store environment variables:

```bash
VITE_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

### Development Server

Start the Vite development server with hot module replacement:

```bash
npm run dev
```

The application runs at `http://localhost:5173` with automatic browser refresh during development.

## Current Features

### Weather System

The application integrates with the OpenWeatherMap API to provide current weather conditions and forecasts:

- Real-time weather data fetching using HTTP requests
- 5-day weather forecast display with daily summaries
- Sunrise and sunset times with automatic calculation
- Weather metrics including humidity percentage, barometric pressure, and wind speed
- Dynamic video backgrounds that change based on current weather conditions and time of day

### Settings Management

The application provides user preference controls with persistent storage:

- Temperature units (Fahrenheit or Celsius conversion)
- Time format (12-hour or 24-hour display)
- Speed units (miles per hour, kilometers per hour, or meters per second)
- Theme mode (automatic, light, or dark theme selection)
- Location-based default unit selection using geolocation
- Persistent settings storage using browser localStorage API

### User Interface

The interface uses modern web development techniques for responsive design:

- Responsive layout that adapts to desktop and mobile screen sizes
- Automatic theme switching based on time of day detection
- Video backgrounds that update dynamically based on weather and time
- Glassmorphism design effects using CSS backdrop filters
- Accessibility support through Radix UI component library

### Music Interface Components

The application includes user interface components for music controls that display placeholder data:

- Current track display component with song and artist information
- Music queue interface showing upcoming tracks
- Play, pause, and skip control buttons
- Navigation component with authentication placeholders

## Technology Stack

### Core Framework

The application uses React 19 as the primary JavaScript library for building user interfaces:

- React 19 with functional components and React hooks for state management
- TypeScript for static type checking and improved developer experience
- Vite as the build tool and development server with fast hot module replacement
- React Router DOM for client-side navigation between application pages

### Styling and UI Components

The interface uses utility-first CSS and accessible component libraries:

- Tailwind CSS for rapid styling with utility classes
- Radix UI for accessible, unstyled component primitives
- Lucide React for consistent icon components
- Class Variance Authority for managing component style variants

### Code Quality Tools

The project maintains code quality through automated tools:

- ESLint 9.25.0 for identifying and fixing JavaScript code issues
- Prettier 3.5.3 for consistent code formatting across the project
- TypeScript ESLint for TypeScript-specific linting rules

## Project Structure

The application follows React best practices for organizing components and logic:

```
src/
├── components/         # Reusable UI components organized by purpose
│   ├── ui/            # Base UI primitives (button, card, input)
│   ├── icons/         # Custom SVG icon components
│   └── ...            # Feature-specific components for weather and music
├── contexts/          # React Context providers for global state management
├── hooks/             # Custom React hooks for reusable logic
├── lib/               # Utility functions and external service integrations
├── pages/             # Top-level route components that render full pages
├── types/             # TypeScript type definitions and interfaces
└── assets/            # Static assets including video files for backgrounds
```

### Key Components

#### Main Application Structure

- `src/App.tsx` - Root component that configures React Router for navigation
- `src/pages/MainPage.tsx` - Primary application interface combining weather and music components
- `src/pages/Login.tsx` - Authentication page structure with placeholder content

#### Weather System Components

- `src/components/WeatherDisplay.tsx` - Current weather information display with real API data
- `src/components/ForecastCard.tsx` - 5-day weather forecast component using OpenWeatherMap
- `src/components/VideoBackground.tsx` - Dynamic video backgrounds based on weather conditions

#### Settings and State Management

- `src/components/SettingsMenu.tsx` - User preferences interface for units and theme selection
- `src/contexts/SettingsContext.tsx` - React Context for global settings state management
- `src/hooks/useSettings.ts` - Custom hook that provides settings state to components

#### Music Interface Components

- `src/components/CurrentlyPlaying.tsx` - Current track display with placeholder data structure
- `src/components/UpNext.tsx` - Music queue interface ready for backend integration
- `src/components/NavBar.tsx` - Navigation component with authentication placeholder buttons

## Development

### Available Scripts

The project includes npm scripts for common development tasks:

- `npm run dev` - Start Vite development server with hot module replacement
- `npm run build` - Create optimized production build in the `dist/` directory
- `npm run lint` - Run ESLint code analysis to identify potential issues
- `npm run preview` - Preview the production build locally before deployment

### Code Organization Patterns

The project implements several React and TypeScript patterns for maintainable code:

- **Component composition** - Building complex interfaces from smaller, focused components
- **Custom hooks** - Extracting reusable logic into hooks like `useWeather` and `useSettings`
- **Context providers** - Managing global application state through React Context API
- **TypeScript interfaces** - Ensuring type safety for weather data structures and component props

### Code Quality and Testing

The development workflow includes automated tools for consistent code quality:

- TypeScript strict mode enabled for compile-time error detection
- ESLint configuration enforcing consistent code style and best practices
- Prettier integration for automatic code formatting on save
- Component isolation pattern that simplifies testing and maintenance

## Implementation Status

### Completed Features

The following systems have full implementation with working functionality:

- Weather data integration with OpenWeatherMap API including error handling
- Settings system with localStorage persistence and user preference management
- Responsive user interface with automatic theme switching based on time
- Video background system supporting 24 weather and time combinations
- Component structure for music features with placeholder data ready for backend integration

### Backend Integration Requirements

The following features require external service integration to become fully functional:

- Spotify OAuth 2.0 authentication flow for user login
- Music playback functionality through Spotify Web API
- User data synchronization across devices and sessions
- Music selection algorithms that correlate weather conditions with song recommendations
