# Specification

## Summary
**Goal:** Fix the "Is your design ready?" toggle on the quotation page, fix admin login/authentication so it works correctly on the live app, and add a visible Admin Login link on the main site.

**Planned changes:**
- Fix the Yes/No option selector on the QuotationRequestPage so clicking either option visually updates the selected state and stores the correct value for form submission
- Fix AdminGuard and AdminLoginPage so that valid email/password login on the live/deployed app correctly redirects to /admin/dashboard instead of showing the setup page
- Ensure session storage keys and values are written and read consistently between AdminLoginPage and AdminGuard
- Ensure the admin-exists check and credential verification work correctly in production
- Add a discreet "Admin Login" link in the site footer (or HomePage) that navigates to /admin/login

**User-visible outcome:** Admins can log in with their email and password on the live app and be taken directly to the Admin Dashboard. The quotation form's design-ready toggle correctly highlights the selected option. A visible Admin Login link is available on the main site for easy access to the admin area.
