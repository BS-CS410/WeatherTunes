"""Authentication routes for Spotify OAuth integration."""

import logging
from typing import Tuple

import spotipy
from flask import Blueprint, redirect, request
from flask_cors import cross_origin
from spotipy.oauth2 import SpotifyOAuth
from werkzeug.wrappers import Response

from app.config import AppConfig, SpotifyConfig
from app.models.models import SpotifyTokens
from app.services.user_data import user_data_service
from app.utils.auth import (
    clear_auth_session,
    get_authenticated_user,
    is_user_authenticated,
    save_auth_session,
)
from app.utils.responses import error_response, success_response

logger = logging.getLogger(__name__)

auth_bp = Blueprint("auth", __name__)

# Initialize Spotify OAuth
sp_oauth = SpotifyOAuth(
    client_id=SpotifyConfig.CLIENT_ID,
    client_secret=SpotifyConfig.CLIENT_SECRET,
    redirect_uri=SpotifyConfig.REDIRECT_URI,
    scope=SpotifyConfig.SCOPE,
    cache_path=".cache",
)


@auth_bp.route("/login")
@cross_origin(supports_credentials=True)
def login() -> Response:
    """Initiate Spotify OAuth login flow."""
    auth_url = sp_oauth.get_authorize_url()
    logger.info("Redirecting to Spotify authorization")
    return redirect(auth_url)


@auth_bp.route("/callback")
@cross_origin(supports_credentials=True)
def callback() -> Tuple[Response, int] | Response:
    """Handle Spotify OAuth callback."""
    code = request.args.get("code")
    error = request.args.get("error")

    if error:
        logger.warning(f"OAuth error: {error}")
        return redirect(f"{AppConfig.FRONTEND_URL}/login?error=oauth_error")

    if not code:
        logger.warning("Missing authorization code")
        return redirect(f"{AppConfig.FRONTEND_URL}/login?error=missing_code")

    try:
        # Exchange code for tokens
        token_info = sp_oauth.get_access_token(code)
        if not token_info:
            raise Exception("Failed to get access token")

        # Get user profile
        sp = spotipy.Spotify(auth=token_info["access_token"])
        profile = sp.current_user()

        if not profile or not profile.get("id"):
            raise Exception("Failed to get Spotify user profile")

        spotify_username = profile["id"]

        # Create token model
        tokens = SpotifyTokens(
            access_token=token_info["access_token"],
            refresh_token=token_info.get("refresh_token"),
            expires_at=token_info.get("expires_at"),
        )

        # Save authentication session
        save_auth_session(spotify_username, tokens)

        # Update user login data
        user_data_service.update_user_login(spotify_username)

        logger.info(f"User {spotify_username} authenticated successfully")

        # Redirect to frontend auth callback
        return redirect(f"{AppConfig.FRONTEND_URL}/auth-callback")

    except Exception as e:
        logger.error(f"Authentication callback error: {e}")
        return redirect(f"{AppConfig.FRONTEND_URL}/login?error=auth_failed")


@auth_bp.route("/logout", methods=["POST"])
@cross_origin(supports_credentials=True)
def logout() -> Tuple[Response, int]:
    """Log out user and clear session."""
    username = get_authenticated_user()
    clear_auth_session()

    if username:
        logger.info(f"User {username} logged out")

    return success_response({"message": "Logged out successfully"})


@auth_bp.route("/session")
@cross_origin(supports_credentials=True)
def session_info() -> Tuple[Response, int]:
    """Get current session information."""
    authenticated = is_user_authenticated()
    username = get_authenticated_user() if authenticated else None

    return success_response({"authenticated": authenticated, "username": username})
