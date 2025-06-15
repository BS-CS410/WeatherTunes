# Getting Started

This guide will help you set up WeatherTunes for development in just a few steps.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js** (version 18 or higher)

   - Download from [nodejs.org](https://nodejs.org/)
   - Choose the LTS (Long Term Support) version
   - Includes npm (Node Package Manager)

2. **Git** (for repository cloning)
   - Download from [git-scm.com](https://git-scm.com/)

### Verification

Check your installations:

```bash
node -v    # Should show v18.x.x or higher
npm -v     # Should show 8.x.x or higher
git --version    # Should show git version
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/cpond8/weathertunes.git
cd weathertunes
```

### 2. Install Dependencies

```bash
npm install
```

This will:

- Read `package.json` to identify required packages
- Download and install all dependencies to `node_modules/`
- Create `package-lock.json` for dependency version locking
- Set up the development environment

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
VITE_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

**Getting an OpenWeatherMap API Key:**

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to the API section
4. Generate a free API key
5. Replace `your_api_key_here` with your actual key

## Running the Application

Start the development server:

```bash
npm run dev
```

This will:

- Start the Vite development server (typically on `http://localhost:5173`)
- Enable Hot Module Replacement for instant updates
- Provide detailed error reporting and debugging
- Automatically open your default browser

## Verify Installation

Once the application is running:

1. **Weather Display**: You should see current weather data for your location
2. **Settings**: Click the settings gear to access user preferences
3. **Responsive Design**: Resize your browser to test mobile responsiveness
4. **Theme Switching**: The app should automatically switch between light/dark themes based on time

## Development Features Available

- **Real-time Updates**: Code changes appear instantly without page refresh
- **TypeScript Checking**: Type errors appear in the terminal
- **Tailwind CSS**: Styling changes compile automatically
- **React DevTools**: Browser extension works seamlessly

## Troubleshooting

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

## Next Steps

Once you have the application running:

1. **Explore the Code**: See [Component Structure](../architecture/components.md)
2. **Understand the Features**: Check [Weather System](../features/weather.md)
3. **Set Up Development Tools**: Review [Development Setup](setup.md)
4. **Learn the Architecture**: Read [System Overview](../architecture/overview.md)

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint code checking
npm run preview      # Preview production build
```
