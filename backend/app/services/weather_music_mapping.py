"""
Enhanced weather-to-music mapping service for Spotify recommendations.
Provides comprehensive mapping from weather conditions to audio features and genres.
"""

import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class WeatherMusicMapper:
    """Maps weather conditions to Spotify audio features and genres using comprehensive rules."""

    # Comprehensive weather-to-music mapping
    WEATHER_MAPPINGS = {
        # Clear/Sunny Weather
        "clear sky": {
            "genres": ["pop", "indie-pop", "tropical", "summer", "funk"],
            "audio_features": {
                "valence": 0.7,  # High happiness
                "energy": 0.8,  # High energy
                "danceability": 0.7,  # Danceable
                "acousticness": 0.3,  # More electric
                "tempo": 120,  # Upbeat tempo
            },
            "keywords": ["happy", "upbeat", "sunny", "bright", "energetic"],
        },
        "sunny": {
            "genres": ["pop", "reggae", "tropical", "beach", "surf"],
            "audio_features": {
                "valence": 0.8,
                "energy": 0.7,
                "danceability": 0.8,
                "acousticness": 0.4,
                "tempo": 115,
            },
            "keywords": ["sunshine", "beach", "summer", "warm", "tropical"],
        },
        "clear": {
            "genres": ["pop", "indie-pop", "tropical", "summer", "funk"],
            "audio_features": {
                "valence": 0.7,
                "energy": 0.8,
                "danceability": 0.7,
                "acousticness": 0.3,
                "tempo": 120,
            },
            "keywords": ["happy", "upbeat", "sunny", "bright", "energetic"],
        },
        # Cloudy Weather
        "cloudy": {
            "genres": ["indie", "alternative", "folk", "ambient", "chill"],
            "audio_features": {
                "valence": 0.5,  # Neutral mood
                "energy": 0.4,  # Lower energy
                "danceability": 0.4,  # Less danceable
                "acousticness": 0.6,  # More acoustic
                "tempo": 100,  # Moderate tempo
            },
            "keywords": ["contemplative", "mellow", "cloudy", "overcast", "thoughtful"],
        },
        "broken clouds": {
            "genres": ["indie-rock", "alternative", "folk-rock", "ambient"],
            "audio_features": {
                "valence": 0.6,
                "energy": 0.5,
                "danceability": 0.5,
                "acousticness": 0.5,
                "tempo": 105,
            },
            "keywords": ["partly cloudy", "mixed", "changing", "dynamic"],
        },
        "overcast": {
            "genres": ["indie", "alternative", "folk", "ambient"],
            "audio_features": {
                "valence": 0.4,
                "energy": 0.3,
                "danceability": 0.3,
                "acousticness": 0.7,
                "tempo": 95,
            },
            "keywords": ["overcast", "gray", "contemplative", "subdued"],
        },
        # Rainy Weather
        "rain": {
            "genres": ["jazz", "blues", "ambient", "neo-soul", "lo-fi"],
            "audio_features": {
                "valence": 0.3,  # Lower happiness
                "energy": 0.3,  # Low energy
                "danceability": 0.3,  # Not very danceable
                "acousticness": 0.7,  # More acoustic
                "instrumentalness": 0.4,  # Some instrumental
                "tempo": 80,  # Slower tempo
            },
            "keywords": [
                "rain",
                "melancholy",
                "contemplative",
                "cozy",
                "introspective",
            ],
        },
        "drizzle": {
            "genres": ["ambient", "chillout", "downtempo", "indie-folk"],
            "audio_features": {
                "valence": 0.4,
                "energy": 0.2,
                "danceability": 0.2,
                "acousticness": 0.8,
                "instrumentalness": 0.5,
                "tempo": 70,
            },
            "keywords": ["drizzle", "soft", "gentle", "peaceful", "calm"],
        },
        "shower rain": {
            "genres": ["jazz", "blues", "ambient", "neo-soul"],
            "audio_features": {
                "valence": 0.3,
                "energy": 0.4,
                "danceability": 0.3,
                "acousticness": 0.6,
                "instrumentalness": 0.3,
                "tempo": 85,
            },
            "keywords": ["shower", "refreshing", "cleansing", "rhythmic"],
        },
        # Storm Weather
        "thunderstorm": {
            "genres": ["rock", "metal", "electronic", "dark-ambient", "industrial"],
            "audio_features": {
                "valence": 0.2,  # Low happiness
                "energy": 0.9,  # Very high energy
                "danceability": 0.6,  # Moderately danceable
                "acousticness": 0.1,  # Very electric
                "tempo": 140,  # Fast tempo
            },
            "keywords": ["storm", "intense", "dramatic", "powerful", "electric"],
        },
        "storm": {
            "genres": ["rock", "metal", "electronic", "dark-ambient"],
            "audio_features": {
                "valence": 0.2,
                "energy": 0.9,
                "danceability": 0.6,
                "acousticness": 0.1,
                "tempo": 140,
            },
            "keywords": ["storm", "intense", "dramatic", "powerful"],
        },
        # Snow Weather
        "snow": {
            "genres": ["classical", "ambient", "folk", "winter", "acoustic"],
            "audio_features": {
                "valence": 0.6,  # Peaceful happiness
                "energy": 0.2,  # Very low energy
                "danceability": 0.2,  # Not danceable
                "acousticness": 0.9,  # Very acoustic
                "instrumentalness": 0.6,  # More instrumental
                "tempo": 60,  # Very slow tempo
            },
            "keywords": ["snow", "winter", "peaceful", "serene", "crystalline"],
        },
        "light snow": {
            "genres": ["classical", "ambient", "folk", "acoustic"],
            "audio_features": {
                "valence": 0.7,
                "energy": 0.25,
                "danceability": 0.25,
                "acousticness": 0.85,
                "instrumentalness": 0.5,
                "tempo": 65,
            },
            "keywords": ["light snow", "gentle", "floating", "delicate"],
        },
        # Fog/Mist
        "fog": {
            "genres": ["ambient", "ethereal", "shoegaze", "dream-pop", "atmospheric"],
            "audio_features": {
                "valence": 0.4,
                "energy": 0.3,
                "danceability": 0.3,
                "acousticness": 0.6,
                "instrumentalness": 0.7,  # More instrumental
                "tempo": 85,
            },
            "keywords": ["fog", "mysterious", "ethereal", "atmospheric", "dreamy"],
        },
        "mist": {
            "genres": ["ambient", "new-age", "chillout", "ethereal"],
            "audio_features": {
                "valence": 0.5,
                "energy": 0.25,
                "danceability": 0.25,
                "acousticness": 0.7,
                "instrumentalness": 0.8,
                "tempo": 75,
            },
            "keywords": ["mist", "gentle", "soft", "floating", "serene"],
        },
        # Wind
        "windy": {
            "genres": ["folk", "indie", "acoustic", "singer-songwriter"],
            "audio_features": {
                "valence": 0.5,
                "energy": 0.6,
                "danceability": 0.4,
                "acousticness": 0.7,
                "tempo": 110,
            },
            "keywords": ["wind", "flowing", "movement", "dynamic", "natural"],
        },
    }

    @classmethod
    def get_time_adjustments(cls, time_of_day: str) -> Dict[str, float]:
        """Get time-of-day adjustments for audio features."""
        adjustments = {
            "morning": {"valence": 0.1, "energy": 0.1, "tempo": 10},
            "afternoon": {"energy": 0.05, "danceability": 0.05},
            "evening": {"valence": -0.05, "energy": -0.1, "acousticness": 0.1},
            "night": {
                "valence": -0.1,
                "energy": -0.2,
                "acousticness": 0.2,
                "tempo": -20,
            },
        }
        return adjustments.get(time_of_day, {})

    @classmethod
    def get_temperature_adjustments(cls, temp_celsius: float) -> Dict[str, float]:
        """Get temperature adjustments for audio features."""
        if temp_celsius >= 25:
            # Hot weather - more energetic, tropical
            return {"valence": 0.1, "energy": 0.1, "danceability": 0.1, "tempo": 10}
        if temp_celsius >= 15:
            # Mild weather - no major adjustments
            return {}
        if temp_celsius >= 0:
            # Cold weather - more contemplative
            return {"valence": -0.05, "energy": -0.1, "acousticness": 0.1, "tempo": -10}
        # Very cold - much more contemplative and acoustic
        return {"valence": -0.1, "energy": -0.2, "acousticness": 0.2, "tempo": -20}

    @classmethod
    def get_recommendation_params(
        cls,
        weather_condition: str,
        temperature: float = 20,
        time_of_day: str = "afternoon",
    ) -> Dict[str, Any]:
        """
        Get Spotify recommendation parameters for weather conditions.

        Returns:
            Dictionary with genres, audio_features, and keywords
        """
        normalized_condition = weather_condition.lower().strip()

        # Find the best matching weather condition
        mapping = cls.WEATHER_MAPPINGS.get(normalized_condition)

        # Fallback to partial matches
        if not mapping:
            for condition_key in cls.WEATHER_MAPPINGS:
                if (
                    normalized_condition in condition_key
                    or condition_key in normalized_condition
                ):
                    mapping = cls.WEATHER_MAPPINGS[condition_key]
                    break

            # Final fallback
            if not mapping:
                mapping = cls.WEATHER_MAPPINGS["cloudy"]

        # Apply time and temperature adjustments
        time_adjustments = cls.get_time_adjustments(time_of_day)
        temp_adjustments = cls.get_temperature_adjustments(temperature)

        adjusted_features = mapping["audio_features"].copy()

        # Apply adjustments with bounds checking
        for key, adjustment in {**time_adjustments, **temp_adjustments}.items():
            if key in adjusted_features:
                current_value = adjusted_features[key]
                if key == "tempo":
                    adjusted_features[key] = max(
                        50, min(200, current_value + adjustment)
                    )
                else:
                    adjusted_features[key] = max(
                        0.0, min(1.0, current_value + adjustment)
                    )

        logger.info(
            f"Generated recommendation params for {weather_condition} at {temperature}°C "
            f"during {time_of_day}: {adjusted_features}"
        )

        return {
            "genres": mapping["genres"],
            "audio_features": adjusted_features,
            "keywords": mapping["keywords"],
        }

    @classmethod
    def get_spotify_audio_features(
        cls,
        weather_condition: str,
        temperature: float = 20,
        time_of_day: str = "afternoon",
    ) -> Dict[str, float]:
        """
        Get audio features formatted for Spotify's recommendations API.

        Returns:
            Dictionary of audio features ready for Spotify API
        """
        params = cls.get_recommendation_params(
            weather_condition, temperature, time_of_day
        )
        return params["audio_features"]

    @classmethod
    def get_seed_genres(
        cls,
        weather_condition: str,
        user_preferences: Optional[Dict[str, Any]] = None,
        limit: int = 5,
    ) -> List[str]:
        """
        Get seed genres for Spotify recommendations.

        Args:
            weather_condition: Current weather condition
            user_preferences: User's preferred genres (optional)
            limit: Maximum number of genres (Spotify limit is 5)

        Returns:
            List of genre strings
        """
        params = cls.get_recommendation_params(weather_condition)
        weather_genres = params["genres"]

        # Combine with user preferences if available
        if user_preferences and "genres" in user_preferences:
            user_genres = user_preferences["genres"]
            # Prioritize weather genres but include user preferences
            combined_genres = weather_genres + [
                g for g in user_genres if g not in weather_genres
            ]
            return combined_genres[:limit]

        return weather_genres[:limit]
