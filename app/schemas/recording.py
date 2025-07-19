from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class RecordingBase(BaseModel):
    filename: str
    original_filename: Optional[str] = None


class RecordingCreate(RecordingBase):
    pass


class RecordingUpdate(BaseModel):
    filename: Optional[str] = None
    original_filename: Optional[str] = None
    transcription: Optional[str] = None
    summary: Optional[str] = None
    status: Optional[str] = None
    file_size: Optional[int] = None
    duration: Optional[int] = None
    error_message: Optional[str] = None


class RecordingResponse(RecordingBase):
    id: int
    user_id: int
    audio_path: Optional[str] = None
    transcription: Optional[str] = None
    summary: Optional[str] = None
    status: str
    file_size: Optional[int] = None
    duration: Optional[int] = None
    processing_started_at: Optional[datetime] = None
    processing_completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
