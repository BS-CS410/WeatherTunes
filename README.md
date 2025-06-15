# WeatherTunes 🌪️🎸😎👍

WeatherTunes is a modern web application that connects your Spotify account with real-time weather data to create a personalized music experience. The application automatically selects and plays music that matches your local weather conditions, creating an immersive atmosphere that responds to the world around you.

## 📚 Documentation

This project has comprehensive documentation organized in a wiki format. **[Visit the Documentation Wiki →](docs/README.md)**

### Quick Links

- **[Getting Started](docs/development/getting-started.md)** - Installation and first run
- **[System Overview](docs/architecture/overview.md)** - Architecture and tech stack
- **[Weather System](docs/features/weather.md)** - Weather integration details
- **[API Requirements](docs/backend/api-requirements.md)** - Backend integration specs

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- OpenWeatherMap API key

### Installation
```bash
git clone https://github.com/cpond8/weathertunes.git
cd weathertunes
npm install
```

### Configuration
Create `.env` file:
```bash
VITE_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

### Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## ✨ Features

### ✅ Currently Available
- **Complete Weather System** - Real-time weather with 5-day forecast
- **Smart Settings** - Location-based unit defaults with persistence  
- **Dynamic Backgrounds** - 24 weather/time-specific video backgrounds
- **Modern UI** - Responsive glassmorphism design with dark/light themes
- **Accessibility** - WCAG 2.1 compliant with Radix UI components

### 🔄 UI Ready (Awaiting Backend)
- **Spotify Integration** - Music player components with placeholder data
- **User Authentication** - Login flow structure in place
- **Music Controls** - Play/pause/skip interface ready

### 📋 Planned Features
- **Weather-Based Music Selection** - AI-powered song recommendations
- **Cross-Device Sync** - Settings and preferences across devices
- **Social Features** - Share weather-music combinations

## 🛠️ Technology Stack

- **React 19** + **TypeScript** + **Vite** for modern development
- **Tailwind CSS** + **Radix UI** for styling and accessibility
- **OpenWeatherMap API** for weather data
- **Spotify Web API** for music integration (planned)

## 📖 Documentation Structure

The documentation is organized into focused sections:

- **[Architecture](docs/architecture/)** - System design and component structure
- **[Features](docs/features/)** - Detailed feature documentation  
- **[Development](docs/development/)** - Setup and workflow guides
- **[Backend](docs/backend/)** - API requirements and integration specs

## 🎯 Current Status

**Frontend**: Production-ready weather system with complete UI for music features  
**Backend**: Required for Spotify integration and user data management  
**Design**: Modern, responsive interface with comprehensive accessibility support

For detailed implementation status and technical specifications, see the [Documentation Wiki](docs/README.md).

## 🤝 Contributing

This project follows modern development practices with TypeScript, ESLint, and Prettier. See the [Development Setup](docs/development/setup.md) guide for detailed contribution guidelines.

## 📄 License

[Add your license information here]
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
