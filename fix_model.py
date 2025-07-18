#!/usr/bin/env python3
"""
Convert model to safetensors format or load without safetensors
"""

def fix_model_loading():
    """Try to fix the model loading issue"""
    print("🔧 Attempting to fix model loading...")
    
    try:
        from transformers import WhisperForConditionalGeneration, WhisperProcessor
        import torch
        
        model_path = "./finetuned_vivos_noisy"
        
        print("🔄 Trying to load without safetensors...")
        
        # Load processor (this should work)
        processor = WhisperProcessor.from_pretrained(model_path)
        print("✅ Processor loaded successfully")
        
        # Try loading model without safetensors
        model = WhisperForConditionalGeneration.from_pretrained(
            model_path,
            use_safetensors=False  # Skip corrupted safetensors
        )
        print("✅ Model loaded without safetensors")
        
        # Save model in safetensors format properly
        print("💾 Saving model in proper safetensors format...")
        model.save_pretrained(model_path, safe_serialization=True)
        print("✅ Model saved with correct safetensors format")
        
        return True
        
    except Exception as e:
        print(f"❌ Fix attempt failed: {e}")
        return False

def test_fixed_model():
    """Test the fixed model with pipeline"""
    try:
        from transformers import pipeline
        import torch
        
        model_path = "./finetuned_vivos_noisy"
        device = "cpu"  # Use CPU to avoid GPU compatibility issues
        torch_dtype = torch.float32
        
        print("🧪 Testing fixed model with pipeline...")
        PIPE = pipeline(
            task="automatic-speech-recognition", 
            model=model_path, 
            device=device, 
            torch_dtype=torch_dtype
        )
        print("✅ Pipeline loaded successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

if __name__ == "__main__":
    print("🛠️ Model Fix Utility")
    print("=" * 30)
    
    if fix_model_loading():
        print("\n✅ Model fix completed!")
        if test_fixed_model():
            print("🎉 Model now works with pipeline!")
        else:
            print("⚠️ Model fixed but pipeline test failed")
    else:
        print("\n❌ Could not fix model")
        print("💡 You may need to re-train or re-download the model")
