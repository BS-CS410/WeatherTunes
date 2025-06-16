from flask import Blueprint, request, jsonify
from app.services.storage import write_track_id

user_bp = Blueprint("user", __name__)

@user_bp.route("/history", methods=["POST"])
def log_history():
    data = request.get_json()
    track_id = data.get("track_id")
    if not track_id:
        return jsonify({"error": "Missing track_id"}), 400
    write_track_id("listening_history.txt", track_id)
    return jsonify({"message": "History recorded"}), 200


from app.services.storage import read_track_ids  # Make sure this import is present

@user_bp.route("/history", methods=["GET"])
def get_history():
    ids = read_track_ids("listening_history.txt")
    return jsonify({"listening_history": ids})
