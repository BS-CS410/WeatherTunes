"""Routes for managing user-specific song queues."""

import logging
from typing import Any, Dict, List, Tuple

from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin
from pydantic import BaseModel, Field, ValidationError

from app.utils.auth import get_authenticated_user
from app.utils.responses import error_response, success_response, unauthorized_response

logger = logging.getLogger(__name__)

queue_bp = Blueprint("queue", __name__, url_prefix="/queue")


class TrackData(BaseModel):
    id: str
    title: str
    artist: str
    album_art: str = Field(alias="albumArt")


@queue_bp.route("", methods=["GET"])
@cross_origin(supports_credentials=True)
def get_queue() -> Tuple[Any, int]:
    """Get the current user's song queue from the session."""
    username = get_authenticated_user()
    if not username:
        return unauthorized_response("User not authenticated")

    # Get queue from session
    current_queue = session.get("user_queue", [])
    logger.info(
        f"Retrieved queue for user {username}: {len(current_queue)} items from session"
    )
    return success_response({"queue": current_queue})


@queue_bp.route("/add", methods=["POST"])
@cross_origin(supports_credentials=True)
def add_to_queue() -> Tuple[Any, int]:
    """Add a track object to the user's song queue in the session."""
    username = get_authenticated_user()
    if not username:
        return unauthorized_response("User not authenticated")

    try:
        data = request.get_json()
        if not data or "track" not in data:
            return error_response("Missing track data in request", 400)

        track_payload = data["track"]
        validated_track = TrackData(**track_payload)
        track_to_store = validated_track.model_dump(by_alias=True)

    except ValidationError as e:
        logger.error(f"Validation error for add_to_queue: {e}")
        return error_response(f"Invalid track data: {e.errors()}", 400)
    except Exception as e:
        logger.error(f"Error parsing request data for add_to_queue: {e}")
        return error_response("Invalid request data", 400)

    current_queue = session.get("user_queue", [])

    # Avoid duplicate tracks by checking ID
    if not any(t["id"] == track_to_store["id"] for t in current_queue):
        current_queue.append(track_to_store)
        session["user_queue"] = current_queue
        logger.info(
            f"Added track {track_to_store['id']} to queue for user {username}. New queue size: {len(current_queue)}"
        )
    else:
        logger.info(
            f"Track {track_to_store['id']} already in queue for user {username}."
        )

    return success_response({"message": "Track added to queue", "queue": current_queue})


@queue_bp.route("/next", methods=["POST"])
@cross_origin(supports_credentials=True)
def get_next_track() -> Tuple[Any, int]:
    """Get the next track object from the user's session queue and remove it."""
    username = get_authenticated_user()
    if not username:
        return unauthorized_response("User not authenticated")

    current_queue = session.get("user_queue", [])
    if not current_queue:
        logger.info(f"Queue is empty for user {username}")
        return success_response(
            {"next_track": None, "message": "Queue is empty", "queue": []}
        )

    next_track_object = current_queue.pop(0)
    session["user_queue"] = current_queue  # Update the queue in the session
    logger.info(
        f"Next track for user {username} is {next_track_object.get('id', 'N/A')}. Remaining queue size: {len(current_queue)}"
    )
    return success_response({"currentTrack": next_track_object, "queue": current_queue})


@queue_bp.route("/clear", methods=["POST"])
@cross_origin(supports_credentials=True)
def clear_queue() -> Tuple[Any, int]:
    """Clear the user's entire song queue from the session."""
    username = get_authenticated_user()
    if not username:
        return unauthorized_response("User not authenticated")

    session["user_queue"] = []  # Clear queue in session
    logger.info(f"Cleared queue for user {username}")

    return success_response({"message": "Queue cleared", "queue": []})


@queue_bp.route("/replace", methods=["POST"])
@cross_origin(supports_credentials=True)
def replace_queue() -> Tuple[Any, int]:
    """Replace the user's entire song queue in the session with a new list of track objects."""
    username = get_authenticated_user()
    if not username:
        return unauthorized_response("User not authenticated")

    try:
        data = request.get_json()
        if not data or "tracks" not in data:
            return error_response("Missing tracks list in request", 400)

        tracks_payload = data["tracks"]
        if not isinstance(tracks_payload, list):
            return error_response("tracks must be a list", 400)

        new_queue_objects = []
        for track_data in tracks_payload:
            validated_track = TrackData(**track_data)
            new_queue_objects.append(validated_track.model_dump(by_alias=True))

    except ValidationError as e:
        logger.error(f"Validation error for replace_queue: {e}")
        return error_response(f"Invalid track data in list: {e.errors()}", 400)
    except Exception as e:
        logger.error(f"Error parsing request data for replace_queue: {e}")
        return error_response("Invalid request data", 400)

    session["user_queue"] = new_queue_objects  # Replace queue in session
    logger.info(
        f"Replaced queue for user {username} with {len(new_queue_objects)} tracks."
    )
    return success_response({"message": "Queue replaced", "queue": new_queue_objects})
