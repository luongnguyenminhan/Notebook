# Context for `app/models/`

## Overview
This module contains SQLAlchemy ORM models for the SercueScribe application, defining the database schema and relationships.

## Models

### User Model (`user.py`)
Represents application users with authentication and profile information.

**Key Fields:**
- `username`: Unique username (20 chars max)
- `email`: Unique email address (120 chars max)  
- `password`: Hashed password
- `is_admin`: Boolean flag for admin privileges
- `name`, `job_title`, `company`: Profile information
- `transcription_language`: ISO 639-1 language codes
- `output_language`: Full language names
- `summary_prompt`: Custom prompt for AI summarization
- `diarize`: Boolean for speaker diarization

**Relationships:**
- One-to-many with Recording (cascade delete)

### Recording Model (`recording.py`)
Represents audio recordings and their processing status.

**Key Fields:**
- `user_id`: Foreign key to User
- `filename`, `original_filename`: File identifiers
- `audio_path`: Storage path for audio file
- `transcription`: Processed text
- `summary`: AI-generated summary
- `status`: Processing state (PENDING, PROCESSING, SUMMARIZING, COMPLETED, FAILED)
- `file_size`, `duration`: File metadata
- `processing_started_at`, `processing_completed_at`: Timestamps
- `error_message`: Error details for failed processing

**Relationships:**
- Many-to-one with User (owner)

## Base Entity
All models inherit from `BaseEntity` providing:
- `id`: Auto-incrementing primary key
- `is_deleted`: Soft delete flag
- `created_at`, `updated_at`: Automatic timestamps

## Database Integration
- Uses SQLAlchemy 2.0+ with declarative base
- Configured for PostgreSQL with connection pooling
- Alembic migrations for schema management
- Foreign key constraints and cascade deletes

## Usage Guidance
- Import models via `from app.models import User, Recording`
- Use with FastAPI dependencies for database sessions
- All models inherit base timestamps and soft delete functionality
- Use this context for defining or updating database models.
- Reference this folder when you need to:
  - Add new models or update existing ones
  - Define relationships and constraints
- Models should not contain business logic.

## Tooling
- Use Desktop Commander for model file management.
- Use Context7 for SQLAlchemy ORM conventions and best practices.
