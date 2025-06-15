# WeatherTunes Documentation Wiki 🌪️🎸😎👍

WeatherTunes is a React-based web application that combines weather data with music streaming. This documentation provides comprehensive technical guidance for developers working with the codebase.

## Quick Start

New to web development? React applications use components as building blocks that manage their own state and render UI elements. WeatherTunes follows modern React patterns with TypeScript for type safety.

- **First time setup**: [Getting Started](development/getting-started.md)
- **Development environment**: [Development Setup](development/setup.md)
- **System architecture**: [Architecture Overview](architecture/overview.md)

## Documentation Structure

### Architecture

- [Overview](architecture/overview.md) - System design and technology stack
- [Components](architecture/components.md) - React component organization and patterns
- [State Management](architecture/state-management.md) - Data flow and React Context usage

### Features

- [Weather System](features/weather.md) - OpenWeatherMap API integration
- [Settings System](features/settings.md) - User preferences and localStorage
- [Video Backgrounds](features/video-backgrounds.md) - Dynamic weather-based videos
- [Music Integration](features/music.md) - Spotify Web API preparation

### Development

- [Getting Started](development/getting-started.md) - Installation and first run
- [Setup Guide](development/setup.md) - Environment configuration and tools

### Backend Integration

- [API Requirements](backend/api-requirements.md) - Spotify Web API specifications

## Implementation Status

### Production Ready Features

The following features are fully implemented and functional:

- **Weather data integration**: Real-time weather using OpenWeatherMap API
- **Location-based settings**: Automatic temperature and speed unit selection
- **Responsive design**: Mobile-first layout with glassmorphism styling
- **Video backgrounds**: 24 weather and time-specific background videos
- **TypeScript coverage**: Complete type safety throughout the application

### UI Components Ready for Backend

These components have complete user interfaces but display placeholder data:

- **Music player controls**: Play, pause, skip buttons in CurrentlyPlaying component
- **Queue display**: UpNext component shows mock upcoming tracks
- **User authentication**: Login page and navigation bar login button

### Requires Backend Implementation

- **Spotify OAuth 2.0**: User authentication and authorization
- **Real music data**: Replace placeholder data with Spotify Web API responses
- **Cross-device sync**: User settings and preferences persistence
- **Weather-based music**: Algorithm to select music based on weather conditions

## Technology Stack

WeatherTunes uses modern web development technologies:

- **React 19.1.0**: Component-based UI library for building user interfaces
- **TypeScript 5.8.3**: JavaScript with static type definitions for better developer experience
- **Vite 6.3.5**: Build tool that provides fast development server and optimized production builds
- **Tailwind CSS 4.1.8**: Utility-first CSS framework for rapid styling
- **Radix UI**: Accessible component primitives for complex UI elements

### Development Tools

- **ESLint**: Code linting for consistent style and error detection
- **Prettier**: Code formatting for consistent appearance
- **React Router**: Client-side routing for single-page application navigation

## Project Structure

The codebase follows standard React application organization:

```
src/
├── components/     # Reusable UI components
├── contexts/       # React Context providers for global state
├── hooks/          # Custom React hooks for business logic
├── lib/            # Utility functions and API clients
├── pages/          # Top-level page components
├── types/          # TypeScript type definitions
└── assets/         # Static files including background videos
```

## Environment Requirements

WeatherTunes requires specific environment variables and development tools:

- **Node.js 18+**: JavaScript runtime for development and build processes
- **OpenWeatherMap API key**: Required for weather data (set as `VITE_PUBLIC_OPENWEATHER_API_KEY`)
- **Modern web browser**: Supports ES2020 features and CSS backdrop-filter

## Documentation Philosophy

This documentation explains both project-specific implementation and general web development concepts. Each section includes working code examples extracted from the actual codebase.

For rapid codebase context during development, reference the [AI Codebase Index](../AI_CODEBASE_INDEX.md).
