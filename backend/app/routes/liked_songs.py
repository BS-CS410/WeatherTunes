"""Routes for managing user's liked songs."""

import logging
from typing import Tuple

from flask import Blueprint, request
from flask_cors import cross_origin
from werkzeug.wrappers import Response

from app.services.user_data import user_data_service
from app.utils.auth import get_authenticated_user
from app.utils.responses import error_response, success_response, unauthorized_response
from app.utils.validation import validate_track_id

logger = logging.getLogger(__name__)

liked_songs_bp = Blueprint("liked_songs", __name__)


@liked_songs_bp.route("/liked", methods=["GET"])
@cross_origin(supports_credentials=True)
def get_liked_songs() -> Tuple[Response, int]:
    """Get user's liked songs.

    Returns:
        JSON response with user's favorite tracks
    """
    username = get_authenticated_user()
    if not username:
        return unauthorized_response("Please log into Spotify")

    try:
        favorites = user_data_service.get_favorites(username)
        logger.info(f"Retrieved {len(favorites)} favorites for user {username}")
        return success_response({"favorites": favorites})

    except Exception as e:
        logger.error(f"Error retrieving favorites for {username}: {e}")
        return error_response("Failed to retrieve favorites")


@liked_songs_bp.route("/liked", methods=["POST"])
@cross_origin(supports_credentials=True)
def add_liked_song() -> Tuple[Response, int]:
    """Add a song to user's liked songs.

    Returns:
        JSON response confirming track addition
    """
    username = get_authenticated_user()
    if not username:
        return unauthorized_response("Please log into Spotify")

    try:
        data = request.get_json()
        if not data:
            return error_response("Request body must be JSON")

        track_id = data.get("track_id")
        if not validate_track_id(track_id):
            return error_response("Missing or invalid track_id")

        user_data_service.add_favorite(username, track_id)

        logger.info(f"Added track {track_id} to favorites for user {username}")
        return success_response(
            {"message": "Track added to favorites", "track_id": track_id}
        )

    except Exception as e:
        logger.error(f"Error adding favorite for {username}: {e}")
        return error_response("Failed to add track to favorites")
