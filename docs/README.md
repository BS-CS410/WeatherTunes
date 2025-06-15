# WeatherTunes Documentation Wiki 🌪️🎸😎👍

Welcome to the WeatherTunes documentation. This wiki provides comprehensive technical documentation organized by topic for easy navigation.

## Quick Start

- **New to the project?** Start with [Getting Started](development/getting-started.md)
- **Setting up development?** See [Development Setup](development/setup.md)
- **Understanding the architecture?** Check [System Overview](architecture/overview.md)

## Documentation Structure

### 🏗️ Architecture
- [System Overview](architecture/overview.md) - High-level architecture and tech stack
- [Component Structure](architecture/components.md) - Frontend component organization
- [State Management](architecture/state-management.md) - Data flow and state patterns
- [File Structure](architecture/file-structure.md) - Project organization

### ⚡ Features
- [Weather System](features/weather.md) - Weather data integration and display
- [Settings System](features/settings.md) - User preferences and configuration
- [UI System](features/ui-design.md) - Design system and styling
- [Video Backgrounds](features/video-backgrounds.md) - Dynamic background system
- [Music Integration](features/music.md) - Spotify integration (planned)

### 💻 Development
- [Getting Started](development/getting-started.md) - Installation and first run
- [Development Setup](development/setup.md) - Environment configuration
- [Build Process](development/build.md) - Building and deployment
- [Code Guidelines](development/guidelines.md) - Coding standards and patterns

### 🔌 Backend Integration
- [API Requirements](backend/api-requirements.md) - Backend API specifications
- [Integration Points](backend/integration-points.md) - Frontend-backend connections
- [Authentication](backend/authentication.md) - Spotify OAuth and user management
- [Data Structures](backend/data-structures.md) - Expected data formats

## Current Status

### ✅ Production Ready
- Complete weather system with OpenWeatherMap integration
- Comprehensive settings with location-based defaults
- Responsive UI with glassmorphism design
- Dynamic video backgrounds
- TypeScript coverage and accessibility

### 🔄 UI Ready (Awaiting Backend)
- Spotify music integration components
- User authentication flow
- Music player controls

### ❌ Requires Backend
- Real Spotify API integration
- Weather-based music selection
- User data persistence
- Cross-device synchronization

## Technical Overview

WeatherTunes is a React 19 + TypeScript application built with Vite, featuring:

- **Frontend Framework**: React 19.1.0 with TypeScript 5.8.3
- **Build Tool**: Vite 6.3.5 for fast development and optimized builds
- **Styling**: Tailwind CSS 4.1.8 with custom glassmorphism design
- **UI Components**: Radix UI primitives for accessibility
- **State Management**: React Context with custom hooks
- **Weather API**: OpenWeatherMap integration
- **Music Integration**: Spotify Web API (planned)

## Contributing

This documentation is living and should be updated as the project evolves. Each section focuses on specific aspects of the system to make information easy to find and understand.

For technical details about the codebase structure, see the [AI Codebase Index](../AI_CODEBASE_INDEX.md) for rapid context acquisition.
