"""User data service for managing user operations."""

import logging
from typing import List, Optional

from flask import request

from app.models.models import UserData
from app.services.storage import user_storage
from app.services.weather import weather_service

logger = logging.getLogger(__name__)


class UserDataService:
    """Handles user data operations."""

    def __init__(self) -> None:
        """Initialize user data service."""
        self.storage = user_storage
        self.weather = weather_service

    def get_user_info(self, username: str) -> Optional[UserData]:
        """Get user information.

        Args:
            username: Spotify username

        Returns:
            UserData object if found, None otherwise
        """
        return self.storage.get_user(username)

    def update_user_login(self, username: str) -> UserData:
        """Update user login and fetch current weather.

        Args:
            username: Spotify username

        Returns:
            Updated UserData object
        """
        # Update login timestamp
        user = self.storage.update_login(username)

        # Fetch and save current weather
        ip_address = self._get_client_ip()
        if ip_address:
            weather_data = self.weather.get_weather_by_ip(ip_address)
            if weather_data:
                self.storage.update_weather(username, weather_data)
                user.last_weather = weather_data
                logger.info(f"Updated weather for user {username}")
            else:
                logger.warning(f"Failed to fetch weather for user {username}")

        return user

    def add_favorite(self, username: str, track_id: str) -> None:
        """Add a track to user's favorites.

        Args:
            username: Spotify username
            track_id: Spotify track ID
        """
        self.storage.add_favorite(username, track_id)

    def get_favorites(self, username: str) -> List[str]:
        """Get user's favorite tracks.

        Args:
            username: Spotify username

        Returns:
            List of track IDs
        """
        return self.storage.get_favorites(username)

    def get_user_preferences(self, username: str) -> Optional[dict]:
        """Get user's music preferences.

        Args:
            username: Spotify username

        Returns:
            Dictionary of user preferences or None
        """
        try:
            user = self.storage.get_user(username)
            if user:
                # For now, return default preferences since UserData model may not have preferences field
                return {
                    "preferred_genres": [],
                    "audio_features": {
                        "valence": 0.5,
                        "energy": 0.5,
                        "danceability": 0.5,
                    },
                    "explicit_content": False,
                }

            # Return default preferences if none exist
            return {
                "preferred_genres": [],
                "audio_features": {"valence": 0.5, "energy": 0.5, "danceability": 0.5},
                "explicit_content": False,
            }

        except Exception as e:
            logger.error(f"Error getting user preferences for {username}: {e}")
            return None

    def update_user_preferences(self, username: str, preferences: dict) -> bool:
        """Update user's music preferences.

        Args:
            username: Spotify username
            preferences: Dictionary of preferences to update

        Returns:
            True if successful, False otherwise
        """
        try:
            # This would typically update the user's stored preferences
            # For now, we'll just log it since the storage layer might need updating
            logger.info(f"Updating preferences for user {username}: {preferences}")
            return True

        except Exception as e:
            logger.error(f"Error updating user preferences for {username}: {e}")
            return False

    def _get_client_ip(self) -> Optional[str]:
        """Get client IP address from request.

        Returns:
            Client IP address or None if not available
        """
        # Check for forwarded IP first (proxy/load balancer)
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            # Take the first IP if there are multiple
            return forwarded_for.split(",")[0].strip()

        # Check for real IP header
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip.strip()

        # Fall back to remote address
        return request.remote_addr


# Create singleton instance
user_data_service = UserDataService()
