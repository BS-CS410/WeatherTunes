# Project Brief: WeatherTunes

## Core Concept
WeatherTunes is a frontend-only React web application that provides a unique user experience by combining real-time weather information with personalized music recommendations. The application fetches weather data to dynamically alter the visual theme and suggest music that matches the current weather conditions.

## Key Features
- **Dynamic Weather Display**: Shows current weather conditions, a 5-day forecast, and other meteorological data.
- **Weather-Based Music**: Integrates with the Spotify API to recommend and play music that fits the user's current weather.
- **Dynamic UI**: The application's background and theme change based on the weather and time of day.
- **User Settings**: Allows users to customize units (temperature, time format, etc.) and manage other preferences.
- **Spotify Integration**: Full integration with Spotify for authentication, music playback, and recommendations.

## Technical Architecture
- **Frontend**: Built with React, TypeScript, and Vite.
- **Styling**: Utilizes Tailwind CSS for styling and a responsive design.
- **APIs**: Connects directly to the OpenWeatherMap API for weather data and the Spotify Web API for music.
- **Authentication**: Implements a frontend-only OAuth 2.0 PKCE flow for Spotify.
- **State Management**: Uses React hooks and Context API for managing application state.
