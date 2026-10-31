/**
 * TerraLedger AI — Workspace Portal Types
 *
 * Types specific to the Internal Workspace portal.
 * Shared field/evidence types are in terra-ledger/types.ts.
 */

/** Internal workspace roles */
export type WorkspaceRole = 'admin' | 'project_developer' | 'field_officer' | 'reviewer';

/** Project record as seen by workspace users */
export interface WorkspaceProject {
  id: string;
  title: string;
  slug: string;
  location: string;
  district: string;
  practice: string;
  methodology: string;
  developer: string;
  totalHectares: number;
  enrolledParcels: number;
  farmerCount: number;
  assessmentStatus: 'UNVERIFIED' | 'NEEDS_REVIEW' | 'READY_FOR_VERIFICATION';
  readinessScorePercent: number;
  createdAt: string;
  updatedAt: string;
}

/** Field record in the workspace field registry */
export interface WorkspaceField {
  id: string;
  code: string;
  name: string;
  farmerId: string;
  farmerName: string;
  district: string;
  areaHa: number;
  practice: string;
  crop: string;
  season: string;
  assessmentStatus: 'UNVERIFIED' | 'NEEDS_REVIEW' | 'READY_FOR_VERIFICATION';
  evidenceCount: number;
  lastActivityDate: string | null;
}

/** Farmer record in the internal farmer registry */
export interface WorkspaceFarmer {
  id: string;
  name: string;
  nameLocal: string | null;
  district: string;
  fieldCount: number;
  totalAreaHa: number;
  registeredAt: string;
  /** No PII exposed to buyer portal */
  phone?: never;
}

/** Review queue item */
export interface ReviewQueueItem {
  id: string;
  fieldId: string;
  fieldCode: string;
  projectId: string;
  projectTitle: string;
  evidenceId: string;
  evidenceTitle: string;
  evidenceType: 'photo' | 'satellite' | 'document' | 'log' | 'sensor';
  submittedAt: string;
  priority: 'high' | 'medium' | 'low';
  assignedReviewer: string | null;
  status: 'pending' | 'in_review' | 'approved' | 'flagged' | 'correction_requested';
}

/** MRV assessment record */
export interface MrvAssessment {
  id: string;
  fieldId: string;
  fieldCode: string;
  projectId: string;
  assessmentDate: string;
  status: 'UNVERIFIED' | 'NEEDS_REVIEW' | 'READY_FOR_VERIFICATION';
  ruleResults: MrvRuleResult[];
  completenessPercent: number;
  reviewerId: string | null;
  notes: string;
}

/** Individual MRV rule result */
export interface MrvRuleResult {
  ruleId: string;
  ruleName: string;
  result: 'pass' | 'fail' | 'incomplete' | 'not_applicable';
  explanation: string;
  sourceRecordIds: string[];
}
