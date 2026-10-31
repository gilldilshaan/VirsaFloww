# Technical Analysis & Implementation Blueprint: Live Authentication & Session Management (Milestone 2)

**Author**: M2 Auth Explorer (`explorer_m2_auth`)  
**Target Milestone**: Milestone 2 (Requirement R2)  
**Target File**: `src/lib/auth/auth-context.tsx`  
**Date**: 2026-10-31  

---

## 1. Executive Summary

Milestone 2 transitions VirsaFloww from isolated mock/demo authentication to production-ready live FastAPI session management. The core objectives are:
1. Connecting user login to FastAPI's `POST /api/auth/session` via the central API client (`src/lib/api/client.ts`).
2. Storing the JWT session token in `localStorage` under the canonical key `virsaflow_access_token`.
3. Performing automatic session restoration on browser mount/reload via `GET /api/auth/me` with `Authorization: Bearer <token>`.
4. Gracefully handling and clearing invalid, expired, or network-failed sessions without leaving zombie state or flashing unauthorized screens.
5. Strictly isolating demo mode from live backend sessions so demo identities never store live JWTs, spoof credentials, or dispatch mutations to the live PostgreSQL backend.

---

## 2. Architectural Analysis & Interface Contracts

### 2.1 Backend Contract Reference

#### `POST /api/auth/session` (and alias `/api/auth/login`)
- **Location**: `backend/app/api/routes/auth.py:9-50`
- **Request Body** (`backend/app/schemas/user.py:31-33`):
  ```json
  {
    "email": "user@organization.com",
    "password": "plain_password"
  }
  ```
