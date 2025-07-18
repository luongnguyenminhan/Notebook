import os
from pathlib import Path


class AudioConfig:
    """Configuration for audio processing settings"""

    # Storage configuration
    AUDIO_STORAGE_PATH: str = os.getenv("AUDIO_STORAGE_PATH", "./audio_sessions")

    # Audio processing defaults
    DEFAULT_SAMPLE_RATE: int = int(os.getenv("DEFAULT_SAMPLE_RATE", "44100"))
    DEFAULT_CHANNELS: int = int(os.getenv("DEFAULT_CHANNELS", "1"))
    DEFAULT_FORMAT: str = os.getenv("DEFAULT_FORMAT", "wav")

    # FFmpeg configuration
    FFMPEG_LOGLEVEL: str = os.getenv("FFMPEG_LOGLEVEL", "error")
    FFMPEG_THREADS: int = int(os.getenv("FFMPEG_THREADS", "1"))

    # Session limits
    MAX_SESSION_DURATION_HOURS: int = int(os.getenv("MAX_SESSION_DURATION_HOURS", "24"))
    MAX_CHUNK_SIZE_MB: int = int(os.getenv("MAX_CHUNK_SIZE_MB", "10"))
    MAX_CONCURRENT_SESSIONS: int = int(os.getenv("MAX_CONCURRENT_SESSIONS", "100"))

    # Cleanup settings
    AUTO_CLEANUP_COMPLETED_SESSIONS: bool = os.getenv("AUTO_CLEANUP_COMPLETED_SESSIONS", "true").lower() == "true"
    CLEANUP_INTERVAL_MINUTES: int = int(os.getenv("CLEANUP_INTERVAL_MINUTES", "60"))

    @classmethod
    def ensure_storage_path(cls) -> Path:
        """Ensure audio storage directory exists"""
        storage_path = Path(cls.AUDIO_STORAGE_PATH)
        storage_path.mkdir(parents=True, exist_ok=True)
        return storage_path


class WebSocketConfig:
    """Configuration for WebSocket settings"""

    # Connection limits
    MAX_CONNECTIONS_PER_SESSION: int = int(os.getenv("MAX_CONNECTIONS_PER_SESSION", "5"))
    CONNECTION_TIMEOUT_SECONDS: int = int(os.getenv("CONNECTION_TIMEOUT_SECONDS", "300"))

    # Message limits
    MAX_MESSAGE_SIZE_BYTES: int = int(os.getenv("MAX_MESSAGE_SIZE_BYTES", "10485760"))  # 10MB
    HEARTBEAT_INTERVAL_SECONDS: int = int(os.getenv("HEARTBEAT_INTERVAL_SECONDS", "30"))

    # Error handling
    AUTO_RECONNECT_ATTEMPTS: int = int(os.getenv("AUTO_RECONNECT_ATTEMPTS", "3"))
    RECONNECT_DELAY_SECONDS: int = int(os.getenv("RECONNECT_DELAY_SECONDS", "5"))


# Global configuration instances
audio_config = AudioConfig()
websocket_config = WebSocketConfig()
