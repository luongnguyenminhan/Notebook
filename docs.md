# Audio Streaming API Documentation

## Overview

The SercueScribe Audio Streaming API provides real-time WebSocket endpoints for streaming audio chunks that are automatically concatenated using FFmpeg and saved to persistent storage. This API is designed for applications that need to process audio data in real-time, such as transcription services, voice recording, or audio analysis systems.

## Key Features

- 🎵 **Real-time Audio Streaming**: Stream audio chunks via WebSocket connections
- 🔗 **Automatic Concatenation**: Uses FFmpeg to seamlessly join audio chunks
- 💾 **Persistent Storage**: Audio files saved to persistent Docker volumes
- 🎛️ **Configurable Parameters**: Support for different sample rates, channels, and formats
- 🔄 **Session Management**: UUID-based session tracking with automatic cleanup
- 📊 **Session Monitoring**: HTTP endpoints for session information and control

## Endpoints

### WebSocket Endpoints

#### 1. Create New Audio Session
```
ws://localhost:8000/api/ws/audio
```

**Query Parameters:**
- `user_id` (optional): User identifier for the session
- `sample_rate` (optional): Audio sample rate in Hz (default: 44100)
  - Valid values: 8000, 16000, 22050, 44100, 48000, 96000
- `channels` (optional): Number of audio channels (default: 1)
  - Valid values: 1 (mono), 2 (stereo)
- `format` (optional): Audio format (default: wav)
  - Valid values: wav, mp3, flac, aac

#### 2. Stream to Existing Session
```
ws://localhost:8000/api/ws/audio/{session_id}
```

**Path Parameters:**
- `session_id`: UUID of existing audio session

**Query Parameters:**
- `user_id` (optional): User identifier for the session

### HTTP Endpoints

#### Get Session Information
```http
GET /api/audio/sessions/{session_id}
```

Returns detailed information about an audio session including status, file path, duration, and chunk count.

#### Close Session
```http
POST /api/audio/sessions/{session_id}/close
```

Closes an audio session and cleans up temporary files. Returns success status and final session information.

## Message Formats

### WebSocket Messages

#### Sending Audio Data
Send raw binary audio data directly through the WebSocket connection. The system will:
- Automatically assign sequential chunk IDs
- Convert to WAV format using FFmpeg
- Concatenate with existing audio
- Save to persistent storage

#### Control Messages
Send JSON control messages for session management:

```json
{
    "type": "control",
    "action": "close_session"
}
```

#### Server Responses
The server sends JSON responses for each processed chunk:

```json
{
    "message": "Chunk processed successfully",
    "session_id": "uuid-here",
    "chunk_count": 42,
    "status": "active"
}
```

**Response Status Values:**
- `active`: Session is active and processing chunks
- `completed`: Session has been closed
- `error`: Error occurred during processing

## Client Examples

### JavaScript WebSocket Client

#### Creating a New Session
```javascript
// Connect to create new session with custom parameters
const ws = new WebSocket('ws://localhost:8000/api/ws/audio?sample_rate=48000&channels=2&user_id=user123');

let sessionId = null;

ws.onopen = () => {
    console.log('Connected to audio streaming service');
};

ws.onmessage = (event) => {
    const response = JSON.parse(event.data);
    
    // Store session ID from first response
    if (response.session_id && !sessionId) {
        sessionId = response.session_id;
        console.log(`New session created: ${sessionId}`);
    }
    
    console.log(`Status: ${response.status}, Chunks: ${response.chunk_count}`);
};

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};

ws.onclose = (event) => {
    console.log('Connection closed:', event.code, event.reason);
};

// Send audio chunk (assume you have audio data as ArrayBuffer)
function sendAudioChunk(audioBuffer) {
    if (ws.readyState === WebSocket.OPEN) {
        const audioChunk = new Uint8Array(audioBuffer);
        ws.send(audioChunk);
    }
}

// Close session gracefully
function closeSession() {
    const closeMessage = {
        "type": "control",
        "action": "close_session"
    };
    ws.send(JSON.stringify(closeMessage));
}
```

