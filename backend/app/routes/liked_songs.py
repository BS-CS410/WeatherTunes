from flask import Blueprint, session, request, jsonify
from flask_cors import cross_origin
from app.services.user_data import add_favorite, get_favorites

liked_songs_bp = Blueprint('liked_songs', __name__)

@liked_songs_bp.route('/liked', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_liked_songs():
    print("Session contents:", dict(session))
    username = session.get('spotify_username')

    if not username:
        return jsonify({"error": "Please log into Spotify."}), 401

    favorites = get_favorites(username)
    return jsonify({"favorites": favorites})


@liked_songs_bp.route('/liked', methods=['POST'])
@cross_origin(supports_credentials=True)
def add_liked_song():
    username = session.get('spotify_username')

    if not username:
        return jsonify({"error": "Please log into Spotify."}), 401

    data = request.get_json()
    track_id = data.get('track_id')
    if not track_id:
        return jsonify({"error": "Missing track_id"}), 400

    add_favorite(username, track_id)
    return jsonify({"message": "Track added to favorites", "track_id": track_id})
