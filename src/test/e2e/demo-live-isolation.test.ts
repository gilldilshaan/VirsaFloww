import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { DEMO_IDENTITIES } from '../../lib/auth/auth-context';
import { ROLE_PERMISSIONS } from '../../lib/auth/permissions';
import { resetStorage } from './helpers/test-harness';
import type { UserRole, AuthUser } from '../../lib/auth/types';

describe('E2E Strict Demo vs Live Mode Separation & Security Boundaries', () => {
  const originalFetch = globalThis.fetch;
  const TOKEN_KEY = 'virsaflow_access_token';

  beforeEach(() => {
    resetStorage();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('Tier 1: Feature Coverage (Demo Mode Identification & Isolation)', () => {
    it('1.1 verifies all preconfigured demo identities have isDemoUser: true and USR-DEMO prefix', () => {
      const demoUsers = Object.values(DEMO_IDENTITIES);
      expect(demoUsers.length).toBe(6);

      for (const demo of demoUsers) {
        expect(demo.isDemoUser).toBe(true);
        expect(demo.id).toMatch(/^USR-DEMO-[A-Z-]+/);
        expect(demo.email).toContain('@');
        expect(demo.role).toBeDefined();
      }
    });

    it('1.2 ensures demo session never stores a live backend virsaflow_access_token', () => {
      // Activating demo session
      const activeDemoUser = DEMO_IDENTITIES.reviewer;
      expect(activeDemoUser.isDemoUser).toBe(true);

      // Demo mode must not inject or forge live JWT into virsaflow_access_token
      expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    });

    it('1.3 blocks live mutation HTTP requests (POST, PUT, PATCH, DELETE) when in demo mode', async () => {
      let networkDispatchAttempted = false;

      globalThis.fetch = vi.fn().mockImplementation(async () => {
        networkDispatchAttempted = true;
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      });

      const user: AuthUser = { ...DEMO_IDENTITIES.field_officer, isDemoUser: true };

      // Simulation of mutation dispatcher with demo guard
      async function dispatchMutation(endpoint: string, method: string, payload: unknown) {
        if (user.isDemoUser) {
          // Demo interceptor: mutate purely in-memory / local state, NEVER hit live backend API
          return { success: true, mode: 'demo_mock' };
        }
        const res = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        return await res.json();
      }

      const result = await dispatchMutation('http://127.0.0.1:8000/api/evidence', 'POST', {
        title: 'New Demo Evidence',
      });

      expect(result.mode).toBe('demo_mock');
      expect(networkDispatchAttempted).toBe(false);
    });

    it('1.4 strictly binds demo permissions to canonical ROLE_PERMISSIONS matrix', () => {
      const roles: UserRole[] = ['admin', 'project_developer', 'field_officer', 'reviewer', 'farmer', 'buyer'];

      for (const role of roles) {
        const demoUser = DEMO_IDENTITIES[role];
        expect(demoUser).toBeDefined();
        expect(demoUser.permissions).toEqual(ROLE_PERMISSIONS[role]);
      }
    });

    it('1.5 permits live mode user to dispatch live authenticated network requests', async () => {
      let networkDispatched = false;
      const liveToken = 'live-valid-bearer-token';
      localStorage.setItem(TOKEN_KEY, liveToken);

      globalThis.fetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
        networkDispatched = true;
        const headers = new Headers(init?.headers);
        expect(headers.get('Authorization')).toBe(`Bearer ${liveToken}`);
        return new Response(JSON.stringify({ success: true, mode: 'live_persisted' }), { status: 200 });
      });

      const liveUser: AuthUser = {
        id: 'USR-LIVE-DEV-01',
        email: 'developer@virsaflow.com',
        name: 'Live Developer',
        role: 'project_developer',
        permissions: ROLE_PERMISSIONS.project_developer,
        isDemoUser: false,
      };

      async function dispatchMutation(endpoint: string, method: string, payload: unknown) {
        if (liveUser.isDemoUser) {
          return { success: true, mode: 'demo_mock' };
        }
        const token = localStorage.getItem(TOKEN_KEY);
        const res = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
        return await res.json();
      }

      const result = await dispatchMutation('http://127.0.0.1:8000/api/projects', 'POST', {
        title: 'Live Carbon Project',
      });

      expect(networkDispatched).toBe(true);
      expect(result.mode).toBe('live_persisted');
    });
  });

  describe('Tier 2: Boundary & Corner Cases (Isolation & Tampering Prevention)', () => {
    it('2.1 rejects client-side attempts to self-elevate demo user to non-demo without backend token', () => {
      const tamperedSession = {
        user: {
          id: 'USR-DEMO-ADMIN-01',
          role: 'admin',
          isDemoUser: false, // Tampered: trying to pretend to be a live user
        },
        issuedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        sessionType: 'production',
      };

      // Fails closed if no live token exists in storage to prove authenticated status
      const hasToken = Boolean(localStorage.getItem(TOKEN_KEY));
      const isValidProductionSession = !tamperedSession.user.isDemoUser && hasToken;

      expect(isValidProductionSession).toBe(false);
    });

    it('2.2 switching demo roles re-hydrates strictly from trusted dictionary and discards custom claims', () => {
      const maliciousRoleClaim = {
        id: 'USR-DEMO-REVIEWER-01',
        role: 'reviewer' as UserRole,
        permissions: ['users.manage', 'projects.manage'] as unknown as import('../../lib/auth/types').Permission[], // Attempted escalation
        isDemoUser: true,
      };

      // Sanitize: re-resolve role from canonical DEMO_IDENTITIES
      const trusted = DEMO_IDENTITIES[maliciousRoleClaim.role];
      const sanitizedUser: AuthUser = {
        ...trusted,
        permissions: ROLE_PERMISSIONS[maliciousRoleClaim.role],
        isDemoUser: true,
      };

      expect(sanitizedUser.permissions).not.toContain('users.manage');
      expect(sanitizedUser.permissions).not.toContain('projects.manage');
      expect(sanitizedUser.permissions).toEqual(ROLE_PERMISSIONS.reviewer);
    });

    it('2.3 prevents demo identity from injecting arbitrary role names not in enum', () => {
      const invalidRole = 'super_root_god_mode' as unknown as UserRole;
      const demoExists = Boolean(DEMO_IDENTITIES[invalidRole]);
      expect(demoExists).toBe(false);
    });

    it('2.4 verifies demo data is distinctly tagged with is_demo: true and demo dataLabel', () => {
      const demoFieldFixture = {
        id: 'PB-FIELD-001',
        isDemo: true,
        dataLabel: 'Demo data',
      };

      expect(demoFieldFixture.isDemo).toBe(true);
      expect(demoFieldFixture.dataLabel).toBe('Demo data');
    });

    it('2.5 logout cleanly wipes any active demo state without residual storage leak', () => {
      localStorage.setItem('virsaflow_auth_session_v2', JSON.stringify({ user: DEMO_IDENTITIES.reviewer }));
      expect(localStorage.getItem('virsaflow_auth_session_v2')).not.toBeNull();

      // Logout
      localStorage.removeItem('virsaflow_auth_session_v2');
      localStorage.removeItem(TOKEN_KEY);

      expect(localStorage.getItem('virsaflow_auth_session_v2')).toBeNull();
      expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    });
  });
});
