import { Permission, WorkspaceRole, UserSession } from "../types/workspace";

export const ALL_PERMISSIONS: Permission[] = [
  "workspace:view",
  "workspace:projects:read",
  "workspace:projects:manage",
  "workspace:farmers:read",
  "workspace:farmers:manage",
  "workspace:fields:read",
  "workspace:fields:manage",
  "workspace:evidence:read",
  "workspace:evidence:upload",
  "workspace:evidence:review",
  "workspace:assessments:read",
  "workspace:assessments:create",
  "workspace:assessments:approve",
  "workspace:geospatial:view",
  "workspace:reports:view",
  "workspace:reports:export",
];

export const ROLE_PERMISSIONS: Record<WorkspaceRole, Permission[]> = {
  admin: [...ALL_PERMISSIONS],
  project_developer: [
    "workspace:view",
    "workspace:projects:read",
    "workspace:projects:manage",
    "workspace:farmers:read",
    "workspace:farmers:manage",
    "workspace:fields:read",
    "workspace:fields:manage",
    "workspace:evidence:read",
    "workspace:evidence:upload",
    "workspace:assessments:read",
    "workspace:assessments:create",
    "workspace:geospatial:view",
    "workspace:reports:view",
    "workspace:reports:export",
  ],
  field_officer: [
    "workspace:view",
    "workspace:farmers:read",
    "workspace:farmers:manage",
    "workspace:fields:read",
    "workspace:fields:manage",
    "workspace:evidence:read",
    "workspace:evidence:upload",
    "workspace:geospatial:view",
  ],
  reviewer: [
    "workspace:view",
    "workspace:projects:read",
    "workspace:fields:read",
    "workspace:evidence:read",
    "workspace:evidence:review",
    "workspace:assessments:read",
    "workspace:assessments:approve",
    "workspace:geospatial:view",
    "workspace:reports:view",
  ],
  buyer: [],
  farmer: [],
};

export function hasPermission(user: UserSession | null, permission: Permission): boolean {
  if (!user) return false;
  return user.permissions.includes(permission);
}

export function hasAnyPermission(user: UserSession | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.some((p) => user.permissions.includes(p));
}

export function hasAllPermissions(user: UserSession | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.every((p) => user.permissions.includes(p));
}

export function canAccessWorkspace(user: UserSession | null): boolean {
  if (!user) return false;
  return ["admin", "project_developer", "field_officer", "reviewer"].includes(user.role);
}

export function canAccessWorkspaceRoute(user: UserSession | null, routeSegment: string): boolean {
  if (!canAccessWorkspace(user)) return false;
  if (!user) return false;
  if (user.role === "admin") return true;

  switch (routeSegment) {
    case "command":
    case "satellite":
    case "terra-intelligence":
      return true;
    case "projects":
      return hasPermission(user, "workspace:projects:read");
    case "farmers":
      return hasPermission(user, "workspace:farmers:read");
    case "fields":
      return hasPermission(user, "workspace:fields:read");
    case "evidence":
      return hasPermission(user, "workspace:evidence:read");
    case "review":
      return hasPermission(user, "workspace:evidence:review") || user.role === "project_developer";
    case "assessments":
      return hasPermission(user, "workspace:assessments:read");
    case "dossier":
      return user.role === "project_developer" || user.role === "reviewer";
    case "reports":
      return hasPermission(user, "workspace:reports:view");
    default:
      return true;
  }
}
