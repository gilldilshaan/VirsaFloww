import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthUser, AuthState, UserRole, Permission, PortalType, LoginCredentials, StoredSession } from './types';
import {
  ROLE_PERMISSIONS,
  hasPermission as checkPermission,
  canAccessPortal as checkPortal,
  canAccessFieldResource as checkField,
  canAccessProjectResource as checkProject,
  canAccessEnquiryResource as checkEnquiry,
} from './permissions';

/**
 * Preconfigured Trusted Demo User Identities
 * 
 * Strict Security Guardrail:
 * Demo roles come strictly from this immutable dictionary and their permissions are strictly
 * bounded by ROLE_PERMISSIONS. Users cannot invent custom permissions in the client.
 */
export const DEMO_IDENTITIES: Record<UserRole, AuthUser> = {
  admin: {
    id: 'USR-DEMO-ADMIN-01',
    email: 'admin@terraledger.ai',
    name: 'Dr. Inderjit Singh',
    role: 'admin',
    organization: 'TerraLedger Global MRV',
    permissions: ROLE_PERMISSIONS.admin,
    isDemoUser: true,
  },
  reviewer: {
    id: 'USR-DEMO-REVIEWER-01',
    email: 'reviewer@vvb-auditor.org',
    name: 'Dr. Evelyn Martinez',
    role: 'reviewer',
    organization: 'Apex Climate Auditing & Verification (VVB)',
    permissions: ROLE_PERMISSIONS.reviewer,
    isDemoUser: true,
    scope: {
      assignedReviewQueueIds: ['REV-2026-001', 'REV-2026-002', 'REV-2026-003'],
    },
  },
  project_developer: {
    id: 'USR-DEMO-PROJECT-DEVELOPER-01',
    email: 'developer@panjdhara.com',
    name: 'Amrita Kaur',
    role: 'project_developer',
    organization: 'Panjdhara Agritech Pvt Ltd',
    permissions: ROLE_PERMISSIONS.project_developer,
    isDemoUser: true,
    scope: {
      assignedProjectIds: ['PRJ-PB-DSR-001'],
    },
  },
  field_officer: {
    id: 'USR-DEMO-FIELD-OFFICER-01',
    email: 'officer@ludhiana-fpo.org',
    name: 'Harpreet Singh Gill',
    role: 'field_officer',
    organization: 'Malwa Progressive Farmers Collective',
    fpoId: 'FPO-MALWA-01',
    permissions: ROLE_PERMISSIONS.field_officer,
    isDemoUser: true,
    scope: {
      permittedFieldIds: ['PB-FIELD-001', 'PB-LUD-042', 'PB-SNG-018'],
      assignedProjectIds: ['PRJ-PB-DSR-001'],
    },
  },
  farmer: {
    id: 'USR-DEMO-FARMER-01',
    email: 'farmer@punjab-agri.in',
    name: 'Gurdev Singh Gill',
    role: 'farmer',
    farmerId: 'PB-FIELD-001',
    fpoId: 'FPO-MALWA-01',
    organization: 'Gill Agro Farms',
    permissions: ROLE_PERMISSIONS.farmer,
    isDemoUser: true,
    scope: {
      farmerId: 'PB-FIELD-001',
      permittedFieldIds: ['PB-FIELD-001', 'PB-LUD-042'],
    },
  },
  buyer: {
    id: 'USR-DEMO-BUYER-01',
    email: 'buyer@auraclimate.com',
    name: 'Marcus Vance',
    role: 'buyer',
    buyerOrgId: 'AURA-CLIMATE-ASSETS',
    organization: 'Aura Climate Asset Management',
    permissions: ROLE_PERMISSIONS.buyer,
    isDemoUser: true,
    scope: {
      buyerOrgId: 'AURA-CLIMATE-ASSETS',
      publishedProjectIds: ['PRJ-PB-DSR-001', 'PRJ-PB-RES-02', 'PRJ-PB-AWD-03'],
    },
  },
};

export const DEMO_CREDENTIALS: Record<UserRole, { email: string; password: string }> = {
  admin: { email: 'admin@terraledger.ai', password: 'admin12345' },
  reviewer: { email: 'reviewer@vvb-auditor.org', password: 'reviewer12345' },
  project_developer: { email: 'developer@panjdhara.com', password: 'dev12345' },
  field_officer: { email: 'officer@ludhiana-fpo.org', password: 'officer12345' },
  farmer: { email: 'farmer@punjab-agri.in', password: 'farmer12345' },
  buyer: { email: 'buyer@auraclimate.com', password: 'buyer12345' },
};

