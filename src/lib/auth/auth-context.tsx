import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { UserSession, WorkspaceRole } from "../types/workspace";
import { ROLE_PERMISSIONS } from "./permissions";

export const DEMO_ACCOUNTS: Record<WorkspaceRole, UserSession> = {
  admin: {
    id: "USR-ADMIN-01",
    name: "Dr. Inderjit Singh",
    email: "inderjit.singh@terraledger.ai",
    role: "admin",
    organization: "TerraLedger Global MRV",
    district: "Ludhiana",
    permissions: ROLE_PERMISSIONS.admin,
  },
  project_developer: {
    id: "USR-DEV-02",
    name: "Amrita Kaur",
    email: "amrita.kaur@panjdhara.com",
    role: "project_developer",
    organization: "Panjdhara Agritech Pvt Ltd",
    district: "Ludhiana & Sangrur",
    permissions: ROLE_PERMISSIONS.project_developer,
  },
  field_officer: {
    id: "USR-FLD-03",
    name: "Harpreet Singh Gill",
    email: "harpreet.gill@malwa-fpo.org",
    role: "field_officer",
    organization: "Malwa Progressive Farmer Collective",
    fpoAffiliation: "Malwa FPO Cluster #4",
    district: "Ludhiana",
    permissions: ROLE_PERMISSIONS.field_officer,
  },
  reviewer: {
    id: "USR-REV-04",
    name: "Dr. Evelyn Martinez",
    email: "e.martinez@sustainability-vvb.org",
    role: "reviewer",
    organization: "Apex Climate Auditing & Verification",
    district: "Global / Remote VVB",
    permissions: ROLE_PERMISSIONS.reviewer,
  },
  buyer: {
    id: "USR-BUY-05",
    name: "Marcus Vance",
    email: "m.vance@auraclimate.com",
    role: "buyer",
    organization: "Aura Climate Asset Management Ltd.",
    permissions: ROLE_PERMISSIONS.buyer,
  },
  farmer: {
    id: "USR-FAR-06",
    name: "Gurdev Singh Gill",
    email: "gurdev.gill@farmer.punjab",
    role: "farmer",
    organization: "Gill Agro Farms",
    district: "Ludhiana",
    village: "Gill Kalan",
    permissions: ROLE_PERMISSIONS.farmer,
  },
};

interface AuthContextType {
  currentUser: UserSession | null;
  currentRole: WorkspaceRole;
  switchRole: (role: WorkspaceRole) => void;
  loginAs: (role: WorkspaceRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
  defaultRole = "admin",
}: {
  children: ReactNode;
  defaultRole?: WorkspaceRole;
}) {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(DEMO_ACCOUNTS[defaultRole]);

  const switchRole = (role: WorkspaceRole) => {
    setCurrentUser(DEMO_ACCOUNTS[role] || null);
  };

  const loginAs = (role: WorkspaceRole) => {
    setCurrentUser(DEMO_ACCOUNTS[role] || null);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = useMemo(
    () => ({
      currentUser,
      currentRole: currentUser?.role || "admin",
      switchRole,
      loginAs,
      logout,
      isAuthenticated: currentUser !== null,
    }),
    [currentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a default fallback if outside provider to ensure resilience
    return {
      currentUser: DEMO_ACCOUNTS.admin,
      currentRole: "admin" as WorkspaceRole,
      switchRole: () => {},
      loginAs: () => {},
      logout: () => {},
      isAuthenticated: true,
    };
  }
  return context;
}
