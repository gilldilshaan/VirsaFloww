import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { type UserRole, USER_ROLES } from "@/lib/auth/roles";
import { canAccessPortal, hasPermission, type Permission } from "@/lib/auth/roles";

// ─── Backward-compatible account context (unchanged API) ───────────────────
export const AccountContext = createContext<User | null>(null);

export function useAccount() {
  return useContext(AccountContext);
}

// ─── Role-aware auth context ───────────────────────────────────────────────
/**
 * SECURITY NOTICE:
 * - In production, `role` MUST come from authenticated session claims
 *   (e.g. Supabase JWT custom claims or a server-side user profile lookup).
 * - The frontend NEVER assigns production roles.
 * - The `isDemoMode` flag indicates that authentication is simulated.
 * - All API endpoints MUST independently verify authorization regardless
 *   of what the frontend believes the user's role to be.
 */
export interface AuthState {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  /** Demo-only: set a simulated role. Not used in production. */
  setDemoLogin: (role: UserRole) => void;
  /** Demo-only: clear the simulated session. */
  clearDemoLogin: () => void;
}

const AuthStateContext = createContext<AuthState>({
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
  isDemoMode: false,
  setDemoLogin: () => {},
  clearDemoLogin: () => {},
});

const DEMO_ROLE_KEY = 'terraledger_demo_role';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [demoRole, setDemoRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Client-only: read demo role from localStorage after hydration
  useEffect(() => {
    try {
      const stored = localStorage.getItem(DEMO_ROLE_KEY);
      if (stored && (USER_ROLES as readonly string[]).includes(stored)) {
        setDemoRole(stored as UserRole);
      }
    } catch {
      // localStorage unavailable (SSR or restricted)
    }
    setIsLoading(false);
  }, []);

  // In production, user/role would come from Supabase auth state.
  // For now, user is null and role comes from demo mechanism.
  const user: User | null = null;
  const role = demoRole;

  const setDemoLogin = (newRole: UserRole) => {
    try {
      localStorage.setItem(DEMO_ROLE_KEY, newRole);
    } catch {
      // localStorage unavailable
    }
    setDemoRole(newRole);
  };

  const clearDemoLogin = () => {
    try {
      localStorage.removeItem(DEMO_ROLE_KEY);
    } catch {
      // localStorage unavailable
    }
    setDemoRole(null);
  };

  const state: AuthState = {
    user,
    role,
    isAuthenticated: role !== null,
    isLoading,
    isDemoMode: role !== null && user === null,
    setDemoLogin,
    clearDemoLogin,
  };

  return (
    <AuthStateContext.Provider value={state}>
      <AccountContext.Provider value={user}>
        {children}
      </AccountContext.Provider>
    </AuthStateContext.Provider>
  );
}

/** Get the full auth state including role */
export function useAuth(): AuthState {
  return useContext(AuthStateContext);
}

/** Check if the current user has a specific permission */
export function useHasPermission(permission: Permission): boolean {
  const { role } = useAuth();
  if (!role) return false;
  return hasPermission(role, permission);
}

/** Check if the current user can access a specific portal */
export function useCanAccessPortal(portal: string): boolean {
  const { role } = useAuth();
  if (!role) return false;
  return canAccessPortal(role, portal);
}
