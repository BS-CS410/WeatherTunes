"""Routes for weather data management."""

import logging
from typing import Tuple

from flask import Blueprint, request
from flask_cors import cross_origin
from werkzeug.wrappers import Response

from app.models.models import WeatherData
from app.services.weather import weather_service
from app.utils.auth import get_authenticated_user
from app.utils.responses import error_response, success_response, unauthorized_response
from app.utils.validation import validate_weather_data

logger = logging.getLogger(__name__)

weather_bp = Blueprint("weather", __name__)


@weather_bp.route("/weather", methods=["POST"])
@cross_origin(supports_credentials=True)
def post_weather() -> Tuple[Response, int]:
    """Save weather data for the authenticated user.

    Returns:
        JSON response confirming weather data save
    """
    username = get_authenticated_user()
    if not username:
        return unauthorized_response("Authentication required")

    try:
        data = request.get_json()
        if not data:
            return error_response("Request body must be JSON")

        # Validate weather data
        validation_error = validate_weather_data(data)
        if validation_error:
            return error_response(validation_error)

        # Create weather data model
        weather_data = WeatherData(
            location=data["location"],
            temperature=float(data["temperature"]),
            condition=data["condition"],
            time_period=data["time_period"],
        )

        # Save weather data
        weather_service.save_weather_data(username, weather_data)

        logger.info(f"Saved weather data for user {username}: {weather_data.location}")
        return success_response(
            {
                "message": f"Weather data saved for {username}",
                "weather": {
                    "location": weather_data.location,
                    "temperature": weather_data.temperature,
                    "condition": weather_data.condition,
                    "time_period": weather_data.time_period,
                },
            }
        )

    except ValueError as e:
        return error_response(f"Invalid temperature value: {e}")
    except Exception as e:
        logger.error(f"Error saving weather data for {username}: {e}")
        return error_response("Failed to save weather data")


@weather_bp.route("/weather", methods=["GET"])
@cross_origin(supports_credentials=True)
def get_weather() -> Tuple[Response, int]:
    """Get current weather data for the authenticated user.

    Returns:
        JSON response with user's weather data
    """
    username = get_authenticated_user()
    if not username:
        return unauthorized_response("Authentication required")

    try:
        # Get user's weather data from storage
        from app.services.user_data import user_data_service

        user_info = user_data_service.get_user_info(username)

        if not user_info or not user_info.last_weather:
            return error_response("No weather data found for user")

        weather_data = {
            "location": user_info.last_weather.location,
            "temperature": user_info.last_weather.temperature,
            "condition": user_info.last_weather.condition,
            "time_period": user_info.last_weather.time_period,
        }

        return success_response({"weather": weather_data})

    except Exception as e:
        logger.error(f"Error retrieving weather data for {username}: {e}")
        return error_response("Failed to retrieve weather data")
