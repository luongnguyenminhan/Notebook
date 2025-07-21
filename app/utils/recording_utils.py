from app.schemas.recording import RecordingUpdate
from app.models.recording import Recording


def apply_recording_update(recording: Recording, update: RecordingUpdate) -> None:
    update_data = update.dict(exclude_unset=True)
    for field, value in update_data.items():
        # Ensure summary and transcription are handled as Text
        if field in ["summary", "transcription"]:
            setattr(recording, field, value if value is not None else None)
        else:
            setattr(recording, field, value)
