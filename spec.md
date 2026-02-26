# Specification

## Summary
**Goal:** Fix the admin login redirect so that authenticated admin users are reliably navigated to the Admin Dashboard in production, instead of seeing the "Go to Admin Setup or Return to Home" fallback screen.

**Planned changes:**
- Update `AdminGuard` to show a loading indicator while actor/identity is still initializing, preventing premature evaluation of admin status that causes fallthrough to the setup screen.
- Fix `AdminLoginPage` post-login navigation to use a reliable programmatic redirect (e.g., `router.navigate`) to the admin dashboard route, ensuring navigation fires only after actor and authentication state are fully settled.
- Clear any stale auth/query cache state before checking admin existence on login to avoid race conditions.
- Ensure redirect and guard behavior is consistent between draft and production environments.

**User-visible outcome:** After logging in as an admin in production, the user is taken directly to the Admin Dashboard without seeing the setup/fallback screen.
