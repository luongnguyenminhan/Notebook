import os
import subprocess
from datetime import datetime
from typing import List, Optional

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.recording import Recording
from app.schemas.recording import RecordingCreate, RecordingResponse, RecordingUpdate
from app.utils.recording_utils import apply_recording_update


async def save_uploaded_file(
    db: Session, file: UploadFile, user_id: int
) -> RecordingResponse:
    # Save uploaded file to disk (e.g., ./audio_sessions/user_{user_id}/)
    upload_dir = f"audio_sessions/user_{user_id}"
    os.makedirs(upload_dir, exist_ok=True)
    filename = file.filename
    file_path = os.path.join(upload_dir, filename)
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # Use ffmpeg to get duration
    try:
        result = subprocess.run(
            [
                "ffprobe",
                "-v",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                file_path,
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True,
        )
        print(result.stdout.strip())
        duration = float(result.stdout.strip())
    except Exception as e:
        print("[ERROR READING FILE LENGTH]: ", e)
        duration = None

    recording = Recording(
        user_id=user_id,
        filename=filename,
        title=f"Recording - {os.path.splitext(filename)[0]}",
        original_filename=file.filename,
        audio_path=file_path,
        duration=duration,
        file_size=len(content),
        status="PENDING",
        summary=None,
        transcription=None,
    )
    db.add(recording)
    db.commit()
    db.refresh(recording)
    return RecordingResponse.model_validate(recording, from_attributes=True)


def get_recordings(
    db: Session, user_id: int, skip: int = 0, limit: int = 100
) -> List[RecordingResponse]:
    recordings = (
        db.query(Recording)
        .filter(Recording.user_id == user_id, ~Recording.is_deleted)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [
        RecordingResponse.model_validate(r, from_attributes=True) for r in recordings
    ]


def get_recording(
    db: Session, recording_id: int, user_id: int
) -> Optional[RecordingResponse]:
    recording = (
        db.query(Recording)
        .filter(
            Recording.id == recording_id,
            Recording.user_id == user_id,
            ~Recording.is_deleted,
        )
        .first()
    )
    if not recording:
        return None
    return RecordingResponse.model_validate(recording, from_attributes=True)


def update_recording(
    db: Session, recording_id: int, recording_in: RecordingUpdate, user_id: int
) -> Optional[RecordingResponse]:
    recording = (
        db.query(Recording)
        .filter(
            Recording.id == recording_id,
            Recording.user_id == user_id,
            ~Recording.is_deleted,
        )
        .first()
    )
    if not recording:
        return None
    apply_recording_update(recording, recording_in)
    recording.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(recording)
    return RecordingResponse.model_validate(recording, from_attributes=True)


def delete_recording(db: Session, recording_id: int, user_id: int) -> None:
    recording = (
        db.query(Recording)
        .filter(
            Recording.id == recording_id,
            Recording.user_id == user_id,
            ~Recording.is_deleted,
        )
        .first()
    )
    if recording:
        recording.is_deleted = True
        db.commit()
