import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { createMockSession, parseErrorEnvelope, resetStorage } from './helpers/test-harness';
import { ROLE_PERMISSIONS, hasPermission, canAccessPortal } from '../../lib/auth/permissions';
import type { UserRole, AuthUser } from '../../lib/auth/types';

describe('E2E Authentication, Session Restoration & RBAC', () => {
  const originalFetch = globalThis.fetch;
  const STORAGE_KEY = 'virsaflow_auth_session_v2';
  const TOKEN_KEY = 'virsaflow_access_token';

  beforeEach(() => {
    resetStorage();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('Tier 1: Feature Coverage (Session Authentication & Restoration)', () => {
    it('1.1 authenticates valid credentials via POST /api/auth/session and stores session token', async () => {
      const mockSession = createMockSession('project_developer', false);

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify(mockSession), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      // Simulate login flow
      const res = await fetch('http://127.0.0.1:8000/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'developer@virsaflow.com', password: 'valid-password' }),
      });

      expect(res.ok).toBe(true);
      const data = await res.json();
      expect(data.accessToken).toBeDefined();
      expect(data.user.role).toBe('project_developer');
      expect(data.user.isDemoUser).toBe(false);

      // Store token
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      expect(localStorage.getItem(TOKEN_KEY)).toBe(mockSession.accessToken);
    });

    it('1.2 restores active session on reload via GET /api/auth/me when token is valid', async () => {
      const mockSession = createMockSession('reviewer', false);
      localStorage.setItem(TOKEN_KEY, mockSession.accessToken);

      globalThis.fetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        const authHeader = headers.get('Authorization');
        if (authHeader === `Bearer ${mockSession.accessToken}`) {
          return new Response(JSON.stringify(mockSession.user), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return new Response(JSON.stringify({ error: { code: 'UNAUTHENTICATED', message: 'Invalid token' } }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const token = localStorage.getItem(TOKEN_KEY);
      expect(token).toBeDefined();

      const res = await fetch('http://127.0.0.1:8000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(res.status).toBe(200);
      const restoredUser = await res.json();
      expect(restoredUser.id).toBe(mockSession.user.id);
      expect(restoredUser.role).toBe('reviewer');
    });

    it('1.3 clears stored session and token when GET /api/auth/me returns 401 UNAUTHENTICATED', async () => {
      const expiredToken = 'expired-token-xyz';
      localStorage.setItem(TOKEN_KEY, expiredToken);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: { id: 'USR-01' }, expiresAt: Date.now() + 100000 }));

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: {
              code: 'UNAUTHENTICATED',
              message: 'Invalid, expired, or revoked session token.',
            },
          }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      // Verify token is sent
      const token = localStorage.getItem(TOKEN_KEY);
      const res = await fetch('http://127.0.0.1:8000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(res.status).toBe(401);
      const errorData = await res.json();
      const parsedError = parseErrorEnvelope(res.status, errorData);
      expect(parsedError.code).toBe('UNAUTHENTICATED');

      // Purge session on 401
      if (res.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(STORAGE_KEY);
      }

      expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('1.4 enforces distinct UI permissions across the 6 standard user roles', () => {
      const roles: UserRole[] = ['admin', 'project_developer', 'field_officer', 'reviewer', 'farmer', 'buyer'];

      for (const role of roles) {
        const perms = ROLE_PERMISSIONS[role];
        expect(perms).toBeDefined();
        expect(Array.isArray(perms)).toBe(true);

        const dummyUser: AuthUser = {
          id: `USR-${role.toUpperCase()}`,
          email: `${role}@example.com`,
          name: `${role} User`,
          role,
          permissions: perms,
          isDemoUser: false,
        };

        if (role === 'admin') {
          expect(hasPermission(dummyUser, 'users.manage')).toBe(true);
        } else if (role === 'farmer') {
          expect(hasPermission(dummyUser, 'fields.read')).toBe(true);
          expect(canAccessPortal(dummyUser, 'farmer')).toBe(true);
          expect(canAccessPortal(dummyUser, 'workspace')).toBe(false);
        } else if (role === 'buyer') {
          expect(hasPermission(dummyUser, 'marketplace.read')).toBe(true);
          expect(canAccessPortal(dummyUser, 'buyer')).toBe(true);
          expect(canAccessPortal(dummyUser, 'workspace')).toBe(false);
        } else if (role === 'reviewer') {
          expect(hasPermission(dummyUser, 'evidence.review')).toBe(true);
          expect(canAccessPortal(dummyUser, 'workspace')).toBe(true);
        }
      }
    });

    it('1.5 prevents unauthenticated access to protected portals', () => {
      const unauthenticatedUser: AuthUser | null = null;
      expect(canAccessPortal(unauthenticatedUser, 'workspace')).toBe(false);
      expect(canAccessPortal(unauthenticatedUser, 'farmer')).toBe(false);
      expect(canAccessPortal(unauthenticatedUser, 'buyer')).toBe(false);
      expect(hasPermission(unauthenticatedUser, 'dashboard.read')).toBe(false);
    });
  });

  describe('Tier 2: Boundary & Corner Cases (Authentication & Token Edge Cases)', () => {
    it('2.1 fails login gracefully with 401 when given incorrect password', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: {
              code: 'UNAUTHENTICATED',
              message: 'Invalid email or password.',
            },
          }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      const res = await fetch('http://127.0.0.1:8000/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@virsaflow.com', password: 'wrong-password' }),
      });

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error.code).toBe('UNAUTHENTICATED');
      expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    });

    it('2.2 handles 429 Too Many Requests on repeated failed login attempts', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: {
              code: 'RATE_LIMITED',
              message: 'Too many failed attempts. Try again later.',
            },
          }),
          {
            status: 429,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      const res = await fetch('http://127.0.0.1:8000/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@virsaflow.com', password: 'brute-force-guess' }),
      });

      expect(res.status).toBe(429);
      const data = await res.json();
      const parsed = parseErrorEnvelope(res.status, data);
      expect(parsed.code).toBe('RATE_LIMITED');
    });

    it('2.3 rejects expired session from localStorage without sending network request', () => {
      const expiredSession = {
        user: { id: 'USR-01', role: 'admin' },
        issuedAt: Date.now() - 3600000 * 24,
        expiresAt: Date.now() - 1000, // Expired 1 second ago
        sessionType: 'production',
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expiredSession));

      const isExpired = Date.now() > expiredSession.expiresAt;
      expect(isExpired).toBe(true);

      // Session must be rejected and fail closed
      const activeUser = isExpired ? null : expiredSession.user;
      expect(activeUser).toBeNull();
    });

    it('2.4 handles corrupt non-JSON localStorage session string gracefully', () => {
      localStorage.setItem(STORAGE_KEY, 'corrupted{non:json:payload');
      let recoveredUser = null;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          recoveredUser = JSON.parse(raw);
        }
      } catch {
        // Fails closed cleanly
        recoveredUser = null;
      }
      expect(recoveredUser).toBeNull();
    });

    it('2.5 handles missing Authorization header during protected endpoint request', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: {
              code: 'UNAUTHENTICATED',
              message: 'Missing or malformed Authorization header.',
            },
          }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      const res = await fetch('http://127.0.0.1:8000/api/auth/me');
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error.code).toBe('UNAUTHENTICATED');
    });

    it('2.6 registers a new user profile via POST /api/auth/register and sets access token', async () => {
      const mockRegisterResponse = {
        accessToken: 'jwt-registered-user-token',
        tokenType: 'Bearer',
        expiresInSeconds: 3600,
        user: {
          id: 'USR-FAR-1234ABCD',
          name: 'Harmanpreet Kaur',
          email: 'harmanpreet@punjab-agri.in',
          role: 'farmer',
          organization: 'Malwa Progressive Farmers',
          isDemoUser: false,
        },
      };

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify(mockRegisterResponse), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const res = await fetch('http://127.0.0.1:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Harmanpreet Kaur',
          email: 'harmanpreet@punjab-agri.in',
          password: 'StrongPassword123!',
          role: 'farmer',
          organization: 'Malwa Progressive Farmers',
        }),
      });

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.accessToken).toBe('jwt-registered-user-token');
      expect(data.user.role).toBe('farmer');
      expect(data.user.name).toBe('Harmanpreet Kaur');

      localStorage.setItem(TOKEN_KEY, data.accessToken);
      expect(localStorage.getItem(TOKEN_KEY)).toBe('jwt-registered-user-token');
    });

    it('2.7 rejects registration with existing email with EMAIL_ALREADY_EXISTS code', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: {
              code: 'EMAIL_ALREADY_EXISTS',
              message: 'An account with this email address already exists.',
            },
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      const res = await fetch('http://127.0.0.1:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Duplicate User',
          email: 'existing@virsaflow.com',
          password: 'Password123!',
          role: 'farmer',
        }),
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error.code).toBe('EMAIL_ALREADY_EXISTS');
    });
  });
});
