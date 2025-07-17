# Context for `app/core/`

This folder contains core configuration, settings, and Celery setup.

## Core Modules

### Celery Configuration (`celery.py`)

- Celery setup for background task processing
- Redis backend configuration for task queue
- Example task definitions

### Application Configuration (`config.py`)

- **AudioConfig**: Audio processing settings
  - Storage paths for audio sessions
  - Default audio parameters (sample rate, channels, format)
  - FFmpeg configuration options
  - Session limits and cleanup settings
- **WebSocketConfig**: WebSocket connection settings
  - Connection limits and timeouts
  - Message size limits
  - Error handling configuration

## Usage Guidance

- Use this context for application-wide configuration, environment settings, and background task setup.
- Reference this folder when you need to:
  - Update app settings or environment variables
  - Configure Celery or background tasks
  - Modify audio processing parameters
  - Adjust WebSocket connection settings
- Do not place business logic or API code here.

## Tooling

- Use Desktop Commander for managing config files.
- Use Context7 to look up configuration and Celery best practices.
