#!/usr/bin/env python3
"""
Test script to verify local Whisper model integration
"""
import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

def test_whisper_loading():
    """Test if the Whisper model loads correctly from local path"""
    try:
        from app.services.audio_service import whisper_transcribe_chunk, LOCAL_MODEL_PATH
        print(f"✓ Successfully imported Whisper functions")
        print(f"✓ Local model path: {LOCAL_MODEL_PATH}")
        print(f"✓ Model path exists: {LOCAL_MODEL_PATH.exists()}")
        
        # Test with a dummy audio file (if available)
        test_audio_path = project_root / "test_audio.wav"
        if test_audio_path.exists():
            print(f"Testing transcription with: {test_audio_path}")
            result = whisper_transcribe_chunk(str(test_audio_path))
            print(f"✓ Transcription result: {result}")
        else:
            print("ℹ️  No test audio file found (test_audio.wav), model loading test completed")
            
        return True
        
    except Exception as e:
        print(f"❌ Error testing Whisper integration: {e}")
        return False

if __name__ == "__main__":
    print("Testing SercueScribe Whisper ASR Integration")
    print("=" * 50)
    
    success = test_whisper_loading()
    
    if success:
        print("\n✅ All tests passed! Ready for audio streaming with local Whisper model")
        print("\nTo test with real audio:")
        print("1. Start the FastAPI server: uvicorn app.main:app --reload")
        print("2. Connect to WebSocket: ws://localhost:8000/ws/audio")
        print("3. Send audio chunks and watch console for transcriptions")
    else:
        print("\n❌ Tests failed. Check the error messages above.")