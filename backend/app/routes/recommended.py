from flask import Blueprint, request, jsonify
from app.services.recommendation import recommend_from_history
from app.services.storage import read_track_ids

recommended_bp = Blueprint("recommended", __name__)

@recommended_bp.route("/recommend", methods=["GET"])
def get_recommendations():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Missing token"}), 401

    seed_ids = read_track_ids("listening_history.txt")[-5:]
    recs = recommend_from_history(seed_ids, token.split()[-1])
    return jsonify(recs)