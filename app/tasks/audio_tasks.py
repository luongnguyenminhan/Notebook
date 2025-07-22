"""
Celery tasks for audio processing
"""

import os
from datetime import datetime
from typing import Optional

from celery import current_task
from pytz import timezone

from app.core.celery import celery
from app.models import Recording
from app.utils.ai import asr_service, summarization_service, transcription_service
from app.utils.text import generate_title_from_transcription

from .base import get_db_session, safe_db_operation

import asyncio


@celery.task(bind=True)
def transcribe_audio_task(
    self,
    recording_id: int,
    bucket_name: str,
    object_name: str,
    language: Optional[str] = None,
    diarize: bool = False,
    min_speakers: Optional[int] = None,
    max_speakers: Optional[int] = None,
):
    """Celery task to transcribe audio"""
    from app.utils.minio import minio_client

    db = get_db_session()

    # Create temp directory
    temp_dir = f"audio_tmp/{recording_id}"
    os.makedirs(temp_dir, exist_ok=True)
    audio_file_path = os.path.join(temp_dir, object_name)

    # Download file from MinIO
    try:
        minio_client.download_file(bucket_name, object_name, audio_file_path)
    except Exception as e:
        raise Exception(f"Failed to download file from MinIO: {str(e)}")

    try:
        # Update task status
        current_task.update_state(
            state="PROGRESS",
            meta={"current": 0, "total": 100, "status": "Starting transcription..."},
        )

        # Get recording
        def get_recording(session):
            return session.query(Recording).filter(Recording.id == recording_id).first()

        recording = safe_db_operation(db, get_recording)
        if not recording:
            raise Exception("Recording not found")

        # Update recording status
        recording.status = "PROCESSING"
        recording.processing_started_at = datetime.now(timezone("Asia/Ho_Chi_Minh"))
        db.commit()

        # Update task status
        current_task.update_state(
            state="PROGRESS",
            meta={"current": 25, "total": 100, "status": "Transcribing audio..."},
        )

        # Choose transcription service
        from app.core.config import settings

        if settings.use_asr_endpoint and diarize:
            # Use ASR service for diarization
            result = asyncio.run(asr_service.transcribe_audio_asr(audio_file_path, diarize, min_speakers, max_speakers))
            transcription = result.get("transcript", "")
        else:
            # Use OpenAI Whisper
            result = asyncio.run(transcription_service.process_audio(audio_file_path))
            transcription = result.get("transcript", "")
            print("=====" * 100)
            print(transcription)

        # Update task status
        current_task.update_state(
            state="PROGRESS",
            meta={"current": 75, "total": 100, "status": "Processing transcription..."},
        )

        # Update recording with transcription
        recording.transcription = str(transcription)
        recording.status = "SUMMARIZING"

        # Generate title if not provided
        if not recording.title:
            recording.title = generate_title_from_transcription(str(transcription))

        db.commit()

        # Start summarization task
        generate_summary_task.delay(
            recording_id,
            transcription,
            recording.owner.summary_prompt,
            recording.owner.output_language,
        )

        return {
            "status": "SUCCESS",
            "recording_id": recording_id,
            "transcription_length": len(transcription),
        }

    except Exception as e:
        # Update recording with error
        def get_recording(session):
            return session.query(Recording).filter(Recording.id == recording_id).first()

        recording = safe_db_operation(db, get_recording)
        if recording:
            recording.status = "FAILED"
            recording.error_message = str(e)
            recording.processing_completed_at = datetime.now(timezone("Asia/Ho_Chi_Minh"))
            db.commit()

        raise Exception(f"Transcription failed: {str(e)}")

    finally:
        db.close()


