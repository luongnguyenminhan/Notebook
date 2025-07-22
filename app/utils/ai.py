"""
AI services for transcription and summarization
"""

import json
import os
from typing import Any, Dict, List, Optional

import aiohttp
import httpx
from openai import OpenAI

from app.core.config import settings


class TranscriptionService:
    """Service for audio transcription"""

    def __init__(self, base_url: str = "https://open-ai-api.epoints.vn") -> None:
        self.base_url = base_url
        self.headers = {"accept": "application/json", "Content-Type": "application/json", "x-header-checksum": "fixed-checksum-that-never-changes-123456789"}  # Replace with actual checksum value

    async def process_audio(self, audio_path: str) -> Dict | None:
        """
        Process an audio file and return the transcript

        Args:
                audio_path: Path to the audio file

        Returns:
                Dictionary containing transcript and token count
        """
        try:
            endpoint = f'{self.base_url}/api/v1/meeting-note/audio-to-transcript'

            # Check if file exists
            if not os.path.exists(audio_path):
                raise FileNotFoundError(f'Audio file not found: {audio_path}')

            # Prepare the file for upload
            print(f'Processing audio file: {audio_path}')
            async with aiohttp.ClientSession() as session:
                with open(audio_path, 'rb') as audio_file:
                    data = aiohttp.FormData()
                    data.add_field(
                        'audio',
                        audio_file,
                        filename=os.path.basename(audio_path),
                        content_type='multipart/form-data',
                    )

                    # Send the request
                    print(f'Sending request to endpoint: {endpoint}')
                    async with session.post(endpoint, headers={'accept': 'application/json'}, data=data, timeout=10000000000) as response:
                        print(f'Response status: {response.status}')
                        response.raise_for_status()

                        # Read the entire response at once
                        data = await response.read()
                        result = json.loads(data.decode('utf-8'))

                        print('Received complete response data')
                        print('Result:', result)
                        transcript = result.get('transcript', '')
                        return {
                            'transcript': transcript,
                        }

        except aiohttp.ClientError as e:
            print(f'API request failed: {str(e)}')
            return None
        except Exception as e:
            print(f'Unexpected error in process_audio: {str(e)}')
            return None



class ASRService:
    """Service for ASR endpoint transcription"""

    def __init__(self):
        self.base_url = settings.ASR_BASE_URL

    async def transcribe_audio_asr(self, audio_file_path: str, diarize: bool = True, min_speakers: Optional[int] = None, max_speakers: Optional[int] = None) -> Dict[str, Any]:
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
    """Service for text summarization"""

    def __init__(self):
        self.client = OpenAI(api_key=settings.TEXT_MODEL_API_KEY, base_url=settings.TEXT_MODEL_BASE_URL)

    async def generate_summary(self, transcription: str, custom_prompt: Optional[str] = None, output_language: str = "English") -> str:
        """Generate summary from transcription"""
        if not transcription.strip():
            return ""

        # Default summary prompt
        default_prompt = f"""Please provide a comprehensive summary of the following transcription in {output_language}. 
        Include key points, decisions made, action items, and important details discussed."""

        prompt = custom_prompt or default_prompt

        try:
            response = self.client.chat.completions.create(model=settings.TEXT_MODEL_NAME, messages=[{"role": "system", "content": prompt}, {"role": "user", "content": transcription}], max_tokens=settings.SUMMARY_MAX_TOKENS, temperature=0.3)

            return response.choices[0].message.content.strip()

        except Exception as e:
            raise Exception(f"Summarization failed: {str(e)}")

    async def chat_with_transcription(self, transcription: str, message: str, message_history: List[Dict[str, str]] = None) -> str:
        """Chat with transcription content"""
        if not transcription.strip():
            return "No transcription available to chat with."

        # Build conversation history
        messages = [{"role": "system", "content": f"You are an AI assistant helping to analyze and discuss the following transcription. Answer questions based on the content provided.\n\nTranscription:\n{transcription}"}]

        # Add message history if provided
        if message_history:
            messages.extend(message_history)

        # Add current message
        messages.append({"role": "user", "content": message})

        try:
            response = self.client.chat.completions.create(model=settings.TEXT_MODEL_NAME, messages=messages, max_tokens=settings.CHAT_MAX_TOKENS, temperature=0.7)

            return response.choices[0].message.content.strip()

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
            response = self.client.chat.completions.create(model=settings.TEXT_MODEL_NAME, messages=[{"role": "system", "content": prompt}, {"role": "user", "content": transcription}], max_tokens=500, temperature=0.3)

            result = response.choices[0].message.content.strip()

            # Try to parse JSON response
            try:
                return json.loads(result)
            except json.JSONDecodeError:
                # If JSON parsing fails, return empty dict
                return {}

        except Exception as e:
            raise Exception(f"Speaker identification failed: {str(e)}")


# Service instances
transcription_service = TranscriptionService()
asr_service = ASRService()
summarization_service = SummarizationService()
