"""Session management utilities."""

import logging
import time
from typing import Optional

import spotipy
from flask import session
from spotipy.oauth2 import SpotifyOAuth

from app.config import SpotifyConfig
from app.models.models import AuthSession, SpotifyTokens

logger = logging.getLogger(__name__)

# Initialize Spotify OAuth for token refresh
sp_oauth = SpotifyOAuth(
    client_id=SpotifyConfig.CLIENT_ID,
    client_secret=SpotifyConfig.CLIENT_SECRET,
    redirect_uri=SpotifyConfig.REDIRECT_URI,
    scope=SpotifyConfig.SCOPE,
)


def get_authenticated_user() -> Optional[str]:
    """Get the authenticated user's Spotify username."""
    return session.get("spotify_username")


def is_user_authenticated() -> bool:
    """Check if user is authenticated with valid token."""
    if not ("access_token" in session and "spotify_username" in session):
        return False

    # Check if token is expired
    expires_at = session.get("expires_at")
    if expires_at and time.time() > expires_at:
        # Try to refresh token
        if _refresh_token_if_needed():
            return True
        clear_auth_session()
        return False

    return True


def save_auth_session(username: str, tokens: SpotifyTokens) -> None:
    """Save authentication session data."""
    session["spotify_username"] = username
    session["access_token"] = tokens.access_token
    session["refresh_token"] = tokens.refresh_token
    session["expires_at"] = tokens.expires_at


def get_auth_session() -> Optional[AuthSession]:
    """Get current authentication session with token refresh."""
    if not is_user_authenticated():
        return None

    tokens = SpotifyTokens(
        access_token=session["access_token"],
        refresh_token=session.get("refresh_token"),
        expires_at=session.get("expires_at"),
    )

    return AuthSession(spotify_username=session["spotify_username"], tokens=tokens)


def clear_auth_session() -> None:
    """Clear authentication session data."""
    session.clear()


def _refresh_token_if_needed() -> bool:
    """Refresh access token if expired."""
    refresh_token = session.get("refresh_token")
    if not refresh_token:
        logger.warning("No refresh token available")
        return False

    try:
        # Use the refresh token to get a new access token
        token_info = sp_oauth.refresh_access_token(refresh_token)

        if token_info and token_info.get("access_token"):
            # Update session with new token info
            session["access_token"] = token_info["access_token"]
            if token_info.get("expires_at"):
                session["expires_at"] = token_info["expires_at"]
            # Refresh token might be updated too
            if token_info.get("refresh_token"):
                session["refresh_token"] = token_info["refresh_token"]

            logger.info(f"Token refreshed for user {session.get('spotify_username')}")
            return True

        logger.error("Failed to refresh token: invalid token_info")
        return False

    except Exception as e:
        logger.error(f"Token refresh failed: {e}")
        return False
