"""Flask application entry point for WeatherTunes backend."""

import logging  # Keep for basicConfig fallback if needed, or remove if setup_logging is robust
from pathlib import Path

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from app.config import AppConfig, Config
from app.routes.auth import auth_bp
from app.routes.liked_songs import liked_songs_bp
from app.routes.queue import queue_bp  # Import the new queue blueprint
from app.routes.recommended import recommended_bp
from app.routes.spotify import spotify_bp
from app.routes.user import user_bp
from app.routes.weather import weather_bp
from app.utils.logging import setup_logging  # Import setup_logging
from flask import Flask
from flask_cors import CORS

# Configure logging using the centralized setup function
# LOG_FILE = "./logs/backend.log" # Example: define a log file path if desired
LOG_FILE = None  # Set to None to disable file logging, or provide a path
setup_logging(log_level="INFO", log_file=LOG_FILE)

# Fallback basicConfig - can be removed if setup_logging is always used
# logging.basicConfig(
#     level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
# )

logger = logging.getLogger(__name__)  # Get logger after setup


def create_app() -> Flask:
    """Create and configure Flask application.

    Returns:
        Configured Flask application
    """
    app = Flask(__name__)
    app.config.from_object(Config)

    # Configure CORS
    CORS(
        app,
        supports_credentials=True,
        origins=AppConfig.ALLOWED_ORIGINS,
    )

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(liked_songs_bp)
    app.register_blueprint(recommended_bp)
    app.register_blueprint(spotify_bp, url_prefix="/spotify")
    app.register_blueprint(user_bp)
    app.register_blueprint(weather_bp)
    app.register_blueprint(queue_bp)  # Register the queue blueprint

    # Log registered routes in debug mode
    if app.config.get("DEBUG"):
        logger.info("Registered routes:")
        for rule in app.url_map.iter_rules():
            logger.info(f"  {rule.methods} {rule.rule} -> {rule.endpoint}")

    @app.route("/health")
    def health() -> dict[str, str]:
        """Detailed health check endpoint.

        Returns:
            Health status information
        """
        return {
            "status": "healthy",
            "service": "WeatherTunes Backend",
            "version": "2.0",
        }

    return app


def main() -> None:
    """Main application entry point."""
    app = create_app()

    logger.info("Starting WeatherTunes backend server...")
    logger.info(
        f"Environment: {'Development' if app.config.get('DEBUG') else 'Production'}"
    )

    app.run(host="127.0.0.1", port=8000, debug=True)


if __name__ == "__main__":
    main()
