from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class AudioChunkMessage(BaseModel):
    """Schema for audio chunk messages received via WebSocket"""

    chunk_id: int
    timestamp: datetime
    audio_data: bytes
    sample_rate: Optional[int] = 44100
    channels: Optional[int] = 1
    format: Optional[str] = "wav"


class AudioStreamSession(BaseModel):
    """Schema for audio streaming session information"""

    session_id: str
    user_id: Optional[str] = None
    start_time: datetime
    status: str = "active"  # active, paused, completed, error
    total_chunks: int = 0
    duration_seconds: float = 0.0


class AudioStreamResponse(BaseModel):
    """Schema for WebSocket responses during audio streaming"""

    message: str
    session_id: str
    chunk_count: int
    status: str


class AudioSessionRequest(BaseModel):
    """Schema for audio session creation request"""

    user_id: Optional[str] = None
    sample_rate: Optional[int] = 44100
    channels: Optional[int] = 1
    format: Optional[str] = "wav"


class AudioSessionInfo(BaseModel):
    """Schema for audio session information response"""

    session_id: str
    user_id: Optional[str] = None
    start_time: datetime
    status: str
    file_path: str
    total_chunks: int
    duration_seconds: float
    sample_rate: int
    channels: int
    format: str
