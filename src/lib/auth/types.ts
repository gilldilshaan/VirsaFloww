/**
 * Canonical Authentication & Granular Permission Types for TerraLedger AI / VirsaFlow
 * 
 * Supports the three-portal architecture:
 * 1. Farmer Portal
 * 2. Internal Workspace (Auditors, Developers, Field Officers, Reviewers, Admins)
 * 3. Industry Buyer Portal
 * 
 * Strict Canonical Roles (NO ABBREVIATIONS):
 * - farmer
 * - admin
 * - project_developer
 * - field_officer
 * - reviewer
 * - buyer
 */

export type UserRole =
  | 'farmer'
  | 'admin'
  | 'project_developer'
  | 'field_officer'
  | 'reviewer'
  | 'buyer';

export type Permission =
  | 'dashboard.read'
  | 'projects.read'
  | 'projects.manage'
  | 'fields.read'
  | 'fields.manage'
  | 'farmers.read'
  | 'evidence.read'
  | 'evidence.upload'
  | 'evidence.review'
  | 'assessments.read'
  | 'assessments.manage'
  | 'satellite.read'
  | 'marketplace.read'
  | 'enquiries.create'
  | 'enquiries.manage'
  | 'buyer_profile.manage'
  | 'users.manage';

export type PortalType = 'farmer' | 'workspace' | 'buyer' | 'admin';

/**
 * Resource-Level Scoping Boundaries
 * Used to enforce least-privilege resource access within a granted permission.
 */
export interface ResourceScope {
  farmerId?: string;
  permittedFieldIds?: string[];
  assignedProjectIds?: string[];
  assignedReviewQueueIds?: string[];
  buyerOrgId?: string;
  publishedProjectIds?: string[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
  scope?: ResourceScope;
  fpoId?: string;
  farmerId?: string;
  buyerOrgId?: string;
  isDemoUser: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  requestedDemoRole?: UserRole;
  isDemoRequest?: boolean;
}

export interface StoredSession {
  user: AuthUser;
  issuedAt: number;
  expiresAt: number;
  sessionType: 'demo' | 'production';
}
