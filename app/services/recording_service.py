import json
import os
import subprocess
from datetime import datetime
from typing import Dict, List, Optional

from fastapi import HTTPException, UploadFile
from pydantic import BaseModel
from pytz import timezone
from sqlalchemy.orm import Session

from app.models import Recording
from app.schemas import RecordingResponse, RecordingUpdate
from app.utils.ai import summarization_service
from app.utils.recording_utils import apply_recording_update
from app.utils.text import md_to_html

SYSTEM_PROMPT_GUIDELINE = (
    "Bạn là một trợ lý AI chuyên nghiệp, thân thiện, tận tâm hỗ trợ người dùng phân tích nội dung cuộc họp. "
    "Nhiệm vụ của bạn là trả lời các câu hỏi một cách NGẮN GỌN, RÕ RÀNG, ĐÚNG TRỌNG TÂM, và chỉ dựa trên thông tin có trong transcript hoặc dữ liệu được cung cấp.\n"
    "\n"
    "QUY TẮC TRẢ LỜI:\n"
    "- Luôn trả lời bằng tiếng Việt, văn phong tự nhiên, dễ hiểu.\n"
    "- Không bịa đặt, không suy diễn, không đưa ra thông tin ngoài transcript.\n"
    "- Nếu không đủ dữ liệu để trả lời, hãy nói rõ: 'Không đủ thông tin trong transcript để trả lời câu hỏi này.'\n"
    "- Nếu câu hỏi không liên quan đến nội dung transcript, hãy lịch sự từ chối.\n"
    "- Nếu transcript có nhiều người nói, hãy cố gắng xác định ai nói nếu có thể, nhưng không tự gán tên nếu không rõ.\n"
    "- Tránh lặp lại toàn bộ transcript trong câu trả lời.\n"
    "\n"
    "VÍ DỤ:\n"
    "Q: Ai là người giao nhiệm vụ trong cuộc họp này?\n"
    "A: Theo transcript, không đủ thông tin để xác định ai là người giao nhiệm vụ.\n"
    "\n"
    "Q: Có bao nhiêu nhiệm vụ được đề cập?\n"
    "A: Trong transcript có 2 nhiệm vụ được nhắc đến: ... (liệt kê ngắn gọn nếu có).\n"
    "\n"
    "Hãy luôn tuân thủ các quy tắc trên trong mọi câu trả lời."
)
class RecordingChatResponse(BaseModel):
    response: str


async def chat_with_recording_transcription(
    db: Session,
    recording_id: int,
    user_id: int,
    message: str,
    history: List[Dict] = None,
) -> RecordingChatResponse:
    # Query recording
    recording = (
        db.query(Recording)
        .filter(
            Recording.id == recording_id,
            Recording.user_id == user_id,
            Recording.is_deleted == False,
        )
        .first()
    )
    if not recording or not recording.transcription:
        raise HTTPException(
            status_code=404, detail="Recording or transcription not found"
        )

    # Logging input
    print("[CHAT] Incoming chat request:")
    print(f"  recording_id: {recording_id}")
    print(f"  user_id: {user_id}")
    print(f"  message: {message}")
    print(f"  history: {history}")
    transcription = recording.transcription
    try:
        transcription_json = json.loads(transcription.replace("'",'"'))
        formatted_transcript_for_llm = f"{transcription_json[0]['speaker']}:{transcription_json[0]['sentence']}"
        for i, turn in enumerate(transcription_json[1:]):
            if turn['speaker'] == transcription_json[i-1]['speaker']:
                formatted_transcript_for_llm +=" "+ turn['sentence']
            else:
                formatted_transcript_for_llm += f"\n\n{turn['speaker']}:{turn['sentence']}"
    except Exception as e:
        print("==="*100)
        print("Error parsing transcription JSON:", e)
        formatted_transcript_for_llm = transcription

    # Gọi chat model (dùng ai.py)
    response = await summarization_service.chat_with_transcription(
        transcription=formatted_transcript_for_llm,
        message=message,
        message_history=history or [],
    )

    # Logging output
    print("[CHAT] Model response:")
    print(f" response: {response}")

    return RecordingChatResponse(response=response)


async def save_uploaded_file(
    db: Session, file: UploadFile, user_id: int
) -> RecordingResponse:
    from app.core.config import settings
    from app.utils.minio import minio_client

    # Create temp directory
    upload_dir = f"audio_sessions/tmp_{user_id}"
    os.makedirs(upload_dir, exist_ok=True)
    filename = file.filename
    file_path = os.path.join(upload_dir, filename)

    # Save file temporarily
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # Upload to MinIO
    bucket_name = f"{settings.minio_bucket_prefix}-user-{user_id}"
    object_name = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{filename}"

    try:
        minio_client.upload_file(file_path, bucket_name, object_name)
    except Exception as e:
        os.remove(file_path)
        raise HTTPException(
            status_code=500, detail=f"Failed to upload file to MinIO: {str(e)}"
        )

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
        audio_path=f"minio://{bucket_name}/{object_name}",
        bucket_name=bucket_name,
        object_name=object_name,
        duration=duration,
        file_size=len(content),
        status="PENDING",
        summary=None,
        transcription=None,
    )
    db.add(recording)
    db.commit()
    db.refresh(recording)

    # Trigger audio processing task
    from app.tasks.audio_tasks import transcribe_audio_task

    transcribe_audio_task.delay(recording.id, bucket_name, object_name)

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
    recording.updated_at = datetime.now(timezone("Asia/Ho_Chi_Minh"))
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


def add_html_fields_to_recording(recording: Recording) -> Recording:
    """Add HTML versions of markdown fields to recording"""
    # Convert summary to HTML
    if recording.summary:
        recording.summary_html = md_to_html(recording.summary)

    # Convert notes to HTML
    if recording.notes:
        recording.notes_html = md_to_html(recording.notes)

    return recording


def get_user_storage_usage(db: Session, user_id: int) -> int:
    """Get total storage usage for a user"""
    result = db.query(Recording).filter(Recording.user_id == user_id).all()
    return sum(r.file_size or 0 for r in result)
