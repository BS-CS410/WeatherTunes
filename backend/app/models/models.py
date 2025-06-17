"""Data models for the WeatherTunes backend."""

from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional


@dataclass
class WeatherData:
    """Weather information model."""

    location: str
    temperature: float
    condition: str
    time_period: str


@dataclass
class UserData:
    """User data model."""

    username: str
    created_at: datetime
    last_login: datetime
    last_weather: Optional[WeatherData] = None
    favorites: Optional[List[str]] = None

    def __post_init__(self) -> None:
        """Initialize favorites list if None."""
        if self.favorites is None:
            self.favorites = []


@dataclass
class SpotifyTokens:
    """Spotify OAuth tokens model."""

    access_token: str
    refresh_token: Optional[str] = None
    expires_at: Optional[int] = None


@dataclass
class AuthSession:
    """Authentication session model."""

    spotify_username: str
    tokens: SpotifyTokens
