// Admin session storage utility

const SESSION_KEY = 'adminSession';

interface AdminSession {
  email: string;
  timestamp: number;
}

export function setAdminSession(email: string): void {
  const session: AdminSession = { email, timestamp: Date.now() };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  // Also set flat keys for compatibility
  sessionStorage.setItem('adminEmail', email);
  sessionStorage.setItem('adminAuthenticated', 'true');
  // Legacy key
  sessionStorage.setItem('adminEmailSession', JSON.stringify({ email, authenticated: true }));
}

export function getAdminSession(): string | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const session: AdminSession = JSON.parse(raw);
      if (session.email) return session.email;
    }
    // Fallback to flat keys
    const email = sessionStorage.getItem('adminEmail');
    const authenticated = sessionStorage.getItem('adminAuthenticated');
    if (email && authenticated === 'true') return email;
    // Fallback to legacy key
    const legacy = sessionStorage.getItem('adminEmailSession');
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (parsed.email && parsed.authenticated) return parsed.email;
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem('adminEmail');
  sessionStorage.removeItem('adminAuthenticated');
  sessionStorage.removeItem('adminEmailSession');
}

export function isAdminSessionValid(): boolean {
  return getAdminSession() !== null;
}