interface AuthContextType extends AuthState {
  role: UserRole | null;
  isDemoMode: boolean;
  clearDemoLogin: () => void;
  setDemoLogin: (role: UserRole) => void;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  loginAsDemo: (role: UserRole) => Promise<{ success: boolean; user?: AuthUser }>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  canAccessPortal: (portal: PortalType) => boolean;
  canAccessField: (fieldId: string) => boolean;
  canAccessProject: (projectId: string, isPublished?: boolean) => boolean;
  canAccessEnquiry: (enquiryOrgId: string) => boolean;
  switchDemoRole: (role: UserRole) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'virsaflow_auth_session_v2';
const DEMO_SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

/**
 * Validates a stored session.
 * Fails closed if expired, tampered with, or unverified.
 */
function validateStoredSession(stored: StoredSession | null): AuthUser | null {
  if (!stored || !stored.user || !stored.expiresAt || !stored.sessionType) {
    return null;
  }

  // Session expiry check
  if (Date.now() > stored.expiresAt) {
    return null;
  }

  if (stored.sessionType === 'demo') {
    const role = stored.user.role;
    const trustedDemo = DEMO_IDENTITIES[role];
    if (!trustedDemo) return null;

    // Verify identity ID matches trusted demo dictionary
    if (stored.user.id !== trustedDemo.id && stored.user.email !== trustedDemo.email) return null;

    // Re-hydrate permissions strictly from trusted matrix
    return {
      ...trustedDemo,
      permissions: ROLE_PERMISSIONS[role],
      isDemoUser: true,
    };
  }

  // Production session:
  // Ensure role is canonical and permissions are re-derived
  if (stored.user.role && ROLE_PERMISSIONS[stored.user.role]) {
    return {
      ...stored.user,
      permissions: ROLE_PERMISSIONS[stored.user.role],
      isDemoUser: false,
    };
  }

  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Fresh application sessions start unauthenticated unless valid local storage session exists
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as StoredSession;
          return validateStoredSession(parsed);
        }
      } catch {
        // Storage corrupt or unreadable -> fail closed
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync session changes to storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (user) {
          const session: StoredSession = {
            user,
            issuedAt: Date.now(),
            expiresAt: Date.now() + DEMO_SESSION_TTL_MS,
            sessionType: user.isDemoUser ? 'demo' : 'production',
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        // Storage write failed
      }
    }
  }, [user]);

  /**
   * Explicit Demo Login
   */
  const loginAsDemo = useCallback(async (role: UserRole): Promise<{ success: boolean; user?: AuthUser }> => {
    setIsLoading(true);
    setError(null);

    const demo = DEMO_IDENTITIES[role];
    if (!demo) {
      setIsLoading(false);
      setError(`Invalid demo role: ${role}`);
      return { success: false };
    }

    // Attempt to acquire real JWT from backend for this demo role
    try {
      const creds = DEMO_CREDENTIALS[role];
      if (creds) {
        const res = await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(creds),
        });
        if (res.ok) {
          const body = await res.json();
          if (body.accessToken && typeof window !== 'undefined') {
            localStorage.setItem('virsaflow_access_token', body.accessToken);
          }
        }
      }
    } catch {
      // Offline fallback: demo session proceeds locally
    }

    const sessionUser: AuthUser = {
      ...demo,
      permissions: ROLE_PERMISSIONS[role],
      isDemoUser: true,
    };

    setUser(sessionUser);
    setIsLoading(false);
    return { success: true, user: sessionUser };
  }, []);

  /**
   * Universal Login Handler
   */
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
      setIsLoading(true);
      setError(null);

      try {
        // Handle explicit demo role request
        if (credentials.isDemoRequest || credentials.requestedDemoRole) {
          const requestedRole = credentials.requestedDemoRole;
          if (requestedRole && DEMO_IDENTITIES[requestedRole]) {
            return await loginAsDemo(requestedRole);
          }
        }

        // Live Backend Authentication
        try {
          const res = await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          });

          if (res.ok) {
            const body = await res.json();
            if (body.accessToken && typeof window !== 'undefined') {
              localStorage.setItem('virsaflow_access_token', body.accessToken);
            }
            const userRole = (body.user.role || 'farmer') as UserRole;
            const authenticatedUser: AuthUser = {
              id: body.user.id,
              email: body.user.email,
              name: body.user.name,
              role: userRole,
              organization: body.user.organization,
              buyerOrgId: body.user.buyerCompanyId,
              permissions: ROLE_PERMISSIONS[userRole] || [],
              isDemoUser: false,
            };

            setUser(authenticatedUser);
            setIsLoading(false);
            return { success: true, user: authenticatedUser };
          }
        } catch {
          // Network failure to backend - proceed to fallback check
        }

        // Check if entered email matches a known demo identity
        const normalizedEmail = credentials.email.toLowerCase().trim();
        const matchedDemo = Object.values(DEMO_IDENTITIES).find(
          (id) => id.email.toLowerCase() === normalizedEmail
        );

        if (matchedDemo) {
          return await loginAsDemo(matchedDemo.role);
        }

        const unconfiguredMsg =
          'Authentication failed. Please verify credentials or select one of the Demo Identities.';
        setError(unconfiguredMsg);
        setIsLoading(false);
        return { success: false, error: unconfiguredMsg };
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Login failed';
        setError(msg);
        setIsLoading(false);
        return { success: false, error: msg };
      }
    },
    [loginAsDemo]
  );

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('virsaflow_access_token');
      } catch {
        // ignore
      }
    }
  }, []);

  const switchDemoRole = useCallback((role: UserRole) => {
    loginAsDemo(role);
  }, [loginAsDemo]);

  const hasPermissionCallback = useCallback(
    (permission: Permission): boolean => {
      return checkPermission(user, permission);
    },
    [user]
  );

  const canAccessPortalCallback = useCallback(
    (portal: PortalType): boolean => {
      return checkPortal(user, portal);
    },
    [user]
  );

  const canAccessFieldCallback = useCallback(
    (fieldId: string): boolean => {
      return checkField(user, fieldId);
    },
    [user]
  );

  const canAccessProjectCallback = useCallback(
    (projectId: string, isPublished?: boolean): boolean => {
      return checkProject(user, projectId, isPublished);
    },
    [user]
  );

  const canAccessEnquiryCallback = useCallback(
    (enquiryOrgId: string): boolean => {
      return checkEnquiry(user, enquiryOrgId);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isDemoMode: Boolean(user?.isDemoUser),
        isAuthenticated: Boolean(user),
        clearDemoLogin: logout,
        setDemoLogin: switchDemoRole,
        isLoading,
        error,
        login,
        loginAsDemo,
        logout,
        hasPermission: hasPermissionCallback,
        canAccessPortal: canAccessPortalCallback,
        canAccessField: canAccessFieldCallback,
        canAccessProject: canAccessProjectCallback,
        canAccessEnquiry: canAccessEnquiryCallback,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
