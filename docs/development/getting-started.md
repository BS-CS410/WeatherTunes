# Getting Started

This guide walks through setting up WeatherTunes for local development. WeatherTunes is a React application that requires Node.js and a weather API key to function properly.

## Prerequisites

WeatherTunes requires specific software and accounts for development:

### Required Software

**Node.js 18+**: JavaScript runtime that enables running the development server and build tools

- Download from [nodejs.org](https://nodejs.org/)
- Choose the LTS (Long Term Support) version
- Includes npm (Node Package Manager) automatically

**Git**: Version control system for cloning the repository

- Download from [git-scm.com](https://git-scm.com/)
- Required for cloning the project repository

### Verify Installation

Check that required software is properly installed:

```bash
node -v    # Should display v18.x.x or higher
npm -v     # Should display 8.x.x or higher
git --version    # Should display git version
```

### OpenWeatherMap API Account

WeatherTunes requires an API key for weather data:

1. Visit [OpenWeatherMap API](https://openweathermap.org/api)
2. Create a free account
3. Navigate to "My API Keys" section
4. Generate a new API key (free tier provides 1000 calls/day)
5. Save the API key for environment configuration

## Installation Process

### Clone Repository

Download the WeatherTunes source code:

```bash
git clone https://github.com/cpond8/weathertunes.git
cd weathertunes
```

### Install Dependencies

Install all required packages using npm:

```bash
npm install
```

This command reads `package.json` and installs:

- React 19.1.0 and related libraries
- TypeScript compiler and type definitions
- Vite build tool and plugins
- Tailwind CSS and utility libraries
- Development tools (ESLint, Prettier)

The installation creates a `node_modules` directory containing all dependencies.

### Environment Configuration

Create environment variables file for API configuration:

```bash
# Create .env file in project root
VITE_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual OpenWeatherMap API key.

**Important**: The `VITE_PUBLIC_` prefix makes the variable available to the browser-side code while maintaining security for server-side variables.

## Running the Development Server

Start the local development environment:

```bash
npm run dev
```

This command:

- Starts Vite development server (usually http://localhost:5173)
- Enables Hot Module Replacement (HMR) for instant code updates
- Provides TypeScript type checking
- Enables Tailwind CSS compilation
- Opens the application in your default browser automatically

### Development Server Features

**Hot Module Replacement**: Code changes appear instantly without page refresh
**TypeScript Checking**: Type errors display in terminal and browser
**CSS Processing**: Tailwind utilities compile automatically
**Error Overlay**: Build errors appear as browser overlays for quick debugging

## Verification Steps

Confirm the application is working correctly:

### Weather System

- Location should be detected automatically
- Current weather data displays (temperature, conditions, etc.)
- 5-day forecast cards should be visible and interactive

### Settings System

- Click the settings gear icon in the navigation
- Toggle between Fahrenheit and Celsius
- Change time format between 12-hour and 24-hour
- Settings should persist after page refresh

### Responsive Design

- Resize browser window to test mobile layout
- Components should adapt to different screen sizes
- Touch interactions should work on mobile devices

### Theme System

- Application should automatically detect system theme preference
- Dark/light mode should switch based on time of day
- All text should remain readable in both themes

## Common Development Tasks

### Code Editing

- Make changes to files in `src/` directory
- Save files to see changes immediately in browser
- TypeScript errors appear in terminal and browser console

### Adding Dependencies

```bash
npm install package-name
```

### Running Tests

```bash
npm run lint    # Check code style and errors
```

### Building for Production

```bash
npm run build   # Creates optimized production build
```

## Troubleshooting

### API Key Issues

**Error**: "Weather data unavailable" or loading states persist

**Solution**: Check environment variable configuration

```bash
# Verify .env file exists and contains:
VITE_PUBLIC_OPENWEATHER_API_KEY=your_actual_key

# Restart development server after adding environment variables
npm run dev
```

### Location Permission Issues

**Error**: Weather shows default location (Bellevue, WA) instead of your location

**Solution**: Grant browser location permission when prompted, or manually allow location access in browser settings.

### Port Conflicts

**Error**: Development server fails to start due to port conflicts

**Solution**: Vite will automatically try alternative ports. You can also specify a port:

```bash
npm run dev -- --port 3000
```

### Dependency Issues

**Error**: Module not found or version conflicts

**Solution**: Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

**Error**: Type checking errors prevent development server from starting

**Solution**: Review TypeScript errors in terminal output. Common issues include:

- Missing type definitions for new dependencies
- Incorrect prop types in components
- Import path errors

## Next Steps

Once the development environment is running successfully:

### 1. Explore the Codebase
- **Component Architecture**: Review [Component Architecture](../architecture/components.md) to understand React component organization and patterns
- **System Overview**: Read [System Overview](../architecture/overview.md) for high-level architecture and technology stack

### 2. Understand Data Flow
- **State Management**: Read [State Management](../architecture/state-management.md) to learn how data flows through the application
- **Development Workflow**: See [Development Setup](setup.md) for advanced configuration and tools

### 3. Review Core Features
- **Weather System**: Check [Weather System](../features/weather.md) to understand OpenWeatherMap API integration
- **Settings System**: Explore [Settings System](../features/settings.md) for user preferences and localStorage patterns

The application is now ready for development with full weather functionality, responsive design, and modern React patterns.

### Common Issues

**Weather data not loading:**

- Verify your API key is correct in `.env`
- Check browser console for error messages
- Ensure location permissions are granted

**Port already in use:**

- Vite will automatically try alternative ports (5174, 5175, etc.)
- Or specify a different port: `npm run dev -- --port 3000`

**Dependencies not installing:**

- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint code checking
npm run preview      # Preview production build
```
