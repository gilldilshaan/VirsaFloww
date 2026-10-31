import { Permission, UserRole, AuthUser, PortalType } from './types';

/**
 * Explicit Least-Privilege Role-to-Permission Matrix
 * 
 * Strict access controls:
 * - Admin: Server-authorized administrative operations across all portals
 * - Project Developer: Project management, field mapping, farmer oversight, evidence upload (CANNOT review/approve own work)
 * - Reviewer: Evidence review, assessment inspection, satellite auditing (CANNOT access unanonymized farmer PII or manage projects)
 * - Field Officer: Field registration, evidence collection, farmer onboarding (CANNOT perform reviewer-only approval actions)
 * - Farmer: Scoped strictly to personal field records and evidence submission (ZERO internal workspace access)
 * - Buyer: Scoped strictly to public/approved marketplace offtake and inquiries (ZERO internal workspace or farmer portal access)
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'dashboard.read',
    'projects.read',
    'projects.manage',
    'fields.read',
    'fields.manage',
    'farmers.read',
    'evidence.read',
    'evidence.upload',
    'evidence.review',
    'assessments.read',
    'assessments.manage',
    'satellite.read',
    'marketplace.read',
    'enquiries.create',
    'enquiries.manage',
    'buyer_profile.manage',
    'users.manage',
  ],

  project_developer: [
    'dashboard.read',
    'projects.read',
    'projects.manage',
    'fields.read',
    'fields.manage',
    'farmers.read',
    'evidence.read',
    'evidence.upload',
    'assessments.read',
    'satellite.read',
    'marketplace.read',
  ],

  reviewer: [
    'dashboard.read',
    'projects.read',
    'fields.read',
    'evidence.read',
    'evidence.review',
    'assessments.read',
    'satellite.read',
  ],

  field_officer: [
    'dashboard.read',
    'projects.read',
    'fields.read',
    'fields.manage',
    'farmers.read',
    'evidence.read',
    'evidence.upload',
    'satellite.read',
  ],

  farmer: [
    'fields.read',
    'evidence.read',
    'evidence.upload',
  ],

  buyer: [
    'marketplace.read',
    'enquiries.create',
    'enquiries.manage',
    'buyer_profile.manage',
  ],
};

/**
 * Check whether a user has a specific granular permission.
 * Fails closed if user is null or role is invalid.
 */
export function hasPermission(user: AuthUser | null, permission: Permission): boolean {
  if (!user || !user.role) return false;
  const userPerms = user.permissions || ROLE_PERMISSIONS[user.role] || [];
  return userPerms.includes(permission);
}

/**
 * Check whether a user has all of the requested permissions.
 */
export function hasAllPermissions(user: AuthUser | null, permissions: Permission[]): boolean {
  if (!user || !user.role) return false;
  const userPerms = user.permissions || ROLE_PERMISSIONS[user.role] || [];
  return permissions.every((p) => userPerms.includes(p));
}

/**
 * Check whether a user has at least one of the requested permissions.
 */
export function hasAnyPermission(user: AuthUser | null, permissions: Permission[]): boolean {
  if (!user || !user.role) return false;
  const userPerms = user.permissions || ROLE_PERMISSIONS[user.role] || [];
  return permissions.some((p) => userPerms.includes(p));
}

/**
 * Determine portal-level authorization.
 * 
 * Rules:
 * - Farmer Portal: accessible only to 'farmer' and 'admin'
 * - Internal Workspace: accessible only to 'admin', 'project_developer', 'reviewer', 'field_officer'
 * - Buyer Portal: accessible only to 'buyer' and 'admin'
 */
export function canAccessPortal(userOrRole: AuthUser | UserRole | null, portal: PortalType): boolean {
  if (!userOrRole) return false;
  const role: UserRole = typeof userOrRole === 'string' ? userOrRole : userOrRole.role;
  if (!role) return false;

  if (role === 'admin') return true;

  switch (portal) {
    case 'farmer':
      return role === 'farmer';
    case 'workspace':
      return ['project_developer', 'reviewer', 'field_officer'].includes(role);
    case 'buyer':
      return role === 'buyer';
    default:
      return false;
  }
}

