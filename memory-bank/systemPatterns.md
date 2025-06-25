# System Patterns: WeatherTunes

## System Architecture
WeatherTunes is a client-side, single-page application (SPA). It operates entirely in the user's browser, with no proprietary backend. This architecture simplifies deployment and reduces server-side costs.

- **Frontend**: A React application bootstrapped with Vite.
- **External APIs**:
  - **OpenWeatherMap**: For all weather-related data.
  - **Spotify Web API**: For music, user authentication, and playback.
- **Data Flow**: The application makes direct, authenticated calls to these external APIs from the client.

## Key Design Patterns
- **Component-Based Architecture**: The UI is built from a collection of reusable, modular components. This promotes separation of concerns and maintainability.
- **State Management with Hooks and Context**:
  - **`useState` and `useEffect`**: Used for local component state and side effects.
  - **React Context API**: Used for global state, such as user settings and authentication status, to avoid prop drilling.
- **Custom Hooks**: Logic is encapsulated and reused across components through custom hooks (e.g., `useWeatherData`, `useAuth`).
- **Service Abstraction**: API interactions are abstracted into service modules (e.g., `WeatherService`, `SpotifyService`). This decouples the UI from the data-fetching logic, making the code cleaner and easier to test.
- **Asynchronous Operations**: The application heavily relies on asynchronous JavaScript (Promises, `async/await`) to handle API requests without blocking the main thread.

## Critical Implementation Paths
- **Authentication**: The OAuth 2.0 PKCE flow for Spotify is a critical path. It's handled entirely on the frontend, with tokens stored securely in the browser.
- **Weather-to-Music Logic**: The core logic that translates weather conditions into Spotify music recommendations is a key feature. This involves mapping weather data to musical attributes (e.g., tempo, energy, valence).
- **Dynamic Theming**: The system that selects and displays video backgrounds based on weather and time of day is central to the user experience.
