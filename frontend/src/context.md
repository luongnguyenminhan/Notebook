# Frontend Context - src Directory

This document summarizes the code context for each file and subdirectory in the `frontend/src` directory of the SercueScribe project. It is intended to provide a high-level overview similar to the backend's copilot-instructions, with a focus on the frontend architecture, conventions, and structure.

## Directory Structure

- **app/**: Main Next.js application entry point and route handlers. Contains page components, layouts, and route-specific logic.
- **components/**: Reusable React components used throughout the frontend. Follows atomic/component-based design for UI consistency.
- **i18n/**: Internationalization (i18n) utilities, configuration, and locale resources. Handles language switching and translation logic.
- **lib/**: Shared frontend libraries, utilities, and helper functions. Used for API calls, formatting, and other cross-cutting concerns.
- **middleware.ts**: Next.js middleware for request/response handling, such as authentication, redirects, or locale detection.

## Key Patterns & Conventions

- **Next.js App Router**: Uses the new app directory structure for routing and layouts.
- **TypeScript**: All code is written in TypeScript for type safety and maintainability.
- **i18n Support**: Built-in internationalization with locale subpaths and translation files in `dictionary/`.
- **Component Reuse**: UI is composed of modular, reusable components from `components/`.
- **API Integration**: API calls and business logic are abstracted in `lib/` for separation of concerns.
- **Modern React**: Uses functional components, hooks, and context where appropriate.

## Example File Summaries

- `app/sitemap.ts`: Generates a sitemap for all supported locales, using the base URL and locale list. Exports a function returning an array of sitemap entries for SEO.
- `middleware.ts`: Handles middleware logic for the app, such as locale detection or authentication checks.
- `components/`: Contains UI elements like buttons, forms, modals, etc., designed for reuse and consistency.
- `i18n/`: Manages translation loading, language switching, and locale context for the app.
- `lib/`: Provides utility functions, API clients, and shared logic used across the frontend.

## Development Workflow

- **Install dependencies**: `npm install` or `bun install`
- **Run development server**: `npm run dev` or `bun dev`
- **Build for production**: `npm run build`
- **Lint and format**: `npm run lint` and `npm run format`

## Testing
- Add tests for components and utilities as needed (e.g., using Jest or React Testing Library).

## Best Practices
- Keep components small and focused.
- Use TypeScript types and interfaces for props and data.
- Organize files by feature or domain when possible.
- Use environment variables for configuration.
- Follow Next.js and React conventions for file and folder naming.

---

This context should be updated as the frontend evolves. For backend and full-stack conventions, see the main copilot-instructions.md.