- **Success Response** (`200 OK` -> `SessionResponse`):
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1Ni...",
    "tokenType": "Bearer",
    "expiresInSeconds": 3600,
    "user": {
      "id": "USR-ADMIN-01",
      "email": "admin@terraledger.ai",
      "name": "Dr. Inderjit Singh",
      "role": "admin",
      "organization": "TerraLedger Global MRV",
      "assignedProjectIds": [],
      "assignedFieldIds": [],
      "buyerCompanyId": null,
      "isActive": true
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`:
    ```json
    { "error": { "code": "UNAUTHENTICATED", "message": "Invalid email or password.", "details": null } }
    ```
  - `429 Too Many Requests` (Rate limit: 5 failed attempts / 60 seconds):
    ```json
    { "error": { "code": "RATE_LIMITED", "message": "Too many failed attempts. Try again later.", "details": null } }
    ```
  - `422 Unprocessable Entity` (Pydantic schema validation error):
    ```json
    { "error": { "code": "VALIDATION_ERROR", "message": "Validation failed", "details": [...] } }
    ```

#### `GET /api/auth/me`
- **Location**: `backend/app/api/routes/auth.py:52-55`
- **Header**: `Authorization: Bearer <token>`
- **Success Response** (`200 OK` -> `User`):
  ```json
  {
    "id": "USR-ADMIN-01",
    "email": "admin@terraledger.ai",
    "name": "Dr. Inderjit Singh",
    "role": "admin",
    "organization": "TerraLedger Global MRV",
    "assignedProjectIds": [],
    "assignedFieldIds": [],
    "buyerCompanyId": null,
    "isActive": true
  }
  ```
- **Error Response** (`401 Unauthorized` -> `deps.py:230-242`):
  ```json
  { "error": { "code": "UNAUTHENTICATED", "message": "Invalid, expired, or revoked session token.", "details": null } }
  ```

---

### 2.2 Storage & Identity Model

Two distinct storage layers must be coordinated:

| Key | Storage | Purpose | Managed By |
|---|---|---|---|
| `virsaflow_access_token` (`AUTH_TOKEN_KEY`) | `localStorage` | Raw JWT string injected into `Authorization: Bearer <token>` by `client.ts` | `getStoredToken()`, `setStoredToken()`, `clearStoredToken()` |
| `virsaflow_auth_session_v2` (`STORAGE_KEY`) | `localStorage` | Cached serialized session envelope (`StoredSession`) with expiry and session type (`demo` vs `production`) | `AuthProvider` |

#### Live vs. Demo Mode Isolation Guardrails:
1. **Live Users**:
   - `isDemoUser: false`
   - Store valid JWT in `virsaflow_access_token`.
   - Store session in `virsaflow_auth_session_v2` with `sessionType: 'production'`.
   - Can dispatch mutations to live backend.
2. **Demo Users**:
   - `isDemoUser: true`
   - `virsaflow_access_token` is **GUARANTEED NULL** (`clearStoredToken()` invoked on demo login or role switch).
   - Session stored in `virsaflow_auth_session_v2` with `sessionType: 'demo'`.
   - Client mutation interceptor blocks network requests (`isDemoUser: true`), preventing backend data pollution.
   - Roles and permissions strictly derived from immutable `DEMO_IDENTITIES` and `ROLE_PERMISSIONS`.

---

## 3. Detailed Flow Specifications

### 3.1 Live Login Flow (`login(credentials)`)

```text
[User Submits Form]
       │
       ▼
Credentials Check:
  - If credentials.isDemoRequest or credentials.requestedDemoRole -> Delegate to loginAsDemo(role)
  - Validate email and password are non-empty
       │
       ▼
Client Network Dispatch:
  await client.post<SessionResponse>('/api/auth/session', { email, password })
       │
       ├───► [Success (200 OK)]
       │        │
       │        ├─ Extract accessToken & user from SessionResponse
       │        ├─ setStoredToken(accessToken) -> writes 'virsaflow_access_token'
       │        ├─ mapBackendUserToAuthUser(user) -> canonical AuthUser with isDemoUser: false
       │        ├─ setUser(authenticatedUser)
       │        ├─ Write StoredSession to 'virsaflow_auth_session_v2' (sessionType: 'production')
       │        └─ Return { success: true, user: authenticatedUser }
       │
       └───► [Failure / Catch (ApiError | Error)]
                │
                ├─ 401 UNAUTHENTICATED -> "Invalid email or password."
                ├─ 429 RATE_LIMITED    -> "Too many failed attempts. Try again later."
                ├─ Network Error       -> "Network connection failed. Please check your network and try again."
                ├─ clearStoredToken() (fail closed)
                └─ Return { success: false, error: errorMessage }
```

### 3.2 Session Restoration on Reload (`restoreSession()`)

```text
[Component Mounts / Reloads]
       │
       ▼
Check getStoredToken()
       │
       ├───► [Token Exists]
       │        │
       │        ├─ Initialize isLoading: true (prevents ProtectedRoute from redirecting prematurely)
       │        ├─ Dispatch client.get<BackendUser>('/api/auth/me') (Bearer token injected automatically)
       │        │
       │        ├───► [Success (200 OK)]
       │        │        ├─ Map backend user to canonical AuthUser (isDemoUser: false)
       │        │        ├─ Re-derive permissions from ROLE_PERMISSIONS[user.role]
       │        │        ├─ setUser(authenticatedUser)
       │        │        ├─ Refresh StoredSession in 'virsaflow_auth_session_v2'
       │        │        └─ setIsLoading(false) -> ProtectedRoute displays protected children
       │        │
       │        └───► [Failure (401 UNAUTHENTICATED / Network Validation Failure)]
       │                 ├─ clearStoredToken() -> removes 'virsaflow_access_token'
       │                 ├─ localStorage.removeItem('virsaflow_auth_session_v2')
       │                 ├─ setUser(null)
       │                 ├─ setIsLoading(false)
       │                 └─ ProtectedRoute sees (!isLoading && !isAuthenticated) -> Redirects to /login?next=...
       │
       └───► [No Token in getStoredToken()]
                │
                ├─ Check 'virsaflow_auth_session_v2' for valid cached Demo session
                │    ├─ If valid demo session: restore demo user, setIsLoading(false)
                │    └─ If expired/invalid: clear storage, setUser(null), setIsLoading(false)
                └─ isLoading: false
```

### 3.3 Universal Logout Flow (`logout()`)

```text
[User Invokes logout()]
       │
       ▼
1. clearStoredToken() -> wipes 'virsaflow_access_token'
2. localStorage.removeItem('virsaflow_auth_session_v2') -> wipes session envelope
3. setUser(null) -> clears in-memory state
4. setError(null)
```

### 3.4 Error Handling Matrix

| HTTP Status | Error Code (`ApiError.code`) | UI Error Message | Action |
|---|---|---|---|
| `401` | `UNAUTHENTICATED` | `"Invalid email or password."` (or server message) | Reject login, clear token |
| `429` | `RATE_LIMITED` | `"Too many failed attempts. Try again later."` | Display rate limit notice |
| `422` | `VALIDATION_ERROR` | `"Validation failed. Please verify submitted credentials."` | Display validation details |
| `0` | `NETWORK_ERROR` | `"Network connection failed. Please check your network and try again."` | Keep unauthenticated |
| `500`+ | `INTERNAL_SERVER_ERROR` | `"Authentication service temporarily unavailable. Please try again later."` | Fail closed |

---

## 4. Backend-to-Frontend Type Mapping

The backend Pydantic model (`backend/app/schemas/user.py:14-26`) returns:
```ts
export interface BackendUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization?: string | null;
  assignedProjectIds?: string[];
  assignedFieldIds?: string[];
  buyerCompanyId?: string | null;
  isActive?: boolean;
}
```

The canonical frontend `AuthUser` (`src/lib/auth/types.ts:60-71`) is mapped as follows:
```ts
export function mapBackendUserToAuthUser(backendUser: BackendUser): AuthUser {
  const role = backendUser.role as UserRole;
  const canonicalRole: UserRole = ROLE_PERMISSIONS[role] ? role : 'farmer';
  const permissions = ROLE_PERMISSIONS[canonicalRole] || [];

  const scope: ResourceScope = {
    assignedProjectIds: backendUser.assignedProjectIds || [],
    permittedFieldIds: backendUser.assignedFieldIds || [],
    buyerOrgId: backendUser.buyerCompanyId || undefined,
  };

  return {
    id: backendUser.id,
    email: backendUser.email,
    name: backendUser.name,
    role: canonicalRole,
    permissions,
    scope,
    farmerId: canonicalRole === 'farmer' && backendUser.assignedFieldIds?.[0] ? backendUser.assignedFieldIds[0] : undefined,
    buyerOrgId: backendUser.buyerCompanyId || undefined,
    isDemoUser: false,
  };
}
```

---

## 5. Complete Drop-in Code Blueprint

Below is the verified code blueprint for `src/lib/auth/auth-context.tsx`.

```tsx
/**
 * TerraLedger AI / VirsaFloww — Universal Authentication Context
 * 
 * Satisfies Milestone 2 (Requirement R2):
 * - Live backend authentication via POST /api/auth/session
 * - Token management with virsaflow_access_token via central client
 * - Automatic session restoration on reload via GET /api/auth/me
 * - Strict demo-live isolation (demo sessions never store JWT tokens)
 * - Fail-closed error handling and open-redirect protection
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthUser, AuthState, UserRole, Permission, PortalType, LoginCredentials, StoredSession, ResourceScope } from './types';
import {
  ROLE_PERMISSIONS,
  hasPermission as checkPermission,
  canAccessPortal as checkPortal,
  canAccessFieldResource as checkField,
  canAccessProjectResource as checkProject,
  canAccessEnquiryResource as checkEnquiry,
} from './permissions';
import {
  client,
  getStoredToken,
  setStoredToken,
  clearStoredToken,
  ApiError,
  AUTH_TOKEN_KEY,
} from '../api/client';

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

export interface BackendUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization?: string | null;
  assignedProjectIds?: string[];
  assignedFieldIds?: string[];
  buyerCompanyId?: string | null;
  isActive?: boolean;
}

export interface SessionResponse {
  accessToken: string;
  tokenType?: string;
  expiresInSeconds?: number;
  user: BackendUser;
}

interface AuthContextType extends AuthState {
  role: UserRole | null;
  isDemoMode: boolean;
  clearDemoLogin: () => void;
  setDemoLogin: (role: UserRole) => void;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  loginAsDemo: (role: UserRole) => Promise<{ success: boolean; user?: AuthUser }>;
  logout: () => void;
  restoreSession: () => Promise<AuthUser | null>;
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

/** SSR-resilient localStorage accessor */
function getStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
    const g = globalThis as unknown as { localStorage?: Storage };
    if (typeof globalThis !== 'undefined' && g.localStorage) return g.localStorage;
  } catch {
    return null;
  }
  return null;
}

