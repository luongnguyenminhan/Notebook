# SercueScribe - AI Coding Instructions

## Project Overview
This is **SercueScribe**, a FastAPI-based application following a clean architecture pattern with modular components. The project uses modern Python FastAPI conventions with clear separation of concerns and includes a comprehensive authentication and admin system.

## Architecture & Structure

### Core Components
- `app/main.py` - FastAPI application entry point with CORS and router configuration
- `app/api/` - API layer with endpoints and dependencies
- `app/core/` - Core configuration, database, security, and Celery setup
- `app/db/` - Database base classes and model registration
- `app/models/` - SQLAlchemy ORM models (User, Recording)
- `app/schemas/` - Pydantic request/response schemas with validation
- `app/services/` - Business logic and service layer (AuthService, AdminService)
- `app/utils/` - Shared utilities and helpers
- `docker-compose.yml` - Multi-service development environment
- `Dockerfile` - Application containerization

### Authentication System
- **JWT Bearer Token Authentication**: Stateless authentication with configurable expiry
- **User Management**: Registration, login, profile updates, password changes
- **Admin System**: User administration, statistics dashboard, role management
- **Security**: Bcrypt password hashing, OAuth2-compatible login, role-based access control
- **Models**: User model with profile fields, Recording model with processing status

### Key Patterns
- **Layered Architecture**: API → Services → Models → DB
- **Dependency Injection**: Use `app/api/dependencies/` for FastAPI dependencies
- **Schema Validation**: Pydantic models in `schemas/` for API contracts
- **Service Layer**: Business logic isolated in `services/` directory
- **Background Tasks**: Celery with Redis for async processing
- **Containerization**: Docker Compose for development environment

## Development Workflow

### Setup & Running

#### Local Development
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Docker Development
```bash
# Start all services (API, database, Redis, worker)
docker-compose up -d

# View logs
docker-compose logs -f app

# Run migrations
docker-compose exec app alembic upgrade head

# Stop all services
docker-compose down
```

### Key Dependencies
- FastAPI 0.100+ for API framework
- SQLAlchemy 2.0+ for ORM
- Alembic for database migrations  
- Pydantic 2.0+ for data validation
- Pytest for testing
- Celery 5.3+ for background tasks
- Redis 4.5+ for task queue and caching
- MySQL for primary database

### Testing Structure
- `tests/` mirrors `app/` structure
- `tests/api/` for endpoint tests
- `tests/services/` for business logic tests
- `tests/utils/` for utility function tests

## Project Conventions

### File Organization
- Keep related functionality grouped in appropriate directories
- Use `__init__.py` files to expose public APIs from modules
- Follow existing empty directory structure - expand as needed

### Code Standards  
- **Critical Rule**: DO NOT CREATE NEW FILES WITH INAPPROPRIATE NAMES - edit existing files when possible
- Use type hints throughout (FastAPI/Pydantic requirement)
- Follow FastAPI dependency injection patterns
- Separate concerns: API routing, business logic, data access

### Configuration
- Environment variables in `.env` files (gitignored)
- Core configuration should go in `app/core/`
- Database configuration in `app/db/`

## Integration Points
- Database: SQLAlchemy ORM with Alembic migrations
- API: FastAPI with automatic OpenAPI documentation
- Testing: Pytest with potential for API client testing via httpx

## Common Tasks
- **New Endpoint**: Add to `app/api/endpoints/`, register in main router
- **New Model**: Create in `app/models/`, add schema in `app/schemas/`
- **Business Logic**: Implement in `app/services/`
- **Background Task**: Create Celery task in `app/core/` or `app/services/`
- **Database Migration**: Use Alembic commands
- **Testing**: Follow existing test directory structure

## Docker Services
- **app**: Main FastAPI application (port 8000)
- **worker**: Celery worker for background tasks
- **db**: MySQL database (port 3306)
- **redis**: Redis for task queue and caching (port 6379)
- **flower**: Celery monitoring dashboard (port 5555)


## Frontend Guide

The `frontend/` directory contains the Next.js-based frontend for SercueScribe. It follows modern React and Next.js conventions, with a focus on modularity, internationalization, and maintainability.

- **src/app/**: Main Next.js app directory, including route handlers, layouts, and pages.
- **src/components/**: Reusable React components for UI consistency.
- **src/i18n/**: Internationalization (i18n) logic and locale resources.
- **src/lib/**: Shared frontend utilities and API clients.
- **src/middleware.ts**: Middleware for locale detection, authentication, etc.

**Key Patterns:**
- Uses TypeScript throughout for type safety.
- Follows Next.js App Router structure.
- Supports multiple locales with translation files in `dictionary/`.
- Encourages component reuse and separation of concerns.
- API integration and business logic are abstracted in `lib/`.

**Development Workflow:**
- Install dependencies: `npm install` or `bun install`
- Run dev server: `npm run dev` or `bun dev`
- Build: `npm run build`
- Lint/format: `npm run lint` / `npm run format`

**Best Practices:**
- Keep components small and focused.
- Use TypeScript types for props and data.
- Organize files by feature/domain when possible.
- Use environment variables for config.
- Follow Next.js/React naming conventions.

See `frontend/src/context.md` for a detailed summary of the frontend code context.

---

The project is designed for scalability with clear boundaries between API, business logic, data, and frontend layers.
