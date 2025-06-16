# WeatherTunes Backend

This is the Flask backend server that provides Spotify integration for the WeatherTunes application.

## Features

- Spotify OAuth authentication
- Weather-based music recommendations
- Liked songs management
- User session handling

## Setup

1. **Install Python dependencies:**

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Create environment variables:**
   Create a `.env` file in the root directory (parent of backend/) with:

   ```
   FLASK_SECRET_KEY=your_secret_key_here
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REDIRECT_URI=http://localhost:5173/auth-callback
   VITE_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
   ```

3. **Run the server:**
   ```bash
   python run.py
   ```

The server will start on `http://localhost:8000`

## API Endpoints

- `GET /login` - Initiate Spotify OAuth flow
- `GET /callback` - Handle OAuth callback
- `GET /session` - Check user session status
- `POST /liked` - Add track to liked songs
- `GET /liked` - Get user's liked tracks
- `GET /recommended` - Get weather-based recommendations

## Development

The backend is configured for development with:

- CORS enabled for localhost:5173
- Session cookies configured for cross-origin requests
- Debug mode enabled
