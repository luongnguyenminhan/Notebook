import json
import logging
from typing import Optional

from fastapi import (
    APIRouter,
    HTTPException,
    WebSocket,
    WebSocketDisconnect,
    WebSocketException,
    status,
)

from app.api.dependencies.audio import validate_audio_format
from app.core.config import audio_config
from app.schemas.audio import AudioStreamResponse
from app.services.audio_service import audio_stream_manager

logger = logging.getLogger(__name__)
router = APIRouter()


@router.websocket("/ws/audio/{session_id}")
async def websocket_audio_stream_existing(websocket: WebSocket, session_id: str, user_id: Optional[str] = None):
    """
    WebSocket endpoint for streaming audio chunks to an existing session.

    This endpoint handles real-time audio streaming where clients can send audio chunks
    that are continuously concatenated using FFmpeg and saved to persistent storage.

    ## Usage

    ### Connection
    Connect to: `ws://localhost:8000/ws/audio/{session_id}?user_id={optional_user_id}`

    ### Message Format
    Send binary audio data or JSON messages:

    #### Binary Audio Data
    Send raw audio bytes directly. The system will automatically:
    - Assign sequential chunk IDs
    - Convert to WAV format using FFmpeg
    - Concatenate with existing audio
    - Save to persistent storage

    #### JSON Control Messages
    ```json
    {
        "type": "control",
        "action": "close_session"
    }
    ```

    ### Response Format
    Server sends JSON responses:
    ```json
    {
        "message": "Chunk processed successfully",
        "session_id": "uuid-here",
        "chunk_count": 42,
        "status": "active"
    }
    ```

    ## Audio Processing

    - **Format**: Automatically converts to WAV for processing
    - **Concatenation**: Uses FFmpeg for seamless audio joining
    - **Storage**: Files saved to `/tmp/audio_sessions/{session_id}.wav`
    - **Real-time**: Processes chunks as they arrive

    ## Error Handling

    - Invalid session ID: Connection closes with 1008 (Policy Violation)
    - Processing errors: Logged but connection continues
    - Network issues: Automatic cleanup on disconnect

    ## Parameters

    - **session_id** (path): UUID of existing audio session
    - **user_id** (query, optional): User identifier for the session

    ## Example Client Code (JavaScript)

    ```javascript
    const ws = new WebSocket('ws://localhost:8000/ws/audio/session-id-here');

    // Send audio chunk
    const audioChunk = new Uint8Array(audioBuffer);
    ws.send(audioChunk);

    // Handle responses
    ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        console.log(`Processed ${response.chunk_count} chunks`);
    };

    // Close session
    ws.send(JSON.stringify({
        "type": "control",
        "action": "close_session"
    }));
    ```

    ## Python Client Example

    ```python
    import asyncio
    import websockets
    import json

    async def stream_audio():
        uri = "ws://localhost:8000/ws/audio/session-id-here"
        async with websockets.connect(uri) as websocket:
            # Send audio chunk
            with open("audio_chunk.wav", "rb") as f:
                audio_data = f.read()
                await websocket.send(audio_data)

            # Receive response
            response = await websocket.recv()
            print(json.loads(response))

    asyncio.run(stream_audio())
    ```
    """
    # Validate session exists
    session_info = audio_stream_manager.get_session_info(session_id)
    if not session_info:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Session not found")
        return

    await websocket.accept()
    logger.info(f"WebSocket connected for audio session: {session_id}")

    chunk_counter = session_info.total_chunks

    try:
        while True:
            # Receive data from client
            data = await websocket.receive()

            if "bytes" in data:
                # Handle binary audio data
                audio_bytes = data["bytes"]
                chunk_counter += 1

                # Process audio chunk
                success = await audio_stream_manager.add_audio_chunk(
                    session_id=session_id,
                    chunk_data=audio_bytes,
                    chunk_id=chunk_counter,
                    sample_rate=audio_config.DEFAULT_SAMPLE_RATE,
                    channels=audio_config.DEFAULT_CHANNELS,
                )

                if success:
                    # Send success response
                    response = AudioStreamResponse(
                        message="Chunk processed successfully",
                        session_id=session_id,
                        chunk_count=chunk_counter,
                        status="active",
                    )
                    await websocket.send_text(response.model_dump_json())
                    logger.debug(f"Processed audio chunk {chunk_counter} for session {session_id}")
                else:
                    # Send error response
                    error_response = AudioStreamResponse(
                        message="Failed to process chunk",
                        session_id=session_id,
                        chunk_count=chunk_counter,
                        status="error",
                    )
                    await websocket.send_text(error_response.model_dump_json())

            elif "text" in data:
                # Handle JSON control messages
                try:
                    message = json.loads(data["text"])
                    if message.get("type") == "control":
                        if message.get("action") == "close_session":
                            # Close session and cleanup
                            audio_stream_manager.close_session(session_id)
                            response = AudioStreamResponse(
                                message="Session closed successfully",
                                session_id=session_id,
                                chunk_count=chunk_counter,
                                status="completed",
                            )
                            await websocket.send_text(response.model_dump_json())
                            break
                    else:
                        # Unknown message type
                        await websocket.send_text(json.dumps({"error": "Unknown message type", "received": message}))

                except json.JSONDecodeError:
                    await websocket.send_text(json.dumps({"error": "Invalid JSON format"}))

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for audio session: {session_id}")
    except Exception as e:
        logger.error(f"Error in audio stream WebSocket: {e}")
    finally:
        # Cleanup on disconnect
        try:
            current_session = audio_stream_manager.get_session_info(session_id)
            if current_session and current_session.status == "active":
                audio_stream_manager.close_session(session_id)
                logger.info(f"Cleaned up audio session: {session_id}")
        except Exception as e:
            logger.error(f"Error during WebSocket cleanup: {e}")


