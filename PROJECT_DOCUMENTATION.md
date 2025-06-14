# WeatherTunes Project Documentation 🌪️🎸😎👍

_Last Updated: June 14, 2025_

## Table of Contents

1.  [Project Purpose and Vision](#project-purpose-and-vision)
2.  [Tech Stack](#tech-stack)
    - [Frontend](#frontend)
    - [Build Tools & Environment](#build-tools--environment)
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
6.  [Building for Production](#building-for-production)
7.  [Future Enhancements (Roadmap)](#future-enhancements-roadmap)
8.  [Contributing](#contributing)

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
- **Lucide React:** For beautiful and consistent icons.

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
- **Dark Mode:** Implemented using Tailwind's class-based strategy (`darkMode: "class"` in `tailwind.config.ts`). Theme switching is handled in `src/hooks/useWeather.ts` (`useThemeFromWeather`).
- **Custom Fonts:** `Inter Tight` (see `tailwind.config.ts`).
- **Animations:** Custom animations defined in `tailwind.config.ts` (e.g., `pulse-eq`, `float`, `pulse-updown`).

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
│   │   └── videos/          # Background videos
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Generic UI primitives (e.g., button, card)
│   │   └── ...              # Specific components (e.g., WeatherDisplay, NavBar)
│   ├── contexts/            # React context providers (currently empty)
│   ├── hooks/               # Custom React hooks (e.g., useWeather.ts)
│   ├── lib/                 # Utility functions and libraries (e.g., utils.ts, weather.ts)
│   ├── pages/               # Top-level route components (e.g., MainPage.tsx, Login.tsx)
│   ├── types/               # TypeScript type definitions (e.g., weather.ts)
│   ├── App.tsx              # Main application component, sets up routing
│   ├── main.tsx             # Entry point of the React application
│   ├── index.css            # Global styles and Tailwind imports
│   └── vite-env.d.ts        # Vite environment types
├── eslint.config.js         # ESLint configuration
├── index.html               # Main HTML entry point for Vite
├── package.json             # Project metadata and dependencies
├── README.md                # Primary README (backend-focused)
├── PROJECT_DOCUMENTATION.md # This file
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

  - **`NavBar.tsx`**: Navigation bar, includes a TODO for Spotify login.
  - **`VideoBackground.tsx`**: Manages the dynamic video background based on weather conditions and time of day. Selects videos from `src/assets/videos/`.
  - **`WeatherDisplay.tsx`**: Responsible for showing the current weather information (location, temperature, condition).
  - **`CurrentlyPlaying.tsx`**: Displays details of the song currently being played (currently uses placeholder data).
  - **`UnifiedDisplay.tsx`**: A component that likely combines weather and currently playing information into a single visual unit.
  - **`UpNext.tsx`**: Shows a list of upcoming songs (currently uses placeholder data).

- **UI Primitives (`src/components/ui/`)**:
  - These are generic, often styled components based on `shadcn/ui` principles (e.g., `button.tsx`, `card.tsx`, `input.tsx`, `label.tsx`, `navigation-menu.tsx`). They provide consistent building blocks for the UI.

### Routing

- Managed by `react-router-dom`.
- Routes are defined in `src/App.tsx`.
- Key routes:
  - `/`: Loads `MainPage.tsx`.
  - `/login`: Loads `Login.tsx`.

### State Management

- Primarily uses React's built-in state management (`useState`, `useEffect`).
- **`src/hooks/useWeather.ts`**:
  - `useWeatherData`: A custom hook responsible for fetching and processing weather data. Currently, it fetches directly from the OpenWeatherMap API (this is planned to move to the backend). It manages loading, error, and display states for weather information. It also determines the `timePeriod` (morning, day, evening, night).
  - `useThemeFromWeather`: A custom hook that applies a dark or light theme to the application based on the `timePeriod` derived from weather data.
- The `src/contexts/` directory is present, suggesting that React Context API might be used for more global state management in the future (e.g., authentication status, user preferences).

### Styling Details

- **Tailwind CSS:** Configuration in `tailwind.config.ts`.
  - `content`: Specifies files to scan for Tailwind classes.
  - `darkMode: "class"`: Enables manual dark mode toggling by adding/removing the `dark` class on the `<html>` element.
  - `theme.extend`: Customizes and extends Tailwind's default theme (e.g., `fontFamily`, `animation`, `keyframes`).
- **Global Styles:** `src/index.css` imports Tailwind's base, components, and utilities layers. Any additional global styles can be added here.
- **Component-Level Styling:** Achieved by applying Tailwind utility classes directly in JSX elements.
- **`clsx` and `tailwind-merge`:** These utilities are likely used for conditionally applying Tailwind classes and resolving conflicting classes, respectively, though not explicitly shown in `package.json`'s direct dependencies (might be via `shadcn/ui` or similar).

### Environment Variables

- Vite handles environment variables. See [Vite Env Variables documentation](https://vitejs.dev/guide/env-and-mode.html).
- Frontend environment variables should be prefixed with `VITE_`.
- Example: `VITE_PUBLIC_OPENWEATHER_API_KEY` is used in `src/hooks/useWeather.ts` for the OpenWeatherMap API key.
- These are embedded during the build process and are accessible in client-side code via `import.meta.env.VITE_YOUR_VARIABLE`.
- A `.env` file at the project root can be used to store these variables (e.g., `.env.local` for local overrides, not committed to git).

### Asset Management

- **Static Assets:** Files in the `public/` directory are served as-is from the root path.
- **Project Assets:** Files in `src/assets/` are processed by Vite during the build.
  - **`src/assets/videos/`**: Contains MP4 files used for the dynamic video background. These are selected by the `VideoBackground.tsx` component based on weather and time. The `README.md` in this folder might contain more specific information about video naming conventions or sources.

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

## 6. Building for Production

To create an optimized production build of the frontend:

```bash
npm run build
```

This command typically performs:

1.  `tsc -b`: Runs the TypeScript compiler to check for type errors (as per the `build` script in `package.json`).
2.  `vite build`: Bundles the application, optimizes assets, and outputs the result to the `dist/` directory (by default).

The contents of the `dist/` directory can then be deployed to any static hosting service or web server.

---

## 7. Future Enhancements (Roadmap)

- **Full Spotify Integration:**
  - Implement robust Spotify player controls (play, pause, skip, volume, seek).
  - User library access (playlists, saved tracks).
  - Dynamic playlist generation based on weather and user taste.
- **Advanced Weather-to-Music Mapping:**
  - More granular weather conditions.
  - User-configurable preferences for music mapping.
  - Machine learning for personalized suggestions.
- **User Accounts & Preferences:**
  - Saving default locations.
  - Storing music preferences and history.
- **Improved UI/UX:**
  - More sophisticated animations and transitions.
  - Accessibility improvements.
  - Mobile responsiveness enhancements.
- **Backend Enhancements:**
  - Database for storing user data, preferences, and cached weather/music mappings.
  - More robust error handling and logging.
  - Scalability improvements.
- **Testing:**
  - Unit tests for critical components and utility functions.
  - Integration tests for API interactions.
  - End-to-end tests for user flows.
- **Additional Music Services:** Potential integration with other music platforms.
- **Location Search:** Allow users to search for locations instead of relying solely on browser geolocation.

---

## 8. Contributing

Currently, contribution guidelines are not formally defined. If you are interested in contributing, please consider:

- Adhering to the existing coding style (TypeScript, ESLint, Prettier).
- Creating issues for bugs or feature requests.
- Discussing significant changes before implementation.

(This section can be expanded later with more specific guidelines, code of conduct, and pull request processes.)
