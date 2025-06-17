"""Music recommendation service using Spotify API."""

import logging
from typing import Any, Dict, List, Optional, Union

import spotipy
from spotipy.oauth2 import SpotifyOAuth

from app.config import SpotifyConfig

logger = logging.getLogger(__name__)


class RecommendationService:
    """Handles music recommendations based on user listening history."""

    def __init__(self) -> None:
        """Initialize recommendation service."""
        self.spotify_config = SpotifyConfig()

    def recommend_from_history(
        self, seed_track_ids: List[str], access_token: str, limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get music recommendations based on seed tracks.

        Args:
            seed_track_ids: List of Spotify track IDs to use as seeds
            access_token: Spotify access token
            limit: Maximum number of recommendations

        Returns:
            List of recommended track dictionaries
        """
        try:
            if not seed_track_ids:
                logger.warning("No seed tracks provided for recommendations")
                return []

            # Limit seed tracks to Spotify API maximum (5)
            seed_tracks = seed_track_ids[:5]

            sp = spotipy.Spotify(auth=access_token)

            # Get recommendations
            recommendations = sp.recommendations(seed_tracks=seed_tracks, limit=limit)

            if not recommendations or "tracks" not in recommendations:
                logger.warning("No recommendations returned from Spotify API")
                return []

            # Format track data
            tracks = []
            for track in recommendations["tracks"]:
                track_data = {
                    "id": track["id"],
                    "name": track["name"],
                    "artists": [artist["name"] for artist in track["artists"]],
                    "album": track["album"]["name"],
                    "preview_url": track.get("preview_url"),
                    "external_urls": track["external_urls"],
                    "popularity": track.get("popularity", 0),
                }
                tracks.append(track_data)

            logger.info(
                f"Generated {len(tracks)} recommendations from {len(seed_tracks)} seed tracks"
            )
            return tracks

        except spotipy.SpotifyException as e:
            logger.error(f"Spotify API error: {e}")
            return []
        except Exception as e:
            logger.error(f"Recommendation service error: {e}")
            return []

    def get_user_top_tracks(
        self, access_token: str, limit: int = 20, time_range: str = "medium_term"
    ) -> List[Dict[str, Any]]:
        """Get user's top tracks for use as recommendation seeds.

        Args:
            access_token: Spotify access token
            limit: Maximum number of top tracks
            time_range: Time range for top tracks ('short_term', 'medium_term', 'long_term')

        Returns:
            List of top track dictionaries
        """
        try:
            sp = spotipy.Spotify(auth=access_token)

            results = sp.current_user_top_tracks(limit=limit, time_range=time_range)

            if not results or "items" not in results:
                logger.warning("No top tracks returned from Spotify API")
                return []

            tracks = []
            for track in results["items"]:
                track_data = {
                    "id": track["id"],
                    "name": track["name"],
                    "artists": [artist["name"] for artist in track["artists"]],
                    "album": track["album"]["name"],
                    "popularity": track.get("popularity", 0),
                }
                tracks.append(track_data)

            return tracks

        except spotipy.SpotifyException as e:
            logger.error(f"Spotify API error getting top tracks: {e}")
            return []
        except Exception as e:
            logger.error(f"Top tracks service error: {e}")
            return []


# Create singleton instance
recommendation_service = RecommendationService()
