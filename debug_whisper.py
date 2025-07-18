#!/usr/bin/env python3
"""
Debug script to check Whisper model and GPU availability
"""
import os
import sys
from pathlib import Path
import torch

def check_gpu():
    """Check GPU availability and functionality"""
    print("🔍 GPU Check:")
    print(f"  CUDA available: {torch.cuda.is_available()}")
    if torch.cuda.is_available():
        print(f"  CUDA device count: {torch.cuda.device_count()}")
        for i in range(torch.cuda.device_count()):
            print(f"  Device {i}: {torch.cuda.get_device_name(i)}")
        try:
            torch.cuda.empty_cache()
            test_tensor = torch.randn(10, 10).cuda()
            print(f"  ✅ CUDA functional test passed")
            return True
        except Exception as e:
            print(f"  ❌ CUDA functional test failed: {e}")
            return False
    else:
        print("  ℹ️ Using CPU")
        return False

def check_model_files():
    """Check if model files exist and are accessible"""
    print("\n📁 Model Files Check:")
    model_path = Path("/app/finetuned_vivos_noisy")  # Docker path
    if not model_path.exists():
        model_path = Path("./finetuned_vivos_noisy")  # Local path
    
    print(f"  Model path: {model_path}")
    print(f"  Exists: {model_path.exists()}")
    
    if model_path.exists():
        files = list(model_path.glob("*"))
        print(f"  Files found ({len(files)}):")
        for file in sorted(files):
            size = file.stat().st_size if file.is_file() else 0
            print(f"    {file.name} ({size:,} bytes)")
        
        # Check critical files
        critical_files = ["config.json", "model.safetensors", "tokenizer.json"]
        for file in critical_files:
            file_path = model_path / file
            if file_path.exists():
                size = file_path.stat().st_size
                print(f"  ✅ {file}: {size:,} bytes")
                
                # Special check for safetensors file
                if file == "model.safetensors":
                    if size < 1000:  # Less than 1KB suggests corruption
                        print(f"  ⚠️ {file} appears to be too small (possibly corrupted)")
                    elif size > 5_000_000_000:  # More than 5GB suggests truncation
                        print(f"  ⚠️ {file} appears to be too large (possibly incomplete)")
                    else:
                        print(f"  ✅ {file} size looks reasonable")
            else:
                print(f"  ❌ Missing: {file}")
        return model_path
    else:
        print(f"  ❌ Model directory not found")
        return None

def test_model_loading():
    """Test loading the model"""
    print("\n🤖 Model Loading Test:")
    model_path = check_model_files()
    if not model_path:
        return False
    
    try:
        from transformers import WhisperProcessor, WhisperForConditionalGeneration
        
        print("  Loading processor...")
        processor = WhisperProcessor.from_pretrained(str(model_path))
        print("  ✅ Processor loaded successfully")
        
        print("  Loading model...")
        try:
            # Try with safetensors first
            model = WhisperForConditionalGeneration.from_pretrained(str(model_path))
            print("  ✅ Model loaded with safetensors")
        except Exception as e:
            print(f"  ⚠️ Safetensors failed: {e}")
            print("  Trying without safetensors...")
            model = WhisperForConditionalGeneration.from_pretrained(
                str(model_path),
                use_safetensors=False
            )
            print("  ✅ Model loaded without safetensors")
        
        # Test device placement
        device = "cuda" if torch.cuda.is_available() else "cpu"
        model = model.to(device)
        model.eval()
        print(f"  ✅ Model moved to {device}")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Model loading failed: {e}")
        return False

def main():
    print("SercueScribe Whisper Model Debug")
    print("=" * 50)
    
    # Environment info
    print("📋 Environment:")
    print(f"  Python: {sys.version}")
    print(f"  PyTorch: {torch.__version__}")
    print(f"  Working directory: {os.getcwd()}")
    
    # Check NVIDIA environment variables
    nvidia_vars = [var for var in os.environ if var.startswith('NVIDIA')]
    if nvidia_vars:
        print("  NVIDIA Environment Variables:")
        for var in nvidia_vars:
            print(f"    {var}={os.environ[var]}")
    
    gpu_available = check_gpu()
    model_loaded = test_model_loading()
    
    print(f"\n📊 Summary:")
    print(f"  GPU Available: {'✅' if gpu_available else '❌'}")
    print(f"  Model Loaded: {'✅' if model_loaded else '❌'}")
    
    if gpu_available and model_loaded:
        print("\n🎉 All checks passed! Ready for GPU inference.")
    elif model_loaded:
        print("\n⚠️ Model loaded but using CPU. Check GPU configuration.")
    else:
        print("\n❌ Model loading failed. Check model files and dependencies.")

if __name__ == "__main__":
    main()
