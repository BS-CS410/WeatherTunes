"""Logging configuration for the WeatherTunes backend."""

import logging
import sys
from pathlib import Path
from typing import Any, Dict


def setup_logging(log_level: str = "INFO", log_file: str | None = None) -> None:
    """Configure application logging.

    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR)
        log_file: Optional log file path
    """
    # Create logs directory if using file logging
    if log_file:
        log_path = Path(log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)

    # Configure logging format
    log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    date_format = "%Y-%m-%d %H:%M:%S"

    # Configure root logger
    logging.basicConfig(
        level=getattr(logging, log_level.upper()),
        format=log_format,
        datefmt=date_format,
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler(log_file) if log_file else logging.NullHandler(),
        ],
    )

    # Set specific logger levels
    logger_config = {
        "spotipy": "WARNING",  # Reduce spotipy verbosity
        "urllib3": "WARNING",  # Reduce urllib3 verbosity
        "requests": "WARNING",  # Reduce requests verbosity
    }

    for logger_name, level in logger_config.items():
        logging.getLogger(logger_name).setLevel(getattr(logging, level))


def get_logger(name: str) -> logging.Logger:
    """Get a logger instance.

    Args:
        name: Logger name (usually __name__)

    Returns:
        Logger instance
    """
    return logging.getLogger(name)
