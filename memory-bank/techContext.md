# Tech Context: WeatherTunes

## Core Technologies
- **React 19**: The fundamental library for building the user interface.
- **TypeScript**: For static typing, improving code quality and maintainability.
- **Vite**: The build tool and development server, providing a fast and modern development experience.
- **Node.js**: The runtime environment for the development server and build tools.

## Styling
- **Tailwind CSS**: A utility-first CSS framework for rapid and consistent styling.
- **Radix UI**: A library of unstyled, accessible UI components that serve as a foundation for the design system.
- **Lucide React**: Provides a set of clean and consistent icons.

## Key Libraries
- **React Router**: For client-side routing and navigation within the application.
- **Class Variance Authority (CVA)**: To manage component style variants in a structured way.

## Development and Tooling
- **ESLint**: For static code analysis to find and fix problems in the code.
- **Prettier**: An opinionated code formatter that ensures a consistent code style across the project.
- **npm**: The package manager for handling project dependencies.

## APIs and Services
- **OpenWeatherMap API**: The source for all weather-related data.
- **Spotify Web API**: Used for music recommendations, playback, and user authentication.

## Technical Constraints
- **Browser Environment**: The application must run entirely within a web browser, with no server-side component.
- **API Rate Limits**: The application must be mindful of the rate limits imposed by the OpenWeatherMap and Spotify APIs.
- **Security**: Since authentication is handled on the client-side, care must be taken to store tokens securely and handle the OAuth flow correctly.

### **Service Layer**

The application's external API interactions are abstracted into a dedicated service layer. This decouples the UI and business logic from the complexities of data fetching, creating a clean and maintainable architecture.

-   **`AuthService`**: Manages the entire OAuth 2.0 PKCE flow for Spotify, including token storage, refresh, and user retrieval.
-   **`SpotifyService`**: Provides a comprehensive and consistent interface for all Spotify API interactions. It is the single source of truth for all Spotify data, handling everything from searching for tracks to generating weather-based playlists. This service is responsible for transforming raw API responses into the application-specific `TrackMetadata` type, ensuring a stable data contract for the rest of the application.
-   **`WeatherService`**: Handles all interactions with the OpenWeatherMap API, providing a simple interface for fetching weather and forecast data.

### **Custom Type Definitions**

This section outlines the custom TypeScript types and interfaces that form the data model of the WeatherTunes application. These types ensure data consistency and provide a clear structure for working with information from various sources, including the OpenWeatherMap and Spotify APIs.

#### **Authentication (`src/types/auth/index.ts`)**

-   **`User`**: Represents a logged-in user, containing their ID, display name, email, and profile images.
-   **`TokenInfo`**: A dedicated interface for storing Spotify-specific tokens, including the access token, refresh token, and expiration time.
-   **`AuthState`**: Represents the state of the authentication context, using the `AsyncState` generic type to manage the user, loading, and error states.

#### **Music Queue (`src/types/queue-types.ts`)**

-   **`TrackMetadata`**: A unified interface for track information, combining data from the Spotify API with application-specific metadata, such as video URLs for background visuals.
-   **`QueueState`**: Defines the structure of the music queue, including the currently playing track and the list of upcoming tracks.

#### **Spotify API (`src/types/spotify-api-types.ts`)**

-   **`Track`**: Represents a track from the Spotify API, including details like its ID, name, artists, and album.
-   **`PlaybackState`**: Defines the current state of the Spotify player, including the currently playing track, progress, and device information.
-   **`RecommendationsResponse`**: Structures the response from the Spotify recommendations endpoint, containing a list of recommended tracks and the seeds used to generate them.

#### **Spotify Player (`src/types/spotify-player.d.ts`)**

-   **`SpotifyPlayer`**: An interface for the Spotify Web Playback SDK player, defining methods for controlling playback, managing volume, and listening for events.
-   **`SpotifyPlaybackState`**: Represents the detailed state of the Spotify Web Playback SDK, including the current track, playback status, and disallows.
-   **`Window.Spotify`**: A global declaration that makes the Spotify Web Playback SDK available on the `window` object, allowing for easy integration with the application.

#### **Application Settings (`src/types/units-types.ts`)**

-   **`TemperatureUnit`**: A type for temperature units, allowing the user to switch between "imperial," "metric," and "standard."
-   **`TimeFormat`**: A type for time formats, enabling the user to choose between "12h" and "24h" displays.
-   **`ThemeMode`**: A type for the application's theme, supporting "auto," "light," and "dark" modes.

#### **Weather (`src/types/weather-types.ts`)**

-   **`WeatherApiResponse`**: Defines the structure of the response from the OpenWeatherMap API, including temperature, weather conditions, and sunrise/sunset times.
-   **`DailyForecast`**: Represents a single day's forecast, with properties for the date, condition, high and low temperatures, and an icon.
-   **`ForecastState`**: Defines the state of the weather forecast, including the list of daily forecasts, loading status, and any errors.
