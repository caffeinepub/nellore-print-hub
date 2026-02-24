# Specification

## Summary
**Goal:** Add admin user management system with email/password and biometric authentication for admin partners.

**Planned changes:**
- Implement backend admin user storage with email, password hash, and biometric registration status
- Create admin invitation system allowing existing admins to invite new admin partners
- Add email/password authentication in backend with secure password hashing
- Implement biometric authentication registration and verification in backend
- Create admin-only login page with email/password and biometric login options
- Build admin user management interface to view and invite admin partners
- Integrate WebAuthn API for device-level biometric authentication (Face ID, Touch ID, fingerprint)
- Update admin navigation to show new login option only on admin routes

**User-visible outcome:** Admins can log in using email/password or biometric authentication (face/fingerprint), invite other partners to share admin access, and manage all admin users from a dedicated management interface. The new authentication methods work alongside the existing Internet Identity system.
