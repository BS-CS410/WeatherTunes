"""Routes for managing user's liked songs."""

import logging
from typing import Tuple

import spotipy
from flask import Blueprint, request
from flask_cors import cross_origin
from pydantic import ValidationError  # Import ValidationError
from werkzeug.wrappers import Response

from app.models.models import TrackIdRequest  # Import TrackIdRequest
from app.services.user_data import user_data_service
from app.utils.auth import get_auth_session, get_authenticated_user
from app.utils.responses import error_response, success_response, unauthorized_response

logger = logging.getLogger(__name__)

liked_songs_bp = Blueprint("liked_songs", __name__)


def _fetch_track_metadata(track_ids: list[str], auth_session) -> list[dict]:
    """Fetch track metadata from Spotify API."""
    sp = spotipy.Spotify(auth=auth_session.tokens.access_token)
    favorites_with_metadata = []

    # Process tracks in batches of 50 (Spotify API limit)
    for i in range(0, len(track_ids), 50):
        batch = track_ids[i : i + 50]
        try:
            tracks_response = sp.tracks(batch)

            if tracks_response and "tracks" in tracks_response:
                for track_data in tracks_response["tracks"]:
                    if track_data:  # track_data can be None if track not found
                        track_metadata = {
                            "id": track_data["id"],
                            "title": track_data["name"],
                            "artist": ", ".join(
                                [artist["name"] for artist in track_data["artists"]]
                            ),
                            "albumArt": track_data["album"]["images"][0]["url"]
                            if track_data["album"]["images"]
                            else "",
                            "albumArtFallback": "/placeholder-album.svg",
                            "tags": [],  # Can be populated with mood/genre tags if needed
                        }
                        favorites_with_metadata.append(track_metadata)

        except Exception as batch_error:
            logger.warning(f"Failed to fetch metadata for batch: {batch_error}")
            # Add tracks without metadata as fallback
            for track_id in batch:
                favorites_with_metadata.append(
                    {
                        "id": track_id,
                        "title": "Unknown Track",
                        "artist": "Unknown Artist",
                        "albumArt": "",
                        "albumArtFallback": "/placeholder-album.svg",
                        "tags": [],
                    }
                )

    return favorites_with_metadata


@liked_songs_bp.route("/liked", methods=["GET"])
@cross_origin(supports_credentials=True)
def get_liked_songs() -> Tuple[Response, int]:
    """Get user's liked songs with full track metadata.

    Returns:
        JSON response with user's favorite tracks including metadata
    """
    username = get_authenticated_user()
    if not username:
        return unauthorized_response("Please log into Spotify")

    try:
        # Get track IDs from user data
        track_ids = user_data_service.get_favorites(username)

        if not track_ids:
            logger.info(f"No favorites found for user {username}")
            return success_response({"favorites": []})

        # Get auth session for Spotify API calls
        auth_session = get_auth_session()
        if not auth_session:
            # Fallback to just track IDs if no Spotify session
            return success_response(
                {"favorites": [{"id": track_id} for track_id in track_ids]}
            )

        # Fetch full metadata for tracks
        favorites_with_metadata = _fetch_track_metadata(track_ids, auth_session)

        logger.info(
            f"Retrieved {len(favorites_with_metadata)} favorites with metadata for user {username}"
        )
        return success_response({"favorites": favorites_with_metadata})

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

        user_data_service.add_favorite(username, track_request.track_id)

        logger.info(
            f"Added track {track_request.track_id} to favorites for user {username}"
        )
        return success_response(
            {"message": "Track added to favorites", "track_id": track_request.track_id}
        )

    except Exception as e:
        logger.error(f"Error adding favorite for {username}: {e}")
        return error_response("Failed to add track to favorites")
