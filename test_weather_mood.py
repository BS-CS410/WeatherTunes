"""Test the weather mood matching system."""

import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

from app.services.weather_mood import WeatherMoodService


def test_get_weather_moods():
    """Test weather mood mapping."""
    # Test sunny weather
    moods = WeatherMoodService.get_weather_moods("sunny", 25, "afternoon")
    assert "happy" in moods
    assert "upbeat" in moods
    assert "energetic" in moods

    # Test rainy weather
    moods = WeatherMoodService.get_weather_moods("rainy", 15, "evening")
    assert "calm" in moods
    assert "acoustic" in moods


def test_calculate_mood_match_score():
    """Test mood matching score calculation."""
    track_moods = ["happy", "upbeat", "energetic"]
    weather_moods = {"happy", "upbeat", "energetic", "danceable"}

    score = WeatherMoodService.calculate_mood_match_score(track_moods, weather_moods)
    assert score > 0.5  # Should have good match

    # Test no match
    track_moods = ["sad", "melancholy"]
    weather_moods = {"happy", "upbeat"}

    score = WeatherMoodService.calculate_mood_match_score(track_moods, weather_moods)
    assert score == 0.0  # No matching moods


def test_filter_tracks_by_weather():
    """Test filtering tracks by weather mood match."""
    tracks_with_moods = [
        {"id": "1", "title": "Happy Song", "mood_tags": ["happy", "upbeat"]},
        {"id": "2", "title": "Sad Song", "mood_tags": ["sad", "melancholy"]},
        {"id": "3", "title": "Energetic Song", "mood_tags": ["energetic", "danceable"]},
    ]

    filtered = WeatherMoodService.filter_tracks_by_weather(
        tracks_with_moods, "sunny", 25, "afternoon", min_score=0.1
    )

    # Should have tracks that match sunny weather (happy, upbeat, energetic)
    assert len(filtered) >= 2
    assert (
        filtered[0]["mood_match_score"] >= filtered[1]["mood_match_score"]
    )  # Sorted by score


if __name__ == "__main__":
    print("Testing WeatherMoodService...")
    test_get_weather_moods()
    print("✓ Weather mood mapping works")

    test_calculate_mood_match_score()
    print("✓ Mood score calculation works")

    test_filter_tracks_by_weather()
    print("✓ Track filtering by weather works")

    print("All tests passed! Weather-based mood matching system is working.")
