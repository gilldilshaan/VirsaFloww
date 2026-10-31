/**
 * TerraLedger AI — Route Permission Guards
 *
 * SECURITY: Frontend route guards are a UX convenience ONLY.
 * All data access MUST be independently authorized server-side.
 * Never rely on frontend checks to protect sensitive data.
 */

import type { Permission, UserRole } from './roles';
import { hasPermission, canAccessPortal } from './roles';

/** Maps route prefixes to the portal they belong to */
export function getPortalFromPath(pathname: string): string | null {
  if (pathname.startsWith('/farmer')) return 'farmer';
  if (pathname.startsWith('/workspace')) return 'workspace';
  if (pathname.startsWith('/buyers')) return 'buyers';
  return null;
}

/**
 * Maps specific routes to their required permissions.
 * Routes not listed here inherit portal-level access.
 */
const ROUTE_PERMISSION_MAP: Array<{ pattern: RegExp; permissions: Permission[] }> = [
  // Farmer portal
  { pattern: /^\/farmer\/fields/, permissions: ['farmer:view_own_fields'] },
  { pattern: /^\/farmer\/register-field/, permissions: ['farmer:register_field'] },
  { pattern: /^\/farmer\/season/, permissions: ['farmer:manage_seasons'] },
  { pattern: /^\/farmer\/evidence/, permissions: ['farmer:submit_evidence'] },
  { pattern: /^\/farmer\/notifications/, permissions: ['farmer:view_notifications'] },
  { pattern: /^\/farmer\/profile/, permissions: ['farmer:manage_profile'] },

  // Workspace portal
  { pattern: /^\/workspace\/command/, permissions: ['workspace:view_command'] },
  { pattern: /^\/workspace\/satellite/, permissions: ['workspace:view_satellite'] },
  { pattern: /^\/workspace\/evidence/, permissions: ['workspace:view_evidence'] },
  { pattern: /^\/workspace\/projects/, permissions: ['workspace:manage_projects'] },
  { pattern: /^\/workspace\/fields/, permissions: ['workspace:view_fields'] },
  { pattern: /^\/workspace\/review/, permissions: ['workspace:review_evidence'] },
  { pattern: /^\/workspace\/assessments/, permissions: ['workspace:manage_assessments'] },
  { pattern: /^\/workspace\/farmers/, permissions: ['workspace:view_farmers'] },
  { pattern: /^\/workspace\/terra-intelligence/, permissions: ['workspace:terra_intelligence'] },
  { pattern: /^\/workspace\/dossier/, permissions: ['workspace:view_dossier'] },

  // Buyer portal
  { pattern: /^\/buyers\/marketplace/, permissions: ['buyer:view_marketplace'] },
  { pattern: /^\/buyers\/projects/, permissions: ['buyer:view_approved_project'] },
  { pattern: /^\/buyers\/enquiry/, permissions: ['buyer:submit_enquiry'] },
  { pattern: /^\/buyers\/enquiries/, permissions: ['buyer:view_own_enquiries'] },
  { pattern: /^\/buyers\/profile/, permissions: ['buyer:manage_profile'] },
];

/** Get the permissions required to access a given route */
export function getRequiredPermissions(pathname: string): Permission[] {
  for (const entry of ROUTE_PERMISSION_MAP) {
    if (entry.pattern.test(pathname)) {
      return entry.permissions;
    }
  }
  return [];
}

/** Check whether a role can access a specific route */
export function canAccessRoute(role: UserRole, pathname: string): boolean {
  const portal = getPortalFromPath(pathname);
  if (portal && !canAccessPortal(role, portal)) {
    return false;
  }

  const required = getRequiredPermissions(pathname);
  if (required.length === 0) return true;

  return required.every((perm) => hasPermission(role, perm));
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