#### Connecting to Existing Session
```javascript
const sessionId = 'existing-session-uuid-here';
const ws = new WebSocket(`ws://localhost:8000/api/ws/audio/${sessionId}?user_id=user123`);

ws.onopen = () => {
    console.log(`Connected to existing session: ${sessionId}`);
};

// Same message handling as above...
```

### Python WebSocket Client

#### Basic Example
```python
import asyncio
import websockets
import json
import wave
import io

async def stream_audio_file(file_path, session_id=None):
    """Stream an audio file to the server"""
    
    # Choose endpoint based on whether we have a session ID
    if session_id:
        uri = f"ws://localhost:8000/api/ws/audio/{session_id}"
    else:
        uri = "ws://localhost:8000/api/ws/audio?sample_rate=44100&channels=1"
    
    async with websockets.connect(uri) as websocket:
        print(f"Connected to {uri}")
        
        # Read and send audio file in chunks
        with open(file_path, "rb") as audio_file:
            chunk_size = 4096  # 4KB chunks
            chunk_count = 0
            
            while True:
                chunk = audio_file.read(chunk_size)
                if not chunk:
                    break
                
                # Send audio chunk
                await websocket.send(chunk)
                chunk_count += 1
                
                # Receive response
                try:
                    response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                    data = json.loads(response)
                    print(f"Chunk {chunk_count}: {data['message']} (Total: {data['chunk_count']})")
                    
                    # Store session ID from first response if creating new session
                    if not session_id and 'session_id' in data:
                        session_id = data['session_id']
                        print(f"Session ID: {session_id}")
                        
                except asyncio.TimeoutError:
                    print(f"Timeout waiting for response to chunk {chunk_count}")
                except json.JSONDecodeError as e:
                    print(f"Error parsing response: {e}")
        
        # Close session
        close_message = {
            "type": "control",
            "action": "close_session"
        }
        await websocket.send(json.dumps(close_message))
        
        # Wait for final response
        final_response = await websocket.recv()
        print(f"Session closed: {json.loads(final_response)}")

# Usage
asyncio.run(stream_audio_file("audio_file.wav"))
```

#### Advanced Example with Error Handling
```python
import asyncio
import websockets
import json
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AudioStreamer:
    def __init__(self, base_url="ws://localhost:8000/api"):
        self.base_url = base_url
        self.session_id = None
        self.websocket = None
        
    async def create_session(self, user_id=None, sample_rate=44100, channels=1, format="wav"):
        """Create a new audio streaming session"""
        params = f"sample_rate={sample_rate}&channels={channels}&format={format}"
        if user_id:
            params += f"&user_id={user_id}"
            
        uri = f"{self.base_url}/ws/audio?{params}"
        
        try:
            self.websocket = await websockets.connect(uri)
            logger.info(f"Connected to new session: {uri}")
            
            # Wait for initial response with session ID
            response = await self.websocket.recv()
            data = json.loads(response)
            self.session_id = data['session_id']
            logger.info(f"Session created: {self.session_id}")
            
            return self.session_id
            
        except Exception as e:
            logger.error(f"Failed to create session: {e}")
            raise
    
    async def connect_to_session(self, session_id, user_id=None):
        """Connect to an existing session"""
        self.session_id = session_id
        params = f"?user_id={user_id}" if user_id else ""
        uri = f"{self.base_url}/ws/audio/{session_id}{params}"
        
        try:
            self.websocket = await websockets.connect(uri)
            logger.info(f"Connected to existing session: {session_id}")
            
        except Exception as e:
            logger.error(f"Failed to connect to session {session_id}: {e}")
            raise
    
    async def send_audio_chunk(self, audio_data):
        """Send an audio chunk and wait for response"""
        if not self.websocket:
            raise RuntimeError("Not connected to any session")
            
        try:
            await self.websocket.send(audio_data)
            response = await asyncio.wait_for(self.websocket.recv(), timeout=10.0)
            return json.loads(response)
            
        except asyncio.TimeoutError:
            logger.error("Timeout waiting for server response")
            raise
        except websockets.exceptions.ConnectionClosed:
            logger.error("WebSocket connection closed")
            raise
    
    async def close_session(self):
        """Close the current session"""
        if not self.websocket:
            return
            
        try:
            close_message = {
                "type": "control",
                "action": "close_session"
            }
            await self.websocket.send(json.dumps(close_message))
            response = await self.websocket.recv()
            logger.info(f"Session closed: {json.loads(response)}")
            
        except Exception as e:
            logger.error(f"Error closing session: {e}")
        finally:
            await self.websocket.close()
            self.websocket = None
            self.session_id = None

