"""Weather-based mood matching service for track selection."""

from typing import Dict, List, Set


class WeatherMoodService:
    """Service for matching weather conditions to track moods."""

    # Weather condition to mood mapping
    WEATHER_MOOD_MAP: Dict[str, Set[str]] = {
        "sunny": {"happy", "upbeat", "energetic", "danceable"},
        "clear": {"happy", "upbeat", "energetic"},
        "partly cloudy": {"happy", "energetic"},
        "cloudy": {"calm", "relaxing", "acoustic"},
        "overcast": {"melancholy", "calm", "acoustic"},
        "rainy": {"melancholy", "sad", "calm", "acoustic", "organic"},
        "rain": {"melancholy", "sad", "calm", "acoustic"},
        "drizzle": {"calm", "relaxing", "acoustic", "organic"},
        "thunderstorm": {"energetic", "intense"},
        "storm": {"energetic", "intense"},
        "snow": {"calm", "relaxing", "acoustic", "organic"},
        "snowy": {"calm", "relaxing", "acoustic"},
        "fog": {"calm", "acoustic", "organic"},
        "foggy": {"calm", "acoustic", "organic"},
        "mist": {"calm", "acoustic", "organic"},
        "haze": {"calm", "relaxing"},
    }

    # Temperature-based mood adjustments
    TEMP_MOOD_ADJUSTMENTS: Dict[str, Set[str]] = {
        "hot": {"energetic", "danceable", "upbeat"},  # > 25°C
        "warm": {"happy", "upbeat", "energetic"},  # 20-25°C
        "mild": {"happy", "calm"},  # 15-20°C
        "cool": {"calm", "relaxing", "acoustic"},  # 10-15°C
        "cold": {"melancholy", "calm", "acoustic"},  # < 10°C
    }

    # Time of day mood preferences
    TIME_MOOD_MAP: Dict[str, Set[str]] = {
        "morning": {"happy", "upbeat", "energetic"},
        "afternoon": {"energetic", "danceable", "upbeat"},
        "evening": {"calm", "relaxing", "acoustic"},
        "night": {"calm", "melancholy", "acoustic", "organic"},
    }

    @classmethod
    def get_weather_moods(
        cls, weather_condition: str, temperature: float, time_of_day: str = "afternoon"
    ) -> Set[str]:
        """Get preferred moods for current weather conditions."""
        moods = set()

        # Get base moods from weather condition
        weather_key = weather_condition.lower().strip()
        if weather_key in cls.WEATHER_MOOD_MAP:
            moods.update(cls.WEATHER_MOOD_MAP[weather_key])

        # Add temperature-based adjustments
        temp_category = cls._categorize_temperature(temperature)
        if temp_category in cls.TEMP_MOOD_ADJUSTMENTS:
            moods.update(cls.TEMP_MOOD_ADJUSTMENTS[temp_category])

        # Add time-based preferences
        if time_of_day in cls.TIME_MOOD_MAP:
            moods.update(cls.TIME_MOOD_MAP[time_of_day])

        return moods

    @classmethod
    def calculate_mood_match_score(
        cls, track_moods: List[str], weather_moods: Set[str]
    ) -> float:
        """Calculate how well a track's moods match the weather."""
        if not track_moods or not weather_moods:
            return 0.0

        # Calculate intersection of moods
        track_mood_set = set(track_moods)
        matching_moods = track_mood_set.intersection(weather_moods)

        # Score based on percentage of matching moods
        match_score = len(matching_moods) / len(weather_moods)

        # Bonus for having multiple matching moods
        if len(matching_moods) > 1:
            match_score *= 1.2

        # Cap at 1.0
        return min(1.0, match_score)

    @classmethod
    def filter_tracks_by_weather(
        cls,
        tracks_with_moods: List[Dict],
        weather_condition: str,
        temperature: float,
        time_of_day: str = "afternoon",
        min_score: float = 0.3,
    ) -> List[Dict]:
        """Filter and rank tracks based on weather mood matching."""
        weather_moods = cls.get_weather_moods(
            weather_condition, temperature, time_of_day
        )

        # Calculate scores and filter
        scored_tracks = []
        for item in tracks_with_moods:
            track_moods = item.get("mood_tags", [])
            score = cls.calculate_mood_match_score(track_moods, weather_moods)

            if score >= min_score:
                scored_tracks.append({**item, "mood_match_score": score})

        # Sort by score (highest first)
        scored_tracks.sort(key=lambda x: x["mood_match_score"], reverse=True)

        return scored_tracks

    @staticmethod
    def _categorize_temperature(temperature: float) -> str:
        """Categorize temperature into broad ranges."""
        if temperature > 25:
            return "hot"
        if temperature > 20:
            return "warm"
        if temperature > 15:
            return "mild"
        if temperature > 10:
            return "cool"
        return "cold"
