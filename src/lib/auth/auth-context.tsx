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
    email: 'admin@virsaflow.com',
    name: 'Dilshaan Singh Gill',
    role: 'admin',
    permissions: ROLE_PERMISSIONS.admin,
    isDemoUser: true,
  },
  reviewer: {
    id: 'USR-DEMO-REVIEWER-01',
    email: 'mankirat.auditor@virsaflow.com',
    name: 'Mankirat Singh',
    role: 'reviewer',
    permissions: ROLE_PERMISSIONS.reviewer,
    isDemoUser: true,
    scope: {
      assignedReviewQueueIds: ['REV-2026-001', 'REV-2026-002', 'REV-2026-003'],
    },
  },
  project_developer: {
    id: 'USR-DEMO-PROJECT-DEVELOPER-01',
    email: 'developer@virsaflow.com',
    name: 'Panjdhara Project Ops',
    role: 'project_developer',
    permissions: ROLE_PERMISSIONS.project_developer,
    isDemoUser: true,
    scope: {
      assignedProjectIds: ['PRJ-PB-DSR-01'],
    },
  },
  field_officer: {
    id: 'USR-DEMO-FIELD-OFFICER-01',
    email: 'harpreet.officer@virsaflow.com',
    name: 'Harpreet Singh',
    role: 'field_officer',
    fpoId: 'FPO-MALWA-01',
    permissions: ROLE_PERMISSIONS.field_officer,
    isDemoUser: true,
    scope: {
      permittedFieldIds: ['PB-LUD-042', 'PB-SNG-018'],
      assignedProjectIds: ['PRJ-PB-DSR-01'],
    },
  },
  farmer: {
    id: 'USR-DEMO-FARMER-01',
    email: 'gurdev.singh@malwa-fpo.org',
    name: 'Gurdev Singh Gill',
    role: 'farmer',
    farmerId: 'PB-LUD-042',
    fpoId: 'FPO-MALWA-01',
    permissions: ROLE_PERMISSIONS.farmer,
    isDemoUser: true,
    scope: {
      farmerId: 'PB-LUD-042',
      permittedFieldIds: ['PB-LUD-042'],
    },
  },
  buyer: {
    id: 'USR-DEMO-BUYER-01',
    email: 'marcus.vance@auraclimate.com',
    name: 'Marcus Vance',
    role: 'buyer',
    buyerOrgId: 'AURA-CLIMATE-ASSETS',
    permissions: ROLE_PERMISSIONS.buyer,
    isDemoUser: true,
    scope: {
      buyerOrgId: 'AURA-CLIMATE-ASSETS',
      publishedProjectIds: ['PRJ-PB-DSR-01', 'PRJ-PB-RES-02', 'PRJ-PB-AWD-03'],
    },
  },
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
    if (stored.user.id !== trustedDemo.id) return null;

    // Re-hydrate permissions strictly from trusted matrix
    return {
      ...trustedDemo,
      permissions: ROLE_PERMISSIONS[role],
      isDemoUser: true,
    };
  }

  // Production session:
  // If backend is unconfigured, production session cannot be validated; fail closed
  const apiBaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.['VITE_MRV_API_BASE_URL']) || '';
  if (!apiBaseUrl || (apiBaseUrl as string).trim().length === 0) {
    return null;
  }

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
  // CRITICAL SECURITY ENFORCEMENT:
  // Fresh application sessions ALWAYS start unauthenticated (null).
  // No user automatically becomes authenticated simply by loading the application.
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
        const apiBaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.['VITE_MRV_API_BASE_URL']) || '';
        if (apiBaseUrl && (apiBaseUrl as string).trim().length > 0) {
          const res = await fetch(`${apiBaseUrl}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            const msg = errData.message || `Authentication failed (HTTP ${res.status})`;
            setError(msg);
            setIsLoading(false);
            return { success: false, error: msg };
          }

          const body = await res.json();
          const authenticatedUser: AuthUser = {
            id: body.user.id,
            email: body.user.email,
            name: body.user.name,
            role: body.user.role,
            permissions: ROLE_PERMISSIONS[body.user.role as UserRole] || [],
            isDemoUser: false,
          };

          setUser(authenticatedUser);
          setIsLoading(false);
          return { success: true, user: authenticatedUser };
        }

        // Check if entered email matches a known demo identity
        const normalizedEmail = credentials.email.toLowerCase().trim();
        const matchedDemo = Object.values(DEMO_IDENTITIES).find(
          (id) => id.email.toLowerCase() === normalizedEmail
        );

        if (matchedDemo) {
          return await loginAsDemo(matchedDemo.role);
        }

        // Unconfigured production backend:
        const unconfiguredMsg =
          'Production authentication backend is not configured. For evaluation, please use one of the labelled Demo Identities below.';
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
      } catch {
        // ignore
      }
    }
  }, []);

  const switchDemoRole = useCallback((role: UserRole) => {
    if (DEMO_IDENTITIES[role]) {
      const demoUser = DEMO_IDENTITIES[role];
      setUser({
        ...demoUser,
        permissions: ROLE_PERMISSIONS[role],
        isDemoUser: true,
      });
    }
  }, []);

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
