"""Advanced music recommendation service with caching and personalization."""

import json
import logging
import time
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple, Union

import spotipy
from spotipy.oauth2 import SpotifyOAuth

from app.config import SpotifyConfig
from app.services.recommendation import RecommendationService
from app.services.weather_mood import WeatherMoodService

logger = logging.getLogger(__name__)


class CacheManager:
    """Simple in-memory cache for Spotify API responses."""

    def __init__(self, ttl_seconds: int = 1800):  # 30 minutes default TTL
        self.cache: Dict[str, Tuple[object, float]] = {}
        self.ttl = ttl_seconds

    def get(self, key: str) -> Optional[object]:
        """Get cached value if not expired."""
        if key in self.cache:
            value, timestamp = self.cache[key]
            if time.time() - timestamp < self.ttl:
                return value
            # Remove expired entry
            del self.cache[key]
        return None

    def set(self, key: str, value: object) -> None:
        """Set cached value with current timestamp."""
        self.cache[key] = (value, time.time())

    def clear_expired(self) -> None:
        current_time = time.time()
        expired_keys = [
            key
            for key, (_, timestamp) in self.cache.items()
            if current_time - timestamp >= self.ttl
        ]
        for key in expired_keys:
            del self.cache[key]


class AdvancedRecommendationService:
    """Enhanced recommendation service with caching, personalization, and advanced algorithms."""

    def __init__(self):
        self.spotify_config = SpotifyConfig()
        self.cache = CacheManager(ttl_seconds=1800)  # 30 minute cache
        self.user_cache = CacheManager(ttl_seconds=3600)  # 1 hour for user data

    def get_personalized_weather_recommendations(
        self,
        weather_condition: str,
        temperature: float,
        time_of_day: str,
        access_token: str,
        user_id: str,
        user_preferences: Optional[Dict[str, Any]] = None,
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        """Get personalized music recommendations based on weather and user preferences.

        Args:
            weather_condition: Weather condition (sunny, rainy, cloudy, etc.)
            temperature: Temperature in Celsius
            time_of_day: Time of day (morning, afternoon, evening, night)
            access_token: Spotify access token
            user_id: Unique user identifier
            user_preferences: User's music preferences
            limit: Maximum number of recommendations

        Returns:
            List of recommended track dictionaries with mood scores
        """
        # Create cache key for this specific request
        cache_key = f"weather_rec_{user_id}_{weather_condition}_{temperature:.1f}_{time_of_day}_{limit}"

        # Try to get from cache first
        cached_result = self.cache.get(cache_key)
        if cached_result:
            logger.info(f"Returning cached weather recommendations for {user_id}")
            # If cache is a dict with 'tracks', return the list, else return as is
            if isinstance(cached_result, dict) and "tracks" in cached_result:
                return cached_result["tracks"]
            if isinstance(cached_result, list):
                return cached_result
            return []

        try:
            sp = spotipy.Spotify(auth=access_token)

            # Get user's music profile for personalization
            user_profile = self._get_user_music_profile(sp, user_id, user_preferences)

            # Generate multiple recommendation strategies and combine them
            strategies = [
                lambda sp, wc, t, tod, up, l: self._get_audio_feature_recommendations(
                    sp, {"condition": wc, "temperature": t, "time_of_day": tod}, up, l
                ),
                lambda sp, wc, _, tod, up, l: self._get_genre_based_recommendations(
                    sp, wc, tod, up, l
                ),
                lambda sp, wc, _, tod, up, l: self._get_artist_seed_recommendations(
                    sp, wc, tod, up, l
                ),
            ]

            all_recommendations = []
            tracks_per_strategy = max(1, limit * 2 // len(strategies))

            for strategy in strategies:
                try:
                    if strategy == strategies[0]:
                        strategy_recs = strategy(
                            sp,
                            weather_condition,
                            temperature,
                            time_of_day,
                            user_profile,
                            tracks_per_strategy,
                        )
                    else:
                        strategy_recs = strategy(
                            sp,
                            weather_condition,
                            0,
                            time_of_day,
                            user_profile,
                            tracks_per_strategy,
                        )
                    all_recommendations.extend(strategy_recs)
                except Exception as e:
                    logger.warning(
                        f"Strategy failed: {getattr(strategy, '__name__', str(strategy))}: {e}"
                    )
                    continue

            # Remove duplicates
            seen_ids = set()
            unique_recommendations = []
            for track in all_recommendations:
                if track["id"] not in seen_ids:
                    seen_ids.add(track["id"])
                    unique_recommendations.append(track)

            # Add mood tags to tracks and filter by weather mood match
            mood_filtered_tracks = self._add_mood_tags_and_filter(
                sp,
                unique_recommendations,
                {
                    "condition": weather_condition,
                    "temperature": temperature,
                    "time_of_day": time_of_day,
                },
            )

            # If we don't have enough mood-matched recommendations, add fallback
            if len(mood_filtered_tracks) < limit // 2:
                try:
                    fallback_recs = self._get_fallback_recommendations(
                        sp, limit - len(mood_filtered_tracks)
                    )
                    fallback_with_moods = self._add_mood_tags_and_filter(
                        sp,
                        fallback_recs,
                        {
                            "condition": weather_condition,
                            "temperature": temperature,
                            "time_of_day": time_of_day,
                        },
                        min_score=0.1,
                    )
                    mood_filtered_tracks.extend(fallback_with_moods)
                except Exception as e:
                    logger.warning(
                        f"Spotify fallback failed: {e}, using hardcoded fallback"
                    )
                    # Use hardcoded fallback when Spotify API completely fails
                    mood_filtered_tracks.extend(self._get_simple_fallback()[:limit])

            # If we still have no tracks, use simple fallback
            if len(mood_filtered_tracks) == 0:
                logger.warning(
                    "No tracks found via any method, using hardcoded fallback"
                )
                mood_filtered_tracks = self._get_simple_fallback()[:limit]

            # Limit to requested amount
            final_tracks = mood_filtered_tracks[:limit]

            # Cache the result as a list, not a dict
            self.cache.set(cache_key, final_tracks)

            logger.info(
                f"Generated {len(final_tracks)} mood-matched recommendations for {user_id}"
            )
            logger.info(
                f"Final tracks: {[t.get('title', 'Unknown') for t in final_tracks]}"
            )
            return final_tracks

        except Exception as e:
            logger.error(f"Advanced recommendation service error: {e}")
            return self._get_simple_fallback()

    def _get_user_music_profile(
        self,
        sp: spotipy.Spotify,
        user_id: str,
        user_preferences: Optional[Dict[str, Any]],
    ) -> Dict[str, Any]:
        cache_key = f"user_profile_{user_id}"
        cached_profile = self.user_cache.get(cache_key)
        if cached_profile and isinstance(cached_profile, dict):
            return cached_profile
        profile = {
            "top_genres": [],
            "top_artists": [],
            "audio_features_avg": {},
            "preferred_time_periods": {},
            "explicit_preferences": user_preferences or {},
        }
        try:
            self._populate_top_artists_and_genres(sp, profile)
            self._populate_audio_features_avg(sp, profile)
        except Exception as e:
            logger.warning(f"Could not build complete user profile: {e}")
        self.user_cache.set(cache_key, profile)
        return profile

    def _populate_top_artists_and_genres(
        self, sp: spotipy.Spotify, profile: dict
    ) -> None:
        top_artists = sp.current_user_top_artists(limit=20, time_range="medium_term")
        if top_artists and "items" in top_artists:
            profile["top_artists"] = [
                {"id": artist["id"], "name": artist["name"]}
                for artist in top_artists["items"][:10]
            ]
            genre_counts = {}
            for artist in top_artists["items"]:
                for genre in artist.get("genres", []):
                    genre_counts[genre] = genre_counts.get(genre, 0) + 1
            profile["top_genres"] = sorted(
                genre_counts.keys(), key=lambda x: genre_counts[x], reverse=True
            )[:10]

    def _populate_audio_features_avg(self, sp: spotipy.Spotify, profile: dict) -> None:
        top_tracks = sp.current_user_top_tracks(limit=50, time_range="medium_term")
        if top_tracks and "items" in top_tracks:
            track_ids = [track["id"] for track in top_tracks["items"]]
            audio_features = sp.audio_features(track_ids)
            if audio_features:
                features_sum = {}
                valid_tracks = 0
                for features in audio_features:
                    if features:
                        valid_tracks += 1
                        for key in [
                            "valence",
                            "energy",
                            "danceability",
                            "acousticness",
                            "instrumentalness",
                        ]:
                            features_sum[key] = features_sum.get(key, 0) + features.get(
                                key, 0
                            )
                if valid_tracks > 0:
                    profile["audio_features_avg"] = {
                        key: value / valid_tracks for key, value in features_sum.items()
                    }

    def _get_audio_feature_recommendations(
        self,
        sp: spotipy.Spotify,
        weather: dict,
        user_profile: Dict[str, Any],
        limit: int,
    ) -> List[Dict[str, Any]]:
        """Get recommendations based on audio features matching weather and user preferences."""
        # Get weather-based audio features
        weather_features = self._get_enhanced_weather_audio_features(
            weather["condition"], weather["temperature"], weather["time_of_day"]
        )

        # Blend with user's preferred audio features
        user_audio_features = user_profile.get("audio_features_avg", {})
        blended_features = self._blend_audio_features(
            weather_features, user_audio_features
        )

        # Use top genres as seeds
        seed_genres = user_profile.get("top_genres", ["pop", "indie"])[:5]

        try:
            recommendations = sp.recommendations(
                seed_genres=seed_genres, limit=limit, **blended_features
            )

            if recommendations and "tracks" in recommendations:
                return self._format_tracks(recommendations["tracks"])
            return []
        except Exception as e:
            logger.warning(f"Audio feature recommendations failed: {e}")
            return []

    def _get_genre_based_recommendations(
        self,
        sp: spotipy.Spotify,
        weather_condition: str,
        time_of_day: str,
        user_profile: Dict[str, Any],
        limit: int,
    ) -> List[Dict[str, Any]]:
        """Get recommendations based on weather-appropriate genres and user preferences."""
        # Map weather to genres
        weather_genres = self._get_weather_genres(weather_condition, time_of_day)

        # Blend with user's top genres
        user_genres = user_profile.get("top_genres", [])
        combined_genres = self._combine_genres(weather_genres, user_genres)

        try:
            recommendations = sp.recommendations(
                seed_genres=combined_genres[:5], limit=limit
            )

            if recommendations and "tracks" in recommendations:
                return self._format_tracks(recommendations["tracks"])
            return []
        except Exception as e:
            logger.warning(f"Genre-based recommendations failed: {e}")
            return []

    def _get_artist_seed_recommendations(
        self,
        sp: spotipy.Spotify,
        weather_condition: str,
        time_of_day: str,
        user_profile: Dict[str, Any],
        limit: int,
    ) -> List[Dict[str, Any]]:
        """Get recommendations using user's top artists as seeds."""
        top_artists = user_profile.get("top_artists", [])
        if not top_artists:
            return []

        # Use audio features that match the weather
        weather_features = self._get_enhanced_weather_audio_features(
            weather_condition, 0, time_of_day
        )

        # Take up to 5 top artists as seeds
        seed_artists = [artist["id"] for artist in top_artists[:5]]

        try:
            recommendations = sp.recommendations(
                seed_artists=seed_artists, limit=limit, **weather_features
            )

            if recommendations and "tracks" in recommendations:
                return self._format_tracks(recommendations["tracks"])
            return []
        except Exception as e:
            logger.warning(f"Artist seed recommendations failed: {e}")
            return []

    def _get_enhanced_weather_audio_features(
        self, weather_condition: str, temperature: float, time_of_day: str
    ) -> Dict[str, float]:
        """Enhanced weather-to-audio-features mapping with more nuanced algorithms."""
        # Base features with more nuanced mapping
        weather_features = {
            "sunny": {
                "valence": 0.85,
                "energy": 0.75,
                "danceability": 0.7,
                "acousticness": 0.2,
                "instrumentalness": 0.1,
            },
            "clear": {
                "valence": 0.8,
                "energy": 0.7,
                "danceability": 0.65,
                "acousticness": 0.25,
                "instrumentalness": 0.15,
            },
            "rainy": {
                "valence": 0.3,
                "energy": 0.4,
                "acousticness": 0.7,
                "instrumentalness": 0.3,
                "danceability": 0.3,
            },
            "rain": {
                "valence": 0.35,
                "energy": 0.45,
                "acousticness": 0.65,
                "instrumentalness": 0.25,
                "danceability": 0.35,
            },
            "cloudy": {
                "valence": 0.5,
                "energy": 0.5,
                "acousticness": 0.5,
                "instrumentalness": 0.2,
                "danceability": 0.5,
            },
            "thunderstorm": {
                "valence": 0.2,
                "energy": 0.8,
                "instrumentalness": 0.4,
                "danceability": 0.4,
                "acousticness": 0.3,
            },
            "snow": {
                "valence": 0.4,
                "energy": 0.3,
                "acousticness": 0.8,
                "instrumentalness": 0.5,
                "danceability": 0.2,
            },
            "fog": {
                "valence": 0.4,
                "energy": 0.35,
                "instrumentalness": 0.6,
                "acousticness": 0.6,
                "danceability": 0.3,
            },
        }

        features = weather_features.get(
            weather_condition.lower(),
            {"valence": 0.5, "energy": 0.5, "danceability": 0.5},
        ).copy()

        # Temperature adjustments (more sophisticated)
        temp_factor = max(0, min(1, (temperature + 10) / 40))  # Normalize to 0-1
        features["energy"] = features.get("energy", 0.5) + (temp_factor - 0.5) * 0.3
        features["valence"] = features.get("valence", 0.5) + (temp_factor - 0.5) * 0.2

        # Time of day adjustments
        time_factors = {
            "morning": {"energy": 0.15, "valence": 0.1, "acousticness": -0.1},
            "afternoon": {"energy": 0.1, "danceability": 0.1},
            "evening": {"energy": -0.1, "acousticness": 0.15, "valence": -0.05},
            "night": {
                "energy": -0.25,
                "valence": -0.15,
                "acousticness": 0.25,
                "instrumentalness": 0.1,
            },
        }

        if time_of_day in time_factors:
            for feature, adjustment in time_factors[time_of_day].items():
                current = features.get(feature, 0.5)
                features[feature] = max(0.0, min(1.0, current + adjustment))

        return features

    def _blend_audio_features(
        self,
        weather_features: Dict[str, float],
        user_features: Dict[str, float],
        weather_weight: float = 0.6,
    ) -> Dict[str, float]:
        """Blend weather-based and user-preferred audio features."""
        if not user_features:
            return weather_features

        blended = {}
        for feature in [
            "valence",
            "energy",
            "danceability",
            "acousticness",
            "instrumentalness",
        ]:
            weather_val = weather_features.get(feature, 0.5)
            user_val = user_features.get(feature, 0.5)
            blended[feature] = weather_val * weather_weight + user_val * (
                1 - weather_weight
            )

        return blended

    def _get_weather_genres(
        self, weather_condition: str, time_of_day: str
    ) -> List[str]:
        """Get genres that match weather conditions and time of day."""
        weather_genre_map = {
            "sunny": ["pop", "indie-pop", "funk", "dance", "electronic"],
            "clear": ["pop", "indie", "alternative", "electronic"],
            "rainy": ["indie", "ambient", "jazz", "acoustic", "chill"],
            "rain": ["indie", "jazz", "ambient", "acoustic"],
            "cloudy": ["indie", "alternative", "folk", "acoustic"],
            "thunderstorm": ["electronic", "ambient", "post-rock", "indie"],
            "snow": ["acoustic", "folk", "ambient", "indie-folk"],
            "fog": ["ambient", "electronic", "indie", "post-rock"],
        }

        time_genre_map = {
            "morning": ["acoustic", "folk", "indie-pop", "jazz"],
            "afternoon": ["pop", "electronic", "dance", "funk"],
            "evening": ["indie", "alternative", "chill", "acoustic"],
            "night": ["ambient", "electronic", "jazz", "chill"],
        }

        weather_genres = weather_genre_map.get(
            weather_condition.lower(), ["pop", "indie"]
        )
        time_genres = time_genre_map.get(time_of_day, [])

        # Combine and prioritize
        combined = weather_genres + time_genres
        return combined

    def _combine_genres(
        self, weather_genres: List[str], user_genres: List[str]
    ) -> List[str]:
        intersection = [g for g in weather_genres if g in user_genres]
        result = intersection + [g for g in weather_genres if g not in intersection]
        result.extend([g for g in user_genres if g not in result])
        return result[:10]  # Limit to 10 genres

    def _add_mood_tags_and_filter(
        self,
        sp: spotipy.Spotify,
        tracks: List[Dict[str, Any]],
        weather: dict,
        min_score: float = 0.3,
    ) -> List[Dict[str, Any]]:
        """Add mood tags to tracks and filter by weather mood matching."""
        if not tracks:
            return []

        # Get track IDs for batch audio features request
        track_ids = [track["id"] for track in tracks]

        try:
            # Get audio features for all tracks in batch
            audio_features_list = sp.audio_features(track_ids)

            if not audio_features_list:
                return tracks

            tracks_with_moods = []
            for track, audio_features in zip(tracks, audio_features_list):
                if audio_features:
                    # Classify mood from audio features
                    mood_tags = self._classify_mood_from_audio_features(audio_features)

                    # Add mood tags to track
                    track_with_mood = {**track, "mood_tags": mood_tags}
                    tracks_with_moods.append(track_with_mood)

            # Filter by weather mood match using WeatherMoodService
            return WeatherMoodService.filter_tracks_by_weather(
                tracks_with_moods,
                weather["condition"],
                weather["temperature"],
                weather["time_of_day"],
                min_score,
            )

        except Exception as e:
            logger.warning(f"Failed to add mood tags and filter: {e}")
            # Return original tracks without mood filtering
            return tracks

    def _classify_mood_from_audio_features(self, audio_features: dict) -> List[str]:
        """Classify mood tags based on Spotify audio features."""
        mood_tags = []

        valence = audio_features.get("valence", 0.5)
        energy = audio_features.get("energy", 0.5)
        danceability = audio_features.get("danceability", 0.5)
        acousticness = audio_features.get("acousticness", 0.5)

        # Primary mood classifications
        if valence > 0.7 and energy > 0.6:
            mood_tags.extend(["happy", "upbeat", "energetic"])
        elif valence < 0.3:
            mood_tags.extend(["melancholy", "sad"])
        elif energy > 0.7:
            mood_tags.append("energetic")
        elif energy < 0.3:
            mood_tags.extend(["calm", "relaxing"])

        # Secondary characteristics
        if danceability > 0.7:
            mood_tags.append("danceable")
        if acousticness > 0.6:
            mood_tags.extend(["acoustic", "organic"])

        return list(set(mood_tags))

    def _optimize_track_order(
        self, tracks: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Optimize track order for better listening experience."""
        if not tracks:
            return tracks

        # Sort by mood match score if available, then by popularity
        return sorted(
            tracks,
            key=lambda x: (x.get("mood_match_score", 0), x.get("popularity", 0)),
            reverse=True,
        )

    def _format_tracks(self, tracks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Format Spotify track data for frontend consumption."""
        formatted = []
        for track in tracks:
            track_data = {
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
            formatted.append(track_data)
        return formatted

    def _get_fallback_recommendations(
        self, sp: spotipy.Spotify, limit: int
    ) -> List[Dict[str, Any]]:
        """Get simple fallback recommendations."""
        try:
            fallback_genres = ["pop", "indie", "alternative"]
            recommendations = sp.recommendations(
                seed_genres=fallback_genres[:3], limit=limit
            )
            if recommendations and "tracks" in recommendations:
                return self._format_tracks(recommendations["tracks"])
            return []
        except Exception:
            return []

    def _get_simple_fallback(self) -> List[Dict[str, Any]]:
        """Simple fallback when all else fails."""
        logger.warning(
            "All recommendation strategies failed, using hardcoded fallback tracks"
        )

        # Return hardcoded tracks in the correct format expected by frontend
        return [
            {
                "id": "4iV5W9uYEdYUVa79Axb7Rh",
                "title": "Never Gonna Give You Up",
                "artist": "Rick Astley",
                "albumArt": "",
                "album": "Whenever You Need Somebody",
                "preview_url": None,
                "external_urls": {
                    "spotify": "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh"
                },
                "popularity": 85,
                "duration_ms": 213000,
            },
            {
                "id": "1BxfuPKGuaTgP7aM0Bbdwr",
                "title": "Cruel Summer",
                "artist": "Taylor Swift",
                "albumArt": "",
                "album": "Lover",
                "preview_url": None,
                "external_urls": {
                    "spotify": "https://open.spotify.com/track/1BxfuPKGuaTgP7aM0Bbdwr"
                },
                "popularity": 95,
                "duration_ms": 178000,
            },
            {
                "id": "3n3Ppam7vgaVa1iaRUc9Lp",
                "title": "Mr. Brightside",
                "artist": "The Killers",
                "albumArt": "",
                "album": "Hot Fuss",
                "preview_url": None,
                "external_urls": {
                    "spotify": "https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp"
                },
                "popularity": 88,
                "duration_ms": 222000,
            },
            {
                "id": "0VjIjW4GlUZAMYd2vXMi3b",
                "title": "Blinding Lights",
                "artist": "The Weeknd",
                "albumArt": "",
                "album": "After Hours",
                "preview_url": None,
                "external_urls": {
                    "spotify": "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b"
                },
                "popularity": 92,
                "duration_ms": 200000,
            },
            {
                "id": "7qiZfU4dY1lWllzX7mPBI3",
                "title": "Shape of You",
                "artist": "Ed Sheeran",
                "albumArt": "",
                "album": "÷ (Divide)",
                "preview_url": None,
                "external_urls": {
                    "spotify": "https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3"
                },
                "popularity": 90,
                "duration_ms": 233000,
            },
        ]

    def clear_cache(self) -> None:
        """Clear all cached data."""
        self.cache.clear_expired()
        self.user_cache.clear_expired()

    def get_adaptive_playlist(
        self,
        weather: dict,
        access_token: str,
        user_id: str,
        playlist_duration_minutes: int = 60,
        user_preferences: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        """Generate an adaptive playlist with smooth transitions.

        Args:
            weather_condition: Current weather condition
            temperature: Temperature in Celsius
            time_of_day: Time of day
            access_token: Spotify access token
            user_id: User's Spotify ID
            playlist_duration_minutes: Target playlist duration in minutes
            user_preferences: User's preferences

        Returns:
            List of tracks arranged for smooth transitions
        """
        try:
            # Get a larger pool of recommendations
            recommendations = self.get_personalized_weather_recommendations(
                weather["condition"],
                weather["temperature"],
                weather["time_of_day"],
                access_token,
                user_id,
                user_preferences,
                limit=50,
            )

            if not recommendations:
                return []

            # Calculate target duration in milliseconds
            target_duration_ms = playlist_duration_minutes * 60 * 1000

            # Simple playlist creation - select tracks up to target duration
            playlist = []
            current_duration_ms = 0

            # Sort by popularity/confidence for quality
            recommendations.sort(key=lambda x: x.get("popularity", 0), reverse=True)

            for track in recommendations:
                track_duration = track.get("duration_ms", 180000)  # Default 3 minutes
                if current_duration_ms + track_duration <= target_duration_ms:
                    playlist.append(track)
                    current_duration_ms += track_duration
                else:
                    break

            logger.info(f"Created adaptive playlist with {len(playlist)} tracks")
            return playlist

        except Exception as e:
            logger.error(f"Adaptive playlist generation error: {e}")
            return []


# Create singleton instance
advanced_recommendation_service = AdvancedRecommendationService()
