import { createContext, useContext } from 'react';
import type { User } from '@supabase/supabase-js';
import { useAuth, AuthProvider, AuthContext } from './auth/auth-context';
import type { AuthUser } from './auth/types';

/**
 * Legacy AccountContext maintained for backwards compatibility with public site-shell.
 * Maps to the canonical useAuth() session user.
 */
export const AccountContext = createContext<User | null>(null);

export function useAccount(): AuthUser | User | null {
  try {
    const auth = useAuth();
    if (auth?.user) {
      return auth.user;
    }
  } catch {
    // If rendered outside AuthProvider, fall back to legacy context
  }
  return useContext(AccountContext);
}

// Re-export canonical authentication system
export * from './auth/types';
export * from './auth/permissions';
export * from './auth/auth-context';


export function useHasPermission(permission: any): boolean {
  try {
    const auth = useAuth();
    if (auth?.hasPermission) return auth.hasPermission(permission);
    return false;
  } catch {
    return false;
  }
}

export function useCanAccessPortal(portal: any): boolean {
  try {
    const auth = useAuth();
    if (auth?.canAccessPortal) return auth.canAccessPortal(portal);
    return false;
  } catch {
    return false;
  }
}