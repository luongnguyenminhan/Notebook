#!/usr/bin/env python3
"""
Standalone test for Whisper pipeline loading
"""
import sys
from pathlib import Path

def test_whisper_pipeline():
    """Test if Whisper model can be loaded using pipeline"""
    print("🧪 Testing Whisper Pipeline Loading...")
    print("=" * 50)
    
    try:
        import torch
        from transformers import pipeline
        
        print(f"✅ PyTorch version: {torch.__version__}")
        print(f"✅ CUDA available: {torch.cuda.is_available()}")
        if torch.cuda.is_available():
            print(f"✅ GPU device: {torch.cuda.get_device_name(0)}")
        
        # Test with local model path
        print("\n📁 Loading pipeline with local model...")
        model_path = "./finetuned_vivos_noisy"
        
        if not Path(model_path).exists():
            print(f"❌ Model directory not found: {model_path}")
            return False
        
        device = "cuda:0" if torch.cuda.is_available() else "cpu"
        torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32
        
        print(f"🔧 Device: {device}")
        print(f"🔧 Dtype: {torch_dtype}")
        
        # Load pipeline
        PIPE = pipeline(
            task="automatic-speech-recognition", 
            model=model_path, 
            device=device, 
            torch_dtype=torch_dtype
        )
        print(f"✅ Pipeline loaded successfully on {device}")
        
        # Test pipeline kwargs
        PIPE_KWARGS = {"language": "vi", "task": "transcribe"}
        print(f"✅ Pipeline kwargs: {PIPE_KWARGS}")
        
        # Test with a dummy audio file if available
        test_audio_files = ["audio.mp3", "test_audio.wav", "sample.wav", "meet_simple_loaded.png"]
        audio_found = False
        
        for audio_file in test_audio_files:
            try:
                if Path(audio_file).exists():
                    print(f"🎵 Found audio file: {audio_file}")
                    if audio_file.endswith(('.mp3', '.wav', '.flac', '.m4a')):
                        print(f"🔄 Testing transcription with: {audio_file}")
                        output = PIPE(audio_file, generate_kwargs=PIPE_KWARGS)["text"]
                        print(f"🗣️ Transcription result: {output}")
                        audio_found = True
                        break
                    else:
                        print(f"⚠️ Skipping non-audio file: {audio_file}")
            except Exception as e:
                print(f"⚠️ Error with {audio_file}: {e}")
        
        if not audio_found:
            print("ℹ️ No test audio files found, but pipeline loaded successfully")
            print("💡 To test transcription, add an audio file (audio.mp3, test_audio.wav, etc.)")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("💡 Install missing dependencies:")
        print("   pip install transformers torch torchaudio soundfile")
        return False
    except Exception as e:
        print(f"❌ Pipeline loading failed: {e}")
        print(f"   Error type: {type(e).__name__}")
        return False

def main():
    print("🚀 Whisper Pipeline Test")
    print("=" * 30)
    
    success = test_whisper_pipeline()
    
    print(f"\n📊 Result: {'✅ SUCCESS' if success else '❌ FAILED'}")
    
    if success:
        print("\n🎉 Your local Whisper model works with pipeline!")
        print("💡 You can use this approach in your application:")
        print("""
from transformers import pipeline
import torch

# Load once at startup
PIPE = pipeline(
    task="automatic-speech-recognition", 
    model="./finetuned_vivos_noisy", 
    device="cuda:0" if torch.cuda.is_available() else "cpu",
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
)

# Use for transcription
PIPE_KWARGS = {"language": "vi", "task": "transcribe"}
output = PIPE("audio.mp3", generate_kwargs=PIPE_KWARGS)["text"]
        """)
    else:
        print("\n❌ Pipeline approach failed.")
        print("💡 Check the diagnostic output above for specific issues.")

if __name__ == "__main__":
    main()
