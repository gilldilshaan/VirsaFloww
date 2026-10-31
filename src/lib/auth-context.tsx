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
