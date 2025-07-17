# Context for `app/api/`

This folder contains the API layer, including endpoint definitions and dependency injection modules.

## Usage Guidance
- Use this context for defining FastAPI routes and dependencies.
- Reference this folder when you need to:
  - Add or modify API endpoints
  - Implement or update dependency injection
- Follow the clean architecture pattern: API should only call the service layer, not access models or DB directly.

## Tooling
- Use Desktop Commander for file operations and context navigation.
- Use Context7 for searching API patterns, endpoint conventions, and FastAPI best practices.
