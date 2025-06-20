"""Music recommendation service using Spotify API."""

import logging
from typing import Any, Dict, List, Optional, Union

import spotipy
from spotipy.oauth2 import SpotifyOAuth

from app.config import SpotifyConfig
from app.services.weather_music_mapping import WeatherMusicMapper

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

    def search_tracks(
        self, query: str, access_token: str, limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Search for tracks on Spotify.

        Args:
            query: Search query string
            access_token: Spotify access token
            limit: Maximum number of results

        Returns:
            List of track dictionaries
        """
        try:
            sp = spotipy.Spotify(auth=access_token)

            results = sp.search(q=query, type="track", limit=limit)

            if (
                not results
                or "tracks" not in results
                or "items" not in results["tracks"]
            ):
                logger.warning(f"No search results for query: {query}")
                return []

            tracks = []
            for track in results["tracks"]["items"]:
                track_data = {
                    "id": track["id"],
                    "title": track[
                        "name"
                    ],  # Using 'title' to match frontend expectations
                    "artist": ", ".join(
                        [artist["name"] for artist in track["artists"]]
                    ),
                    "albumArt": track["album"]["images"][0]["url"]
                    if track["album"]["images"]
                    else "",
                    "album": track["album"]["name"],
                    "preview_url": track.get("preview_url"),
                    "external_urls": track["external_urls"],
                    "popularity": track.get("popularity", 0),
                    "duration_ms": track.get("duration_ms", 0),
                }
                tracks.append(track_data)

            logger.info(f"Found {len(tracks)} tracks for query: {query}")
            return tracks

        except spotipy.SpotifyException as e:
            logger.error(f"Spotify API error during search: {e}")
            return []
        except Exception as e:
            logger.error(f"Search service error: {e}")
            return []

    def get_weather_based_recommendations(
        self,
        weather_condition: str,
        temperature: float,
        time_of_day: str,
        access_token: str,
        user_preferences: Optional[Dict[str, Any]] = None,
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        """Get music recommendations based on weather conditions using enhanced mapping.

        Args:
            weather_condition: Weather condition (sunny, rainy, cloudy, etc.)
            temperature: Temperature in Celsius
            time_of_day: Time of day (morning, afternoon, evening, night)
            access_token: Spotify access token
            user_preferences: User's music preferences (optional)
            limit: Maximum number of recommendations

        Returns:
            List of recommended track dictionaries
        """
        try:
            sp = spotipy.Spotify(auth=access_token)

            # Use enhanced weather mapping for audio features
            weather_audio_features = WeatherMusicMapper.get_spotify_audio_features(
                weather_condition, temperature, time_of_day
            )

            # Get seed genres using enhanced mapping
            seed_genres = WeatherMusicMapper.get_seed_genres(
                weather_condition, user_preferences, limit=5
            )

            logger.info(
                f"Using enhanced mapping for {weather_condition}: "
                f"features={weather_audio_features}, genres={seed_genres}"
            )

            # Get recommendations from Spotify
            recommendations = sp.recommendations(
                seed_genres=seed_genres[:5],  # Spotify allows max 5 seeds
                limit=limit,
                **weather_audio_features,
            )

            if not recommendations or "tracks" not in recommendations:
                logger.warning(
                    "No weather-based recommendations returned from Spotify API"
                )
                return []

            # Format track data to match frontend expectations
            tracks = []
            for track in recommendations["tracks"]:
                track_data = {
                    "id": track["id"],
                    "title": track["name"],
                    "artist": ", ".join(
                        [artist["name"] for artist in track["artists"]]
                    ),
                    "albumArt": track["album"]["images"][0]["url"]
                    if track["album"]["images"]
                    else "",
                    "album": track["album"]["name"],
                    "preview_url": track.get("preview_url"),
                    "external_urls": track["external_urls"],
                    "popularity": track.get("popularity", 0),
                    "duration_ms": track.get("duration_ms", 0),
                    # Add weather context for debugging
                    "weather_context": {
                        "condition": weather_condition,
                        "temperature": temperature,
                        "time_of_day": time_of_day,
                    },
                }
                tracks.append(track_data)

            logger.info(
                f"Generated {len(tracks)} weather-based recommendations for {weather_condition} at {temperature}°C"
            )
            return tracks

        except spotipy.SpotifyException as e:
            logger.error(f"Spotify API error during weather recommendations: {e}")
            return []
        except Exception as e:
            logger.error(f"Weather recommendations service error: {e}")
            return []

    def _get_weather_audio_features(
        self, weather_condition: str, temperature: float, time_of_day: str
    ) -> Dict[str, float]:
        """Map weather conditions to Spotify audio features.

        Returns dict of audio features for Spotify recommendations API.
        """
        # Base audio features by weather condition
        weather_features = {
            "sunny": {"valence": 0.8, "energy": 0.7, "danceability": 0.6},
            "clear": {"valence": 0.8, "energy": 0.7, "danceability": 0.6},
            "rainy": {"valence": 0.3, "energy": 0.4, "acousticness": 0.7},
            "rain": {"valence": 0.3, "energy": 0.4, "acousticness": 0.7},
            "cloudy": {"valence": 0.5, "energy": 0.5, "acousticness": 0.5},
            "overcast": {"valence": 0.4, "energy": 0.4, "acousticness": 0.6},
            "thunderstorm": {"valence": 0.2, "energy": 0.8, "instrumentalness": 0.3},
            "storm": {"valence": 0.2, "energy": 0.8, "instrumentalness": 0.3},
            "snowy": {"valence": 0.4, "energy": 0.3, "acousticness": 0.8},
            "snow": {"valence": 0.4, "energy": 0.3, "acousticness": 0.8},
            "foggy": {"valence": 0.4, "energy": 0.3, "instrumentalness": 0.5},
            "fog": {"valence": 0.4, "energy": 0.3, "instrumentalness": 0.5},
        }

        # Get base features or defaults
        features = weather_features.get(
            weather_condition.lower(),
            {"valence": 0.5, "energy": 0.5, "danceability": 0.5},
        ).copy()

        # Adjust based on temperature
        if temperature > 25:  # Hot weather
            features["energy"] = min(features.get("energy", 0.5) + 0.2, 1.0)
            features["danceability"] = min(features.get("danceability", 0.5) + 0.2, 1.0)
        elif temperature < 5:  # Cold weather
            features["energy"] = max(features.get("energy", 0.5) - 0.2, 0.0)
            features["acousticness"] = min(features.get("acousticness", 0.5) + 0.3, 1.0)

        # Adjust based on time of day
        time_adjustments = {
            "morning": {"energy": 0.1, "valence": 0.1},
            "afternoon": {"energy": 0.0, "valence": 0.0},  # No adjustment
            "evening": {"energy": -0.1, "acousticness": 0.1},
            "night": {"energy": -0.2, "valence": -0.1, "acousticness": 0.2},
        }

        if time_of_day in time_adjustments:
            for feature, adjustment in time_adjustments[time_of_day].items():
                current_value = features.get(feature, 0.5)
                features[feature] = max(0.0, min(1.0, current_value + adjustment))

        return features

    def _get_seed_genres(
        self, user_preferences: Optional[Dict[str, Any]], sp: spotipy.Spotify
    ) -> List[str]:
        """Get seed genres for recommendations.

        Args:
            user_preferences: User's music preferences
            sp: Spotify client instance

        Returns:
            List of genre strings
        """
        # Default genres if no user preferences
        default_genres = ["pop", "indie", "electronic", "alternative", "chill"]

        if not user_preferences:
            return default_genres

        # Try to get user's top genres from their listening history
        try:
            # Get user's top artists to extract genres
            top_artists = sp.current_user_top_artists(
                limit=10, time_range="medium_term"
            )

            if top_artists and "items" in top_artists:
                genres = []
                for artist in top_artists["items"]:
                    genres.extend(artist.get("genres", []))

                # Return most common genres, limit to available Spotify genres
                if genres:
                    # Simple frequency count and return top genres
                    genre_counts = {}
                    for genre in genres:
                        genre_counts[genre] = genre_counts.get(genre, 0) + 1

                    sorted_genres = sorted(
                        genre_counts.keys(), key=lambda x: genre_counts[x], reverse=True
                    )
                    return sorted_genres[:5] if sorted_genres else default_genres

        except Exception as e:
            logger.warning(f"Could not get user genres: {e}")

        return default_genres


# Create singleton instance
recommendation_service = RecommendationService()
