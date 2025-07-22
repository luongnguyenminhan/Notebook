"""
AI services for transcription and summarization
"""

import json
import os
from typing import Any, Dict, List, Optional

import aiohttp
import httpx
import logging

from app.core.config import settings
import re
from app.services.chat_service import chat_service

logger = logging.getLogger(__name__)


class TranscriptionService:
    """Dịch vụ chuyển đổi âm thanh thành văn bản"""

    def __init__(self, base_url: str = "https://open-ai-api.epoints.vn") -> None:
        self.base_url = base_url
        self.headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
            "x-header-checksum": "fixed-checksum-that-never-changes-123456789",
        }

    async def process_audio(self, audio_path: str) -> Dict | None:
        """
        Xử lý file âm thanh và trả về transcript
        Args:
            audio_path: Đường dẫn file âm thanh
        Returns:
            Dictionary chứa transcript và số lượng token
        """
        try:
            endpoint = f"{self.base_url}/api/v1/meeting-note/audio-to-transcript"
            if not os.path.exists(audio_path):
                raise FileNotFoundError(f"Không tìm thấy file âm thanh: {audio_path}")
            logger.debug(f"Xử lý file âm thanh: {audio_path}")
            async with aiohttp.ClientSession() as session:
                with open(audio_path, "rb") as audio_file:
                    data = aiohttp.FormData()
                    data.add_field(
                        "audio",
                        audio_file,
                        filename=os.path.basename(audio_path),
                        content_type="multipart/form-data",
                    )
                    logger.debug(f"Gửi request tới endpoint: {endpoint}")
                    async with session.post(
                        endpoint,
                        headers={"accept": "application/json"},
                        data=data,
                        timeout=10000000000,
                    ) as response:
                        logger.debug(f"Trạng thái response: {response.status}")
                        response.raise_for_status()
                        data = await response.read()
                        result = json.loads(data.decode("utf-8"))
                        logger.debug(f"Nhận dữ liệu response hoàn chỉnh")
                        transcript = result.get("transcript", "")
                        transcript = re.sub(
                            r"\s\[\d{2}/\d{2}/\d{4} \d{2}:\d{2} (AM|PM)\]",
                            ":",
                            transcript,
                        ).strip()
                        entries = re.split(r"(?=SPEAKER_\d+:)", transcript.strip())

                        # Convert to desired structure
                        trs: List[Dict[str, str]] = []
                        for entry in entries:
                            match = re.match(r"(SPEAKER_\d+):\s*(.*)", entry, re.DOTALL)
                            if match:
                                speaker = match.group(1).strip()
                                sentence = re.sub(r"\s+", " ", match.group(2).strip())
                                if sentence:
                                    trs.append(
                                        {
                                            "speaker": speaker,
                                            "sentence": re.sub(
                                                r"[^a-zA-Z0-9À-ỹ\s]",
                                                "",
                                                sentence.lower(),
                                            ),
                                        }
                                    )
                        print("Kết quả:", trs)
                        return {
                            "transcript": trs,
                            "tokens": result.get(
                                "tokens",
                                {"totalTokens": 0, "cachedContentTokenCount": 0},
                            ),
                        }
        except aiohttp.ClientError as e:
            logger.error(f"Lỗi API request: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Lỗi không xác định trong process_audio: {str(e)}")
            return None


class ASRService:
    """Service for ASR endpoint transcription"""

    def __init__(self):
        self.base_url = settings.asr_endpoint

    async def transcribe_audio_asr(
        self,
        audio_file_path: str,
        diarize: bool = True,
        min_speakers: Optional[int] = None,
        max_speakers: Optional[int] = None,
    ) -> Dict[str, Any]:
        """Transcribe audio using ASR endpoint"""
        if not self.base_url:
            raise Exception("ASR endpoint not configured")

        try:
            async with httpx.AsyncClient(timeout=300.0) as client:
                with open(audio_file_path, "rb") as audio_file:
                    files = {"file": audio_file}
                    data = {
                        "diarize": str(diarize).lower(),
                    }

                    if min_speakers is not None:
                        data["min_speakers"] = str(min_speakers)
                    if max_speakers is not None:
                        data["max_speakers"] = str(max_speakers)

                    response = await client.post(f"{self.base_url}/transcribe", files=files, data=data)
                    response.raise_for_status()

                    return response.json()

        except Exception as e:
            raise Exception(f"ASR transcription failed: {str(e)}")


