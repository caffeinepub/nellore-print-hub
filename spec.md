# Specification

## Summary
**Goal:** Permanently seed a hardcoded first admin account (magic.nellorehub@gmail.com) on the backend and pre-fill the login page with that email so no manual registration is needed.

**Planned changes:**
- On backend initialization (and upgrades), seed an admin credential for email `magic.nellorehub@gmail.com` with the SHA-256 hash of `Munnu1998@` in an idempotent way (no duplicates created on repeated runs).
- On the AdminLoginPage, pre-fill the email input with `magic.nellorehub@gmail.com` on initial render.
- On AdminLoginPage load, trigger the first-admin seed automatically if no admin exists yet.

**User-visible outcome:** The admin can immediately log in with email `magic.nellorehub@gmail.com` and password `Munnu1998@` without any prior registration step, and is redirected to the admin dashboard upon success.
