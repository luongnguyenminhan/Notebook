from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.recording import (
    RecordingResponse,
    RecordingUpdate,
)
from app.services.recording_service import (
    delete_recording,
    get_recording,
    get_recordings,
    save_uploaded_file,
    update_recording,
)
from ...utils.text import md_to_html

router = APIRouter(prefix="/recordings", tags=["recordings"])


# Upload binary audio file and return filename
@router.post("/", status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return await save_uploaded_file(db=db, file=file, user_id=current_user.id)


@router.get("/", response_model=List[RecordingResponse])
async def read_all(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
):
    return get_recordings(db=db, user_id=current_user.id, skip=skip, limit=limit)


@router.get("/{recording_id}", response_model=RecordingResponse)
async def read_one(
    recording_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    recording = get_recording(db=db, recording_id=recording_id, user_id=current_user.id)
    if not recording:
        raise HTTPException(status_code=404, detail="Recording not found")
    recording.summary = md_to_html(recording.summary)
    return recording


@router.put("/{recording_id}", response_model=RecordingResponse)
async def update(
    recording_id: int,
    recording_in: RecordingUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return update_recording(
        db=db,
        recording_id=recording_id,
        recording_in=recording_in,
        user_id=current_user.id,
    )


@router.delete("/{recording_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(
    recording_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    delete_recording(db=db, recording_id=recording_id, user_id=current_user.id)
    return None
