/**
 * TerraLedger AI — Role and Permission Definitions
 *
 * SECURITY: These definitions are used for frontend route guards and UI rendering ONLY.
 * They are NOT a security boundary. All access control MUST be enforced server-side
 * in the API layer. Frontend role checks are a UX convenience to prevent users from
 * navigating to pages they cannot use.
 *
 * Roles are assigned by the backend authentication system (Supabase + custom claims).
 * The frontend NEVER assigns or modifies production roles.
 */

export const USER_ROLES = [
  'farmer',
  'admin',
  'project_developer',
  'field_officer',
  'reviewer',
  'buyer',
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const PERMISSIONS = [
  // Farmer portal
  'farmer:view_own_fields',
  'farmer:register_field',
  'farmer:manage_seasons',
  'farmer:submit_evidence',
  'farmer:view_notifications',
  'farmer:manage_profile',

  // Workspace portal
  'workspace:view_command',
  'workspace:view_satellite',
  'workspace:view_evidence',
  'workspace:manage_projects',
  'workspace:view_projects',
  'workspace:manage_fields',
  'workspace:view_fields',
  'workspace:review_evidence',
  'workspace:manage_assessments',
  'workspace:view_farmers',
  'workspace:terra_intelligence',
  'workspace:view_dossier',
  'workspace:manage_dossier',

  // Buyer portal
  'buyer:view_marketplace',
  'buyer:view_approved_project',
  'buyer:submit_enquiry',
  'buyer:view_own_enquiries',
  'buyer:manage_profile',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/**
 * Role-to-permission mapping.
 * Server-side authorization MUST mirror this exactly.
 */
export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  farmer: [
    'farmer:view_own_fields',
    'farmer:register_field',
    'farmer:manage_seasons',
    'farmer:submit_evidence',
    'farmer:view_notifications',
    'farmer:manage_profile',
  ],
  admin: [
    'workspace:view_command',
    'workspace:view_satellite',
    'workspace:view_evidence',
    'workspace:manage_projects',
    'workspace:view_projects',
    'workspace:manage_fields',
    'workspace:view_fields',
    'workspace:review_evidence',
    'workspace:manage_assessments',
    'workspace:view_farmers',
    'workspace:terra_intelligence',
    'workspace:view_dossier',
    'workspace:manage_dossier',
    'buyer:view_marketplace',
    'buyer:view_approved_project',
    'buyer:view_own_enquiries',
  ],
  project_developer: [
    'workspace:view_command',
    'workspace:view_satellite',
    'workspace:view_evidence',
    'workspace:manage_projects',
    'workspace:view_projects',
    'workspace:manage_fields',
    'workspace:view_fields',
    'workspace:view_farmers',
    'workspace:terra_intelligence',
    'workspace:view_dossier',
    'workspace:manage_dossier',
    'buyer:view_marketplace',
    'buyer:view_approved_project',
  ],
  field_officer: [
    'workspace:view_command',
    'workspace:view_satellite',
    'workspace:view_evidence',
    'workspace:view_projects',
    'workspace:view_fields',
    'workspace:view_farmers',
    'workspace:terra_intelligence',
  ],
  reviewer: [
    'workspace:view_command',
    'workspace:view_evidence',
    'workspace:review_evidence',
    'workspace:view_projects',
    'workspace:view_fields',
    'workspace:manage_assessments',
    'workspace:view_dossier',
  ],
  buyer: [
    'buyer:view_marketplace',
    'buyer:view_approved_project',
    'buyer:submit_enquiry',
    'buyer:view_own_enquiries',
    'buyer:manage_profile',
  ],
};

/** Which portals each role can access */
export const PORTAL_ACCESS: Record<UserRole, readonly string[]> = {
  farmer: ['farmer'],
  admin: ['workspace', 'buyers'],
  project_developer: ['workspace', 'buyers'],
  field_officer: ['workspace'],
  reviewer: ['workspace'],
  buyer: ['buyers'],
};

/** Check if a role has a specific permission */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role];
  return perms.includes(permission);
}

/** Check if a role can access a portal */
export function canAccessPortal(role: UserRole, portal: string): boolean {
  const access = PORTAL_ACCESS[role];
  return access.includes(portal);
}

/** Human-readable role labels */
export const ROLE_LABELS: Record<UserRole, string> = {
  farmer: 'Farmer',
  admin: 'Administrator',
  project_developer: 'Project Developer',
  field_officer: 'Field Officer',
  reviewer: 'Reviewer',
  buyer: 'Industry Buyer',
};
