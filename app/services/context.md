# Context for `app/services/`

This folder contains the business logic and service layer.

## Services

### Audio Service (`audio_service.py`)

- **AudioStreamManager**: Manages WebSocket audio streaming sessions
- **Features**:
  - Real-time audio chunk processing using FFmpeg
  - Persistent audio file concatenation
  - Session management with UUIDs
  - Temporary file cleanup
  - Configurable audio parameters (sample rate, channels, format)
- **Storage**: Audio files saved to `/app/audio_sessions/` (Docker volume)
- **Dependencies**: FFmpeg, pydub for audio processing

### Celery Service (`celery_service.py`)

- Background task processing using Celery and Redis
- Example async task implementation for demonstration

## Usage Guidance

- Use this context for implementing business rules, service classes, and background task logic.
- Reference this folder when you need to:
  - Add or update business logic
  - Implement service classes or background tasks
  - Audio processing and streaming functionality
- Services should interact with models and schemas, not with API or DB directly.

## Tooling

- Use Desktop Commander for service file management.
- Use Context7 for service layer and background task best practices.
