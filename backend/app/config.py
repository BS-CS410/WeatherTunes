"""Configuration settings for the WeatherTunes backend."""

import os
from pathlib import Path
from typing import Final


class Paths:
    """File path constants."""

    BASE_DIR: Final[Path] = Path(__file__).parent.parent
    DATA_DIR: Final[Path] = BASE_DIR / "data"
    USER_DATA_FILE: Final[Path] = DATA_DIR / "user_data.json"
    LIKED_SONGS_FILE: Final[Path] = DATA_DIR / "liked_songs.txt"


class WeatherConfig:
    """Weather API configuration."""

    BASE_URL: Final[str] = "https://api.openweathermap.org/data/2.5/weather"
    GEO_API_URL: Final[str] = "http://ip-api.com/json"
    DEFAULT_TIMEZONE: Final[str] = "America/Los_Angeles"
    API_KEY: Final[str] = os.getenv("OPENWEATHER_API_KEY", "")


class SpotifyConfig:
    """Spotify API configuration."""

    SCOPE: Final[str] = "user-library-read user-read-email user-read-private"
    CLIENT_ID: Final[str] = os.getenv("SPOTIPY_CLIENT_ID", "")
    CLIENT_SECRET: Final[str] = os.getenv("SPOTIPY_CLIENT_SECRET", "")
    REDIRECT_URI: Final[str] = os.getenv("SPOTIPY_REDIRECT_URI", "")


class AppConfig:
    """Application URLs and settings."""

    FRONTEND_URL: Final[str] = "http://127.0.0.1:5173"
    CALLBACK_URL: Final[str] = f"{FRONTEND_URL}/auth-callback"
    ALLOWED_ORIGINS: Final[list[str]] = [
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ]


class Config:
    """Flask configuration."""

    SECRET_KEY: str = os.getenv("FLASK_SECRET_KEY", "dev-secret-change-in-production")
    SESSION_COOKIE_SAMESITE: str = "Lax"
    SESSION_COOKIE_SECURE: bool = not os.getenv("FLASK_DEBUG", "True").lower() in (
        "true",
        "1",
        "t",
    )
    SESSION_COOKIE_DOMAIN: str | None = None
    SESSION_COOKIE_HTTPONLY: bool = True
