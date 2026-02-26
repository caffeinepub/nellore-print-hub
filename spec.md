# Specification

## Summary
**Goal:** Fix the chicken-and-egg authorization bug that prevents the very first admin from being registered on a fresh deployment.

**Planned changes:**
- Update the backend admin registration logic so that if zero admins exist in the system, the registration proceeds without requiring an existing admin caller
- Keep the existing admin-only authorization guard active for all subsequent registrations (when one or more admins already exist)

**User-visible outcome:** On a fresh deployment, an admin can successfully register for the first time without receiving an "Unauthorized: Only admins can assign user roles" error. After the first admin is created, the normal authorization rules apply to any further admin registrations.
