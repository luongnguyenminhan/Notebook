# Context for `app/services/`

## Overview
This folder contains the business logic and service layer, implementing core functionality and data operations for the SercueScribe authentication system.

## Service Files

### Authentication Service (`auth_service.py`)
Handles user authentication and account management operations.

**Methods:**
- `create_user(db, user)`: Register new users with validation
- `authenticate_user(db, email, password)`: Validate login credentials  
- `create_access_token_for_user(user)`: Generate JWT tokens
- `update_user(db, user, user_update)`: Modify user profiles and settings
- `change_password(db, user, current_password, new_password)`: Secure password updates
- `get_user_stats(db, user)`: Calculate user recording statistics

**Features:**
- Password hashing with bcrypt via Passlib
- Duplicate username/email validation
- JWT token generation with configurable expiry
- User statistics (recording count, storage usage)
- SQLAlchemy 2.0+ compatible queries

### Admin Service (`admin_service.py`)
Administrative functions and dashboard data management.

**Methods:**
- `get_all_users(db)`: Retrieve all users with statistics
- `create_user(db, user)`: Admin user creation (includes admin privileges)
- `update_user(db, user_id, user_update)`: Admin user modifications
- `delete_user(db, user_id, current_user_id)`: Safe user deletion with cascade cleanup
- `toggle_admin(db, user_id, current_user_id)`: Admin privilege management
- `get_admin_stats(db)`: System-wide statistics and metrics

**Features:**
- Permission checks (admin-only operations)
- Self-protection (can't delete/demote self)
- Cascade deletion of user data
- Dashboard metrics (users, recordings, storage, top users)
- Comprehensive error handling

## Business Logic Patterns
- Service classes use static methods for stateless operations
- Database sessions injected via FastAPI dependency injection
- HTTPException raising for API-appropriate error handling
- Separation of concerns: services handle business logic, not HTTP details
- Pydantic v2 compatible with model_dump() for serialization

## Security Features
- Password hashing with Passlib/bcrypt
- JWT token generation and validation
- Admin permission enforcement
- Input validation and sanitization
- Protection against common vulnerabilities

## Database Integration
- SQLAlchemy 2.0+ syntax throughout
- Proper session management with dependency injection
- Optimized queries for statistics and user data
- Foreign key relationships with cascade operations

## Usage Guidance
- Import services in API endpoints for business logic
- Use dependency injection for database sessions: `db: Session = Depends(get_db)`
- Services return domain objects, not HTTP responses
- Error handling via HTTPException for API integration
- All database operations wrapped in service methods for consistency

## Tooling
- Use Desktop Commander for service file management.
- Use Context7 for service layer and background task best practices.
