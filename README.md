# SercueScribe

A FastAPI-based application for real-time audio streaming and processing with FFmpeg integration.

## Features

### 🎵 Real-time Audio Streaming
- WebSocket-based audio chunk streaming
- Automatic audio concatenation using FFmpeg
- Persistent audio file storage
- Session management with UUIDs
- Support for multiple audio formats (WAV, MP3, FLAC, AAC)

### ⚙️ Background Task Processing
- Celery integration with Redis backend
- Async task processing and monitoring
- Flower dashboard for task monitoring

### 🐳 Containerized Development
- Docker Compose setup for development
- Persistent volumes for audio storage
- PostgreSQL database integration
- Redis for task queue and caching

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── endpoints/
│   │   │   ├── audio_stream.py      # WebSocket audio streaming endpoints
│   │   │   └── celery_task.py       # Background task endpoints
│   │   └── dependencies/
│   │       └── audio.py             # Audio session dependencies
│   ├── core/
│   │   ├── celery.py               # Celery configuration
│   │   └── config.py               # Audio & WebSocket configuration
│   ├── db/
│   ├── models/
│   ├── schemas/
│   │   ├── audio.py                # Audio-related schemas
│   │   └── celery_task.py          # Task schemas
│   ├── services/
│   │   ├── audio_service.py        # Audio stream management
│   │   └── celery_service.py       # Background task service
│   └── utils/
├── tests/
├── docker-compose.yml              # Multi-service development environment
├── Dockerfile                      # App containerization with FFmpeg
└── requirements.txt                # Dependencies including audio processing
```

## Getting Started

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run the application
uvicorn app.main:app --reload
```

### Docker Development (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down
```

## Audio Streaming API

### WebSocket Endpoints

#### Create New Audio Session
```
ws://localhost:8000/api/ws/audio?sample_rate=44100&channels=1&format=wav
```

#### Stream to Existing Session
```
ws://localhost:8000/api/ws/audio/{session_id}
```

### HTTP Endpoints

#### Get Session Information
```http
GET /api/audio/sessions/{session_id}
```

#### Close Session
```http
POST /api/audio/sessions/{session_id}/close
```

### Usage Example

#### JavaScript Client
```javascript
const ws = new WebSocket('ws://localhost:8000/api/ws/audio');

ws.onopen = () => {
    console.log('Connected to audio stream');
};

ws.onmessage = (event) => {
    const response = JSON.parse(event.data);
    console.log(`Session: ${response.session_id}, Chunks: ${response.chunk_count}`);
};

// Send audio chunk
const audioChunk = new Uint8Array(audioBuffer);
ws.send(audioChunk);

// Close session
ws.send(JSON.stringify({
    "type": "control",
    "action": "close_session"
}));
```

#### Python Client
```python
import asyncio
import websockets
import json

async def stream_audio():
    uri = "ws://localhost:8000/api/ws/audio"
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

## Configuration

### Environment Variables

```env
# Audio Processing
AUDIO_STORAGE_PATH=/app/audio_sessions
DEFAULT_SAMPLE_RATE=44100
DEFAULT_CHANNELS=1
DEFAULT_FORMAT=wav
FFMPEG_LOGLEVEL=error

# WebSocket Settings
MAX_CONNECTIONS_PER_SESSION=5
CONNECTION_TIMEOUT_SECONDS=300
MAX_MESSAGE_SIZE_BYTES=10485760

# Database & Redis
DATABASE_URL=postgresql://user:pass@localhost:5432/db
REDIS_URL=redis://localhost:6379/0
```

## Services

### Audio Stream Manager
- Manages WebSocket audio streaming sessions
- Real-time FFmpeg-based audio concatenation
- Automatic cleanup and session management
- Configurable audio parameters

### Background Tasks
- Celery worker for async processing
- Redis task queue and result backend
- Flower monitoring dashboard at http://localhost:5555

## Development

### Adding New Endpoints
1. Create endpoint in `app/api/endpoints/`
2. Add schemas in `app/schemas/`
3. Implement business logic in `app/services/`
4. Register router in `app/main.py`

### Audio Processing
- Audio files stored in `/app/audio_sessions/` (Docker volume)
- FFmpeg handles format conversion and concatenation
- Session cleanup automatic on disconnect
- Supports various audio formats and parameters

## API Documentation

Once running, visit:
- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Flower Dashboard**: http://localhost:5555 (Docker only)
