"""Configuration settings for the WeatherTunes backend."""

import os
from pathlib import Path

# File paths
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
USER_DATA_FILE = DATA_DIR / "user_data.json"
LIKED_SONGS_FILE = DATA_DIR / "liked_songs.txt"

# Weather API configuration
WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather"
GEO_API_URL = "http://ip-api.com/json"
DEFAULT_TIMEZONE = "America/Los_Angeles"

# Spotify configuration
SPOTIFY_SCOPE = "user-library-read user-read-email user-read-private"


# Flask configuration
class Config:
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "supersecretkey")
    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_SECURE = False
    SESSION_COOKIE_DOMAIN = None
    SESSION_COOKIE_HTTPONLY = False