@router.websocket("/ws/audio")
async def websocket_audio_stream_new(
    websocket: WebSocket,
    user_id: Optional[str] = None,
    sample_rate: int = audio_config.DEFAULT_SAMPLE_RATE,
    channels: int = audio_config.DEFAULT_CHANNELS,
    format: str = audio_config.DEFAULT_FORMAT,
):
    """
    WebSocket endpoint for streaming audio chunks to a new session.

    This endpoint creates a new audio session and handles real-time audio streaming
    where clients can send audio chunks that are continuously concatenated using
    FFmpeg and saved to persistent storage.

    ## Usage

    ### Connection
    Connect to: `ws://localhost:8000/ws/audio?user_id={user_id}&sample_rate=44100&channels=1&format=wav`

    ### Query Parameters
    - **user_id** (optional): User identifier for the session
    - **sample_rate** (optional): Audio sample rate in Hz (default: 44100)
      - Valid values: 8000, 16000, 22050, 44100, 48000, 96000
    - **channels** (optional): Number of audio channels (default: 1)
      - Valid values: 1 (mono), 2 (stereo)
    - **format** (optional): Audio format (default: wav)
      - Valid values: wav, mp3, flac, aac

    ### Initial Response
    Upon connection, server sends session information:
    ```json
    {
        "message": "Audio session created",
        "session_id": "uuid-here",
        "chunk_count": 0,
        "status": "active"
    }
    ```

    ### Message Format
    Send binary audio data or JSON messages (same as existing session endpoint).

    ## Audio Processing

    - **Session Creation**: Automatically creates new session with UUID
    - **Format Validation**: Validates audio parameters on connection
    - **Real-time Processing**: Same as existing session endpoint
    - **Storage**: Files saved to `/tmp/audio_sessions/{session_id}.wav`

    ## Error Handling

    - Invalid audio parameters: Connection closes with 1008 (Policy Violation)
    - Session creation failure: Connection closes with 1011 (Internal Error)
    - Processing errors: Same as existing session endpoint

    ## Example Usage

    ```javascript
    // Connect with custom parameters
    const ws = new WebSocket('ws://localhost:8000/ws/audio?sample_rate=48000&channels=2');

    ws.onopen = () => {
        console.log('Connected to new audio session');
    };

    ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.session_id) {
            console.log(`New session created: ${response.session_id}`);
        }
    };
    ```
    """
    # Validate audio format parameters
    try:
        audio_params = validate_audio_format(sample_rate, channels, format)
    except WebSocketException as e:
        await websocket.close(code=e.code, reason=e.reason)
        return

    # Create new session
    try:
        session_id = audio_stream_manager.create_session(
            user_id=user_id,
            sample_rate=audio_params["sample_rate"],
            channels=audio_params["channels"],
            format=audio_params["format"],
        )
    except Exception as e:
        logger.error(f"Failed to create audio session: {e}")
        await websocket.close(code=status.WS_1011_INTERNAL_ERROR, reason="Session creation failed")
        return

    await websocket.accept()
    logger.info(f"WebSocket connected for new audio session: {session_id}")

    # Send initial session info
    initial_response = AudioStreamResponse(
        message="Audio session created",
        session_id=session_id,
        chunk_count=0,
        status="active",
    )
    await websocket.send_text(initial_response.model_dump_json())

    chunk_counter = 0

    try:
        while True:
            # Receive data from client
            data = await websocket.receive()

            if "bytes" in data:
                # Handle binary audio data
                audio_bytes = data["bytes"]
                chunk_counter += 1

                # Process audio chunk with session parameters
                success = await audio_stream_manager.add_audio_chunk(
                    session_id=session_id,
                    chunk_data=audio_bytes,
                    chunk_id=chunk_counter,
                    sample_rate=audio_params["sample_rate"],
                    channels=audio_params["channels"],
                )

                if success:
                    # Send success response
                    response = AudioStreamResponse(
                        message="Chunk processed successfully",
                        session_id=session_id,
                        chunk_count=chunk_counter,
                        status="active",
                    )
                    await websocket.send_text(response.model_dump_json())
                    logger.debug(f"Processed audio chunk {chunk_counter} for session {session_id}")
                else:
                    # Send error response
                    error_response = AudioStreamResponse(
                        message="Failed to process chunk",
                        session_id=session_id,
                        chunk_count=chunk_counter,
                        status="error",
                    )
                    await websocket.send_text(error_response.model_dump_json())

            elif "text" in data:
                # Handle JSON control messages
                try:
                    message = json.loads(data["text"])
                    if message.get("type") == "control":
                        if message.get("action") == "close_session":
                            # Close session and cleanup
                            audio_stream_manager.close_session(session_id)
                            response = AudioStreamResponse(
                                message="Session closed successfully",
                                session_id=session_id,
                                chunk_count=chunk_counter,
                                status="completed",
                            )
                            await websocket.send_text(response.model_dump_json())
                            break
                    else:
                        # Unknown message type
                        await websocket.send_text(json.dumps({"error": "Unknown message type", "received": message}))

                except json.JSONDecodeError:
                    await websocket.send_text(json.dumps({"error": "Invalid JSON format"}))

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for audio session: {session_id}")
    except Exception as e:
        logger.error(f"Error in audio stream WebSocket: {e}")
    finally:
        # Cleanup on disconnect
        try:
            current_session = audio_stream_manager.get_session_info(session_id)
            if current_session and current_session.status == "active":
                audio_stream_manager.close_session(session_id)
                logger.info(f"Cleaned up audio session: {session_id}")
        except Exception as e:
            logger.error(f"Error during WebSocket cleanup: {e}")


@router.get("/audio/sessions/{session_id}")
async def get_audio_session_info(session_id: str):
    """
    Get information about an audio session.

    Returns session details including status, file path, duration, and chunk count.
    """
    session_info = audio_stream_manager.get_session_info(session_id)
    if not session_info:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    return session_info


@router.post("/audio/sessions/{session_id}/close")
async def close_audio_session(session_id: str):
    """
    Close an audio session and clean up temporary files.

    Returns success status and final session information.
    """
    session_info = audio_stream_manager.get_session_info(session_id)
    if not session_info:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")

    success = audio_stream_manager.close_session(session_id)

    return {"success": success, "session_id": session_id, "final_info": session_info}
