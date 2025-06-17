"""Data models for the WeatherTunes backend."""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class WeatherData(BaseModel):
    """Weather information model."""

    location: str
    temperature: float
    condition: str
    time_period: str


class UserData(BaseModel):
    """User data model."""

    username: str
    created_at: datetime
    last_login: datetime
    last_weather: Optional[WeatherData] = None
    favorites: List[str] = Field(default_factory=list)


class SpotifyTokens(BaseModel):
    """Spotify OAuth tokens model."""

    access_token: str
    refresh_token: Optional[str] = None
    expires_at: Optional[int] = None


class AuthSession(BaseModel):
    """Authentication session model."""

    spotify_username: str
    tokens: SpotifyTokens


class TrackIdRequest(BaseModel):
    """Request model for operations requiring a track ID."""

    track_id: str
