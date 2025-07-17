# Context for `app/schemas/`

This folder contains Pydantic schemas for request and response validation.

## Schema Modules

### Audio Schemas (`audio.py`)

- **AudioChunkMessage**: Schema for WebSocket audio chunk messages
- **AudioStreamSession**: Session tracking for audio streams
- **AudioStreamResponse**: WebSocket response format for audio processing
- **AudioSessionRequest**: HTTP request for creating audio sessions
- **AudioSessionInfo**: Detailed session information response

### Celery Task Schemas (`celery_task.py`)

- **AddTaskRequest**: Request schema for Celery task creation
- **AddTaskResult**: Response schema for task status and results

## Usage Guidance

- Use this context for defining API contracts and data validation logic.
- Reference this folder when you need to:
  - Add or update request/response schemas
  - Enforce data validation rules
  - Define WebSocket message formats
  - Create audio processing data structures
- Schemas should not contain business logic or DB access.

## Tooling

- Use Desktop Commander for schema file management.
- Use Context7 for Pydantic and FastAPI schema best practices.
