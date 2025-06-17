"""Unified storage service for user data management."""

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

from app.config import Paths
from app.models.models import UserData, WeatherData

logger = logging.getLogger(__name__)


class UserDataStorage:
    """Manages user data storage operations."""

    def __init__(self, data_file: Path = Paths.USER_DATA_FILE) -> None:
        """Initialize storage with data file path.

        Args:
            data_file: Path to the user data file
        """
        self.data_file = data_file
        self._ensure_data_dir()

    def _ensure_data_dir(self) -> None:
        """Ensure data directory exists."""
        self.data_file.parent.mkdir(parents=True, exist_ok=True)

    def _read_data(self) -> Dict[str, Dict]:
        """Read user data from file.

        Returns:
            Dictionary containing all user data
        """
        try:
            if not self.data_file.exists():
                return {}

            with open(self.data_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            logger.error(f"Failed to read user data: {e}")
            return {}

    def _write_data(self, data: Dict[str, Dict]) -> None:
        """Write user data to file.

        Args:
            data: Dictionary containing all user data
        """
        try:
            with open(self.data_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, default=str)
        except IOError as e:
            logger.error(f"Failed to write user data: {e}")
            raise

    def get_user(self, username: str) -> Optional[UserData]:
        """Get user data by username.

        Args:
            username: Spotify username

        Returns:
            UserData object if found, None otherwise
        """
        data = self._read_data()
        user_dict = data.get(username)

        if not user_dict:
            return None

        # Parse weather data if present
        weather = None
        if user_dict.get("last_weather"):
            weather_dict = user_dict["last_weather"]
            weather = WeatherData(
                location=weather_dict["location"],
                temperature=weather_dict["temperature"],
                condition=weather_dict["condition"],
                time_period=weather_dict["time_period"],
            )

        return UserData(
            username=username,
            created_at=datetime.fromisoformat(user_dict["created_at"]),
            last_login=datetime.fromisoformat(user_dict["last_login"]),
            last_weather=weather,
            favorites=user_dict.get("favorites", []),
        )

    def create_user(self, username: str) -> UserData:
        """Create a new user.

        Args:
            username: Spotify username

        Returns:
            Created UserData object
        """
        now = datetime.utcnow()
        user = UserData(username=username, created_at=now, last_login=now, favorites=[])

        self._save_user(user)
        return user

    def update_login(self, username: str) -> UserData:
        """Update user's last login time.

        Args:
            username: Spotify username

        Returns:
            Updated UserData object
        """
        user = self.get_user(username)
        if not user:
            user = self.create_user(username)
        else:
            user.last_login = datetime.utcnow()
            self._save_user(user)

        return user

    def update_weather(self, username: str, weather: WeatherData) -> None:
        """Update user's weather data.

        Args:
            username: Spotify username
            weather: Weather data to save
        """
        user = self.get_user(username)
        if not user:
            user = self.create_user(username)

        user.last_weather = weather
        self._save_user(user)

    def add_favorite(self, username: str, track_id: str) -> None:
        """Add a track to user's favorites.

        Args:
            username: Spotify username
            track_id: Spotify track ID
        """
        user = self.get_user(username)
        if not user:
            user = self.create_user(username)

        if user.favorites and track_id not in user.favorites:
            user.favorites.append(track_id)
            self._save_user(user)
        elif not user.favorites:
            user.favorites = [track_id]
            self._save_user(user)

    def get_favorites(self, username: str) -> List[str]:
        """Get user's favorite tracks.

        Args:
            username: Spotify username

        Returns:
            List of track IDs
        """
        user = self.get_user(username)
        return user.favorites if (user and user.favorites) else []

    def _save_user(self, user: UserData) -> None:
        """Save user data to storage.

        Args:
            user: UserData object to save
        """
        data = self._read_data()

        user_dict = {
            "created_at": user.created_at.isoformat(),
            "last_login": user.last_login.isoformat(),
            "favorites": user.favorites,
            "last_weather": {},
        }

        if user.last_weather:
            user_dict["last_weather"] = {
                "location": user.last_weather.location,
                "temperature": user.last_weather.temperature,
                "condition": user.last_weather.condition,
                "time_period": user.last_weather.time_period,
            }

        data[user.username] = user_dict
        self._write_data(data)


# Create singleton instance
user_storage = UserDataStorage()
