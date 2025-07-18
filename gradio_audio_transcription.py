import queue
import threading

import gradio as gr
import numpy as np
import scipy.signal
import torch
from transformers import WhisperProcessor, WhisperForConditionalGeneration

# Configuration - Match test_microphone_stream.py exactly
MODEL_PATH = "./finetuned_vivos_noisy"
SAMPLE_RATE = 16000
CHANNELS = 1
CHUNK_DURATION = 5  # seconds

print(torch.cuda.is_available())
print(torch.cuda.device_count())
print(torch.cuda.get_device_name(0) if torch.cuda.is_available() else "No CUDA")
print("Using local model: ./finetuned_vivos_noisy")

# Use same device logic as test_microphone_stream.py
device = "cpu" if torch.cuda.is_available() else "cpu"
print("using device:", device)

# Load model and processor
processor = WhisperProcessor.from_pretrained(MODEL_PATH)
model = WhisperForConditionalGeneration.from_pretrained(MODEL_PATH).to(device)
model.eval()

# Global variables for streaming
audio_queue = queue.Queue()
stop_event = threading.Event()
transcription_results = []
is_recording = False


def preprocess_audio(audio_data):
    """Preprocess audio exactly like test_microphone_stream.py"""
    # Slow down audio by resampling to lower rate, then back to original
    orig_len = len(audio_data)
    print("received")
    slow_factor = 2  # 40% slower
    slow_len = int(orig_len * slow_factor)
    slowed_audio = scipy.signal.resample(audio_data, slow_len)
    print("slowed")
    # Resample back to original length to keep model input shape
    slowed_audio = scipy.signal.resample(slowed_audio, orig_len)
    return slowed_audio


def transcribe_audio_chunk(audio_data):
    """Transcribe a single audio chunk"""
    try:
        # Preprocess audio
        processed_audio = preprocess_audio(audio_data)

        # Convert to features
        input_features = processor(processed_audio, sampling_rate=SAMPLE_RATE, return_tensors="pt").input_features.to(device)

        # Generate transcription
        with torch.no_grad():
            predicted_ids = model.generate(input_features, language="vi")

        # Decode text
        text = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
        print(f"Recognized: {text}")
        return text
    except Exception as e:
        print(f"Error transcribing audio: {e}")
        return f"[Error: {str(e)}]"


def process_audio_stream(audio_stream, history):
    """Process streaming audio chunks"""
    global is_recording, transcription_results

    if audio_stream is None:
        return history, history, "Ready to record"

    try:
        # Get audio data
        sample_rate, audio_data = audio_stream

        # Convert to float32 and mono if needed
        if audio_data.dtype != np.float32:
            audio_data = audio_data.astype(np.float32)

        if audio_data.ndim > 1:
            audio_data = audio_data.mean(axis=1)

        # Normalize audio
        if np.max(np.abs(audio_data)) > 0:
            audio_data = audio_data / np.max(np.abs(audio_data))

        # Accumulate audio in history
        if history is None:
            history = audio_data
        else:
            history = np.concatenate([history, audio_data])

        # Process if we have enough audio (simulate chunks)
        if len(history) >= SAMPLE_RATE * CHUNK_DURATION:
            # Take the last CHUNK_DURATION seconds
            chunk = history[-SAMPLE_RATE * CHUNK_DURATION :]

            # Transcribe
            transcription = transcribe_audio_chunk(chunk)

            # Add to results
            transcription_results.append(transcription)

            # Update status
            status = f"Recording... ({len(transcription_results)} chunks processed)"

            return history, history, status

        # Still recording
        status = "Recording... (processing audio)"
        return history, history, status

    except Exception as e:
        print(f"Error processing audio: {e}")
        return history, history, f"Error: {str(e)}"


def start_recording():
    """Start recording session"""
    global is_recording, transcription_results
    is_recording = True
    transcription_results = []
    return "Recording started! Speak now...", ""


def stop_recording():
    """Stop recording session"""
    global is_recording
    is_recording = False

    # Compile all transcriptions
    if transcription_results:
        final_text = "\n\n".join([f"Chunk {i + 1}: {text}" for i, text in enumerate(transcription_results)])
        status = f"Recording stopped. Processed {len(transcription_results)} chunks."
    else:
        final_text = "No audio was processed."
        status = "No audio chunks were processed."

    return status, final_text


def clear_transcription():
    """Clear all transcription results"""
    global transcription_results
    transcription_results = []
    return "Transcription cleared", ""


def get_transcription_text():
    """Get current transcription text"""
    if transcription_results:
        return "\n\n".join([f"Chunk {i + 1}: {text}" for i, text in enumerate(transcription_results)])
    return "No transcription available yet..."


# Remove all custom CSS
custom_css = ""

# Create Gradio interface
with gr.Blocks(css=custom_css, title="Real-time Vietnamese Speech Recognition") as demo:
    # Simple header
    gr.HTML("<h1>Real-time Vietnamese Speech Recognition</h1>")

    # Status display
    status_display = gr.Textbox(label="Status", value="Ready to record", interactive=False)

    # Main interface
    with gr.Row():
        with gr.Column(scale=1):
            # Audio input
            audio_input = gr.Audio(label="Microphone Input", sources=["microphone"], type="numpy", streaming=True)

            # Control buttons
            with gr.Row():
                start_btn = gr.Button("Start Recording", variant="primary")
                stop_btn = gr.Button("Stop Recording", variant="stop")
                clear_btn = gr.Button("Clear", variant="secondary")

            # Settings display
            gr.HTML("""
            <div>
                <h3>Model Settings</h3>
                <p><strong>Model:</strong> Fine-tuned Whisper</p>
                <p><strong>Language:</strong> Vietnamese</p>
                <p><strong>Sample Rate:</strong> 16kHz</p>
                <p><strong>Chunk Duration:</strong> 5 seconds</p>
                <p><strong>Device:</strong> CPU</p>
            </div>
            """)

        with gr.Column(scale=2):
            # Transcription output
            transcription_output = gr.Textbox(label="Transcription Results", value="Click 'Start Recording' to begin...", lines=15, interactive=False)

    # Hidden state for audio history
    audio_history = gr.State(value=None)

    # Event handlers
    start_btn.click(fn=start_recording, inputs=[], outputs=[status_display, transcription_output])

    stop_btn.click(fn=stop_recording, inputs=[], outputs=[status_display, transcription_output])

    clear_btn.click(fn=clear_transcription, inputs=[], outputs=[status_display, transcription_output])

    # Audio streaming handler
    audio_input.stream(
        fn=process_audio_stream,
        inputs=[audio_input, audio_history],
        outputs=[audio_history, audio_history, status_display],
        stream_every=5.0,  # Process every 1 second
        time_limit=60,  # Maximum 60 seconds per session
    )

    # Update transcription display periodically
    def update_transcription():
        return get_transcription_text()

    # Footer
    gr.HTML("""
    <div>
        <p><strong>Model:</strong> Fine-tuned Whisper for Vietnamese</p>
        <p><strong>Tips:</strong> Speak clearly and allow 5-second chunks for best results</p>
    </div>
    """)

# Launch the demo
if __name__ == "__main__":
    print("Launching Gradio interface...")
    print("Open your browser to interact with the interface")
    print("Click 'Start Recording' and speak into your microphone")
    print("Click 'Stop Recording' when finished")

    demo.launch(server_name="0.0.0.0", server_port=7860, share=False, debug=True)