@celery.task(bind=True)
def generate_summary_task(
    self,
    recording_id: int,
    transcription: str,
    custom_prompt: Optional[str] = None,
    output_language: Optional[str] = None,
):
    """Celery task to generate summary"""
    db = get_db_session()

    try:
        # Update task status
        current_task.update_state(
            state="PROGRESS",
            meta={"current": 0, "total": 100, "status": "Starting summarization..."},
        )

        # Get recording
        def get_recording(session):
            return session.query(Recording).filter(Recording.id == recording_id).first()

        recording = safe_db_operation(db, get_recording)
        if not recording:
            raise Exception("Recording not found")

        # Update task status
        current_task.update_state(
            state="PROGRESS",
            meta={"current": 50, "total": 100, "status": "Generating summary..."},
        )

        # Generate summary
        # summary = asyncio.run(
        #     summarization_service.generate_summary(
        #         transcription, custom_prompt, output_language or "English"
        #     )
        # )
        summary = asyncio.run(summarization_service.generate_summary(transcription))
        print("====--===-=-=-=-=" * 100)
        print("summary hererererer", summary)
        # Update task status
        current_task.update_state(
            state="PROGRESS",
            meta={"current": 90, "total": 100, "status": "Finalizing..."},
        )

        # Update recording
        recording.summary = summary
        recording.status = "COMPLETED"
        recording.processing_completed_at = datetime.now(timezone("Asia/Ho_Chi_Minh"))

        db.commit()

        return {
            "status": "SUCCESS",
            "recording_id": recording_id,
            "summary_length": len(summary),
        }

    except Exception as e:
        # Update recording with error
        def get_recording(session):
            return session.query(Recording).filter(Recording.id == recording_id).first()

        recording = safe_db_operation(db, get_recording)
        if recording:
            recording.status = "FAILED"
            recording.error_message = str(e)
            recording.processing_completed_at = datetime.now(timezone("Asia/Ho_Chi_Minh"))
            db.commit()

        raise Exception(f"Summarization failed: {str(e)}")

    finally:
        db.close()


@celery.task(bind=True)
def transcribe_audio_asr_task(
    self,
    recording_id: int,
    bucket_name: str,
    object_name: str,
    diarize: bool = True,
    min_speakers: Optional[int] = None,
    max_speakers: Optional[int] = None,
):
    """Celery task to transcribe audio using ASR endpoint"""
    from app.utils.minio import minio_client

    db = get_db_session()

    # Create temp directory
    temp_dir = f"audio_tmp/{recording_id}"
    os.makedirs(temp_dir, exist_ok=True)
    audio_file_path = os.path.join(temp_dir, object_name)

    # Download file from MinIO
    try:
        minio_client.download_file(bucket_name, object_name, audio_file_path)
    except Exception as e:
        raise Exception(f"Failed to download file from MinIO: {str(e)}")

    try:
        # Update task status
        current_task.update_state(
            state="PROGRESS",
            meta={
                "current": 0,
                "total": 100,
                "status": "Starting ASR transcription...",
            },
        )

        # Get recording
        def get_recording(session):
            return session.query(Recording).filter(Recording.id == recording_id).first()

        recording = safe_db_operation(db, get_recording)
        if not recording:
            raise Exception("Recording not found")

        # Update recording status
        recording.status = "PROCESSING"
        recording.processing_started_at = datetime.now(timezone("Asia/Ho_Chi_Minh"))
        db.commit()

        # Update task status
        current_task.update_state(
            state="PROGRESS",
            meta={"current": 25, "total": 100, "status": "Processing with ASR..."},
        )

        # Use ASR service
        result = asyncio.run(asr_service.transcribe_audio_asr(audio_file_path, diarize, min_speakers, max_speakers))
        transcription = result.get("transcript", "")

        # Update task status
        current_task.update_state(
            state="PROGRESS",
            meta={"current": 75, "total": 100, "status": "Processing transcription..."},
        )

        # Update recording with transcription
        import json

        if isinstance(transcription, dict) or isinstance(transcription, list):
            recording.transcription = json.dumps(transcription, ensure_ascii=False)
        else:
            recording.transcription = transcription
        recording.status = "SUMMARIZING"

        # Generate title if not provided
        if not recording.title:
            if isinstance(transcription, (dict, list)):
                text_for_title = json.dumps(transcription, ensure_ascii=False)
            else:
                text_for_title = transcription
            recording.title = generate_title_from_transcription(text_for_title)

        db.commit()

        # Start summarization task
        generate_summary_task.delay(
            recording_id,
            transcription,
            recording.owner.summary_prompt,
            recording.owner.output_language,
        )

        return {
            "status": "SUCCESS",
            "recording_id": recording_id,
            "transcription_length": len(transcription),
        }

    except Exception as e:
        # Update recording with error
        def get_recording(session):
            return session.query(Recording).filter(Recording.id == recording_id).first()

        recording = safe_db_operation(db, get_recording)
        if recording:
            recording.status = "FAILED"
            recording.error_message = str(e)
            recording.processing_completed_at = datetime.now(timezone("Asia/Ho_Chi_Minh"))
            db.commit()

        raise Exception(f"ASR transcription failed: {str(e)}")

    finally:
        db.close()
