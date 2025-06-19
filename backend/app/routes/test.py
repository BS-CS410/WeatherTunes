"""Test endpoint for fallback tracks."""

from typing import Tuple

from flask import Blueprint
from werkzeug.wrappers import Response

from app.services.advanced_recommendation import advanced_recommendation_service
from app.utils.responses import success_response

test_bp = Blueprint("test", __name__)


@test_bp.route("/test/fallback", methods=["GET"])
def test_fallback() -> Tuple[Response, int]:
    """Test the fallback tracks without authentication."""
    fallback_tracks = advanced_recommendation_service._get_simple_fallback()
    return success_response({"tracks": fallback_tracks, "count": len(fallback_tracks)})
