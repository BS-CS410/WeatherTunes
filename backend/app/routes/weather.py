"""Routes for weather data management."""

import logging
from typing import Tuple

from flask import Blueprint, request
from flask_cors import cross_origin
from pydantic import ValidationError  # Import ValidationError
from werkzeug.wrappers import Response

from app.models.models import WeatherData
from app.services.user_data import user_data_service
from app.services.weather import weather_service
from app.utils.auth import get_authenticated_user
from app.utils.responses import error_response, success_response, unauthorized_response

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

        # Validate weather data using Pydantic model
        try:
            weather_data = WeatherData(**data)
        except ValidationError as e:
            logger.warning(f"Weather data validation error: {e.errors()}")
            # Format Pydantic errors for a user-friendly response
            error_messages = []
            for error in e.errors():
                field = ".".join(str(loc) for loc in error["loc"])
                message = error["msg"]
                error_messages.append(f"Field '{field}': {message}")
            return error_response(
                f"Invalid weather data: {'; '.join(error_messages)}", 422
            )  # Unprocessable Entity

        # Save weather data
        weather_service.save_weather_data(username, weather_data)

        logger.info(f"Saved weather data for user {username}: {weather_data.location}")
        return success_response(
            {
                "message": f"Weather data saved for {username}",
                "weather": weather_data.model_dump(),  # Use model_dump for Pydantic
            }
        )

    except ValueError as e:  # This might still be relevant for other conversions if any
        return error_response(f"Invalid data value: {e}")
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
