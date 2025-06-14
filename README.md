# WeatherTunes 🌪️🎸😎👍

**WeatherTunes** is a web application that connects to your Spotify account and plays music according to the current weather in your location. This document focuses on the backend development aspects required to bring the full functionality to life, referencing specific integration points in the existing frontend. The frontend is built with [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) and [Vite](https://vitejs.dev/), using [Tailwind CSS](https://tailwindcss.com/) for styling.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Getting Started (Frontend Setup)](#getting-started-frontend-setup)
  - [Prerequisites](#prerequisites)
  - [Installation Steps](#installation-steps)
  - [Running the Development Server](#running-the-development-server)
- [Backend Development Guide: Addressing Frontend Needs](#backend-development-guide-addressing-frontend-needs)
  - [Core Responsibilities](#core-responsibilities)
  - [Spotify Integration: Frontend Placeholders](#spotify-integration-frontend-placeholders)
  - [Weather Data Handling: Moving Client-Side Logic](#weather-data-handling-moving-client-side-logic)
  - [Music & Player Features: API Requirements](#music--player-features-api-requirements)
  - [API Design Considerations (Updated)](#api-design-considerations-updated)
- [Codebase Overview for Backend Developers: Integration Points](#codebase-overview-for-backend-developers-integration-points)
  - [Key Frontend Components & TODOs](#key-frontend-components--todos)
- [Linting and Formatting](#linting-and-formatting)

---

## Project Overview

The primary goal of WeatherTunes is to provide users with a seamless experience where music from their Spotify account automatically adapts to the real-time weather conditions of their specified location.

The current frontend includes:

- UI for weather display.
- UI elements for music playback (currently with placeholder data).
- User interaction for location input (though weather data fetching is client-side).

The backend's role is to:

1.  Securely handle Spotify authentication (OAuth 2.0), integrating with frontend placeholders.
2.  Take over weather data fetching from a reliable API (currently client-side).
3.  Query the Spotify API for music selection and control, replacing frontend placeholders.
4.  Provide robust APIs for all frontend interactions.

---

## Getting Started (Frontend Setup)

This section will guide you through setting up your development environment and getting the project running on your local machine. We'll cover everything from installing prerequisites to running the development server.

### Prerequisites

Before you begin, you'll need to have the following tools installed on your computer:

1. **Node.js** (version 18 or higher recommended)

   - This is the JavaScript runtime that powers your development environment
   - Download from [nodejs.org](https://nodejs.org/)
   - Choose the LTS (Long Term Support) version for stability

2. **npm** (Node Package Manager)
   - Comes bundled with Node.js
   - Used to install and manage project dependencies
   - You don't need to install it separately

To verify your installations, open a terminal and run:

```bash
node -v    # Should show v18.x.x or higher
npm -v     # Should show 8.x.x or higher
```

### What are `npm` and `npx`?

- **`npm`** is the Node.js package manager. You use it to install packages (libraries, tools, etc.) into your project or globally on your system. For example, `npm install react` adds React to your project.
- **`npx`** is a tool that comes with npm (version 5.2+). It lets you run commands from packages that you haven't installed globally. For example, `npx prettier --write .` will run Prettier even if you haven't installed it in your project, always using the latest version available.

In this README, you'll see both `npm` and `npx` used:

- Use `npm` to install dependencies.
- Use `npx` to run tools and CLIs directly from the command line.

Example `npx` usage:

```bash
npx create-react-app my-app     # Create a new React app
npx prettier --write .          # Format all files
npx eslint .                    # Lint all files
```

### Installation Steps

1. **Clone the Repository**

   ```bash
   # (Install git first if you haven't already)
   git clone https://github.com/cpond8/weathertunes.git

   # Then navigate into the project directory
   cd weathertunes
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

   This command:

   - Reads the `package.json` file
   - Installs all listed dependencies
   - Creates a `node_modules` directory
   - Generates a `package-lock.json` file for dependency versioning

   > **Note**: The installation process might take a few minutes depending on your internet connection and computer speed.

3. **Verify Installation**
   After installation, you should see:
   - A `node_modules` directory containing all dependencies
   - A `package-lock.json` file

### Running the Development Server

Once the installation is complete, you can start the development server:

```bash
npm run dev
```

This command will:

- Start the Vite development server (usually on `http://localhost:5173`)
- Enable Hot Module Replacement (HMR) for fast updates

---

## Backend Development Guide: Addressing Frontend Needs

This section details backend tasks, focusing on integrating with existing frontend structures and replacing placeholder logic.

### Core Responsibilities

- **User Authentication:** Implement Spotify OAuth 2.0.
- **Weather Data Service:** Server-side fetching and processing of weather data.
- **Music Logic Service:** Link weather to music, interact with Spotify API.
- **API for Frontend:** Provide endpoints for all frontend data and action needs.

### Spotify Integration: Frontend Placeholders

- **Authentication Trigger:** The frontend has a placeholder for Spotify login in `src/components/NavBar.tsx` (line 36: `[TODO: put spotify login here]`). The backend authentication flow (`POST /auth/spotify` and `GET /auth/spotify/callback`) should be triggered from here.
- **Scopes:** Ensure you request necessary Spotify scopes: `user-read-playback-state`, `user-modify-playback-state`, `user-read-currently-playing`, `playlist-read-private`, `user-library-read`, etc.
- **Fallback Route:** `src/App.tsx` has a `TODO` (line 17) to make a fallback route for unknown paths, potentially redirecting to login. Backend should provide auth status to help frontend routing.

### Weather Data Handling: Moving Client-Side Logic

- **Current Implementation:** Weather data is fetched client-side in `src/hooks/useWeather.ts` and `src/lib/weather.ts`, using the OpenWeatherMap API with an API key (`VITE_PUBLIC_OPENWEATHER_API_KEY`) stored in a `.env` file.
- **Backend Responsibility:** This entire logic must move to the backend.
  - The backend will call the weather API (e.g., OpenWeatherMap).
  - The frontend will call a new backend endpoint (e.g., `GET /api/weather-music`) to get weather data. This replaces the direct client-side API call.
- **Data Structure:** Refer to `src/types/weather.ts` for the frontend's expected weather data structure. `src/components/WeatherDisplay.tsx` consumes this data.

### Music & Player Features: API Requirements

- **Spotify Player UI:** `src/pages/MainPage.tsx` has a placeholder `[TODO: put spotify player here]` (line 78). This area will need to display current track information and playback controls.
  - **API Needs:** Endpoints to get currently playing track (title, artist, album art), and to control playback (play, pause, next, previous, volume).
  - **Placeholder Data:** `MainPage.tsx` (line 10) uses `PLACEHOLDER DATA FOR CURRENTLY PLAYING`. `src/components/CurrentlyPlaying.tsx` (line 12) uses a placeholder album art URL. These must be replaced by data from the backend via API calls.
- **"Up Next" Queue:** `src/components/UpNext.tsx` currently uses static `placeholderSongs` (lines 11, 102).
  - **API Needs:** An endpoint to fetch the user's upcoming track queue from Spotify.
- **"Favorites List":** `src/pages/MainPage.tsx` has a placeholder `[TODO: put favorites list here]` (line 92).
  - **API Needs:** Endpoints to get, add, and remove favorite tracks/playlists. This implies backend database storage for user-specific favorites.

### API Design Considerations (Updated)

- **Authentication:**
  - `POST /auth/spotify`: Initiate Spotify login.
  - `GET /auth/spotify/callback`: Spotify callback URL.
  - `GET /auth/status`: Check user's current authentication status.
  - `POST /auth/logout`: Log out user.
- **Core Functionality:**
  - `GET /api/weather-music?location=<location_string_or_lat_lon>`: Get current weather (processed server-side) and suggested/currently-playing music. This replaces the client-side `useWeather` hook's direct API call.
- **Player Control (interfacing with Spotify API via backend):**
  - `GET /api/player/current`: Get current playing track details.
  - `POST /api/player/play`: Start/resume playback.
  - `POST /api/player/pause`: Pause playback.
  - `POST /api/player/next`: Skip to next track.
  - `POST /api/player/previous`: Skip to previous track.
  - `PUT /api/player/volume`: Set volume (e.g., `?level=50`).
- **Queue/Up Next:**
  - `GET /api/player/queue`: Get the user's upcoming tracks.
- **User Favorites (requires database interaction):**
  - `GET /api/favorites`: Get user's favorite tracks/playlists.
  - `POST /api/favorites`: Add a track/playlist to favorites.
  - `DELETE /api/favorites/:id`: Remove a track/playlist from favorites.
- **General:**
  - Use JSON for requests/responses.
  - Implement robust error handling.
  - Secure API keys and ensure HTTPS.

---

## Codebase Overview for Backend Developers: Integration Points

Focus on these areas where frontend meets backend:

### Key Frontend Components & TODOs

- **`src/components/NavBar.tsx`**:

  - Line 36: `[TODO: put spotify login here]`. This is the primary entry point for user authentication with Spotify. The backend needs to provide the mechanism that this UI element will trigger.

- **`src/pages/MainPage.tsx`**: This is the central UI.

  - Line 10: `PLACEHOLDER DATA FOR CURRENTLY PLAYING`. This static data (songTitle, artistName, albumArtUrl) needs to be replaced with live data fetched from the backend (`/api/player/current`).
  - Line 78: `[TODO: put spotify player here]`. This section is intended for the main Spotify player interface (displaying current song, controls). Backend APIs will drive its functionality.
  - Line 92: `[TODO: put favorites list here]`. This requires backend APIs (`/api/favorites`) to manage a user's list of saved songs/playlists.

- **`src/components/CurrentlyPlaying.tsx`**:

  - Line 12: `albumArtUrl = "https://via.placeholder.com/150"`. This placeholder image URL must be replaced by the actual album art URL from the Spotify track data, supplied by the backend.

- **`src/components/UpNext.tsx`**:

  - Lines 11 & 102: Uses `placeholderSongs`. This static array needs to be replaced by a dynamic list of upcoming songs fetched from the backend (`/api/player/queue`).

- **`src/hooks/useWeather.ts` & `src/lib/weather.ts`**:

  - These files currently manage **client-side** calls to the OpenWeatherMap API using `VITE_PUBLIC_OPENWEATHER_API_KEY`.
  - **Action for Backend:** This entire weather fetching logic (including API key management) must be moved to the backend. The frontend (`MainPage.tsx` via `useWeatherData`) will then call a backend endpoint (e.g., `/api/weather-music`) to get this information.

- **`src/types/weather.ts`**:

  - Contains TypeScript type definitions for weather data (e.g., `WeatherApiResponse`, `EnhancedWeatherState`). This is a useful reference for structuring the backend API response for weather information to ensure frontend compatibility.

- **`src/App.tsx`**:
  - Line 17: ` {/* TODO: make fallback Route to send unknown routes to login page */}`. The backend should provide an endpoint like `/auth/status` so the frontend can make intelligent routing decisions based on authentication state.

---

## Linting and Formatting

This project uses ESLint for linting and Prettier for code formatting.

- **ESLint**: Helps find and fix problems in your JavaScript/TypeScript code.
  - Configuration: `eslint.config.js`
  - To run: `npm run lint`
- **Prettier**: An opinionated code formatter that ensures consistent code style.
  - Configuration: Can be added via `.prettierrc.json` or `prettier` key in `package.json`.
  - To run: `npm run format` (you might need to add this script to `package.json` if it doesn't exist, e.g., `"format": "prettier --write ."`).

It's recommended to integrate these tools with your code editor for an optimal development experience.

---
