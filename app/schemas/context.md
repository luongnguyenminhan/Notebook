# Context for `app/schemas/`

## Overview
This folder contains Pydantic schemas for request and response validation, defining API contracts and data structures.

## Schema Files

### Authentication Schemas (`auth.py`)
User-related request/response schemas:

- `UserBase`: Base user fields (username, email)
- `UserCreate`: User registration (includes password validation)
- `UserUpdate`: User profile updates (all optional fields)
- `UserResponse`: Public user information (excludes password)
- `UserAdminResponse`: Admin view with statistics
- `UserLogin`: Login credentials
- `Token`: JWT token response
- `TokenData`: Token payload structure
- `PasswordChange`: Password change validation

### Recording Schemas (`recording.py`)
Audio recording data structures:

- `RecordingBase`: Basic recording fields
- `RecordingCreate`: Recording creation request
- `RecordingUpdate`: Recording modification
- `RecordingResponse`: Complete recording information

### Admin Schemas (`admin.py`)
Administrative dashboard data:

- `AdminStats`: System statistics and metrics

## Validation Features
- Email validation using `EmailStr`
- Password strength requirements (minimum 8 characters)
- Field validation with custom validators
- Optional field handling for updates
- Automatic datetime serialization

## Usage Guidance
- Import schemas for FastAPI endpoint typing
- Use `response_model` parameter in route decorators
- All schemas support `from_attributes=True` for SQLAlchemy models
- Password fields are automatically excluded from responses
- Custom validators enforce business rules (password complexity, email format)

## Integration
- Works seamlessly with SQLAlchemy models via `from_attributes`
- FastAPI automatically generates OpenAPI documentation from schemas
- Pydantic v2 provides enhanced performance and validation

## Tooling
- Use Desktop Commander for schema file management.
- Use Context7 for Pydantic and FastAPI schema best practices.
