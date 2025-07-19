# Context for `app/core/`

## Overview
This folder contains core configuration, settings, database connections, and security utilities for the SercueScribe application.

## Core Files

### Configuration (`config.py`)
Application settings and environment configuration:

**Settings:**
- `database_url`: MySQL connection string
- `secret_key`: JWT signing key (change in production)
- `access_token_expire_minutes`: JWT token lifetime
- `allow_registration`: Toggle user registration
- `asr_diarize`: ASR diarization setting
- `redis_url`: Redis connection for Celery
- `environment`: Development/production mode

**Features:**
- Pydantic BaseSettings for validation
- Environment variable override support
- Caching with lru_cache for performance
- Type hints and validation

### Database (`database.py`)
SQLAlchemy database connection and session management:

**Components:**
- `engine`: SQLAlchemy engine with connection pooling
- `SessionLocal`: Database session factory
- `get_db()`: FastAPI dependency for database sessions

**Features:**
- Connection pooling with pre-ping for reliability
- Echo mode for development SQL logging
- Session lifecycle management
- FastAPI dependency pattern

### Security (`security.py`)
Authentication and authorization utilities:

**Functions:**
- `verify_password()`: Password verification with bcrypt
- `get_password_hash()`: Secure password hashing
- `create_access_token()`: JWT token generation
- `get_current_user()`: FastAPI dependency for authentication
- `get_current_admin_user()`: Admin-only dependency

**Features:**
- Bcrypt password hashing with Passlib
- JWT tokens with Jose library
- Configurable token expiry
- Bearer token authentication
- Role-based access control

## Security Architecture
- Stateless JWT authentication
- Bcrypt password hashing (industry standard)
- Bearer token validation
- Admin role enforcement
- Configurable token lifetime

## Database Architecture
- MySQL with SQLAlchemy 2.0+
- Connection pooling for performance
- Session-per-request pattern
- Automatic session cleanup

## Configuration Management
- Environment-based settings
- Development vs production modes
- Sensitive data via environment variables
- Type-safe configuration with Pydantic

## Usage Guidance
- Import settings via `from app.core.config import settings`
- Use `get_db()` dependency for database access
- Import auth dependencies for route protection
- Configure environment variables for deployment
- Keep sensitive configuration in environment files

## Tooling
- Use Desktop Commander for managing config files.
- Use Context7 to look up configuration and Celery best practices.
