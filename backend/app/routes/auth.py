"""Authentication routes for Spotify OAuth integration with enhanced token management."""

import logging
import time
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
    get_auth_session,
    get_authenticated_user,
    is_user_authenticated,
    save_auth_session,
)
from app.utils.cors import ensure_cors_headers
from app.utils.responses import error_response, success_response

logger = logging.getLogger(__name__)

auth_bp = Blueprint("auth", __name__)

# Initialize Spotify OAuth with enhanced configuration
sp_oauth = SpotifyOAuth(
    client_id=SpotifyConfig.CLIENT_ID,
    client_secret=SpotifyConfig.CLIENT_SECRET,
    redirect_uri=SpotifyConfig.REDIRECT_URI,
    scope=SpotifyConfig.SCOPE,
    cache_path=None,  # Disable file cache, use session-based storage
    show_dialog=True,  # Always show auth dialog for clarity
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
    """Handle Spotify OAuth callback and complete authentication."""
    code = request.args.get("code")
    error = request.args.get("error")
    state = request.args.get("state")  # Log state for debugging

    logger.info(
        f"OAuth callback received - code: {'present' if code else 'missing'}, error: {error}, state: {state}"
    )

    if error:
        logger.warning(f"OAuth error from Spotify: {error}")
        return redirect(
            f"{AppConfig.FRONTEND_URL}/login?error=oauth_error&details={error}"
        )

    if not code:
        logger.warning("OAuth callback missing authorization code")
        return redirect(f"{AppConfig.FRONTEND_URL}/login?error=missing_code")

    try:
        logger.info("Attempting to exchange authorization code for tokens")
        # Exchange code for tokens
        token_info = sp_oauth.get_access_token(code)
        if not token_info:
            logger.error("Failed to get access token from Spotify")
            raise Exception("Failed to get access token")

        logger.info("Successfully obtained access token, fetching user profile")
        # Get user profile
        sp = spotipy.Spotify(auth=token_info["access_token"])
        profile = sp.current_user()

        if not profile or not profile.get("id"):
            logger.error(f"Invalid Spotify profile received: {profile}")
            raise Exception("Failed to get Spotify user profile")

        spotify_username = profile["id"]
        logger.info(f"Spotify user profile obtained: {spotify_username}")

        # Create token model
        tokens = SpotifyTokens(
            access_token=token_info["access_token"],
            refresh_token=token_info.get("refresh_token"),
            expires_at=token_info.get("expires_at"),
        )

        # Save authentication session
        save_auth_session(spotify_username, tokens)
        logger.info(f"Authentication session saved for user: {spotify_username}")

        # Update user login data
        user_data_service.update_user_login(spotify_username)

        logger.info(f"User {spotify_username} authenticated successfully")

        # Redirect directly to frontend home page - authentication is complete
        return redirect(f"{AppConfig.FRONTEND_URL}/")

    except Exception as e:
        logger.error(f"Authentication callback error: {e}", exc_info=True)
        return redirect(
            f"{AppConfig.FRONTEND_URL}/login?error=auth_failed&details=callback_error"
        )


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
    ensure_cors_headers()
    authenticated = is_user_authenticated()
    username = get_authenticated_user() if authenticated else None

    return success_response({"authenticated": authenticated, "username": username})


@auth_bp.route("/token")
@cross_origin(supports_credentials=True)
def get_access_token() -> Tuple[Response, int]:
    """Get current access token for Spotify Web Playback SDK with automatic refresh."""
    ensure_cors_headers()
    auth_session = get_auth_session()

    if not auth_session:
        logger.warning("Unauthorized token request")
        return error_response("Not authenticated", 401)

    try:
        # Check if token needs refresh (refresh 5 minutes before expiry)
        current_time = int(time.time())
        buffer_time = 300  # 5 minutes

        if auth_session.tokens.expires_at and current_time >= (
            auth_session.tokens.expires_at - buffer_time
        ):
            if auth_session.tokens.refresh_token:
                logger.info(
                    f"Refreshing token for user {auth_session.spotify_username}"
                )

                # Use Spotipy's token refresh
                token_info = sp_oauth.refresh_access_token(
                    auth_session.tokens.refresh_token
                )

                if token_info:
                    # Update stored tokens
                    new_tokens = SpotifyTokens(
                        access_token=token_info["access_token"],
                        refresh_token=token_info.get(
                            "refresh_token", auth_session.tokens.refresh_token
                        ),
                        expires_at=token_info.get("expires_at"),
                    )

                    save_auth_session(auth_session.spotify_username, new_tokens)
                    logger.info(
                        f"Token refreshed successfully for user {auth_session.spotify_username}"
                    )

                    return success_response(
                        {
                            "access_token": new_tokens.access_token,
                            "expires_at": new_tokens.expires_at,
                        }
                    )

                logger.warning("Token refresh failed")
                return error_response(
                    "Token refresh failed, please re-authenticate", 401
                )

            logger.warning("Token expired and no refresh token available")
            return error_response("Token expired, please re-authenticate", 401)

        # Return the current access token
        return success_response(
            {
                "access_token": auth_session.tokens.access_token,
                "expires_at": auth_session.tokens.expires_at,
            }
        )

    except Exception as e:
        logger.error(f"Failed to get access token: {e}")
        return error_response("Failed to get access token")
