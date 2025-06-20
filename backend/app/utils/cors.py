"""CORS utilities for consistent header handling."""

from flask import Response, after_this_request

from app.config import AppConfig


def add_cors_headers(response: Response) -> Response:
    """Add CORS headers to a Flask response.

    This ensures CORS headers are always present, addressing the issue where
    Flask-CORS only adds headers for cross-origin requests.
    """
    response.headers["Access-Control-Allow-Origin"] = AppConfig.ALLOWED_ORIGINS[0]
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return response


def ensure_cors_headers() -> None:
    """Add CORS headers to the current request's response.

    Use this function in route handlers to ensure CORS headers are always added.
    """

    @after_this_request
    def add_headers(response: Response) -> Response:
        return add_cors_headers(response)
