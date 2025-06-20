"""Routes for user data and listening history."""

import logging
from typing import Tuple

import spotipy
from flask import Blueprint, request
from flask_cors import cross_origin
from pydantic import ValidationError  # Import ValidationError
from werkzeug.wrappers import Response

from app.models.models import TrackIdRequest  # Import TrackIdRequest
from app.services.advanced_recommendation import AdvancedRecommendationService
from app.services.user_data import user_data_service
from app.utils.auth import get_auth_session, get_authenticated_user
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


@user_bp.route("/music-profile", methods=["GET"])
@cross_origin(supports_credentials=True)
def get_music_profile() -> Tuple[Response, int]:
    """Get user's music profile for personalized recommendations.

    Returns:
        JSON response with user's top genres, artists, and audio feature preferences
    """
    auth_session = get_auth_session()
    if not auth_session:
        return unauthorized_response("Authentication required")

    username = get_authenticated_user()
    if not username:
        return unauthorized_response("Authentication required")

    try:
        access_token = auth_session.tokens.access_token
        if not access_token:
            return unauthorized_response("Spotify authentication required")

        sp = spotipy.Spotify(auth=access_token)
        user_profile = _build_user_music_profile(sp)

        logger.info(f"Retrieved music profile for user {username}")
        return success_response(user_profile)

    except Exception as e:
        logger.error(f"Error retrieving music profile: {e}")
        return error_response("Failed to retrieve music profile")


def _build_user_music_profile(sp: spotipy.Spotify) -> dict:
    """Build user music profile from Spotify data."""
    profile = {
        "top_genres": [],
        "top_artists": [],
        "audio_features_avg": {},
    }

    try:
        # Get top artists and extract genres
        top_artists = sp.current_user_top_artists(limit=20, time_range="medium_term")
        if top_artists and "items" in top_artists:
            profile["top_artists"] = [
                {"id": artist["id"], "name": artist["name"]}
                for artist in top_artists["items"][:10]
            ]

            genre_counts = {}
            for artist in top_artists["items"]:
                for genre in artist.get("genres", []):
                    genre_counts[genre] = genre_counts.get(genre, 0) + 1
            profile["top_genres"] = sorted(
                genre_counts.keys(), key=lambda x: genre_counts[x], reverse=True
            )[:10]

        # Get audio features from top tracks
        _add_audio_features_to_profile(sp, profile)

    except Exception as e:
        logger.warning(f"Could not build complete user profile: {e}")

    return profile


def _add_audio_features_to_profile(sp: spotipy.Spotify, profile: dict) -> None:
    """Add average audio features to user profile."""
    try:
        top_tracks = sp.current_user_top_tracks(limit=50, time_range="medium_term")
        if not (top_tracks and "items" in top_tracks):
            return

        track_ids = [track["id"] for track in top_tracks["items"]]
        audio_features = sp.audio_features(track_ids)

        if not audio_features:
            return

        features_sum = {}
        valid_tracks = 0

        for features in audio_features:
            if features:
                valid_tracks += 1
                for key in ["valence", "energy", "danceability", "acousticness"]:
                    features_sum[key] = features_sum.get(key, 0) + features.get(key, 0)

        if valid_tracks > 0:
            profile["audio_features_avg"] = {
                key: value / valid_tracks for key, value in features_sum.items()
            }
    except Exception as e:
        logger.warning(f"Could not add audio features to profile: {e}")
