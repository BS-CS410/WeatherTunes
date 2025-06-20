"""Alternative recommendation service using Spotify Search API instead of Recommendations API."""

import logging
import random
from typing import Any, Dict, List, Optional

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

from app.config import SpotifyConfig

logger = logging.getLogger(__name__)


class SearchBasedRecommendationService:
    """Get music recommendations using Spotify Search API instead of Recommendations API."""

    def __init__(self):
        self.spotify_config = SpotifyConfig()

    def get_weather_recommendations(
        self,
        weather_condition: str,
        temperature: float,
        time_of_day: str,
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        """Get weather-based recommendations using search queries."""
        try:
            # Create Spotify client
            client_credentials_manager = SpotifyClientCredentials(
                client_id=self.spotify_config.CLIENT_ID,
                client_secret=self.spotify_config.CLIENT_SECRET,
            )
            sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

            # Generate search queries based on weather
            search_queries = self._generate_weather_queries(
                weather_condition, temperature, time_of_day
            )

            tracks = []
            tracks_per_query = max(1, limit // len(search_queries))

            for query in search_queries:
                try:
                    logger.info(f"Searching for: {query}")
                    results = sp.search(
                        q=query, type="track", limit=tracks_per_query * 2
                    )  # Get extra to filter

                    if results and "tracks" in results and results["tracks"]["items"]:
                        # Filter and format tracks
                        for track in results["tracks"]["items"]:
                            if len(tracks) >= limit:
                                break

                            # Skip tracks without album art
                            if not track["album"]["images"]:
                                continue

                            formatted_track = self._format_track(track)
                            if formatted_track and formatted_track not in tracks:
                                tracks.append(formatted_track)

                except Exception as e:
                    logger.warning(f"Search query '{query}' failed: {e}")
                    continue

            # Shuffle to mix results from different queries
            random.shuffle(tracks)

            logger.info(
                f"Generated {len(tracks)} tracks using search-based recommendations"
            )
            return tracks[:limit]

        except Exception as e:
            logger.error(f"Search-based recommendation failed: {e}")
            return []

    def _generate_weather_queries(
        self, condition: str, temperature: float, time_of_day: str
    ) -> List[str]:
        """Generate search queries based on weather conditions."""
        base_queries = []

        # Weather-based queries
        condition_lower = condition.lower()

        if "clear" in condition_lower or "sunny" in condition_lower:
            base_queries.extend(
                [
                    "sunny day pop",
                    "feel good music",
                    "upbeat happy songs",
                    "summer hits",
                    "positive vibes",
                ]
            )
        elif "rain" in condition_lower:
            base_queries.extend(
                [
                    "rainy day music",
                    "cozy indie folk",
                    "acoustic peaceful",
                    "melancholic beautiful",
                    "coffee shop ambient",
                ]
            )
        elif "cloud" in condition_lower:
            base_queries.extend(
                [
                    "chill indie alternative",
                    "mellow atmospheric",
                    "contemplative music",
                    "soft rock ballads",
                ]
            )
        elif "snow" in condition_lower:
            base_queries.extend(
                [
                    "winter ambient",
                    "peaceful instrumental",
                    "cozy acoustic",
                    "warm indie folk",
                ]
            )
        else:
            # Default queries
            base_queries.extend(
                [
                    "popular music 2024",
                    "indie pop hits",
                    "alternative rock",
                    "electronic chill",
                ]
            )

        # Temperature adjustments
        if temperature > 25:  # Hot
            base_queries.extend(["tropical house", "beach party", "summer electronic"])
        elif temperature < 10:  # Cold
            base_queries.extend(["warm acoustic", "cozy jazz", "intimate folk"])

        # Time of day adjustments
        if time_of_day == "morning":
            base_queries.extend(["morning motivation", "energetic start"])
        elif time_of_day == "evening":
            base_queries.extend(["evening chill", "relaxing sunset"])
        elif time_of_day == "night":
            base_queries.extend(["late night ambient", "nocturnal vibes"])

        # Ensure we have enough variety
        return base_queries[:8]  # Limit to reasonable number

    def _format_track(self, track: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Format Spotify track data for frontend consumption."""
        try:
            return {
                "id": track["id"],
                "title": track["name"],
                "artist": ", ".join([artist["name"] for artist in track["artists"]]),
                "albumArt": track["album"]["images"][0]["url"]
                if track["album"]["images"]
                else "",
                "album": track["album"]["name"],
                "preview_url": track.get("preview_url"),
                "external_urls": track["external_urls"],
                "popularity": track.get("popularity", 0),
                "duration_ms": track.get("duration_ms", 0),
            }
        except Exception as e:
            logger.error(f"Failed to format track: {e}")
            return None


# Create singleton instance
search_recommendation_service = SearchBasedRecommendationService()
