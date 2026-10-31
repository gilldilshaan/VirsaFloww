/**
 * Domain Type Adapter: Assessments & MRV Engine
 *
 * Maps backend Assessment schema and rule results to frontend representations.
 */

import type { AssessmentStatus, RuleEvaluationResult } from '../terra-ledger/types';

export interface FrontendAssessmentSummary {
  id: string;
  fieldId: string;
  seasonId: string;
  assessedAt: string;
  rulesetVersion: string;
  status: AssessmentStatus;
  statusLabel: string;
  outstandingVerification: string[];
  ruleResults: RuleEvaluationResult[];
}

export function adaptBackendAssessment(raw: Record<string, unknown>): FrontendAssessmentSummary {
  const rawStatus = String(raw['status'] ?? 'UNVERIFIED');
  const status: AssessmentStatus =
    rawStatus === 'READY_FOR_VERIFICATION' || rawStatus === 'NEEDS_REVIEW' || rawStatus === 'UNVERIFIED'
      ? rawStatus
      : 'UNVERIFIED';

  const rawResults = raw['ruleResults'] || raw['rule_results'];
  const ruleResults: RuleEvaluationResult[] = Array.isArray(rawResults)
    ? rawResults.map((r: Record<string, unknown>) => {
        const rawRes = String(r['result'] ?? r['status'] ?? 'pass').toLowerCase();
        const ruleStatus: RuleEvaluationResult['status'] =
          rawRes === 'fail' ? 'fail' : rawRes === 'warn' ? 'warn' : 'pass';
        return {
          ruleId: String(r['ruleId'] ?? r['rule_id'] ?? ''),
          ruleName: String(r['ruleName'] ?? r['rule_name'] ?? r['ruleId'] ?? ''),
          status: ruleStatus,
          message: String(r['explanation'] ?? r['message'] ?? ''),
          timestamp: String(r['timestamp'] ?? new Date().toISOString()),
        };
      })
    : [];

  const rawOutstanding = raw['outstandingVerification'] || raw['outstanding_verification'];
  const outstandingVerification: string[] = Array.isArray(rawOutstanding)
    ? (rawOutstanding as string[])
    : ['Independent field visit', 'Independent review'];

  return {
    id: String(raw['id'] ?? ''),
    fieldId: String(raw['fieldId'] ?? raw['field_id'] ?? ''),
    seasonId: String(raw['seasonId'] ?? raw['season_id'] ?? 'Kharif-2026'),
    assessedAt: String(raw['assessedAt'] ?? raw['assessed_at'] ?? new Date().toISOString()),
    rulesetVersion: String(raw['rulesetVersion'] ?? raw['ruleset_version'] ?? '1.0.0-deterministic'),
    status,
    statusLabel: String(raw['statusLabel'] ?? raw['status_label'] ?? status),
    outstandingVerification,
    ruleResults,
  };
}

export function adaptBackendAssessments(rawList: unknown[]): FrontendAssessmentSummary[] {
  if (!Array.isArray(rawList)) return [];
  return rawList
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map(adaptBackendAssessment);
}
