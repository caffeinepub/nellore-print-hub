# Specification

## Summary
**Goal:** Update the Nellore Printing Hub app with quotation form improvements, admin login redirect fix, customer-facing UX enhancements, bilingual English/Telugu toggle, and permanent app branding.

**Planned changes:**
- Remove file attachment input from the quotation form; replace with a "Is your design ready?" radio option ("Yes, my design is ready" / "No, I need design assistance") stored as `designStatus` in the submission payload
- Update admin quotation management view to display the `designStatus` field for each quotation
- Fix admin login to redirect directly to the Admin Dashboard after successful email/password authentication
- Add a prominent "Share This App" call-to-action on the Home page using the existing ShareAppButton component
- Improve the hero section on HomePage with a bold tagline and clear CTA button using vibrant accent colors
- Add smooth hover/tap animations to service cards, gallery items, and navigation elements
- Standardize button styling across all customer-facing pages (filled primary, outline secondary)
- Add friendly status messages and progress indicators on the customer portal and quotation pages
- Ensure the LanguageToggle component is visible in the header on all screen sizes and in a fixed/floating position on mobile
- Ensure all customer-facing pages (Quotation, CustomerLogin, CustomerRegistration, CustomerPortal, Home, Services, ContactUs, Testimonials) use LanguageContext translations and display correctly in both English and Telugu
- Add missing translation keys (including the new design-status options) to both `en.ts` and `te.ts`
- Set app name to "Nellore Printing Hub" in the browser tab title, header logo, hero section, About page, and all other visible instances
- Add a permanent hardcoded "Sponsored by Magic Advertising" footer badge/text in Layout.tsx visible on every page (not admin-configurable)

**User-visible outcome:** Customers see a fully bilingual, visually polished app branded as "Nellore Printing Hub" with a simpler quotation form, better UX, and a persistent sponsor footer. Admins are taken directly to the dashboard after login.
