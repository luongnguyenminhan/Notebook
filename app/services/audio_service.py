import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional

import ffmpeg
from pydub import AudioSegment

from app.core.config import audio_config
from app.schemas.audio import AudioSessionInfo, AudioStreamSession


class AudioStreamManager:
    """Manages audio streaming sessions and file concatenation using FFmpeg"""

    def __init__(self, storage_path: Optional[str] = None):
        self.storage_path = Path(storage_path or audio_config.AUDIO_STORAGE_PATH)
        self.storage_path.mkdir(parents=True, exist_ok=True)
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
        """Add an audio chunk to the session and update the concatenated file"""
        if session_id not in self.active_sessions:
            return False

        session = self.active_sessions[session_id]
        temp_dir = self._temp_dirs[session_id]

        # Save chunk to temporary file
        chunk_file = temp_dir / f"chunk_{chunk_id:06d}.wav"

        try:
            # Convert bytes to audio file using pydub
            audio_segment = AudioSegment(
                data=chunk_data,
                sample_width=2,  # 16-bit
                frame_rate=sample_rate,
                channels=channels,
            )
            audio_segment.export(str(chunk_file), format="wav")

            # Update session stats
            session.total_chunks += 1
            session.duration_seconds += len(audio_segment) / 1000.0  # pydub uses milliseconds

            # Concatenate with existing file using FFmpeg
            await self._concatenate_chunk(session_id, chunk_file)

            return True

        except Exception as e:
            print(f"Error processing audio chunk {chunk_id} for session {session_id}: {e}")
            return False

    async def _concatenate_chunk(self, session_id: str, chunk_file: Path) -> None:
        """Concatenate new chunk with existing audio file using FFmpeg"""
        temp_dir = self._temp_dirs[session_id]
        output_file = self.storage_path / f"{session_id}.wav"

        if not output_file.exists():
            # First chunk - just copy it
            try:
                (
                    ffmpeg.input(str(chunk_file))
                    .output(str(output_file))
                    .overwrite_output()
                    .run(
                        quiet=True,
                        cmd=["ffmpeg", "-loglevel", audio_config.FFMPEG_LOGLEVEL],
                    )
                )
            except ffmpeg.Error as e:
                print(f"FFmpeg error creating initial file: {e}")
        else:
            # Concatenate with existing file
            temp_concat_file = temp_dir / "temp_concat.wav"

            try:
                # Create concat filter
                input1 = ffmpeg.input(str(output_file))
                input2 = ffmpeg.input(str(chunk_file))

                (
                    ffmpeg.concat(input1, input2, v=0, a=1)
                    .output(str(temp_concat_file))
                    .overwrite_output()
                    .run(
                        quiet=True,
                        cmd=["ffmpeg", "-loglevel", audio_config.FFMPEG_LOGLEVEL],
                    )
                )

                # Replace original with concatenated version
                temp_concat_file.replace(output_file)

            except ffmpeg.Error as e:
                print(f"FFmpeg error concatenating: {e}")

    def get_session_info(self, session_id: str) -> Optional[AudioSessionInfo]:
        """Get information about an audio session"""
        if session_id not in self.active_sessions:
            return None

        session = self.active_sessions[session_id]
        output_file = self.storage_path / f"{session_id}.wav"

        return AudioSessionInfo(
            session_id=session.session_id,
            user_id=session.user_id,
            start_time=session.start_time,
            status=session.status,
            file_path=str(output_file),
            total_chunks=session.total_chunks,
            duration_seconds=session.duration_seconds,
            sample_rate=44100,  # Default
            channels=1,  # Default
            format="wav",
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
        """Get the path to the concatenated audio file"""
        if session_id not in self.active_sessions:
            return None

        output_file = self.storage_path / f"{session_id}.wav"
        return str(output_file) if output_file.exists() else None


# Global instance
audio_stream_manager = AudioStreamManager()