/**
 * Extract portal name from a pathname.
 * Returns 'farmer' | 'workspace' | 'buyers' | null
 */
export function getPortalFromPath(pathname: string): 'farmer' | 'workspace' | 'buyers' | null {
  if (pathname.startsWith('/farmer')) return 'farmer';
  if (pathname.startsWith('/workspace')) return 'workspace';
  if (pathname.startsWith('/buyers')) return 'buyers';
  return null;
}

/**
 * Check whether a role or user can access a specific route.
 */
export function canAccessRoute(userOrRole: UserRole | AuthUser | null, pathname: string): boolean {
  if (!userOrRole) return false;
  const role: UserRole = typeof userOrRole === 'string' ? userOrRole : userOrRole.role;
  if (!role) return false;

  const portal = getPortalFromPath(pathname);
  if (portal) {
    const portalType: PortalType = portal === 'buyers' ? 'buyer' : portal;
    if (!canAccessPortal(role, portalType)) {
      return false;
    }
  }

  return true;
}

/**
 * Determine where to redirect an unauthorized user.
 * - Not authenticated → /login
 * - Authenticated but wrong portal → /unauthorized
 */
export function getAuthRedirect(
  isAuthenticated: boolean,
  currentPath: string,
): string {
  if (!isAuthenticated) {
    return `/login?next=${encodeURIComponent(currentPath)}`;
  }
  return '/unauthorized';
}

/**
 * Resource-Level Authorization Helpers
 * 
 * IMPORTANT ARCHITECTURAL DISTINCTION:
 * Frontend resource-level checks are UX guardrails that prevent displaying 
 * inaccessible data or triggering guaranteed 403 API errors.
 * 
 * In production, true security boundaries MUST be enforced authoritatively
 * by the backend API via Row-Level Security (RLS) / attribute-based access control (ABAC).
 */

/**
 * Enforce field-level scoping:
 * - Farmers: own farmerId or assigned fieldIds only
 * - Field Officers: assigned fieldIds only
 * - Buyers: ZERO field access
 */
export function canAccessFieldResource(user: AuthUser | null, fieldId: string): boolean {
  if (!user) return false;
  if (user.role === 'buyer') return false; // Zero internal field records for buyers
  if (user.role === 'admin') return true;  // Subject to backend authorization

  if (user.role === 'farmer') {
    if (user.farmerId && user.farmerId === fieldId) return true;
    if (user.scope?.permittedFieldIds && user.scope.permittedFieldIds.includes(fieldId)) return true;
    return false;
  }

  if (user.role === 'field_officer') {
    if (user.scope?.permittedFieldIds) {
      return user.scope.permittedFieldIds.includes(fieldId);
    }
    return hasPermission(user, 'fields.read');
  }

  return hasPermission(user, 'fields.read');
}

/**
 * Enforce project-level scoping:
 * - Buyers: published projects only
 * - Project Developers: assigned projects only
 * - Farmers: ZERO project dossier access
 */
export function canAccessProjectResource(
  user: AuthUser | null,
  projectId: string,
  isPublished: boolean = true
): boolean {
  if (!user) return false;
  if (user.role === 'farmer') return false; // Farmers do not manage project dossiers

  if (user.role === 'buyer') {
    if (!isPublished) return false;
    if (user.scope?.publishedProjectIds) {
      return user.scope.publishedProjectIds.includes(projectId);
    }
    return true;
  }

  if (user.role === 'admin') return true;

  if (user.role === 'project_developer') {
    if (user.scope?.assignedProjectIds) {
      return user.scope.assignedProjectIds.includes(projectId);
    }
    return hasPermission(user, 'projects.read');
  }

  return hasPermission(user, 'projects.read');
}

/**
 * Enforce buyer enquiry scoping:
 * - Buyers: can only manage enquiries belonging to their own organization
 */
export function canAccessEnquiryResource(user: AuthUser | null, enquiryOrgId: string): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'buyer') {
    return Boolean(user.buyerOrgId && user.buyerOrgId === enquiryOrgId);
  }
  return false;
}
