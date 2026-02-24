# Specification

## Summary
**Goal:** Convert the existing website into a mobile app-like interface with native app UI/UX patterns including bottom navigation, swipeable pages, and mobile-optimized interactions.

**Planned changes:**
- Replace header navigation with a fixed bottom navigation bar containing Home, Services, Gallery, Testimonials, and Chat icons with labels
- Update header to minimal mobile app-style top bar with logo only, removing horizontal navigation menu
- Implement swipeable page transitions between main sections with touch gesture support
- Add pull-to-refresh functionality on all customer-facing pages
- Optimize layouts for mobile-first vertical scrolling with card-based designs and 44x44px minimum touch targets
- Convert chat widget to full-screen modal interface that opens from bottom navigation
- Add haptic feedback (vibration) for button taps, form submissions, and navigation actions
- Implement skeleton screens with shimmer effects for loading states instead of traditional spinners
- Update form pages with mobile-optimized controls including bottom sheets for selects and touch-friendly input fields

**User-visible outcome:** Users experience a native mobile app-like interface with bottom navigation, swipeable pages, pull-to-refresh, haptic feedback, and mobile-optimized forms and layouts while maintaining all existing functionality.
