import sounddevice as sd
import numpy as np
import torch
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import threading
import queue
import torch

print(torch.cuda.is_available())
print(torch.cuda.device_count())
print(torch.cuda.get_device_name(0) if torch.cuda.is_available() else "No CUDA")

MODEL_PATH = "./finetuned_vivos_noisy"
print("Using local model: ./finetuned_vivos_noisy")

SAMPLE_RATE = 16000
CHANNELS = 1
CHUNK_DURATION = 5  # seconds

device = "cpu" if torch.cuda.is_available() else "cpu"
print("using device:", device)
processor = WhisperProcessor.from_pretrained(MODEL_PATH)
model = WhisperForConditionalGeneration.from_pretrained(MODEL_PATH).to(device)
model.eval()

audio_queue = queue.Queue()
stop_event = threading.Event()


def transcribe_worker():
    while not stop_event.is_set() or not audio_queue.empty():
        try:
            audio = audio_queue.get(timeout=1)
        except queue.Empty:
            continue
        # Preprocessing: slow down audio and noise reduction
        # Slow down audio by resampling to lower rate, then back to original
        import scipy.signal

        orig_len = len(audio)
        print("received")
        slow_factor = 2  # 40% slower
        slow_len = int(orig_len * slow_factor)
        slowed_audio = scipy.signal.resample(audio, slow_len)
        print("slowed")
        # Resample back to original length to keep model input shape
        slowed_audio = scipy.signal.resample(slowed_audio, orig_len)

        # Noise reduction using noisereduce if available

        input_features = processor(slowed_audio, sampling_rate=SAMPLE_RATE, return_tensors="pt").input_features.to(device)
        with torch.no_grad():
            predicted_ids = model.generate(input_features, language="vi")
        text = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
        print(f"📝 Recognized: {text}")
        audio_queue.task_done()


def record_worker():
    print("🎤 Speak into your microphone. Press Ctrl+C to stop.")
    try:
        while not stop_event.is_set():
            print(f"\nRecording {CHUNK_DURATION}s chunk...")
            audio = sd.rec(
                int(CHUNK_DURATION * SAMPLE_RATE),
                samplerate=SAMPLE_RATE,
                channels=CHANNELS,
                dtype="float32",
            )
            sd.wait()
            audio = np.squeeze(audio)
            audio_queue.put(audio)
    except KeyboardInterrupt:
        stop_event.set()
        print("\nStopped recording.")


# Start transcribe thread
transcribe_thread = threading.Thread(target=transcribe_worker, daemon=True)
transcribe_thread.start()

# Start recording in main thread
record_worker()

audio_queue.join()
