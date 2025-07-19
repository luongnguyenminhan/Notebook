# API Context

## authApi.ts
- Provides API client functions for authentication and user management.
- **checkIsFirstUser**: Calls `GET /auth/is-first-user` to check if the database has any users. Returns `{ is_first_user: boolean }`.
- **initSuperUser**: Calls `POST /auth/init-superuser` to create the first superuser. Used by the InitSuperUserForm.
- Both use `axiosInstance.ts` for base URL and config.

These functions are used in the first-user initialization flow to secure the app on first launch. 