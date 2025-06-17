# WeatherTunes Backend

A Flask backend server providing Spotify integration and weather-based music recommendations.

## Features

- Spotify OAuth authentication
- Weather-based music recommendations
- User session management
- Liked songs tracking

## Project Structure

```
backend/
├── app/
│   ├── config.py          # Centralized configuration
│   ├── routes/            # API route handlers
│   │   ├── auth.py        # Authentication endpoints
│   │   ├── liked_songs.py # Liked songs management
│   │   ├── recommended.py # Music recommendations
│   │   ├── user.py        # User profile endpoints
│   │   └── weather.py     # Weather data endpoints
│   └── services/          # Business logic services
│       ├── recommendation.py
│       ├── storage.py
│       ├── user_data.py
│       └── weather.py
├── data/                  # User data storage
├── requirements.txt       # Python dependencies
└── run.py                # Flask application entry point
```

## Setup

1. **Install Python dependencies:**

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Create environment variables:**
   Create a `.env` file in the root directory with:

   ```
   FLASK_SECRET_KEY=your_secret_key_here
   SPOTIPY_CLIENT_ID=your_spotify_client_id
   SPOTIPY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIPY_REDIRECT_URI=http://localhost:5173/auth-callback
   OPENWEATHER_API_KEY=your_openweather_api_key
   ```

3. **Run the server:**
   ```bash
   python run.py
   ```

The server starts on `http://localhost:8000`

## API Endpoints

- `GET /login` - Initiate Spotify OAuth flow
- `GET /callback` - Handle OAuth callback
- `GET /session` - Check user session status
- `POST /liked` - Add track to liked songs
- `GET /liked` - Get user's liked tracks
- `GET /recommended` - Get weather-based recommendations

## Development

- All configuration is centralized in `app/config.py`
- User data is stored in the `data/` directory
- Python cache files are automatically ignored

- CORS enabled for localhost:5173
- Session cookies configured for cross-origin requests
- Debug mode enabled
