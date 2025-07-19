# Context for `app/api/`

## Overview
This folder contains the API layer, including endpoint definitions and dependency injection modules for FastAPI routes.

## Endpoint Files

### Authentication Endpoints (`endpoints/auth.py`)
User authentication and account management routes:

**Routes:**
- `POST /auth/register`: User registration with validation
- `POST /auth/login`: OAuth2-compatible login with JWT tokens
- `GET /auth/me`: Current user profile information
- `PUT /auth/me`: Update user profile and settings
- `POST /auth/change-password`: Secure password change
- `GET /auth/account`: Account details with system settings

**Features:**
- OAuth2 password flow compatibility
- JWT bearer token authentication
- Registration toggle via environment settings
- Account settings with ASR configuration

### Admin Endpoints (`endpoints/admin.py`)
Administrative dashboard and user management:

**Routes:**
- `GET /admin/dashboard`: Admin access validation
- `GET /admin/users`: List all users with statistics
- `POST /admin/users`: Create new users (admin)
- `PUT /admin/users/{id}`: Update user accounts
- `DELETE /admin/users/{id}`: Delete users and data
- `POST /admin/users/{id}/toggle-admin`: Toggle admin privileges
- `GET /admin/stats`: System dashboard statistics

**Features:**
- Admin-only access control
- User management with cascade operations
- System statistics and metrics
- Self-protection mechanisms

## Dependencies Structure
The `dependencies/` folder contains FastAPI dependencies for:

- Database session injection
- Authentication and authorization
- Request validation and processing

## Security Implementation
- JWT Bearer token authentication
- Role-based access control (admin vs regular users)
- Password hashing with bcrypt
- CORS middleware configuration
- Input validation via Pydantic schemas

## API Design Patterns
- RESTful endpoint design
- Consistent error handling with HTTP status codes
- Request/response validation with Pydantic models
- Dependency injection for database sessions
- Service layer separation (no direct model access)

## Usage Guidance
- Import service classes for business logic
- Use Depends() for dependency injection
- Return Pydantic models for automatic serialization
- Raise HTTPException for error handling
- Follow OAuth2 patterns for authentication
- Include appropriate HTTP status codes in responses

## Integration
- Routes registered in main.py with router inclusion
- Automatic OpenAPI documentation generation
- CORS middleware for frontend integration
- Environment-based configuration via settings

## Tooling
- Use Desktop Commander for file operations and context navigation.
- Use Context7 for searching API patterns, endpoint conventions, and FastAPI best practices.
