# Specification

## Summary
**Goal:** Add a complete admin authentication flow (first-time registration, login, route protection, and dashboard access) for the Nellore Print Hub application.

**Planned changes:**
- Add `/admin/register` page that collects email and password, hashes the password with SHA-256, and calls the backend seed/invite admin mutation to create the first admin account; redirects to `/admin/login` on success
- When no admin account exists, redirect any visit to `/admin` or `/admin/login` to `/admin/register`; once an admin exists, `/admin/register` redirects to `/admin/login`
- Add `/admin/login` page that authenticates with email/password (SHA-256 hashed), persists session to `sessionStorage`, redirects to `/admin/dashboard` on success, and shows an inline error on failure
- Implement `AdminGuard` to protect all `/admin/*` routes: unauthenticated users are redirected to `/admin/login`, and users with no admin account are redirected to `/admin/register`
- Ensure `/admin/dashboard` is accessible after login, displays all management section links and statistics, and includes a logout button that clears `sessionStorage` and redirects to `/admin/login`
- Add backend support (in `backend/main.mo`) for checking if an admin exists, seeding/inviting the first admin, and verifying admin credentials

**User-visible outcome:** Admins can register the first account, log in securely, and access the full admin dashboard. All admin pages are protected from unauthenticated access.
