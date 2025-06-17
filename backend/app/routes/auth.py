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
from app.utils.responses import error_response, success_response, unauthorized_response

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
    """Initiate Spotify OAuth login flow.

    Returns:
        Redirect to Spotify authorization URL
    """
    auth_url = sp_oauth.get_authorize_url()
    logger.info("Redirecting to Spotify authorization")
    return redirect(auth_url)


@auth_bp.route("/callback")
@cross_origin(supports_credentials=True)
def callback() -> Tuple[Response, int] | Response:
    """Handle Spotify OAuth callback.

    Returns:
        Redirect to frontend callback URL or error response
    """
    code = request.args.get("code")
    error = request.args.get("error")

    if error:
        logger.warning(f"OAuth error: {error}")
        return error_response(f"OAuth error: {error}")

    if not code:
        return error_response("Missing authorization code")

    try:
        # Exchange code for tokens
        token_info = sp_oauth.get_access_token(code)
        if not token_info:
            return error_response("Failed to get access token")

        # Get user profile
        sp = spotipy.Spotify(auth=token_info["access_token"])
        profile = sp.current_user()

        if not profile or not profile.get("id"):
            return error_response("Failed to get Spotify user profile")

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
        return redirect(AppConfig.CALLBACK_URL)

    except Exception as e:
        logger.error(f"Authentication callback error: {e}")
        return error_response("Authentication failed")


@auth_bp.route("/logout")
@cross_origin(supports_credentials=True)
def logout() -> Response:
    """Log out user and clear session.

    Returns:
        Redirect to frontend home page
    """
    username = get_authenticated_user()
    clear_auth_session()

    if username:
        logger.info(f"User {username} logged out")

    return redirect(AppConfig.FRONTEND_URL)


@auth_bp.route("/session")
@cross_origin(supports_credentials=True)
def session_info() -> Tuple[Response, int]:
    """Get current session information.

    Returns:
        JSON response with authentication status
    """
    logged_in = is_user_authenticated()
    username = get_authenticated_user() if logged_in else None

    return success_response({"logged_in": logged_in, "spotify_username": username})


@auth_bp.route("/userinfo")
@cross_origin(supports_credentials=True)
def userinfo() -> Tuple[Response, int]:
    """Get authenticated user information.

    Returns:
        JSON response with user info or error
    """
    username = get_authenticated_user()

    if not username:
        return unauthorized_response("Not logged in")

    return success_response({"spotify_username": username})
