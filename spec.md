# Specification

## Summary
**Goal:** Add admin-editable contact info access from the dashboard, open the project gallery to all visitors with a detail modal, and add an admin icon in the header for quick login/dashboard access.

**Planned changes:**
- Add an "Edit Contact Info" quick-link card to the admin dashboard that navigates to the ContactInfoManagementPage (protected by AdminGuard)
- Make the ProjectGalleryPage fully public and accessible to unauthenticated users without any login prompt
- Show project cards (image, title, description, category) and category filter buttons to all visitors; hide add/edit/delete controls from non-admins
- Add a project detail modal that opens when any project card is clicked, displaying the full-size image, title, full description, and category with a close button
- Add an admin icon (shield or user-cog) to the app header/navigation that navigates unauthenticated users to the admin login page, and authenticated admins directly to the admin dashboard

**User-visible outcome:** Customers can browse the project gallery and view project details without logging in. Admins can quickly access contact info editing from the dashboard and use a persistent admin icon in the header to reach the dashboard or login page at any time.
