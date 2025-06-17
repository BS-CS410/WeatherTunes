"""Weather service for fetching location-based weather data."""

import logging
from typing import Optional

import requests

from app.config import WeatherConfig
from app.models.models import WeatherData
from app.services.storage import user_storage

logger = logging.getLogger(__name__)


class WeatherService:
    """Handles weather data fetching and processing."""

    def __init__(self) -> None:
        """Initialize weather service."""
        self.geo_api_url = WeatherConfig.GEO_API_URL
        self.weather_base_url = WeatherConfig.BASE_URL
        self.api_key = WeatherConfig.API_KEY

    def get_weather_by_ip(self, ip_address: str) -> Optional[WeatherData]:
        """Fetch weather data based on IP address geolocation.

        Args:
            ip_address: IP address to get location for

        Returns:
            WeatherData object if successful, None otherwise
        """
        try:
            # Handle local development
            if ip_address in ("127.0.0.1", "localhost"):
                ip_address = "8.8.8.8"  # Fallback to Google DNS for testing

            logger.info(f"Fetching weather for IP: {ip_address}")

            # Get geolocation
            geo_data = self._fetch_geolocation(ip_address)
            if not geo_data:
                return None

            # Get weather data
            weather_data = self._fetch_weather(geo_data["lat"], geo_data["lon"])
            if not weather_data:
                return None

            return WeatherData(
                location=f"{geo_data['city']}, {geo_data['regionName']}",
                temperature=weather_data["main"]["temp"],
                condition=weather_data["weather"][0]["main"],
                time_period="day"
                if weather_data["weather"][0]["icon"].endswith("d")
                else "night",
            )

        except Exception as e:
            logger.error(f"Weather fetch failed: {e}")
            return None

    def _fetch_geolocation(self, ip_address: str) -> Optional[dict]:
        """Fetch geolocation data for IP address.

        Args:
            ip_address: IP address to lookup

        Returns:
            Geolocation data if successful, None otherwise
        """
        try:
            response = requests.get(f"{self.geo_api_url}/{ip_address}", timeout=10)
            response.raise_for_status()

            geo_data = response.json()
            if geo_data.get("status") != "success":
                logger.warning(
                    f"Geolocation failed: {geo_data.get('message', 'Unknown error')}"
                )
                return None

            return geo_data

        except requests.RequestException as e:
            logger.error(f"Geolocation API request failed: {e}")
            return None

    def _fetch_weather(self, lat: float, lon: float) -> Optional[dict]:
        """Fetch weather data for coordinates.

        Args:
            lat: Latitude
            lon: Longitude

        Returns:
            Weather data if successful, None otherwise
        """
        if not self.api_key:
            logger.error("OpenWeather API key not configured")
            return None

        try:
            weather_url = (
                f"{self.weather_base_url}?lat={lat}&lon={lon}"
                f"&units=metric&appid={self.api_key}"
            )

            response = requests.get(weather_url, timeout=10)
            response.raise_for_status()

            return response.json()

        except requests.RequestException as e:
            logger.error(f"Weather API request failed: {e}")
            return None

    def save_weather_data(self, username: str, weather: WeatherData) -> None:
        """Save weather data for a user.

        Args:
            username: Spotify username
            weather: Weather data to save
        """
        user_storage.update_weather(username, weather)


# Create singleton instance
weather_service = WeatherService()
