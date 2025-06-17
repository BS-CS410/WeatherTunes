"""HTTP response utilities."""

from typing import Any, Dict, Tuple

from flask import jsonify
from werkzeug.wrappers import Response


def success_response(
    data: Dict[str, Any], status_code: int = 200
) -> Tuple[Response, int]:
    """Create a successful JSON response.

    Args:
        data: Response data
        status_code: HTTP status code

    Returns:
        JSON response tuple
    """
    return jsonify(data), status_code


def error_response(message: str, status_code: int = 400) -> Tuple[Response, int]:
    """Create an error JSON response.

    Args:
        message: Error message
        status_code: HTTP status code

    Returns:
        JSON response tuple
    """
    return jsonify({"error": message}), status_code


def unauthorized_response(
    message: str = "Authentication required",
) -> Tuple[Response, int]:
    """Create an unauthorized response.

    Args:
        message: Error message

    Returns:
        JSON response tuple
    """
    return error_response(message, 401)
