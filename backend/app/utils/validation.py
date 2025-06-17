"""Validation utilities for request data."""

from typing import Any, Dict, List, Optional


def validate_required_fields(
    data: Dict[str, Any], required_fields: List[str]
) -> Optional[str]:
    """Validate that all required fields are present and non-empty.

    Args:
        data: Dictionary to validate
        required_fields: List of required field names

    Returns:
        Error message if validation fails, None if valid
    """
    missing_fields = []

    for field in required_fields:
        if field not in data or not data[field]:
            missing_fields.append(field)

    if missing_fields:
        return f"Missing required fields: {', '.join(missing_fields)}"

    return None


def validate_track_id(track_id: str | None) -> bool:
    """Validate Spotify track ID format.

    Args:
        track_id: Track ID to validate

    Returns:
        True if valid, False otherwise
    """
    return track_id is not None and isinstance(track_id, str) and len(track_id) > 0


def validate_weather_data(data: Dict[str, Any]) -> Optional[str]:
    """Validate weather data structure.

    Args:
        data: Weather data dictionary

    Returns:
        Error message if validation fails, None if valid
    """
    required_fields = ["location", "temperature", "condition", "time_period"]
    error = validate_required_fields(data, required_fields)

    if error:
        return error

    # Additional weather-specific validation
    if not isinstance(data["temperature"], (int, float)):
        return "Temperature must be a number"

    if data["time_period"] not in ["day", "night"]:
        return "time_period must be 'day' or 'night'"

    return None
