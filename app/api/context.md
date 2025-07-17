# Context for `app/api/`

This folder contains the API layer, including endpoint definitions and dependency injection modules.

## API Structure

### Endpoints (`endpoints/`)

#### Audio Stream Endpoints (`audio_stream.py`)

- **WebSocket Endpoints**:
  - `/ws/audio/{session_id}`: Stream audio to existing session
  - `/ws/audio`: Create new session and stream audio
- **HTTP Endpoints**:
  - `GET /audio/sessions/{session_id}`: Get session information
  - `POST /audio/sessions/{session_id}/close`: Close and cleanup session
- **Features**:
  - Real-time audio chunk processing via WebSocket
  - Comprehensive API documentation in docstrings
  - Error handling with proper status codes
  - Session management and cleanup

#### Celery Task Endpoints (`celery_task.py`)

- Task creation and result retrieval endpoints
- Example background task processing

### Dependencies (`dependencies/`)

#### Audio Dependencies (`audio.py`)

- **get_audio_session**: WebSocket dependency for session management
- **validate_audio_format**: Audio parameter validation
- WebSocket connection management and error handling

## Usage Guidance

- Use this context for defining FastAPI routes and dependencies.
- Reference this folder when you need to:
  - Add or modify API endpoints
  - Implement or update dependency injection
  - Create WebSocket endpoints
  - Add audio processing endpoints
- Follow the clean architecture pattern: API should only call the service layer, not access models or DB directly.

## Tooling

- Use Desktop Commander for file operations and context navigation.
- Use Context7 for searching API patterns, endpoint conventions, and FastAPI best practices.
