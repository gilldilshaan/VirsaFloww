/**
 * TerraLedger AI — Shared Type Barrel Export
 *
 * Import from '@/lib/types' for cross-portal types.
 * Import from specific modules when working within a single portal.
 */

// Re-export existing core types
export type {
  AssessmentStatus,
  DemoState,
  FieldParcel,
  EvidenceItem,
  SatelliteObservation,
  MarketplaceProject,
  DueDiligenceItem,
} from '@/lib/terra-ledger/types';

// Portal-specific types
export type {
  FarmerProfile,
  FarmerField,
  SeasonRecord,
  ActivityRecord,
  FarmerEvidenceUpload,
  FarmerNotification,
} from './farmer';

export type {
  WorkspaceRole,
  WorkspaceProject,
  WorkspaceField,
  WorkspaceFarmer,
  ReviewQueueItem,
  MrvAssessment,
  MrvRuleResult,
} from './workspace';

export type {
  BuyerProfile,
  BuyerProject,
  BuyerEnquiry,
  BuyerEnquirySubmission,
} from './buyer';

// Auth types
export type { UserRole, Permission } from '@/lib/auth/roles';
