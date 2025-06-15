# WeatherTunes 🌪️🎸😎👍

WeatherTunes is a modern web application that connects your Spotify account with real-time weather data to create a personalized music experience. The application automatically selects and plays music that matches your local weather conditions, creating an immersive atmosphere that responds to the world around you.

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Features](#features)
- [Project Structure](#project-structure)
- [Development](#development)
  - [Available Scripts](#available-scripts)
  - [Code Quality](#code-quality)
- [Current Implementation Status](#current-implementation-status)

## Project Overview

WeatherTunes combines weather data with music streaming to provide an intelligent listening experience. The application features a responsive interface with dynamic backgrounds that change based on weather conditions and time of day, comprehensive weather information, and a complete settings system for user preferences.

### Core Concept

The application automatically:

- Detects your location and fetches current weather data
- Selects appropriate music from your Spotify library based on weather conditions
- Displays dynamic video backgrounds that match the current weather and time
- Provides detailed weather forecasts and music queue information
- Adapts the interface theme based on time of day

## Technology Stack

### Frontend Framework

- **React 19** - Modern React with latest features
- **TypeScript** - Type safety and enhanced developer experience
- **React Router DOM 7.6.2** - Client-side routing

### Build Tools

- **Vite 6.3.5** - Fast development server and optimized builds
- **Node.js 18+** - JavaScript runtime environment
- **npm** - Package management

### Styling and UI

- **Tailwind CSS 4.1.8** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **Class Variance Authority** - Component variant management

### Code Quality

- **ESLint 9.25.0** - Code linting
- **Prettier 3.5.3** - Code formatting
- **TypeScript ESLint** - TypeScript-specific linting

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (version 18 or higher)

   - Download from [nodejs.org](https://nodejs.org/)
   - Choose the LTS (Long Term Support) version for stability

2. **npm** (Node Package Manager)
   - Included with Node.js installation
   - Used to install and manage project dependencies

You can verify your installations by running:

```bash
node -v    # Should show v18.x.x or higher
npm -v     # Should show 8.x.x or higher
```

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/cpond8/weathertunes.git
   cd weathertunes
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   This command will:

   - Read the `package.json` file
   - Install all required dependencies
   - Create a `node_modules` directory
   - Generate a `package-lock.json` file for version control

3. **Set up environment variables**

   Create a `.env` file in the project root and add your API keys:

   ```bash
   VITE_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key_here
   ```

   You can obtain a free API key from [OpenWeatherMap](https://openweathermap.org/api).

### Running the Application

Start the development server:

```bash
npm run dev
```

This will:

- Start the Vite development server (typically on `http://localhost:5173`)
- Enable Hot Module Replacement for instant updates during development
- Open your default browser to the application

## Features

### Current Features

**Complete Settings System**

- Temperature units (Fahrenheit/Celsius)
- Time format (12-hour/24-hour)
- Speed units (mph/km/h/m/s)
- Theme mode (automatic/light/dark)
- Location-based default unit selection
- Persistent settings storage

**Weather Integration**

- Real-time weather data display
- 5-day weather forecast
- Sunrise and sunset times
- Detailed weather metrics (humidity, pressure, wind speed)
- Weather-responsive video backgrounds

**User Interface**

- Responsive design for all device sizes
- Automatic theme switching based on time of day
- Dynamic video backgrounds based on weather conditions
- Interactive elements with brightness hover effects
- Glassmorphism design with backdrop blur effects

**Architecture**

- Modular component structure
- Custom React hooks for state management
- TypeScript for type safety
- Accessible UI components

### Planned Features (Backend Required)

**Spotify Integration**

- OAuth 2.0 authentication
- Music player controls
- Weather-based music selection
- Playlist management
- User library access

**User Features**

- Personal favorites system
- Cross-device settings synchronization
- Music listening history
- Personalized recommendations

## Project Structure

```
weathertunes/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base UI primitives
│   │   ├── icons/         # Custom icon components
│   │   └── ...            # Feature-specific components
│   ├── contexts/          # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and libraries
│   ├── pages/             # Top-level route components
│   ├── types/             # TypeScript type definitions
│   └── assets/            # Static assets and videos
├── public/                # Static public assets
├── package.json           # Project configuration and dependencies
├── tailwind.config.ts     # Tailwind CSS configuration
├── vite.config.ts         # Vite build configuration
└── tsconfig.json          # TypeScript configuration
```

### Key Components

**Main Application**

- `App.tsx` - Root component with routing
- `MainPage.tsx` - Primary application interface
- `Login.tsx` - Authentication page (placeholder)

**Weather System**

- `WeatherDisplay.tsx` - Current weather information
- `ForecastCard.tsx` - 5-day weather forecast
- `VideoBackground.tsx` - Dynamic weather-based backgrounds

**Settings and Preferences**

- `SettingsMenu.tsx` - User preferences interface
- `SettingsContext.tsx` - Global settings management
- `useSettings.ts` - Settings hook

**Music Integration (Placeholders)**

- `CurrentlyPlaying.tsx` - Current track display
- `UpNext.tsx` - Music queue
- `NavBar.tsx` - Navigation with Spotify login placeholder

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Code Quality

The project maintains high code quality through:

**Linting and Formatting**

- ESLint configuration for JavaScript/TypeScript
- Prettier for consistent code formatting
- Automatic Tailwind class sorting

**Type Safety**

- TypeScript throughout the codebase
- Strict type checking enabled
- Custom type definitions for weather data

**Best Practices**

- Component composition over inheritance
- Custom hooks for reusable logic
- Context for global state management
- Utility-first CSS with Tailwind

## Current Implementation Status

### ✅ Completed

- Complete settings system with persistence
- Weather data fetching and display
- Responsive UI with dynamic themes
- Location-based unit defaults
- 5-day weather forecast
- Interactive UI elements with hover effects

### 🔄 In Progress

- Spotify integration (UI components ready)
- Music player interface (placeholder data)
- User authentication flow (structure in place)

### ❌ Pending Backend Development

- Spotify OAuth 2.0 authentication
- Music playback controls
- Weather-based music selection algorithm
- User data persistence
- Cross-device settings synchronization
- Favorites system
