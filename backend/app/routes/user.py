"""Routes for user data and listening history."""

import logging
from typing import Tuple

from flask import Blueprint, request
from flask_cors import cross_origin
from pydantic import ValidationError  # Import ValidationError
from werkzeug.wrappers import Response

from app.models.models import TrackIdRequest  # Import TrackIdRequest
from app.services.user_data import user_data_service
from app.utils.auth import get_authenticated_user
from app.utils.responses import error_response, success_response, unauthorized_response

logger = logging.getLogger(__name__)

user_bp = Blueprint("user", __name__)


@user_bp.route("/history", methods=["POST"])
@cross_origin(supports_credentials=True)
def log_history() -> Tuple[Response, int]:
    """Log a track to user's listening history (stored as favorites).

    Returns:
        JSON response confirming history logging
    """
    username = get_authenticated_user()
    if not username:
        return unauthorized_response("Authentication required")

    try:
        data = request.get_json()
        if not data:
            return error_response("Request body must be JSON")

        try:
            track_request = TrackIdRequest(**data)
        except ValidationError as e:
            logger.warning(f"Track ID request validation error: {e.errors()}")
            error_messages = []
            for error in e.errors():
                field = ".".join(str(loc) for loc in error["loc"])
                message = error["msg"]
                error_messages.append(f"Field '{field}': {message}")
            return error_response(f"Invalid request: {'; '.join(error_messages)}", 422)

        # Add to favorites (which serves as listening history)
        user_data_service.add_favorite(username, track_request.track_id)

        logger.info(
            f"Logged track {track_request.track_id} to history for user {username}"
        )
        return success_response({"message": "History recorded"})

    except Exception as e:
        logger.error(f"Error logging history for {username}: {e}")
        return error_response("Failed to record history")


@user_bp.route("/history", methods=["GET"])
@cross_origin(supports_credentials=True)
def get_history() -> Tuple[Response, int]:
    """Get user's listening history (favorites).

    Returns:
        JSON response with listening history
    """
    username = get_authenticated_user()
    if not username:
        return unauthorized_response("Authentication required")

    try:
        favorites = user_data_service.get_favorites(username)
        logger.info(f"Retrieved history ({len(favorites)} tracks) for user {username}")
        return success_response({"listening_history": favorites})

    except Exception as e:
        logger.error(f"Error retrieving history for {username}: {e}")
        return error_response("Failed to retrieve history")


@user_bp.route("/profile", methods=["GET"])
@cross_origin(supports_credentials=True)
def get_profile() -> Tuple[Response, int]:
    """Get user profile information.

    Returns:
        JSON response with user profile data
    """
    username = get_authenticated_user()
    if not username:
        return unauthorized_response("Authentication required")

    try:
        user_info = user_data_service.get_user_info(username)
        if not user_info:
            return error_response("User profile not found")

        profile_data = {
            "username": user_info.username,
            "created_at": user_info.created_at.isoformat(),
            "last_login": user_info.last_login.isoformat(),
            "favorites_count": len(user_info.favorites) if user_info.favorites else 0,
            "last_weather": None,
        }

        if user_info.last_weather:
            profile_data["last_weather"] = {
                "location": user_info.last_weather.location,
                "temperature": user_info.last_weather.temperature,
                "condition": user_info.last_weather.condition,
                "time_period": user_info.last_weather.time_period,
            }

        logger.info(f"Retrieved profile for user {username}")
        return success_response(profile_data)

    except Exception as e:
        logger.error(f"Error retrieving profile for {username}: {e}")
        return error_response("Failed to retrieve profile")