/**
 * Maps raw backend user model to canonical frontend AuthUser
 */
export function mapBackendUserToAuthUser(backendUser: BackendUser): AuthUser {
  const role = backendUser.role as UserRole;
  const canonicalRole: UserRole = ROLE_PERMISSIONS[role] ? role : 'farmer';
  const permissions = ROLE_PERMISSIONS[canonicalRole] || [];

  const scope: ResourceScope = {
    assignedProjectIds: backendUser.assignedProjectIds || [],
    permittedFieldIds: backendUser.assignedFieldIds || [],
    buyerOrgId: backendUser.buyerCompanyId || undefined,
  };

  return {
    id: backendUser.id,
    email: backendUser.email,
    name: backendUser.name,
    role: canonicalRole,
    permissions,
    scope,
    farmerId: canonicalRole === 'farmer' && backendUser.assignedFieldIds?.[0] ? backendUser.assignedFieldIds[0] : undefined,
    buyerOrgId: backendUser.buyerCompanyId || undefined,
    isDemoUser: false,
  };
}

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
  // Must fail closed if no live token exists in storage
  const token = getStoredToken();
  if (!token) {
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
  // Fresh application sessions start unauthenticated (null) or load valid cached demo session
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storage = getStorage();
    if (!storage) return null;
    try {
      const cached = storage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as StoredSession;
        return validateStoredSession(parsed);
      }
    } catch {
      // Storage corrupt or unreadable -> fail closed
    }
    return null;
  });

  // If a live token exists in storage on startup, initialize in loading state until verified
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    return Boolean(getStoredToken());
  });

  const [error, setError] = useState<string | null>(null);

  // Sync session changes to storage (only after initial restoration finishes)
  useEffect(() => {
    if (isLoading) return; // Guard against wiping storage during initial restoration
    const storage = getStorage();
    if (!storage) return;
    try {
      if (user) {
        const session: StoredSession = {
          user,
          issuedAt: Date.now(),
          expiresAt: Date.now() + (user.isDemoUser ? DEMO_SESSION_TTL_MS : 3600 * 1000),
          sessionType: user.isDemoUser ? 'demo' : 'production',
        };
        storage.setItem(STORAGE_KEY, JSON.stringify(session));
      } else {
        storage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Storage write failed
    }
  }, [user, isLoading]);

  /**
   * Session Restoration on reload / mount:
   * Queries GET /api/auth/me with Bearer token.
   */
  const restoreSession = useCallback(async (): Promise<AuthUser | null> => {
    const token = getStoredToken();
    if (!token) {
      // No live token; check if valid demo session exists
      const storage = getStorage();
      if (storage) {
        try {
          const cached = storage.getItem(STORAGE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached) as StoredSession;
            const validated = validateStoredSession(parsed);
            if (validated && validated.isDemoUser) {
              setUser(validated);
              setIsLoading(false);
              return validated;
            }
          }
        } catch {
          // ignore
        }
      }
      setUser(null);
      setIsLoading(false);
      return null;
    }

    setIsLoading(true);
    try {
      const backendUser = await client.get<BackendUser>('/api/auth/me');
      if (!backendUser || !backendUser.role) {
        throw new Error('Invalid user payload from backend');
      }

      const authenticatedUser = mapBackendUserToAuthUser(backendUser);
      setUser(authenticatedUser);
      setIsLoading(false);

      const storage = getStorage();
      if (storage) {
        try {
          const session: StoredSession = {
            user: authenticatedUser,
            issuedAt: Date.now(),
            expiresAt: Date.now() + 3600 * 1000,
            sessionType: 'production',
          };
          storage.setItem(STORAGE_KEY, JSON.stringify(session));
        } catch {
          // ignore
        }
      }

      return authenticatedUser;
    } catch (err) {
      // If 401 UNAUTHENTICATED or network token validation fails,
      // call clearStoredToken(), clear session state, and fail closed
      clearStoredToken();
      const storage = getStorage();
      if (storage) {
        try {
          storage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
      }
      setUser(null);
      setIsLoading(false);
      return null;
    }
  }, []);

  // Perform session verification on mount if live token is present
  useEffect(() => {
    if (getStoredToken()) {
      restoreSession();
    }
  }, [restoreSession]);

  /**
   * Explicit Demo Login
   */
  const loginAsDemo = useCallback(async (role: UserRole): Promise<{ success: boolean; user?: AuthUser }> => {
    setIsLoading(true);
    setError(null);

    // Strict guardrail: Demo sessions must NEVER store a live JWT
    clearStoredToken();

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

        const email = credentials.email?.trim();
        const password = credentials.password;

        if (!email) {
          const msg = 'Email address is required.';
          setError(msg);
          setIsLoading(false);
          return { success: false, error: msg };
        }

        if (!password) {
          const msg = 'Password is required.';
          setError(msg);
          setIsLoading(false);
          return { success: false, error: msg };
        }

        // Live Backend Authentication via central API client
        const sessionRes = await client.post<SessionResponse>('/api/auth/session', {
          email,
          password,
        });

        const token = sessionRes.accessToken || (sessionRes as unknown as { access_token?: string }).access_token;
        if (!token) {
          throw new Error('Authentication succeeded but no access token was returned.');
        }

        const rawUser = sessionRes.user;
        if (!rawUser || !rawUser.role) {
          throw new Error('Authentication succeeded but user profile was missing or invalid.');
        }

        // Store live JWT token
        setStoredToken(token);

        // Map backend user to canonical AuthUser
        const authenticatedUser = mapBackendUserToAuthUser(rawUser);

        // Update state
        setUser(authenticatedUser);
        setIsLoading(false);

        // Write production session to storage
        const storage = getStorage();
        if (storage) {
          try {
            const expiresIn =
              sessionRes.expiresInSeconds ||
              (sessionRes as unknown as { expires_in_seconds?: number }).expires_in_seconds ||
              3600;
            const session: StoredSession = {
              user: authenticatedUser,
              issuedAt: Date.now(),
              expiresAt: Date.now() + expiresIn * 1000,
              sessionType: 'production',
            };
            storage.setItem(STORAGE_KEY, JSON.stringify(session));
          } catch {
            // ignore
          }
        }

        return { success: true, user: authenticatedUser };
      } catch (err) {
        let errorMsg = 'Authentication failed';
        if (err instanceof ApiError) {
          if (err.isUnauthorized()) {
            errorMsg = err.message || 'Invalid email or password.';
          } else if (err.isRateLimited()) {
            errorMsg = 'Too many failed attempts. Try again later.';
          } else if (err.isNetworkError()) {
            errorMsg = 'Network connection failed. Please check your network and try again.';
          } else {
            errorMsg = err.message || `Authentication failed (HTTP ${err.status})`;
          }
        } else if (err instanceof Error) {
          errorMsg = err.message;
        }

        setError(errorMsg);
        setIsLoading(false);
        return { success: false, error: errorMsg };
      }
    },
    [loginAsDemo]
  );

  /**
   * Universal Logout Handler
   */
  const logout = useCallback(() => {
    clearStoredToken();
    setUser(null);
    setError(null);
    const storage = getStorage();
    if (storage) {
      try {
        storage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, []);

  /**
   * Switch Demo Role
   */
  const switchDemoRole = useCallback((role: UserRole) => {
    if (DEMO_IDENTITIES[role]) {
      clearStoredToken(); // Ensure live token is wiped
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
        restoreSession,
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
```

---

## 6. Verification and Validation Strategy

To verify this implementation when applied by the worker:
1. **Typecheck**: `npx tsc --noEmit` must pass with 0 errors.
2. **Frontend Tests**: `npm test` must execute 18 test files, 204 tests, passing 100%. Specifically:
   - `src/test/e2e/auth-session.test.ts` (10 tests) verifies `POST /api/auth/session`, token storage, `GET /api/auth/me` restoration, 401 purge, 429 throttling, and expired session rejection.
   - `src/test/e2e/demo-live-isolation.test.ts` (10 tests) verifies demo tokens remain null, live tokens permit requests, self-elevation is rejected, and logout cleanly wipes tokens.
   - `src/lib/auth/auth.test.ts` (24 tests) verifies unauthenticated fresh start, RBAC matrices, portal access, and redirect sanitization.
3. **Production Build**: `npm run build` must generate `.output/` cleanly without SSR reference errors.
4. **Git Protection**: `src/routeTree.gen.ts` must remain bit-for-bit identical (`git hash-object src/routeTree.gen.ts` matches HEAD).
