# WeatherTunes Backend

A modern Flask-based REST API backend for the WeatherTunes application, providing Spotify integration, weather data management, and music recommendations.

## Features

- **Spotify OAuth Integration**: Secure user authentication via Spotify
- **Weather Data Management**: Location-based weather fetching and storage
- **Music Recommendations**: Spotify-powered recommendations based on listening history
- **User Data Management**: Favorites, listening history, and profile management
- **Type Safety**: Full type annotations for better code quality
- **Structured Logging**: Comprehensive logging for debugging and monitoring
- **Modular Architecture**: Clean separation of concerns with services and utilities

## Architecture

```
backend/
├── app/
│   ├── models/          # Data models and type definitions
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic and external API integrations
│   ├── utils/           # Utility functions and helpers
│   └── config.py        # Application configuration
├── data/                # Data storage (JSON files)
├── requirements.txt     # Python dependencies
└── run.py              # Application entry point
```

## Setup

### Prerequisites

- Python 3.11+
- Spotify Developer Account
- OpenWeather API Key (optional, for weather features)

### Installation

1. **Clone and navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Create virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Spotify Configuration
   SPOTIPY_CLIENT_ID=your_spotify_client_id
   SPOTIPY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIPY_REDIRECT_URI=http://127.0.0.1:8000/callback

   # Flask Configuration
   FLASK_SECRET_KEY=your-secure-secret-key-here

   # Weather API (Optional)
   OPENWEATHER_API_KEY=your_openweather_api_key
   ```

5. **Run the application**
   ```bash
   python run.py
   ```

The backend will start on `http://127.0.0.1:8000`

## API Endpoints

### Authentication

- `GET /login` - Initiate Spotify OAuth login
- `GET /callback` - Handle OAuth callback
- `GET /logout` - Logout and clear session
- `GET /session` - Get current session status
- `GET /userinfo` - Get authenticated user info

### Music & Recommendations

- `GET /liked` - Get user's favorite tracks
- `POST /liked` - Add track to favorites
- `GET /recommend` - Get music recommendations
- `GET /top-tracks` - Get user's Spotify top tracks

### User Data

- `POST /history` - Log listening history
- `GET /history` - Get listening history
- `GET /profile` - Get user profile

### Weather

- `POST /weather` - Save weather data
- `GET /weather` - Get user's weather data

## Configuration

### Spotify Setup

1. Create a Spotify app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Add `http://127.0.0.1:8000/callback` to redirect URIs
3. Copy Client ID and Client Secret to `.env` file

### Weather Setup (Optional)

1. Get API key from [OpenWeather](https://openweathermap.org/api)
2. Add to `.env` file as `OPENWEATHER_API_KEY`

## Development

### Code Style

The codebase follows these principles:

- **Type Safety**: All functions have type annotations
- **Clear Naming**: Descriptive variable and function names
- **Single Responsibility**: Each module has a clear purpose
- **Error Handling**: Comprehensive error handling with logging
- **DRY Principle**: No code duplication

### Adding New Features

1. **Models**: Add data models to `app/models/`
2. **Services**: Add business logic to `app/services/`
3. **Routes**: Add API endpoints to `app/routes/`
4. **Utils**: Add utilities to `app/utils/`

### Testing

```bash
# Install test dependencies
pip install pytest pytest-flask

# Run tests
pytest
```

## Deployment

### Production Setup

1. **Set secure secret key**

   ```env
   FLASK_SECRET_KEY=your-production-secret-key
   ```

2. **Configure session security**

   ```python
   SESSION_COOKIE_SECURE = True
   SESSION_COOKIE_HTTPONLY = True
   ```

3. **Use production WSGI server**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:8000 run:app
   ```

## Troubleshooting

### Common Issues

1. **Spotify callback errors**: Check redirect URI configuration
2. **Session issues**: Verify secret key and cookie settings
3. **Weather API errors**: Check API key and internet connection
4. **Import errors**: Ensure virtual environment is activated

### Logging

Logs are written to stdout and can be redirected to files:

```bash
python run.py > app.log 2>&1
```

## Contributing

1. Follow the existing code style and architecture
2. Add type annotations to all new code
3. Include proper error handling and logging
4. Update tests for new functionality
5. Update documentation as needed

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
