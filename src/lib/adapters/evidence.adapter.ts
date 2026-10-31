/**
 * Domain Type Adapter: Evidence Items & Telemetry
 *
 * Maps backend Evidence schema to frontend EvidenceItem.
 * Preserves immutable cryptographic hash (SHA-256) and non-destructive supersession audit trail.
 */

import type { EvidenceItem, RuleEvaluationResult } from '../terra-ledger/types';

export function adaptBackendEvidenceToEvidenceItem(raw: Record<string, unknown>): EvidenceItem {
  const rawType = String(raw['type'] ?? 'document').toLowerCase();
  const type: EvidenceItem['type'] =
    rawType === 'photo' || rawType === 'satellite' || rawType === 'log' || rawType === 'sensor'
      ? rawType
      : 'document';

  const rawCategory = String(raw['category'] ?? 'supporting').toLowerCase();
  const category: EvidenceItem['category'] =
    rawCategory === 'contradicting' || rawCategory === 'missing' ? rawCategory : 'supporting';

  const rawStatus = String(raw['status'] ?? 'pending').toLowerCase();
  let status: EvidenceItem['status'] = 'pending';
  if (rawStatus === 'verified' || rawStatus === 'hash_recorded' || rawStatus === 'received') {
    status = 'verified';
  } else if (rawStatus === 'flagged' || rawStatus === 'contradicting') {
    status = 'flagged';
  } else if (rawStatus === 'missing') {
    status = 'missing';
  }

  const rawProvenance = (raw['provenance'] as Record<string, unknown>) || {};
  const rawGps = rawProvenance['gpsCoordinates'] || rawProvenance['gps_coordinates'];
  let gpsCoordinates: EvidenceItem['provenance']['gpsCoordinates'] | undefined = undefined;

  if (rawGps && typeof rawGps === 'object') {
    const g = rawGps as Record<string, unknown>;
    if (typeof g['lat'] === 'number' && typeof g['lng'] === 'number') {
      const gps: { lat: number; lng: number; accuracyMeters?: number } = {
        lat: g['lat'],
        lng: g['lng'],
      };
      const acc = typeof g['accuracyMeters'] === 'number' ? g['accuracyMeters'] : typeof g['accuracy_meters'] === 'number' ? (g['accuracy_meters'] as number) : undefined;
      if (acc !== undefined) gps.accuracyMeters = acc;
      gpsCoordinates = gps;
    }
  }

  const rawFile = (raw['fileDetails'] || raw['file_details']) as Record<string, unknown> | undefined;
  const fileDetails = rawFile
    ? {
        name: String(rawFile['name'] ?? 'evidence-file'),
        sizeKb: typeof rawFile['sizeKb'] === 'number' ? rawFile['sizeKb'] : typeof rawFile['size_kb'] === 'number' ? (rawFile['size_kb'] as number) : 0,
        mime: String(rawFile['mime'] ?? 'application/octet-stream'),
      }
    : undefined;

  const rawRuleResults = raw['ruleResults'] || raw['rule_results'];
  const ruleResults: RuleEvaluationResult[] = Array.isArray(rawRuleResults)
    ? rawRuleResults.map((r: Record<string, unknown>) => ({
        ruleId: String(r['ruleId'] ?? r['rule_id'] ?? ''),
        ruleName: String(r['ruleName'] ?? r['rule_name'] ?? r['ruleId'] ?? ''),
        status: (String(r['result'] ?? r['status'] ?? 'pass').toLowerCase() as RuleEvaluationResult['status']),
        message: String(r['explanation'] ?? r['message'] ?? ''),
        timestamp: String(r['timestamp'] ?? new Date().toISOString()),
      }))
    : [];

  const provenance: EvidenceItem['provenance'] = {
    author: String(rawProvenance['author'] ?? 'Panjdhara Operational Agent'),
    source: String(rawProvenance['source'] ?? 'Mobile Field Uplink'),
    reviewStatus: String(rawProvenance['reviewStatus'] ?? rawProvenance['review_status'] ?? 'Server SHA-256 Verified'),
  };

  if (rawProvenance['sha256']) provenance.sha256 = String(rawProvenance['sha256']);
  if (rawProvenance['device']) provenance.device = String(rawProvenance['device']);
  if (gpsCoordinates) provenance.gpsCoordinates = gpsCoordinates;
  const dist = typeof rawProvenance['spatialDistanceMeters'] === 'number' ? rawProvenance['spatialDistanceMeters'] : typeof rawProvenance['spatial_distance_meters'] === 'number' ? (rawProvenance['spatial_distance_meters'] as number) : undefined;
  if (dist !== undefined) provenance.spatialDistanceMeters = dist;

  const item: EvidenceItem = {
    id: String(raw['id'] ?? ''),
    title: String(raw['title'] ?? 'Field Evidence'),
    type,
    category,
    status,
    description: String(raw['description'] ?? ''),
    timestamp: String(raw['capturedAt'] ?? raw['captured_at'] ?? raw['submittedAt'] ?? raw['submitted_at'] ?? new Date().toISOString()),
    provenance,
  };

  if (fileDetails) item.fileDetails = fileDetails;
  const sId = raw['supersedesId'] ? String(raw['supersedesId']) : raw['supersedes_evidence_id'] ? String(raw['supersedes_evidence_id']) : undefined;
  if (sId) item.supersedesId = sId;

  const sById = raw['supersededById'] ? String(raw['supersededById']) : raw['superseded_by_evidence_id'] ? String(raw['superseded_by_evidence_id']) : undefined;
  if (sById) item.supersededById = sById;

  const fId = raw['fieldId'] ? String(raw['fieldId']) : raw['field_id'] ? String(raw['field_id']) : undefined;
  if (fId) {
    item.fieldId = fId;
    item.fieldCode = fId;
  }

  if (ruleResults.length > 0) item.ruleResults = ruleResults;

  return item;
}

export function adaptBackendEvidenceList(rawList: unknown[]): EvidenceItem[] {
  if (!Array.isArray(rawList)) return [];
  return rawList
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map(adaptBackendEvidenceToEvidenceItem);
}
