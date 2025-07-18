import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional

import ffmpeg

from app.core.config import audio_config
from app.schemas.audio import AudioSessionInfo, AudioStreamSession
import threading
import queue


class AudioStreamManager:
    # Transcription queue and worker
    _transcription_queue = queue.Queue()
    _transcription_thread = None

    def _start_transcription_worker(self):
        if not self._transcription_thread or not self._transcription_thread.is_alive():
            self._transcription_thread = threading.Thread(target=self._transcription_worker, daemon=True)
            self._transcription_thread.start()

    def _transcription_worker(self):
        while True:
            try:
                session_id, chunk_file = self._transcription_queue.get(timeout=2)
            except queue.Empty:
                continue
            try:
                # Dummy transcription logic (replace with actual model call)
                transcript = f"[{chunk_file.name}] recognized text\n"
                transcript_path = self.storage_path / f"{session_id}_transcript.txt"
                with open(transcript_path, "a", encoding="utf-8") as f:
                    f.write(transcript)
            except Exception as e:
                print(f"Transcription error: {e}")
            finally:
                self._transcription_queue.task_done()

    """Manages audio streaming sessions and file concatenation using FFmpeg"""

    def __init__(self, storage_path: Optional[str] = None):
        self.storage_path = Path(storage_path or audio_config.AUDIO_STORAGE_PATH)
        try:
            self.storage_path.mkdir(parents=True, exist_ok=True)
        except PermissionError:
            # If we can't create the storage path, try to use a fallback
            import tempfile

            fallback_path = Path(tempfile.gettempdir()) / "audio_sessions"
            fallback_path.mkdir(parents=True, exist_ok=True)
            self.storage_path = fallback_path
            print(f"Warning: Could not create {storage_path}, using fallback: {self.storage_path}")

        self.active_sessions: Dict[str, AudioStreamSession] = {}
        self._temp_dirs: Dict[str, Path] = {}

    def create_session(
        self,
        user_id: Optional[str] = None,
        sample_rate: Optional[int] = None,
        channels: Optional[int] = None,
        format: Optional[str] = None,
    ) -> str:
        """Create a new audio streaming session"""
        session_id = str(uuid.uuid4())

        # Use defaults from config if not provided
        sample_rate = sample_rate or audio_config.DEFAULT_SAMPLE_RATE
        channels = channels or audio_config.DEFAULT_CHANNELS
        format = format or audio_config.DEFAULT_FORMAT

        # Create session object
        session = AudioStreamSession(
            session_id=session_id,
            user_id=user_id,
            start_time=datetime.now(),
            status="active",
            total_chunks=0,
            duration_seconds=0.0,
        )

        # Create temporary directory for chunks
        temp_dir = self.storage_path / f"session_{session_id}"
        temp_dir.mkdir(exist_ok=True)

        self.active_sessions[session_id] = session
        self._temp_dirs[session_id] = temp_dir

        return session_id

    async def add_audio_chunk(
        self,
        session_id: str,
        chunk_data: bytes,
        chunk_id: int,
        sample_rate: int = 44100,
        channels: int = 1,
    ) -> bool:
        """Add an audio chunk to the session and store directly without conversion"""
        if session_id not in self.active_sessions:
            return False

        session = self.active_sessions[session_id]
        temp_dir = self._temp_dirs[session_id]

        try:
            # Detect format and save chunk directly
            chunk_file = None
            detected_format = "webm"  # Default assumption

            # Try to detect the format
            try:
                # Save to temporary file for format detection
                temp_detection_file = temp_dir / f"detect_{chunk_id:06d}.dat"
                with open(temp_detection_file, "wb") as f:
                    f.write(chunk_data)

                # Probe the file to detect format
                probe_result = ffmpeg.probe(str(temp_detection_file))
                if probe_result.get("format"):
                    format_name = probe_result["format"].get("format_name", "unknown")
                    print(f"Detected format: {format_name}")

                    # Determine file extension based on detected format
                    if "webm" in format_name or "matroska" in format_name:
                        detected_format = "webm"
                    elif "wav" in format_name:
                        detected_format = "wav"
                    elif "ogg" in format_name:
                        detected_format = "ogg"
                    elif "mp4" in format_name:
                        detected_format = "mp4"
                    else:
                        detected_format = "webm"  # Default to WebM

                # Clean up detection file
                temp_detection_file.unlink()

            except Exception as probe_e:
                print(f"Format detection failed: {probe_e}, assuming WebM")
                detected_format = "webm"
                # Clean up detection file if it exists
                temp_detection_file = temp_dir / f"detect_{chunk_id:06d}.dat"
                if temp_detection_file.exists():
                    temp_detection_file.unlink()

            # Save chunk with detected format extension
            chunk_file = temp_dir / f"chunk_{chunk_id:06d}.{detected_format}"

            print(f"Saving chunk {chunk_id} as {detected_format} format ({len(chunk_data)} bytes)")

            with open(chunk_file, "wb") as f:
                f.write(chunk_data)

            # Try to get duration for session stats
            duration_seconds = 3.0  # Default duration (3 seconds based on client chunk size)
            try:
                probe_result = ffmpeg.probe(str(chunk_file))
                if probe_result.get("streams"):
                    input_stream = probe_result["streams"][0]
                    if "duration" in input_stream:
                        duration_seconds = float(input_stream["duration"])
                        print(f"Detected duration: {duration_seconds:.2f} seconds")

                    # Log additional info
                    detected_sample_rate = input_stream.get("sample_rate", "unknown")
                    detected_channels = input_stream.get("channels", "unknown")
                    print(f"Audio properties: {detected_sample_rate}Hz, {detected_channels} channels")

            except Exception as duration_e:
                print(f"Could not detect duration: {duration_e}, using default")

            # Update session stats
            session.total_chunks += 1
            session.duration_seconds += duration_seconds

            # Store chunk in final location (copy to main audio_sessions directory)
            final_chunk_file = self.storage_path / f"{session_id}_chunk_{chunk_id:06d}.{detected_format}"
            import shutil

            shutil.copy2(chunk_file, final_chunk_file)

            print(f"Stored chunk to: {final_chunk_file}")

            # Add to transcription queue (transcription will handle the original format)
            self._start_transcription_worker()
            self._transcription_queue.put((session_id, chunk_file))

            return True

        except Exception as e:
            print(f"Error processing audio chunk {chunk_id} for session {session_id}: {e}")
            return False

    def get_session_info(self, session_id: str) -> Optional[AudioSessionInfo]:
        """Get information about an audio session"""
        if session_id not in self.active_sessions:
            return None

        session = self.active_sessions[session_id]
        # List all chunk files for this session
        chunk_files = list(self.storage_path.glob(f"{session_id}_chunk_*.webm")) + list(self.storage_path.glob(f"{session_id}_chunk_*.wav")) + list(self.storage_path.glob(f"{session_id}_chunk_*.ogg")) + list(self.storage_path.glob(f"{session_id}_chunk_*.mp4"))

        # Use the first chunk file as the main file path, or create a generic path
        if chunk_files:
            file_path = str(chunk_files[0])
        else:
            file_path = str(self.storage_path / f"{session_id}_chunks")

        return AudioSessionInfo(
            session_id=session.session_id,
            user_id=session.user_id,
            start_time=session.start_time,
            status=session.status,
            file_path=file_path,
            total_chunks=session.total_chunks,
            duration_seconds=session.duration_seconds,
            sample_rate=44100,  # Default
            channels=1,  # Default
            format="webm",  # Default to WebM since we're not converting
        )

    def close_session(self, session_id: str) -> bool:
        """Close an audio session and clean up temporary files"""
        if session_id not in self.active_sessions:
            return False

        # Update session status
        self.active_sessions[session_id].status = "completed"

        # Clean up temporary directory
        temp_dir = self._temp_dirs.get(session_id)
        if temp_dir and temp_dir.exists():
            import shutil

            shutil.rmtree(temp_dir)
            del self._temp_dirs[session_id]

        return True

    def get_audio_file_path(self, session_id: str) -> Optional[str]:
        """Get the paths to all audio chunk files for a session"""
        if session_id not in self.active_sessions:
            return None

        # Find all chunk files for this session
        chunk_files = list(self.storage_path.glob(f"{session_id}_chunk_*.webm")) + list(self.storage_path.glob(f"{session_id}_chunk_*.wav")) + list(self.storage_path.glob(f"{session_id}_chunk_*.ogg")) + list(self.storage_path.glob(f"{session_id}_chunk_*.mp4"))

        if chunk_files:
            # Return the directory path where chunks are stored
            return str(self.storage_path)

        return None


# Global instance
audio_stream_manager = AudioStreamManager()
