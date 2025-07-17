import logging
from typing import Optional

from fastapi import WebSocket, WebSocketException, status

from app.services.audio_service import audio_stream_manager

logger = logging.getLogger(__name__)


async def get_audio_session(
    websocket: WebSocket,
    session_id: Optional[str] = None,
    user_id: Optional[str] = None,
) -> str:
    """
    WebSocket dependency to get or create an audio session.

    Args:
        websocket: The WebSocket connection
        session_id: Optional existing session ID
        user_id: Optional user ID for the session

    Returns:
        str: The session ID

    Raises:
        WebSocketException: If session creation fails
    """
    try:
        if session_id:
            # Validate existing session
            session_info = audio_stream_manager.get_session_info(session_id)
            if not session_info:
                raise WebSocketException(
                    code=status.WS_1008_POLICY_VIOLATION,
                    reason=f"Session {session_id} not found",
                )
            return session_id
        else:
            # Create new session
            new_session_id = audio_stream_manager.create_session(user_id=user_id)
            logger.info(f"Created new audio session: {new_session_id}")
            return new_session_id

    except Exception as e:
        logger.error(f"Error in get_audio_session: {e}")
        raise WebSocketException(
            code=status.WS_1011_INTERNAL_ERROR,
            reason="Failed to initialize audio session",
        )


def validate_audio_format(sample_rate: int = 44100, channels: int = 1, format: str = "wav") -> dict:
    """
    Validate audio format parameters.

    Args:
        sample_rate: Audio sample rate in Hz
        channels: Number of audio channels
        format: Audio format (wav, mp3, etc.)

    Returns:
        dict: Validated audio parameters

    Raises:
        WebSocketException: If parameters are invalid
    """
    # Validate sample rate
    valid_sample_rates = [8000, 16000, 22050, 44100, 48000, 96000]
    if sample_rate not in valid_sample_rates:
        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION,
            reason=f"Invalid sample rate: {sample_rate}. Must be one of {valid_sample_rates}",
        )

    # Validate channels
    if channels not in [1, 2]:
        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION,
            reason=f"Invalid channel count: {channels}. Must be 1 (mono) or 2 (stereo)",
        )

    # Validate format
    valid_formats = ["wav", "mp3", "flac", "aac"]
    if format.lower() not in valid_formats:
        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION,
            reason=f"Invalid format: {format}. Must be one of {valid_formats}",
        )

    return {"sample_rate": sample_rate, "channels": channels, "format": format.lower()}
