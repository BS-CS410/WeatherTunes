"""Routes for music recommendations."""

import logging
from typing import Tuple

from flask import Blueprint, request
from flask_cors import cross_origin
from werkzeug.wrappers import Response

from app.services.recommendation import recommendation_service
from app.services.user_data import user_data_service
from app.utils.auth import get_auth_session
from app.utils.responses import error_response, success_response, unauthorized_response

logger = logging.getLogger(__name__)

recommended_bp = Blueprint("recommended", __name__)


@recommended_bp.route("/recommend", methods=["GET"])
@cross_origin(supports_credentials=True)
def get_recommendations() -> Tuple[Response, int]:
    """Get music recommendations based on user's listening history.

    Returns:
        JSON response with recommended tracks
    """
    # Check authentication via session
    auth_session = get_auth_session()
    if not auth_session:
        return unauthorized_response("Authentication required")

    try:
        # Get user's favorite tracks as seeds
        favorites = user_data_service.get_favorites(auth_session.spotify_username)

        if not favorites:
            logger.info(f"No favorites found for user {auth_session.spotify_username}")
            return success_response(
                {
                    "tracks": [],
                    "message": "No favorites found. Like some songs to get recommendations!",
                }
            )

        # Use last 5 favorites as seed tracks
        seed_tracks = favorites[-5:]

        # Get recommendations
        recommendations = recommendation_service.recommend_from_history(
            seed_track_ids=seed_tracks,
            access_token=auth_session.tokens.access_token,
            limit=int(request.args.get("limit", 10)),
        )

        logger.info(
            f"Generated {len(recommendations)} recommendations for user {auth_session.spotify_username}"
        )
        return success_response({"tracks": recommendations})

    except Exception as e:
        logger.error(f"Error generating recommendations: {e}")
        return error_response("Failed to generate recommendations")


@recommended_bp.route("/top-tracks", methods=["GET"])
@cross_origin(supports_credentials=True)
def get_top_tracks() -> Tuple[Response, int]:
    """Get user's top tracks from Spotify.

    Returns:
        JSON response with user's top tracks
    """
    auth_session = get_auth_session()
    if not auth_session:
        return unauthorized_response("Authentication required")

    try:
        time_range = request.args.get("time_range", "medium_term")
        limit = int(request.args.get("limit", 20))

        # Validate time_range parameter
        valid_ranges = ["short_term", "medium_term", "long_term"]
        if time_range not in valid_ranges:
            return error_response(
                f"Invalid time_range. Must be one of: {', '.join(valid_ranges)}"
            )

        top_tracks = recommendation_service.get_user_top_tracks(
            access_token=auth_session.tokens.access_token,
            limit=limit,
            time_range=time_range,
        )

        logger.info(
            f"Retrieved {len(top_tracks)} top tracks for user {auth_session.spotify_username}"
        )
        return success_response({"tracks": top_tracks})

    except ValueError:
        return error_response("Invalid limit parameter. Must be a number.")
    except Exception as e:
        logger.error(f"Error getting top tracks: {e}")
        return error_response("Failed to get top tracks")