# Usage example
async def main():
    streamer = AudioStreamer()
    
    try:
        # Create new session
        session_id = await streamer.create_session(
            user_id="user123",
            sample_rate=48000,
            channels=2
        )
        
        # Stream audio file
        audio_file = Path("example.wav")
        if audio_file.exists():
            with open(audio_file, "rb") as f:
                chunk_size = 8192
                chunk_count = 0
                
                while True:
                    chunk = f.read(chunk_size)
                    if not chunk:
                        break
                    
                    response = await streamer.send_audio_chunk(chunk)
                    chunk_count += 1
                    
                    if chunk_count % 10 == 0:  # Log every 10 chunks
                        logger.info(f"Processed {response['chunk_count']} chunks")
        
        # Close session
        await streamer.close_session()
        
    except Exception as e:
        logger.error(f"Streaming failed: {e}")
        if streamer.websocket:
            await streamer.close_session()

if __name__ == "__main__":
    asyncio.run(main())
```

### HTTP API Examples

#### Get Session Information
```python
import requests

def get_session_info(session_id):
    """Get information about an audio session"""
    response = requests.get(f"http://localhost:8000/api/audio/sessions/{session_id}")
    
    if response.status_code == 200:
        return response.json()
    elif response.status_code == 404:
        print(f"Session {session_id} not found")
        return None
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None

# Usage
session_info = get_session_info("your-session-uuid-here")
if session_info:
    print(f"Session Status: {session_info['status']}")
    print(f"Total Chunks: {session_info['total_chunks']}")
    print(f"Duration: {session_info['duration_seconds']} seconds")
    print(f"File Path: {session_info['file_path']}")
```

#### Close Session via HTTP
```python
import requests

def close_session(session_id):
    """Close a session via HTTP endpoint"""
    response = requests.post(f"http://localhost:8000/api/audio/sessions/{session_id}/close")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Session closed successfully: {result['success']}")
        return result
    elif response.status_code == 404:
        print(f"Session {session_id} not found")
        return None
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None

