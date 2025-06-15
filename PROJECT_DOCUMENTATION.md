# WeatherTunes Project Documentation 🌪️🎸😎👍

_Last Updated: June 14, 2025_

## Table of Contents

1.  [Project Purpose and Vision](#project-purpose-and-vision)
2.  [Tech Stack](#tech-stack)
    - [Frontend](#frontend)
    - [Build Tools & Environment](#build-tools--env- \*\*Location-based default unit selection (automatically configures appropriate units based on user's location)

- See `LOCATION_UNITS_IMPLEMENTATION.md` for detailed implementation information
- Uses browser geolocation and OpenWeatherMap API to determine country
- Automatically sets Fahrenheit/mph for US users, Celsius/km/h for othersronment)
  - [Styling](#styling)
  - [Linting & Formatting](#linting--formatting)

3.  [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation Steps](#installation-steps)
    - [Running the Development Server](#running-the-development-server)
4.  [Frontend Architecture](#frontend-architecture)
    - [Directory Structure Overview](#directory-structure-overview)
    - [Key Components and Their Roles](#key-components-and-their-roles)
    - [Routing](#routing)
    - [State Management](#state-management)
    - [Styling Details](#styling-details)
    - [Environment Variables](#environment-variables)
    - [Asset Management](#asset-management)
5.  [Backend Development Guide](#backend-development-guide)
6.  [Current Features & Implementation Status](#current-features--implementation-status)
7.  [Building for Production](#building-for-production)
8.  [Future Enhancements (Roadmap)](#future-enhancements-roadmap)
9.  [Contributing](#contributing)

---

## 1. Project Purpose and Vision

**WeatherTunes** aims to be a dynamic web application that enhances the user's listening experience by seamlessly connecting their Spotify account to real-time weather conditions. The core idea is to curate and play music that reflects the current weather in the user's chosen location, creating a unique and immersive auditory atmosphere.

**Vision:**

- To provide an intuitive and visually appealing interface.
- To offer intelligent music suggestions based on a sophisticated mapping of weather conditions to musical moods, genres, and user preferences.
- To deliver a reliable and responsive experience across various devices.
- To potentially expand to other music streaming services and offer more customization options.

---

## 2. Tech Stack

### Frontend

- **React 19:** A JavaScript library for building user interfaces.
- **TypeScript:** A superset of JavaScript that adds static typing, improving code quality and maintainability.
- **React Router DOM 7.6.2:** For declarative routing in the React application.
- **Lucide React 0.513.0:** For beautiful and consistent icons.

### Build Tools & Environment

- **Vite 6.3.5:** A modern frontend build tool that provides an extremely fast development server and optimized builds.
  - Config: `vite.config.ts`
  - Includes `@vitejs/plugin-react` for React support.
- **Node.js (v18+ recommended):** JavaScript runtime environment.
- **npm:** Node Package Manager for handling project dependencies.
  - Config: `package.json`

### Styling

- **Tailwind CSS 4.1.8:** A utility-first CSS framework for rapid UI development.
  - Config: `tailwind.config.ts`
  - Integrated with Vite via `@tailwindcss/vite`.
  - Uses `clsx` and `tailwind-merge` for conditional and merged class names.
- **Radix UI Components:** Uses `@radix-ui/react-*` components for accessible UI primitives including labels, navigation menus, scroll areas, and slots.
- **Class Variance Authority (CVA):** For creating component variants with `class-variance-authority`.
- **Dark Mode:** Implemented using Tailwind's class-based strategy (`darkMode: "class"` in `tailwind.config.ts`). Theme switching is handled through the settings context and theme manager hooks.
- **Custom Fonts:** `Inter Tight` (see `tailwind.config.ts`).
- **Animations:** Custom animations defined in `tailwind.config.ts` with `tw-animate-css` support.

### Linting & Formatting

- **ESLint 9.25.0:** For identifying and reporting on patterns in JavaScript/TypeScript.
  - Config: `eslint.config.js`
  - Plugins: `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`.
- **Prettier 3.5.3:** An opinionated code formatter.
  - Config: Potentially `.prettierrc.json` or in `package.json`.
  - Plugin: `prettier-plugin-tailwindcss` for sorting Tailwind classes.
- **TypeScript ESLint:** For linting TypeScript code.

---

## 3. Getting Started

This section guides you through setting up the frontend development environment.

### Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)

Verify installations:

```bash
node -v
npm -v
```

### Installation Steps

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/cpond8/weathertunes.git
    cd weathertunes
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
    This installs dependencies listed in `package.json` into the `node_modules` directory and creates/updates `package-lock.json`.

### Running the Development Server

```bash
npm run dev
```

This starts the Vite development server (usually at `http://localhost:5173`) with Hot Module Replacement (HMR).

---

## 4. Frontend Architecture

### Directory Structure Overview

```
weathertunes/
├── public/                  # Static assets (e.g., vite.svg)
├── src/
│   ├── assets/              # Project-specific assets
│   │   └── videos/          # Background videos for different weather conditions
│   ├── components/          # Reusable UI components
│   │   ├── icons/           # Custom icon components (Settings, Sunrise, Sunset)
│   │   ├── ui/              # Generic UI primitives (button, card, input, label, navigation-menu)
│   │   └── ...              # Specific components (WeatherDisplay, NavBar, SettingsMenu, etc.)
│   ├── contexts/            # React context providers (SettingsContext)
│   ├── hooks/               # Custom React hooks (useWeather, useSettings, useThemeManager, etc.)
│   ├── lib/                 # Utility functions and libraries (utils, weather, temperature, units)
│   ├── pages/               # Top-level route components (MainPage, Login)
│   ├── types/               # TypeScript type definitions (weather.ts)
│   ├── App.tsx              # Main application component, sets up routing
│   ├── main.tsx             # Entry point with providers (BrowserRouter, SettingsProvider)
│   ├── index.css            # Global styles and Tailwind imports
│   └── vite-env.d.ts        # Vite environment types
├── devs/                    # Development resources
│   └── tw-rainbow-theme-config.txt  # Theme configuration reference
├── components.json          # Component library configuration
├── eslint.config.js         # ESLint configuration
├── index.html               # Main HTML entry point for Vite
├── package.json             # Project metadata and dependencies
├── README.md                # Primary README (backend-focused)
├── PROJECT_DOCUMENTATION.md # This file (comprehensive project documentation)
├── LOCATION_UNITS_IMPLEMENTATION.md # Location-based units implementation details
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # Main TypeScript configuration
├── tsconfig.app.json        # App-specific TypeScript configuration
├── tsconfig.node.json       # Node-specific TypeScript configuration
└── vite.config.ts           # Vite configuration
```

### Key Components and Their Roles

- **`src/App.tsx`**:

  - The root component of the application.
  - Sets up the main routing structure using `react-router-dom`.
  - Currently includes routes for `Login` and `MainPage`.
  - Contains a TODO for a fallback route.

- **`src/main.tsx`**:

  - The entry point that renders the React application into the DOM.
  - Wraps `<App />` with `<BrowserRouter>`.

- **Pages (`src/pages/`)**:

  - **`MainPage.tsx`**: The core page displaying weather, music player (placeholder), "up next" (placeholder), and favorites (placeholder). It integrates various components and hooks to present the main user experience.
  - **`Login.tsx`**: A basic login page structure. Functionality is pending backend integration.

- **Functional Components (`src/components/`)**:

  - **`NavBar.tsx`**: Navigation bar with settings button and placeholder for Spotify login.
  - **`SettingsButton.tsx`** and **`SettingsMenu.tsx`**: Complete settings interface for user preferences (temperature units, time format, speed units, theme mode).
  - **`VideoBackground.tsx`**: Manages the dynamic video background based on weather conditions and time of day. Selects videos from `src/assets/videos/`.
  - **`WeatherDisplay.tsx`**: Shows current weather information with sunrise/sunset times and comprehensive weather data.
  - **`UnifiedDisplay.tsx`**: Combines weather and currently playing information into a single visual component.
  - **`CurrentlyPlaying.tsx`**: Displays details of the song currently being played (currently uses placeholder data).
  - **`UpNext.tsx`**: Shows a list of upcoming songs (currently uses placeholder data).

- **Icon Components (`src/components/icons/`)**:

  - Custom icon components including `SettingsIcon`, `SunriseIcon`, and `SunsetIcon`.

- **UI Primitives (`src/components/ui/`)**:
  - These are generic, often styled components based on `shadcn/ui` principles (e.g., `button.tsx`, `card.tsx`, `input.tsx`, `label.tsx`, `navigation-menu.tsx`). They provide consistent building blocks for the UI.

### Routing

- Managed by `react-router-dom`.
- Routes are defined in `src/App.tsx`.
- Key routes:
  - `/`: Loads `MainPage.tsx`.
  - `/login`: Loads `Login.tsx`.

### State Management

- **React Context API**: Used for global state management through `SettingsContext`.
- **Settings Management (`src/contexts/SettingsContext.tsx`)**:
  - Manages user preferences: temperature units (°F/°C), time format (12h/24h), speed units (mph/km/h/m/s), theme mode (auto/light/dark).
  - Integrates with local storage for persistence and location-based defaults.
  - Provides context for settings access throughout the application.
- **Custom Hooks**:
  - **`useSettings`**: Provides access to settings context and related functions.
  - **`useWeather`**: Manages weather data fetching and processing (currently client-side).
  - **`useThemeManager`**: Handles automatic theme switching based on weather and time.
  - **`useLocalStorage`**: Provides persistent local storage functionality.
  - **`useLocationBasedDefaults`**: Automatically determines appropriate units based on user location.

### Styling Details

- **Tailwind CSS:** Configuration in `tailwind.config.ts`.
  - `content`: Specifies files to scan for Tailwind classes.
  - `darkMode: "class"`: Enables manual dark mode toggling by adding/removing the `dark` class on the `<html>` element.
  - `theme.extend`: Customizes and extends Tailwind's default theme (e.g., `fontFamily`, `animation`, `keyframes`).
- **Global Styles:** `src/index.css` imports Tailwind's base, components, and utilities layers. Any additional global styles can be added here.
- **Component-Level Styling:** Achieved by applying Tailwind utility classes directly in JSX elements.
- **Utility Libraries:** Uses `clsx` and `tailwind-merge` for conditionally applying and merging Tailwind classes.
- **Radix UI Integration:** Styled Radix UI components provide accessible, unstyled primitives that are then styled with Tailwind CSS.

### Environment Variables

- Vite handles environment variables. See [Vite Env Variables documentation](https://vitejs.dev/guide/env-and-mode.html).
- Frontend environment variables should be prefixed with `VITE_`.
- Example: `VITE_PUBLIC_OPENWEATHER_API_KEY` is used in `src/hooks/useWeather.ts` for the OpenWeatherMap API key.
- These are embedded during the build process and are accessible in client-side code via `import.meta.env.VITE_YOUR_VARIABLE`.
- A `.env` file at the project root can be used to store these variables (e.g., `.env.local` for local overrides, not committed to git).

### Asset Management

- **Static Assets:** Files in the `public/` directory are served as-is from the root path.
- **Project Assets:** Files in `src/assets/` are processed by Vite during the build.
  - **`src/assets/videos/`**: Contains MP4 files used for the dynamic video background. These are selected by the `VideoBackground.tsx` component based on weather conditions and time of day. Video files are named according to weather type and time period (e.g., `clear_day.mp4`, `rain_evening.mp4`, `snow_night.mp4`).
- **Component Library Configuration:** `components.json` contains configuration for the component library setup, likely related to shadcn/ui or similar component systems.

---

## 5. Backend Development Guide

The backend is responsible for handling Spotify authentication, server-side weather data fetching, music logic, and providing APIs for the frontend.

For detailed information on backend development, including specific frontend integration points, API design, and TODOs, please refer to the main [**`README.md`**](README.md). The primary `README.md` is now focused on these backend concerns.

Key areas for backend development:

- **Spotify OAuth 2.0 Integration:** Securely manage authentication.
- **Weather API Service:** Abstract weather data fetching behind a backend API.
- **Spotify Player Control:** APIs to manage playback.
- **Music Recommendation Logic:** Determine appropriate music based on weather.

---

## 6. Current Features & Implementation Status

### Implemented Features

- **Complete Settings System:**

  - User preferences for temperature units (°F/°C), time format (12h/24h), speed units (mph/km/h/m/s)
  - Theme mode selection (auto/light/dark) with automatic switching based on time of day
  - Location-based default unit selection (automatically configures appropriate units based on user's location)
  - Persistent storage using local storage with React Context integration

- **Weather Display:**

  - Comprehensive weather information including temperature, conditions, humidity, pressure, wind speed
  - Sunrise and sunset times with formatted display
  - Real-time weather data fetching (currently client-side, pending backend migration)
  - Weather-based time period determination (morning, day, evening, night)

- **Dynamic UI Elements:**

  - Weather-responsive video backgrounds that change based on conditions and time of day
  - Automatic theme switching (light/dark mode) based on time period
  - Responsive design optimized for various screen sizes
  - Smooth animations and transitions

- **Component Architecture:**
  - Modular component structure with reusable UI primitives
  - Custom hooks for state management and data fetching
  - TypeScript integration for type safety
  - Accessible UI components using Radix UI primitives

### In Progress / Placeholder Features

- **Spotify Integration:**

  - UI placeholders for Spotify login in navigation
  - Music player interface with placeholder data
  - "Currently Playing" component structure ready for real data
  - "Up Next" queue component with static placeholder content

- **User Features:**
  - Favorites system structure (placeholder in main page)
  - User authentication flow (login page exists but needs backend integration)

### ❌ Not Yet Implemented (Backend Required)

- **Authentication & Authorization:**

  - Spotify OAuth 2.0 implementation
  - User session management
  - Protected routes and auth state management

- **Music Functionality:**

  - Real Spotify player controls (play, pause, skip, volume)
  - Dynamic music selection based on weather conditions
  - User's Spotify library integration
  - Playlist generation and management

- **Data Persistence:**
  - User settings synchronization across devices
  - Favorites storage and management
  - User preferences and history tracking

---

## 7. Building for Production

To create an optimized production build of the frontend:

```bash
npm run build
```

This command typically performs:

1.  `tsc -b`: Runs the TypeScript compiler to check for type errors (as per the `build` script in `package.json`).
2.  `vite build`: Bundles the application, optimizes assets, and outputs the result to the `dist/` directory (by default).

The contents of the `dist/` directory can then be deployed to any static hosting service or web server.

---

---

## 8. Future Enhancements (Roadmap)

- **Full Spotify Integration:**

  - Complete backend implementation for Spotify OAuth 2.0 authentication.
  - Implement robust Spotify player controls (play, pause, skip, volume, seek).
  - User library access (playlists, saved tracks).
  - Dynamic playlist generation based on weather and user taste.

- **Backend Development:**

  - Move weather API calls from client-side to server-side.
  - Implement user authentication and session management.
  - Create APIs for music control, weather data, and user preferences.
  - Database integration for storing user data, preferences, and favorites.
  - Settings synchronization across devices/sessions.

- **Advanced Weather-to-Music Mapping:**

  - More granular weather conditions and music matching algorithms.
  - User-configurable preferences for music mapping.
  - Machine learning for personalized suggestions based on listening history.

- **Enhanced User Experience:**

  - Complete favorites system implementation.
  - Music queue management and playlist creation.
  - Location search functionality (complement browser geolocation).
  - Offline mode support with cached preferences.

- **Improved UI/UX:**

  - Enhanced animations and transitions.
  - Accessibility improvements (ARIA labels, keyboard navigation).
  - Mobile responsiveness optimizations.
  - Additional theme options and customization.

- **Technical Improvements:**

  - Comprehensive testing suite (unit, integration, end-to-end).
  - Performance optimizations and bundle size reduction.
  - Error handling and logging improvements.
  - Progressive Web App (PWA) capabilities.

- **Additional Features:**
  - Integration with other music streaming services (Apple Music, YouTube Music).
  - Social features (sharing weather-music combinations).
  - Historical weather and music data visualization.
  - Mood-based music selection beyond weather conditions.

---

## 9. Contributing

Currently, contribution guidelines are not formally defined. If you are interested in contributing, please consider:

- Adhering to the existing coding style (TypeScript, ESLint, Prettier).
- Creating issues for bugs or feature requests.
- Discussing significant changes before implementation.

(This section can be expanded later with more specific guidelines, code of conduct, and pull request processes.)
