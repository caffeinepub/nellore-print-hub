# Specification

## Summary
**Goal:** Add a customer self-service portal, display English and Telugu simultaneously across all pages, redesign services with visual sample cards and videos, update the gallery to a masonry layout, and build a comprehensive admin content editor for all dynamic content.

**Planned changes:**
- Add customer registration and login (email or mobile + password) with dedicated routes (`/customer/login`, `/customer/portal`); each customer sees their own quotation/work order history with status and dates
- Display English and Telugu text simultaneously (side-by-side or stacked) on all user-facing labels, headings, buttons, and content sections across every page — no language switch required to see both
- Redesign Services section: remove all A/B/C alphabetic prefixes, replace with visual cards showing sample print images and video thumbnails; add a "Printing Samples & Videos" showcase section on HomePage
- Update ProjectGalleryPage to a masonry/variable-height grid layout that preserves each image's natural aspect ratio (no forced crops or uniform heights)
- Build an Admin Content Editor covering: Contact Details, Services (with images and video URLs), Business Hours (per day), Project Gallery, and Homepage/About page content — all persisted in the backend and reflected live on public pages
- Extend backend data model to store services, business hours, homepage/about content, and customer accounts as mutable records
- All previously hardcoded user-facing content replaced with dynamically fetched, admin-editable content

**User-visible outcome:** Customers can register and log in to view their own order history. All pages show both English and Telugu text at once. Services are displayed as attractive visual cards with print samples and videos. Gallery images display in a natural masonry layout. Admins can edit all site content (contact info, services, hours, gallery, homepage, about) directly from the admin panel.