# Usage
result = close_session("your-session-uuid-here")
```

## Audio Processing Details

### Supported Formats

**Input Formats:**
- Raw audio bytes (automatically detected)
- WAV, MP3, FLAC, AAC (when specified in format parameter)

**Output Format:**
- All audio is converted to WAV format for storage
- Files saved as `{session_id}.wav` in the configured storage directory

### Sample Rates
- 8000 Hz (telephone quality)
- 16000 Hz (wide band speech)
- 22050 Hz (radio quality)
- 44100 Hz (CD quality) - **default**
- 48000 Hz (professional audio)
- 96000 Hz (high-resolution audio)

### Channels
- 1 (mono) - **default**
- 2 (stereo)

### Storage
- Audio files are stored in `/app/audio_sessions/` within the Docker container
- Files persist across container restarts via Docker volumes
- Each session creates a separate audio file named `{session_id}.wav`

## Error Handling

### WebSocket Errors

| Error Code | Reason | Description |
|------------|--------|-------------|
| 1008 | Policy Violation | Invalid session ID or invalid audio parameters |
| 1011 | Internal Error | Session creation failed or server error |

### HTTP Errors

| Status Code | Description |
|-------------|-------------|
| 404 | Session not found |
| 422 | Invalid request parameters |
| 500 | Internal server error |

### Common Error Scenarios

1. **Session Not Found**
   ```json
   {
     "error": "Session not found",
     "session_id": "invalid-uuid"
   }
   ```

2. **Invalid Audio Parameters**
   ```json
   {
     "error": "Invalid sample rate",
     "valid_values": [8000, 16000, 22050, 44100, 48000, 96000]
   }
   ```

3. **Processing Failure**
   ```json
   {
     "message": "Failed to process chunk",
     "session_id": "uuid-here",
     "chunk_count": 42,
     "status": "error"
   }
   ```

## Best Practices

### 1. Connection Management
- Always handle WebSocket connection errors gracefully
- Implement reconnection logic for production applications
- Use appropriate timeouts for WebSocket operations

### 2. Audio Streaming
- Send audio in reasonable chunk sizes (4KB - 64KB recommended)
- Don't send chunks too rapidly - allow time for server processing
- Monitor server responses to detect processing issues

### 3. Session Management
- Store session IDs for reconnection scenarios
- Always close sessions properly to free server resources
- Use HTTP endpoints to check session status before reconnecting

### 4. Error Handling
- Implement proper error handling for all WebSocket and HTTP operations
- Log errors appropriately for debugging
- Have fallback strategies for connection failures

### 5. Performance Optimization
- Use appropriate audio chunk sizes based on your use case
- Consider audio compression for network-constrained environments
- Monitor session duration and file sizes

## Configuration

### Environment Variables

The following environment variables can be used to configure the audio streaming service:

```env
# Audio Processing
AUDIO_STORAGE_PATH=/app/audio_sessions
DEFAULT_SAMPLE_RATE=44100
DEFAULT_CHANNELS=1
DEFAULT_FORMAT=wav
FFMPEG_LOGLEVEL=error

# Session Limits
MAX_SESSION_DURATION_HOURS=24
MAX_CHUNK_SIZE_MB=10
MAX_CONCURRENT_SESSIONS=100

# WebSocket Settings
MAX_CONNECTIONS_PER_SESSION=5
CONNECTION_TIMEOUT_SECONDS=300
MAX_MESSAGE_SIZE_BYTES=10485760
```

### Docker Setup

When running with Docker, ensure the audio storage volume is properly configured:

```yaml
# docker-compose.yml
services:
  app:
    # ... other configuration
    volumes:
      - audio_data:/app/audio_sessions
    environment:
      - AUDIO_STORAGE_PATH=/app/audio_sessions

volumes:
  audio_data:
```

## Troubleshooting

### Common Issues

1. **WebSocket Connection Refused**
   - Check if the server is running on the correct port
   - Verify the WebSocket URL format
   - Ensure no firewall blocking the connection

2. **Session Creation Fails**
   - Verify audio parameters are within valid ranges
   - Check server logs for storage permission issues
   - Ensure sufficient disk space for audio files

3. **Audio Processing Errors**
   - Verify FFmpeg is properly installed in the container
   - Check audio data format compatibility
   - Monitor server resources (CPU, memory, disk)

4. **Session Not Found**
   - Verify session ID format (must be valid UUID)
   - Check if session was previously closed or expired
   - Ensure you're connecting to the correct server instance

### Debug Commands

```bash
# Check server status
curl http://localhost:8000/health

# List active sessions (if monitoring endpoint exists)
curl http://localhost:8000/api/audio/sessions

# Check Docker logs
docker-compose logs -f app

# Check audio storage
docker-compose exec app ls -la /app/audio_sessions/
```

## API Reference

For complete API documentation including all endpoints, schemas, and interactive testing, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These interactive documentation pages provide detailed information about all endpoints, request/response schemas, and allow you to test the API directly from your browser.
