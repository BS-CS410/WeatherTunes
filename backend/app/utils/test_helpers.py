"""Test utilities for mocking authentication."""

import time
from typing import Dict, Optional

from app.models.models import SpotifyTokens
from app.utils.auth import save_auth_session


def create_mock_tokens(expires_in: int = 3600) -> SpotifyTokens:
    """Create mock Spotify tokens for testing.

    Args:
        expires_in: Token expiration time in seconds from now

    Returns:
        Mock SpotifyTokens object
    """
    return SpotifyTokens(
        access_token="mock_access_token_12345",
        refresh_token="mock_refresh_token_67890",
        expires_at=int(time.time()) + expires_in,
    )


def create_test_user_session(
    username: str = "test_user", expires_in: int = 3600
) -> None:
    """Create a test user session with mock tokens.

    Args:
        username: Test username
        expires_in: Token expiration time in seconds from now
    """
    mock_tokens = create_mock_tokens(expires_in)
    save_auth_session(username, mock_tokens)


def get_test_spotify_config() -> Dict[str, str]:
    """Get test Spotify configuration.

    Returns:
        Dictionary with test Spotify config values
    """
    return {
        "client_id": "test_client_id",
        "client_secret": "test_client_secret",
        "redirect_uri": "http://127.0.0.1:5173/auth-callback",
        "scope": "user-library-read user-read-email user-read-private",
    }
