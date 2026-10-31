import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";

export const AccountContext = createContext<User | null>(null);

export function useAccount() {
  return useContext(AccountContext);
}

// Re-export new role-aware auth context for universal access
export { useAuth, AuthProvider, DEMO_ACCOUNTS } from "./auth/auth-context";
export * from "./auth/permissions";
