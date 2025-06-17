"""Session management utilities."""

from typing import Optional

from flask import session

from app.models.models import AuthSession, SpotifyTokens


def get_authenticated_user() -> Optional[str]:
    """Get the authenticated user's Spotify username.

    Returns:
        Spotify username if authenticated, None otherwise
    """
    return session.get("spotify_username")


def is_user_authenticated() -> bool:
    """Check if user is authenticated.

    Returns:
        True if user is authenticated, False otherwise
    """
    return (
        "access_token" in session
        and "spotify_username" in session
        and session["spotify_username"] is not None
    )


def save_auth_session(username: str, tokens: SpotifyTokens) -> None:
    """Save authentication session data.

    Args:
        username: Spotify username
        tokens: Spotify OAuth tokens
    """
    session["spotify_username"] = username
    session["access_token"] = tokens.access_token
    session["refresh_token"] = tokens.refresh_token
    session["expires_at"] = tokens.expires_at


def get_auth_session() -> Optional[AuthSession]:
    """Get current authentication session.

    Returns:
        AuthSession if authenticated, None otherwise
    """
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
