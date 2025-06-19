"""Routes for Spotify API integration."""

import logging
from typing import List, Tuple

import spotipy
from flask import Blueprint, request
from flask_cors import cross_origin
from werkzeug.wrappers import Response

from app.utils.auth import get_auth_session
from app.utils.responses import error_response, success_response, unauthorized_response

logger = logging.getLogger(__name__)

spotify_bp = Blueprint("spotify", __name__)


@spotify_bp.route("/track/<track_id>", methods=["GET"])
@cross_origin(supports_credentials=True)
def get_track_metadata(track_id: str) -> Tuple[Response, int]:
    """Get track metadata from Spotify API by track ID.

    Args:
        track_id: Spotify track ID

    Returns:
        JSON response with track metadata
    """
    auth_session = get_auth_session()
    if not auth_session:
        return unauthorized_response("Authentication required")

    try:
        sp = spotipy.Spotify(auth=auth_session.tokens.access_token)
        track_data = sp.track(track_id)

        if not track_data:
            return error_response(f"Track {track_id} not found", 404)

        # Format track data for frontend
        track_metadata = {
            "id": track_data["id"],
            "title": track_data["name"],
            "artist": ", ".join([artist["name"] for artist in track_data["artists"]]),
            "albumArt": track_data["album"]["images"][0]["url"]
            if track_data["album"]["images"]
            else "",
            "album": track_data["album"]["name"],
            "preview_url": track_data.get("preview_url"),
            "external_urls": track_data["external_urls"],
            "popularity": track_data.get("popularity", 0),
            "duration_ms": track_data.get("duration_ms", 0),
            "explicit": track_data.get("explicit", False),
        }

        return success_response({"track": track_metadata})

    except spotipy.SpotifyException as e:
        logger.error(f"Spotify API error for track {track_id}: {e}")
        if e.http_status == 404:
            return error_response(f"Track {track_id} not found", 404)
        return error_response(f"Spotify API error: {e}", 500)
    except Exception as e:
        logger.error(f"Error fetching track {track_id}: {e}")
        return error_response(f"Failed to fetch track: {e!s}", 500)


@spotify_bp.route("/tracks", methods=["POST"])
@cross_origin(supports_credentials=True)
def get_tracks_metadata() -> Tuple[Response, int]:
    """Get metadata for multiple tracks from Spotify API.

    Request Body:
        track_ids (List[str]): List of Spotify track IDs

    Returns:
        JSON response with track metadata list
    """
    auth_session = get_auth_session()
    if not auth_session:
        return unauthorized_response("Authentication required")

    try:
        data = request.get_json()
        if not data or "track_ids" not in data:
            return error_response("track_ids are required", 400)

        track_ids = data["track_ids"]
        if not isinstance(track_ids, list) or len(track_ids) == 0:
            return error_response("track_ids must be a non-empty list", 400)

        # Spotify API allows max 50 tracks per request
        if len(track_ids) > 50:
            track_ids = track_ids[:50]

        sp = spotipy.Spotify(auth=auth_session.tokens.access_token)
        tracks_data = sp.tracks(track_ids)

        if not tracks_data:
            return error_response("Failed to fetch tracks", 500)

        # Format tracks data for frontend
        tracks_metadata = []
        for track_data in tracks_data.get("tracks", []):
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
                    "album": track_data["album"]["name"],
                    "preview_url": track_data.get("preview_url"),
                    "external_urls": track_data["external_urls"],
                    "popularity": track_data.get("popularity", 0),
                    "duration_ms": track_data.get("duration_ms", 0),
                    "explicit": track_data.get("explicit", False),
                }
                tracks_metadata.append(track_metadata)

        return success_response(
            {
                "tracks": tracks_metadata,
                "count": len(tracks_metadata),
                "requested": len(track_ids),
            }
        )

    except spotipy.SpotifyException as e:
        logger.error(f"Spotify API error for tracks: {e}")
        return error_response(f"Spotify API error: {e}", 500)
    except Exception as e:
        logger.error(f"Error fetching tracks: {e}")
        return error_response(f"Failed to fetch tracks: {e!s}", 500)


@spotify_bp.route("/track/<track_id>/audio-features", methods=["GET"])
@cross_origin(supports_credentials=True)
def get_track_audio_features(track_id: str) -> Tuple[Response, int]:
    """Get audio features for a track from Spotify API.

    Args:
        track_id: Spotify track ID

    Returns:
        JSON response with audio features including mood classification
    """
    auth_session = get_auth_session()
    if not auth_session:
        return unauthorized_response("Authentication required")

    try:
        sp = spotipy.Spotify(auth=auth_session.tokens.access_token)
        audio_features_list = sp.audio_features([track_id])

        if not audio_features_list or not audio_features_list[0]:
            return error_response(
                f"Audio features not available for track {track_id}", 404
            )

        audio_features = audio_features_list[0]

        # Classify mood based on audio features
        mood_tags = _classify_mood_from_audio_features(audio_features)

        return success_response(
            {
                "track_id": track_id,
                "audio_features": audio_features,
                "mood_tags": mood_tags,
            }
        )

    except spotipy.SpotifyException as e:
        logger.error(f"Spotify API error for track {track_id} audio features: {e}")
        return error_response(f"Spotify API error: {e}", 500)
    except Exception as e:
        logger.error(f"Error fetching audio features for track {track_id}: {e}")
        return error_response(f"Failed to fetch audio features: {e!s}", 500)


def _classify_mood_from_audio_features(audio_features: dict) -> List[str]:
    """Classify mood tags based on Spotify audio features."""
    mood_tags = []

    valence = audio_features.get("valence", 0.5)
    energy = audio_features.get("energy", 0.5)
    danceability = audio_features.get("danceability", 0.5)
    acousticness = audio_features.get("acousticness", 0.5)

    # Primary mood classifications
    if valence > 0.7 and energy > 0.6:
        mood_tags.extend(["happy", "upbeat", "energetic"])
    elif valence < 0.3:
        mood_tags.extend(["melancholy", "sad"])
    elif energy > 0.7:
        mood_tags.append("energetic")
    elif energy < 0.3:
        mood_tags.extend(["calm", "relaxing"])

    # Secondary characteristics
    if danceability > 0.7:
        mood_tags.append("danceable")
    if acousticness > 0.6:
        mood_tags.extend(["acoustic", "organic"])

    return list(set(mood_tags))
