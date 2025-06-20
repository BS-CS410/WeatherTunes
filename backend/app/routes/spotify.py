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


@spotify_bp.route("/player/play", methods=["PUT"])
@cross_origin(supports_credentials=True)
def player_play() -> Tuple[Response, int]:
    """Start playback on Spotify player.

    Request Body:
        device_id (str): Target device ID
        uris (List[str], optional): Track URIs to play
        context_uri (str, optional): Album/playlist URI for context
        offset (dict, optional): Starting position

    Returns:
        JSON response confirming playback started
    """
    auth_session = get_auth_session()
    if not auth_session:
        return unauthorized_response("Authentication required")

    try:
        data = request.get_json() or {}
        device_id = data.get("device_id")

        if not device_id:
            return error_response("device_id is required", 400)

        sp = spotipy.Spotify(auth=auth_session.tokens.access_token)

        # Start playback with optional parameters
        kwargs = {"device_id": device_id}
        if "uris" in data:
            kwargs["uris"] = data["uris"]
        if "context_uri" in data:
            kwargs["context_uri"] = data["context_uri"]
        if "offset" in data:
            kwargs["offset"] = data["offset"]

        sp.start_playback(**kwargs)

        logger.info(f"Playback started on device {device_id}")
        return success_response({"message": "Playback started"})

    except spotipy.SpotifyException as e:
        logger.error(f"Spotify playback error: {e}")
        return error_response(f"Spotify playback error: {e}", 500)
    except Exception as e:
        logger.error(f"Error starting playback: {e}")
        return error_response(f"Failed to start playback: {e}")


@spotify_bp.route("/player/queue", methods=["POST"])
@cross_origin(supports_credentials=True)
def player_add_to_queue() -> Tuple[Response, int]:
    """Add track to Spotify playback queue.

    Request Body:
        uri (str): Track URI to add to queue
        device_id (str, optional): Target device ID

    Returns:
        JSON response confirming track added to queue
    """
    auth_session = get_auth_session()
    if not auth_session:
        return unauthorized_response("Authentication required")

    try:
        data = request.get_json() or {}
        uri = data.get("uri")

        if not uri:
            return error_response("uri is required", 400)

        sp = spotipy.Spotify(auth=auth_session.tokens.access_token)

        # Add to queue with optional device ID
        kwargs = {"uri": uri}
        if "device_id" in data:
            kwargs["device_id"] = data["device_id"]

        sp.add_to_queue(**kwargs)

        logger.info(f"Added track {uri} to queue")
        return success_response({"message": "Track added to queue"})

    except spotipy.SpotifyException as e:
        logger.error(f"Spotify queue error: {e}")
        return error_response(f"Spotify queue error: {e}", 500)
    except Exception as e:
        logger.error(f"Error adding to queue: {e}")
        return error_response(f"Failed to add to queue: {e}")


@spotify_bp.route("/player/transfer", methods=["PUT"])
@cross_origin(supports_credentials=True)
def player_transfer_playback() -> Tuple[Response, int]:
    """Transfer playback to device.

    Request Body:
        device_ids (List[str]): List of device IDs (usually one)
        play (bool, optional): Whether to start playing immediately

    Returns:
        JSON response confirming playback transferred
    """
    auth_session = get_auth_session()
    if not auth_session:
        return unauthorized_response("Authentication required")

    try:
        data = request.get_json() or {}
        device_ids = data.get("device_ids")

        if not device_ids or not isinstance(device_ids, list):
            return error_response("device_ids must be a non-empty list", 400)

        sp = spotipy.Spotify(auth=auth_session.tokens.access_token)

        # Transfer playback
        play = data.get("play", False)
        sp.transfer_playback(device_id=device_ids[0], force_play=play)

        logger.info(f"Playback transferred to devices {device_ids}")
        return success_response({"message": "Playback transferred"})

    except spotipy.SpotifyException as e:
        logger.error(f"Spotify transfer error: {e}")
        return error_response(f"Spotify transfer error: {e}", 500)
    except Exception as e:
        logger.error(f"Error transferring playback: {e}")
        return error_response(f"Failed to transfer playback: {e}")


@spotify_bp.route("/player/devices", methods=["GET"])
@cross_origin(supports_credentials=True)
def get_player_devices() -> Tuple[Response, int]:
    """Get available Spotify playback devices.

    Returns:
        JSON response with list of available devices
    """
    auth_session = get_auth_session()
    if not auth_session:
        return unauthorized_response("Authentication required")

    try:
        sp = spotipy.Spotify(auth=auth_session.tokens.access_token)
        devices_response = sp.devices()

        return success_response(
            {"devices": devices_response.get("devices", []) if devices_response else []}
        )

    except spotipy.SpotifyException as e:
        logger.error(f"Spotify devices error: {e}")
        return error_response(f"Spotify devices error: {e}", 500)
    except Exception as e:
        logger.error(f"Error getting devices: {e}")
        return error_response(f"Failed to get devices: {e}")
