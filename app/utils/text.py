"""
Text processing utilities
"""

import re
import markdown
from typing import Optional


def md_to_html(text: Optional[str]) -> Optional[str]:
    """Convert markdown text to HTML"""
    if not text:
        return None

    # Configure markdown with extensions
    md = markdown.Markdown(
        extensions=["nl2br", "fenced_code", "tables"],
        extension_configs={
            "nl2br": {},
        },
    )

    return md.convert(text)


def format_transcription_for_llm(transcription: str, speaker_map: Optional[dict] = None) -> str:
    """Format transcription text for LLM processing"""
    if not transcription:
        return ""

    # If speaker_map is provided, replace speaker labels
    if speaker_map:
        formatted_text = transcription
        for original_name, speaker_info in speaker_map.items():
            if speaker_info.get("name"):
                # Replace speaker labels in format "Speaker 1:" or "[Speaker 1]"
                patterns = [
                    rf"\b{re.escape(original_name)}:",
                    rf"\[{re.escape(original_name)}\]",
                    rf"<{re.escape(original_name)}>",
                ]

                replacement = f"{speaker_info['name']}:"
                for pattern in patterns:
                    formatted_text = re.sub(pattern, replacement, formatted_text, flags=re.IGNORECASE)

        return formatted_text

    return transcription


def clean_text(text: str) -> str:
    """Clean and normalize text"""
    if not text:
        return ""

    # Remove extra whitespace
    text = re.sub(r"\s+", " ", text)

    # Remove leading/trailing whitespace
    text = text.strip()

    return text


def extract_speakers_from_transcription(transcription: str) -> list[str]:
    """Extract speaker names from transcription text"""
    if not transcription:
        return []

    # Common patterns for speaker identification
    patterns = [
        r"\b(speaker_\d+):",
        r"\[(speaker_\d+)\]",
        r"<(speaker_\d+)>",
        r"\b([a-z]+ [a-z]+):",  # Name patterns like "John Doe:"
        r"\b([a-z]+):",  # Single name patterns like "John:"
    ]

    speakers = set()
    for pattern in patterns:
        matches = re.findall(pattern, transcription.lower())
        speakers.update(matches)

    return sorted(list(speakers))


def truncate_text(text: str, max_length: int = 100) -> str:
    """Truncate text to specified length"""
    if len(text) <= max_length:
        return text

    return text[: max_length - 3] + "..."


def generate_title_from_transcription(transcription: str, max_length: int = 50) -> str:
    """Generate a title from transcription text"""
    if not transcription:
        return "Untitled Recording"

    # Take first sentence or first 50 words
    sentences = re.split(r"[.!?]+", transcription.lower())
    if sentences and sentences[0]:
        title = sentences[0].strip()
    else:
        words = transcription.lower().split()[:10]
        title = " ".join(words)

    # Clean up speaker labels
    title = re.sub(r"\b(speaker_\d+):\s*", "", title)
    title = re.sub(r"\[(speaker_\d+)\]\s*", "", title)

    # Truncate and clean
    title = truncate_text(title, max_length)
    title = clean_text(title)

    return title if title else "Untitled Recording"
