/**
 * Domain Type Adapter: Review Queue Items
 *
 * Maps backend Review schema to frontend ReviewQueueItem.
 */

import type { ReviewQueueItem, RuleEvaluationResult } from '../terra-ledger/types';

export function adaptBackendReviewToReviewQueueItem(raw: Record<string, unknown>): ReviewQueueItem {
  const rawStatus = String(raw['status'] ?? 'pending').toLowerCase();
  let status: ReviewQueueItem['status'] = 'pending';
  if (rawStatus === 'in_investigation' || rawStatus === 'in_review') {
    status = 'in_review';
  } else if (rawStatus === 'resolved' || rawStatus === 'accepted') {
    status = 'resolved';
  }

  const rawSeverity = String(raw['severity'] ?? 'medium').toLowerCase();
  const priority: ReviewQueueItem['priority'] =
    rawSeverity === 'high' || rawSeverity === 'low' ? rawSeverity : 'medium';

  const fieldId = String(raw['fieldId'] ?? raw['field_id'] ?? raw['parcelId'] ?? raw['parcel_id'] ?? 'PB-FIELD-001');
  const projectId = String(raw['projectId'] ?? raw['project_id'] ?? 'PRJ-PB-DSR-01');

  const rawRules = raw['rules'];
  const rules: RuleEvaluationResult[] = Array.isArray(rawRules)
    ? rawRules.map((r: Record<string, unknown>) => ({
        ruleId: String(r['ruleId'] ?? r['rule_id'] ?? ''),
        ruleName: String(r['ruleName'] ?? r['rule_name'] ?? r['ruleId'] ?? ''),
        status: (String(r['result'] ?? r['status'] ?? 'pass').toLowerCase() as RuleEvaluationResult['status']),
        message: String(r['explanation'] ?? r['message'] ?? ''),
        timestamp: String(r['timestamp'] ?? new Date().toISOString()),
      }))
    : [];

  const item: ReviewQueueItem = {
    id: String(raw['id'] ?? ''),
    evidenceId: String(raw['evidenceRefId'] ?? raw['evidence_ref_id'] ?? raw['id'] ?? ''),
    evidenceTitle: String(raw['title'] ?? 'Reviewed Item'),
    evidenceType: 'photo',
    fieldId,
    fieldCode: fieldId,
    projectId,
    farmerName: String(raw['farmerName'] ?? raw['farmer_name'] ?? 'Registered Smallholder'),
    submittedAt: String(raw['reportedDate'] ?? raw['reported_date'] ?? new Date().toISOString()),
    status,
    priority,
    rules,
  };

  const assigned = raw['assignedTo'] ? String(raw['assignedTo']) : raw['assigned_to'] ? String(raw['assigned_to']) : undefined;
  if (assigned) item.assignedReviewer = assigned;

  if (raw['comment']) item.reviewNotes = String(raw['comment']);

  const actionAt = raw['resolvedAt'] ? String(raw['resolvedAt']) : raw['resolved_at'] ? String(raw['resolved_at']) : undefined;
  if (actionAt) item.lastActionAt = actionAt;

  return item;
}

export function adaptBackendReviews(rawList: unknown[]): ReviewQueueItem[] {
  if (!Array.isArray(rawList)) return [];
  return rawList
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map(adaptBackendReviewToReviewQueueItem);
}
