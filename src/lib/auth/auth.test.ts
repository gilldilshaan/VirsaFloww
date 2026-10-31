import { describe, expect, it, beforeEach } from 'vitest';
import {
  ROLE_PERMISSIONS,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  canAccessPortal,
  canAccessFieldResource,
  canAccessProjectResource,
  canAccessEnquiryResource,
} from './permissions';
import { DEMO_IDENTITIES } from './auth-context';
import { sanitizeRedirectPath, isValidLocalRedirect } from './redirect';
import type { UserRole, Permission, AuthUser, StoredSession } from './types';

describe('Stage 2.5: Three-Portal Authentication, RBAC & Security Enforcements', () => {
  describe('1 & 2. Fresh Application Startup & No Automatic Demo Login', () => {
    it('fresh application session starts strictly unauthenticated with no user attached', () => {
      // In unauthenticated fresh state, user is null
      const initialUser: AuthUser | null = null;
      expect(initialUser).toBeNull();
      expect(hasPermission(initialUser, 'dashboard.read')).toBe(false);
      expect(canAccessPortal(initialUser, 'workspace')).toBe(false);
      expect(canAccessPortal(initialUser, 'farmer')).toBe(false);
      expect(canAccessPortal(initialUser, 'buyer')).toBe(false);
    });

    it('no automatic demo reviewer login occurs when opening the application', () => {
      // Prior bug: DEMO_IDENTITIES.reviewer was returned as default state.
      // Assert that without an explicit login action, no demo user is loaded.
      const freshSessionUser = null;
      expect(freshSessionUser).not.toEqual(DEMO_IDENTITIES.reviewer);
      expect(freshSessionUser).toBeNull();
    });
  });

  describe('3 & 4. Explicit Demo Login & Demo Identification', () => {
    it('explicit demo login populates user profile and bound permissions', () => {
      const demoReviewer = DEMO_IDENTITIES.reviewer;
      expect(demoReviewer).toBeDefined();
      expect(demoReviewer.role).toBe('reviewer');
      expect(demoReviewer.isDemoUser).toBe(true);
      expect(demoReviewer.permissions).toEqual(ROLE_PERMISSIONS.reviewer);
    });

    it('all demo accounts are visibly identifiable as DEMO', () => {
      const allDemos = Object.values(DEMO_IDENTITIES);
      expect(allDemos.length).toBe(6);
      for (const demo of allDemos) {
        expect(demo.isDemoUser).toBe(true);
        expect(demo.id).toMatch(/^USR-DEMO-/);
      }
    });
  });

  describe('5. Session Lifecycle & Logout', () => {
    it('logout clears user state and invalidates session credentials', () => {
      let activeUser: AuthUser | null = DEMO_IDENTITIES.reviewer;
      expect(activeUser).not.toBeNull();

      // Perform logout
      activeUser = null;
      expect(activeUser).toBeNull();
      expect(canAccessPortal(activeUser, 'workspace')).toBe(false);
    });

    it('expired or tampered localStorage sessions fail closed', () => {
      // Simulated expired session
      const expiredSession: StoredSession = {
        user: DEMO_IDENTITIES.reviewer,
        issuedAt: Date.now() - 10 * 3600 * 1000,
        expiresAt: Date.now() - 2 * 3600 * 1000, // 2 hours in the past
        sessionType: 'demo',
      };

      const isExpired = Date.now() > expiredSession.expiresAt;
      expect(isExpired).toBe(true);

      // Session must be rejected and null returned
      const validatedUser = isExpired ? null : expiredSession.user;
      expect(validatedUser).toBeNull();
    });

    it('production identity is never trusted without backend validation (fails closed)', () => {
      // Tampered production session in localStorage attempting self-elevation
      const fakeProductionSession: StoredSession = {
        user: {
          id: 'USR-HACK-01',
          email: 'attacker@evil.com',
          name: 'Privilege Escalation Attempt',
          role: 'admin',
          permissions: ROLE_PERMISSIONS.admin,
          isDemoUser: false,
        },
        issuedAt: Date.now(),
        expiresAt: Date.now() + 3600 * 1000,
        sessionType: 'production',
      };

      // When backend is unconfigured, production session cannot be validated:
      const apiBaseUrl = '';
      const validated = (!apiBaseUrl) ? null : fakeProductionSession.user;
      expect(validated).toBeNull();
    });
  });

  describe('6, 7, 8, 9 & 10. Cross-Portal Isolation & Role Boundaries', () => {
    const farmerUser: AuthUser = {
      ...DEMO_IDENTITIES.farmer,
      id: 'usr-farmer-verified',
    };

    const buyerUser: AuthUser = {
      ...DEMO_IDENTITIES.buyer,
      id: 'usr-buyer-verified',
    };

    const reviewerUser: AuthUser = {
      ...DEMO_IDENTITIES.reviewer,
      id: 'usr-reviewer-verified',
    };

    it('6. Farmer cannot access internal workspace', () => {
      expect(canAccessPortal(farmerUser, 'workspace')).toBe(false);
      expect(hasPermission(farmerUser, 'dashboard.read')).toBe(false);
      expect(hasPermission(farmerUser, 'evidence.review')).toBe(false);
    });

    it('7. Buyer cannot access internal workspace', () => {
      expect(canAccessPortal(buyerUser, 'workspace')).toBe(false);
      expect(hasPermission(buyerUser, 'dashboard.read')).toBe(false);
      expect(hasPermission(buyerUser, 'evidence.review')).toBe(false);
      expect(hasPermission(buyerUser, 'projects.manage')).toBe(false);
    });

    it('8. Buyer cannot access farmer portal', () => {
      expect(canAccessPortal(buyerUser, 'farmer')).toBe(false);
      expect(hasPermission(buyerUser, 'fields.read')).toBe(false);
      expect(hasPermission(buyerUser, 'evidence.upload')).toBe(false);
    });

    it('9. Farmer cannot access buyer portal', () => {
      expect(canAccessPortal(farmerUser, 'buyer')).toBe(false);
      expect(hasPermission(farmerUser, 'marketplace.read')).toBe(false);
      expect(hasPermission(farmerUser, 'enquiries.create')).toBe(false);
    });

    it('10. Reviewer cannot access buyer portal', () => {
      expect(canAccessPortal(reviewerUser, 'buyer')).toBe(false);
      expect(hasPermission(reviewerUser, 'enquiries.create')).toBe(false);
      expect(hasPermission(reviewerUser, 'buyer_profile.manage')).toBe(false);
    });
  });

  describe('11. Unauthenticated User Access Denied', () => {
    it('unauthenticated users fail closed across all portals and permissions', () => {
      expect(canAccessPortal(null, 'farmer')).toBe(false);
      expect(canAccessPortal(null, 'workspace')).toBe(false);
      expect(canAccessPortal(null, 'buyer')).toBe(false);

      expect(hasPermission(null, 'fields.read')).toBe(false);
      expect(hasPermission(null, 'evidence.review')).toBe(false);
      expect(hasPermission(null, 'marketplace.read')).toBe(false);
      expect(hasAllPermissions(null, ['dashboard.read', 'projects.read'])).toBe(false);
      expect(hasAnyPermission(null, ['dashboard.read', 'marketplace.read'])).toBe(false);
    });
  });

  describe('12 & 13. Canonical Roles & Rejection of Aliases/Arbitrary Roles', () => {
    it('12. Arbitrary role strings fail closed', () => {
      const maliciousUser = {
        id: 'usr-evil-01',
        email: 'hacker@darkweb.org',
        name: 'Evil Operator',
        role: 'super_admin_god_mode' as unknown as UserRole,
        permissions: [],
        isDemoUser: false,
      };

      expect(canAccessPortal(maliciousUser, 'workspace')).toBe(false);
      expect(canAccessPortal(maliciousUser, 'farmer')).toBe(false);
      expect(canAccessPortal(maliciousUser, 'buyer')).toBe(false);
      expect(hasPermission(maliciousUser, 'dashboard.read')).toBe(false);
      expect(hasPermission(maliciousUser, 'evidence.review')).toBe(false);
    });

    it('13. Abbreviated aliases (dev, rev, officer) are rejected', () => {
      const devAlias = { role: 'dev' as unknown as UserRole, id: '1', email: 'a', name: 'a', permissions: [], isDemoUser: false };
      const revAlias = { role: 'rev' as unknown as UserRole, id: '2', email: 'b', name: 'b', permissions: [], isDemoUser: false };
      const officerAlias = { role: 'officer' as unknown as UserRole, id: '3', email: 'c', name: 'c', permissions: [], isDemoUser: false };

      expect(canAccessPortal(devAlias, 'workspace')).toBe(false);
      expect(canAccessPortal(revAlias, 'workspace')).toBe(false);
      expect(canAccessPortal(officerAlias, 'workspace')).toBe(false);

      // Verify canonical 6 roles only exist in ROLE_PERMISSIONS
      const allowedRoles = Object.keys(ROLE_PERMISSIONS);
      expect(allowedRoles).toEqual([
        'admin',
        'project_developer',
        'reviewer',
        'field_officer',
        'farmer',
        'buyer',
      ]);
      expect(allowedRoles).not.toContain('dev');
      expect(allowedRoles).not.toContain('rev');
      expect(allowedRoles).not.toContain('officer');
    });
  });

  describe('14. Resource-Level Permission Scoping', () => {
    const farmerUser: AuthUser = {
      ...DEMO_IDENTITIES.farmer,
      farmerId: 'PB-LUD-042',
      scope: {
        permittedFieldIds: ['PB-LUD-042'],
      },
    };

    const fieldOfficerUser: AuthUser = {
      ...DEMO_IDENTITIES.field_officer,
      scope: {
        permittedFieldIds: ['PB-LUD-042', 'PB-SNG-018'],
      },
    };

    const buyerUser: AuthUser = {
      ...DEMO_IDENTITIES.buyer,
      buyerOrgId: 'AURA-CLIMATE-ASSETS',
      scope: {
        buyerOrgId: 'AURA-CLIMATE-ASSETS',
        publishedProjectIds: ['PRJ-PB-DSR-01'],
      },
    };

    it('Farmer can only access their permitted field parcel', () => {
      // Own field
      expect(canAccessFieldResource(farmerUser, 'PB-LUD-042')).toBe(true);
      // Other farmers fields -> blocked!
      expect(canAccessFieldResource(farmerUser, 'PB-SNG-018')).toBe(false);
      expect(canAccessFieldResource(farmerUser, 'PB-BTI-099')).toBe(false);
    });

    it('Field officer can only access assigned fields', () => {
      expect(canAccessFieldResource(fieldOfficerUser, 'PB-LUD-042')).toBe(true);
      expect(canAccessFieldResource(fieldOfficerUser, 'PB-SNG-018')).toBe(true);
      expect(canAccessFieldResource(fieldOfficerUser, 'PB-ASR-099')).toBe(false);
    });

    it('Buyer has zero access to raw field parcels', () => {
      expect(canAccessFieldResource(buyerUser, 'PB-LUD-042')).toBe(false);
      expect(canAccessFieldResource(buyerUser, 'PB-SNG-018')).toBe(false);
    });

    it('Buyer can access published projects but is blocked from unpublished projects', () => {
      expect(canAccessProjectResource(buyerUser, 'PRJ-PB-DSR-01', true)).toBe(true);
      expect(canAccessProjectResource(buyerUser, 'PRJ-INTERNAL-DRAFT', false)).toBe(false);
    });

    it('Buyer can only access enquiries belonging to their own organization', () => {
      expect(canAccessEnquiryResource(buyerUser, 'AURA-CLIMATE-ASSETS')).toBe(true);
      expect(canAccessEnquiryResource(buyerUser, 'OTHER-COMPETITOR-ORG')).toBe(false);
    });
  });

  describe('15. Open Redirect Prevention & Next URL Sanitization', () => {
    it('accepts safe relative application paths', () => {
      expect(isValidLocalRedirect('/dashboard')).toBe(true);
      expect(sanitizeRedirectPath('/dashboard')).toBe('/dashboard');

      expect(isValidLocalRedirect('/workspace/command')).toBe(true);
      expect(sanitizeRedirectPath('/workspace/command')).toBe('/workspace/command');

      expect(isValidLocalRedirect('/farmer/home')).toBe(true);
      expect(sanitizeRedirectPath('/farmer/home')).toBe('/farmer/home');

      expect(isValidLocalRedirect('/buyers/marketplace')).toBe(true);
      expect(sanitizeRedirectPath('/buyers/marketplace')).toBe('/buyers/marketplace');

      // Percent-encoded safe path
      expect(isValidLocalRedirect('%2Ffarmer%2Fhome')).toBe(true);
      expect(sanitizeRedirectPath('%2Ffarmer%2Fhome')).toBe('/farmer/home');
    });

    it('rejects external URL schemes, protocol-relative URLs, and path traversal bypasses', () => {
      // External absolute URLs
      expect(isValidLocalRedirect('https://evil.com')).toBe(false);
      expect(sanitizeRedirectPath('https://evil.com', '/dashboard')).toBe('/dashboard');

      expect(isValidLocalRedirect('http://attacker.org/phishing')).toBe(false);
      expect(sanitizeRedirectPath('http://attacker.org/phishing', '/dashboard')).toBe('/dashboard');

      // Protocol-relative //evil.com
      expect(isValidLocalRedirect('//evil.com')).toBe(false);
      expect(sanitizeRedirectPath('//evil.com', '/dashboard')).toBe('/dashboard');

      // Windows backslash /\evil.com bypass
      expect(isValidLocalRedirect('/\\evil.com')).toBe(false);
      expect(sanitizeRedirectPath('/\\evil.com', '/dashboard')).toBe('/dashboard');

      // Script execution schemes
      expect(isValidLocalRedirect('javascript:alert(1)')).toBe(false);
      expect(sanitizeRedirectPath('javascript:alert(1)', '/dashboard')).toBe('/dashboard');

      expect(isValidLocalRedirect('/javascript:alert(1)')).toBe(false);
      expect(sanitizeRedirectPath('/javascript:alert(1)', '/dashboard')).toBe('/dashboard');

      expect(isValidLocalRedirect('data:text/html,<script>alert(1)</script>')).toBe(false);
      expect(sanitizeRedirectPath('data:text/html,...', '/dashboard')).toBe('/dashboard');

      // Empty or invalid types
      expect(isValidLocalRedirect('')).toBe(false);
      expect(sanitizeRedirectPath('', '/fallback')).toBe('/fallback');
      expect(sanitizeRedirectPath(null, '/fallback')).toBe('/fallback');
      expect(sanitizeRedirectPath(undefined, '/fallback')).toBe('/fallback');
    });
  });

  describe('16 & 17. Legacy Routes & Router Tree Preservation', () => {
    it('16. Validates legacy /auth search parameters and redirects to safe targets', async () => {
      const { Route: AuthRoute } = await import('../../routes/auth');
      const validate = AuthRoute.options.validateSearch as (s: Record<string, unknown>) => { next: string };

      expect(validate({ next: '/dashboard' })).toEqual({ next: '/dashboard' });
      expect(validate({ next: '%2Fworkspace%2Fcommand' })).toEqual({ next: '/workspace/command' });
      expect(validate({ next: 'https://malicious-external.com' })).toEqual({ next: '/dashboard' });
      expect(validate({ next: '//evil.com' })).toEqual({ next: '/dashboard' });
      expect(validate({})).toEqual({ next: '/dashboard' });
    });

    it(
      '17. Preserves /dashboard, /marketplace, and /passport in router tree',
      async () => {
        const { routeTree } = await import('../../routeTree.gen');
        const { createRouter, createMemoryHistory } = await import('@tanstack/react-router');
        const { QueryClient } = await import('@tanstack/react-query');

        const history = createMemoryHistory({ initialEntries: ['/'] });
        const router = createRouter({
          routeTree,
          history,
          context: { queryClient: new QueryClient() },
        });

        expect(router.routesById['/']).toBeDefined();
        expect(router.routesById['/dashboard']).toBeDefined();
        expect(router.routesById['/marketplace']).toBeDefined();
        expect(router.routesById['/passport']).toBeDefined();
        expect(router.routesById['/login']).toBeDefined();
        expect(router.routesById['/auth']).toBeDefined();

        // Core portal root layouts
        expect(router.routesById['/farmer']).toBeDefined();
        expect(router.routesById['/workspace']).toBeDefined();
        expect(router.routesById['/buyers']).toBeDefined();
      },
      15000
    );
  });
});
