import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";

export const AccountContext = createContext<User | null>(null);

export function useAccount() {
  return useContext(AccountContext);
}
