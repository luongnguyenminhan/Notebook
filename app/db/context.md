# Context for `app/db/`

This folder contains database connection logic and migration scripts.

## Usage Guidance
- Use this context for database setup, connection pooling, and Alembic migrations.
- Reference this folder when you need to:
  - Update DB connection settings
  - Add or manage migration scripts
- Do not put business logic or API code here.
- BaseEntity and other ORM models should be defined in this context.
- Ensure that all database migrations are versioned and documented properly.

## Tooling
- Use Desktop Commander for migration and DB file management.
- Use Context7 for SQLAlchemy and Alembic migration best practices.

