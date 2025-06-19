"""Routes for music recommendations."""

import logging
from typing import Tuple

from flask import Blueprint, request
from flask_cors import cross_origin
from werkzeug.wrappers import Response

from app.services.advanced_recommendation import advanced_recommendation_service
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


@recommended_bp.route("/search", methods=["GET"])
@cross_origin(supports_credentials=True)
def search_tracks() -> Tuple[Response, int]:
    """Search Spotify for tracks based on query.

    Query Parameters:
        q (str): Search query
        limit (int, optional): Number of results (default: 10, max: 50)

    Returns:
        JSON response with search results
    """
    auth_session = get_auth_session()
    if not auth_session:
        return unauthorized_response("Authentication required")

    query = request.args.get("q")
    if not query:
        return error_response("Search query parameter 'q' is required", 400)

    try:
        limit = min(int(request.args.get("limit", 10)), 50)
    except ValueError:
        limit = 10

    try:
        results = recommendation_service.search_tracks(
            query=query,
            access_token=auth_session.tokens.access_token,
            limit=limit,
        )

        return success_response(
            {"tracks": results, "query": query, "count": len(results)}
        )

    except Exception as e:
        logger.error(f"Search failed for user {auth_session.spotify_username}: {e}")
        return error_response(f"Search failed: {e!s}", 500)


@recommended_bp.route("/recommendations/weather", methods=["POST"])
@cross_origin(supports_credentials=True)
def get_weather_recommendations() -> Tuple[Response, int]:
    """Get music recommendations based on weather conditions.

    Request Body:
        weather_condition (str): Weather condition (sunny, rainy, cloudy, etc.)
        temperature (float): Temperature in Celsius
        time_of_day (str, optional): morning, afternoon, evening, night
        limit (int, optional): Number of recommendations (default: 20, max: 50)

    Returns:
        JSON response with weather-based recommendations
    """
    auth_session = get_auth_session()
    if not auth_session:
        return unauthorized_response("Authentication required")

    try:
        data = request.get_json()
        if not data:
            return error_response("Request body is required", 400)

        weather_condition = data.get("weather_condition")
        temperature = data.get("temperature")

        if not weather_condition or temperature is None:
            return error_response("weather_condition and temperature are required", 400)

        time_of_day = data.get("time_of_day", "afternoon")
        limit = min(int(data.get("limit", 20)), 50)

        # Get user's preferences for personalization
        user_preferences = user_data_service.get_user_preferences(
            auth_session.spotify_username
        )

        # Use advanced recommendation service for personalized weather-based recommendations
        results = (
            advanced_recommendation_service.get_personalized_weather_recommendations(
                weather_condition=weather_condition,
                temperature=temperature,
                time_of_day=time_of_day,
                access_token=auth_session.tokens.access_token,
                user_id=auth_session.spotify_username,
                user_preferences=user_preferences,
                limit=limit,
            )
        )

        return success_response(
            {
                "tracks": results,
                "weather_condition": weather_condition,
                "temperature": temperature,
                "time_of_day": time_of_day,
                "count": len(results),
            }
        )

    except Exception as e:
        logger.error(
            f"Weather recommendations failed for user {auth_session.spotify_username}: {e}"
        )
        return error_response(f"Weather recommendations failed: {e!s}", 500)


@recommended_bp.route("/interactions", methods=["POST"])
@cross_origin(supports_credentials=True)
def record_user_interaction() -> Tuple[Response, int]:
    """Record user interaction for learning and personalization.

    Request Body:
        track_id (str): Spotify track ID
        interaction_type (str): like, dislike, skip, replay, play_complete
        context (dict, optional): Context information (weather, time, etc.)

    Returns:
        JSON response confirming interaction recorded
    """
    auth_session = get_auth_session()
    if not auth_session:
        return unauthorized_response("Authentication required")

    try:
        data = request.get_json()
        if not data:
            return error_response("Request body is required", 400)

        track_id = data.get("track_id")
        interaction_type = data.get("interaction_type")

        if not track_id or not interaction_type:
            return error_response("track_id and interaction_type are required", 400)

        # Validate interaction type
        valid_interactions = ["like", "dislike", "skip", "replay", "play_complete"]
        if interaction_type not in valid_interactions:
            return error_response(
                f"interaction_type must be one of: {valid_interactions}", 400
            )

        context = data.get("context", {})

        # Record the interaction for learning
        # Note: In a full implementation, this would also store to database
        logger.info(
            f"User interaction: {auth_session.spotify_username} {interaction_type} {track_id}"
        )

        return success_response(
            {
                "message": "Interaction recorded successfully",
                "track_id": track_id,
                "interaction_type": interaction_type,
            }
        )

    except Exception as e:
        logger.error(f"Error recording user interaction: {e}")
        return error_response(f"Failed to record interaction: {e!s}", 500)


@recommended_bp.route("/playlist/adaptive", methods=["POST"])
@cross_origin(supports_credentials=True)
def get_adaptive_playlist() -> Tuple[Response, int]:
    """Generate an adaptive playlist with smooth transitions.

    Request Body:
        weather_condition (str): Current weather condition
        temperature (float): Temperature in Celsius
        time_of_day (str, optional): morning, afternoon, evening, night
        duration_minutes (int, optional): Target playlist duration (default: 60, max: 180)

    Returns:
        JSON response with adaptive playlist
    """
    auth_session = get_auth_session()
    if not auth_session:
        return unauthorized_response("Authentication required")

    try:
        data = request.get_json()
        if not data:
            return error_response("Request body is required", 400)

        weather_condition = data.get("weather_condition")
        temperature = data.get("temperature")

        if not weather_condition or temperature is None:
            return error_response("weather_condition and temperature are required", 400)

        time_of_day = data.get("time_of_day", "afternoon")
        duration_minutes = min(int(data.get("duration_minutes", 60)), 180)

        # Get user preferences
        user_preferences = user_data_service.get_user_preferences(
            auth_session.spotify_username
        )

        # Generate adaptive playlist
        playlist = advanced_recommendation_service.get_adaptive_playlist(
            weather_condition=weather_condition,
            temperature=temperature,
            time_of_day=time_of_day,
            access_token=auth_session.tokens.access_token,
            user_id=auth_session.spotify_username,
            playlist_duration_minutes=duration_minutes,
            user_preferences=user_preferences,
        )

        return success_response(
            {
                "playlist": playlist,
                "weather_condition": weather_condition,
                "temperature": temperature,
                "time_of_day": time_of_day,
                "duration_minutes": duration_minutes,
                "track_count": len(playlist),
            }
        )

    except Exception as e:
        logger.error(f"Adaptive playlist generation failed: {e}")
        return error_response(f"Failed to generate adaptive playlist: {e!s}", 500)


@recommended_bp.route("/cache/clear", methods=["POST"])
@cross_origin(supports_credentials=True)
def clear_recommendation_cache() -> Tuple[Response, int]:
    """Clear recommendation cache for testing/debugging.

    Returns:
        JSON response confirming cache cleared
    """
    auth_session = get_auth_session()
    if not auth_session:
        return unauthorized_response("Authentication required")

    try:
        advanced_recommendation_service.clear_cache()
        logger.info(f"Cache cleared by user {auth_session.spotify_username}")

        return success_response(
            {"message": "Recommendation cache cleared successfully"}
        )

    except Exception as e:
        logger.error(f"Error clearing cache: {e}")
        return error_response(f"Failed to clear cache: {e!s}", 500)
