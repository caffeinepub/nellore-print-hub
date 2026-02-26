# Specification

## Summary
**Goal:** Fix the first-admin auto-promotion bug so the initial admin can register and log in without an "Unauthorized" error, and set the first admin password to "Munnu1998@".

**Planned changes:**
- Update the backend (Motoko) so that when zero admin accounts exist, the first user to call the registration/login endpoint is automatically granted admin role without requiring prior authorization.
- Ensure subsequent self-promotion attempts by non-invited users are still rejected.
- Update the AdminLoginPage and/or AdminGuard so the first-admin registration flow pre-seeds the password "Munnu1998@" (SHA-256 hashed before sending) and completes without errors.
- Ensure the backend accepts the SHA-256 hash of "Munnu1998@" as valid credentials for the first admin account.

**User-visible outcome:** The first admin can register and log in using the password "Munnu1998@" without encountering an "Unauthorized" error, and is granted access to the AdminDashboardPage. The existing admin invitation flow for subsequent admins remains unaffected.