class SummarizationService:
    """Dịch vụ tóm tắt văn bản sử dụng post_message"""

    def __init__(self, base_url: str = "https://open-ai-api.epoints.vn"):
        self.base_url = base_url
        self.headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
            "x-header-checksum": "fixed-checksum-that-never-changes-123456789",
        }

    async def generate_summary(self, transcription: str, email: str | None = None) -> str:
        """
        Gửi transcript tới endpoint post_message để lấy summary
        Args:
            transcription: Nội dung transcript
            email: Email người dùng (nếu có)
        Returns:
            Summary string
        """
        try:
            endpoint = f"{self.base_url}/api/v2/meeting-note/post-messages"
            payload = {"prompt": str(transcription)}
            if email:
                payload["email"] = email
            else:
                payload["email"] = ""
            async with aiohttp.ClientSession() as session:
                async with session.post(endpoint, headers=self.headers, json=payload) as response:
                    response.raise_for_status()
                    result = await response.json()
                    # Giả sử API trả về summary trong trường 'summary'
                    return result.get("meeting_note", "")
        except aiohttp.ClientError as e:
            logger.error(f"Lỗi khi gửi post_message: {str(e)}")
            raise Exception(f"Lỗi khi gửi post_message: {str(e)}")
        except Exception as e:
            logger.error(f"Lỗi không xác định trong generate_summary: {str(e)}")
            raise Exception(f"Lỗi không xác định trong generate_summary: {str(e)}")

    async def chat_with_transcription(
        self,
        transcription: str,
        message: str,
        message_history: List[Dict[str, str]] = None,
    ) -> str:
        """Chat with transcription content"""
        if not transcription.strip():
            return "No transcription available to chat with."

        # Build conversation history
        messages = [
            {
                "role": "system",
                "content": f"You are an AI assistant helping to analyze and discuss the following transcription. Answer questions based on the content provided.\n\nTranscription:\n{transcription}",
            }
        ]

        # Add message history if provided
        if message_history:
            messages.extend(message_history)

        # Add current message
        messages.append({"role": "user", "content": message})

        try:
            # Gọi chat_service (Ollama)
            return chat_service.chat(message, messages)

        except Exception as e:
            raise Exception(f"Chat failed: {str(e)}")

    async def identify_speakers_from_text(self, transcription: str, current_speaker_map: Optional[Dict[str, Any]] = None) -> Dict[str, str]:
        """Identify speakers from transcription text using LLM"""
        if not transcription.strip():
            return {}

        prompt = """Analyze the following transcription and identify the speakers based on context clues, 
        speaking patterns, and content. Return a JSON object mapping generic speaker labels (like "Speaker 1", "Speaker 2") 
        to likely names or roles. If you cannot determine specific names, suggest descriptive roles like "Interviewer", 
        "Interviewee", "Manager", "Developer", etc.
        
        Only return the JSON object, no additional text."""

        try:
            # Xoá các hàm hoặc biến liên quan đến OpenAI
            # response = self.client.chat.completions.create(
            #     model=settings.text_model_name,
            #     messages=[
            #         {"role": "system", "content": prompt},
            #         {"role": "user", "content": transcription},
            #     ],
            #     max_tokens=500,
            #     temperature=0.3,
            # )

            # result = response.choices[0].message.content.strip()

            # Try to parse JSON response
            # try:
            #     return json.loads(result)
            # except json.JSONDecodeError:
            #     # If JSON parsing fails, return empty dict
            #     return {}
            return {}

        except Exception as e:
            raise Exception(f"Speaker identification failed: {str(e)}")


# Service instances
transcription_service = TranscriptionService()
asr_service = ASRService()
summarization_service = SummarizationService()
