/**
 * Domain Type Adapter: Fields & Parcels
 *
 * Maps backend FieldModel (PostGIS polygon and coordinate properties) to frontend FieldParcel.
 * Handles centroid extraction and boundary polygon normalization.
 */

import type { FieldParcel, AssessmentStatus } from '../terra-ledger/types';

export function adaptBackendFieldToParcel(raw: Record<string, unknown>): FieldParcel {
  const rawBoundary = raw['boundaryPolygon'] ?? raw['boundary_polygon'];
  let boundaryPolygon: Array<[number, number]> = [];

  if (Array.isArray(rawBoundary)) {
    boundaryPolygon = rawBoundary
      .filter((pt): pt is [number, number] => Array.isArray(pt) && pt.length >= 2)
      .map((pt) => [Number(pt[0]), Number(pt[1])]);
  }

  // Centroid coordinate extraction
  let lat = 30.901;
  let lng = 75.8573;

  const rawCoords = raw['coordinates'] as { lat?: number; lng?: number } | undefined;
  if (rawCoords && typeof rawCoords.lat === 'number' && typeof rawCoords.lng === 'number') {
    lat = rawCoords.lat;
    lng = rawCoords.lng;
  } else if (boundaryPolygon.length > 0) {
    const sumLat = boundaryPolygon.reduce((acc, pt) => acc + pt[0], 0);
    const sumLng = boundaryPolygon.reduce((acc, pt) => acc + pt[1], 0);
    lat = Number((sumLat / boundaryPolygon.length).toFixed(6));
    lng = Number((sumLng / boundaryPolygon.length).toFixed(6));
  }

  const areaHa =
    typeof raw['areaHa'] === 'number'
      ? raw['areaHa']
      : typeof raw['area_ha'] === 'number'
      ? (raw['area_ha'] as number)
      : 0;

  const areaAcres =
    typeof raw['areaAcres'] === 'number'
      ? raw['areaAcres']
      : typeof raw['area_acres'] === 'number'
      ? (raw['area_acres'] as number)
      : Number((areaHa * 2.47105).toFixed(2));

  const targetTonnes =
    typeof raw['targetEmissionReductionTonnes'] === 'number'
      ? raw['targetEmissionReductionTonnes']
      : typeof raw['target_emission_reduction_tonnes'] === 'number'
      ? (raw['target_emission_reduction_tonnes'] as number)
      : Number((areaHa * 2.85).toFixed(1));

  const rawAssessmentStatus = String(raw['assessmentStatus'] ?? raw['assessment_status'] ?? '');
  const assessmentStatus: AssessmentStatus | undefined =
    rawAssessmentStatus === 'READY_FOR_VERIFICATION' ||
    rawAssessmentStatus === 'NEEDS_REVIEW' ||
    rawAssessmentStatus === 'UNVERIFIED'
      ? rawAssessmentStatus
      : undefined;

  const fieldId = String(raw['id'] ?? raw['code'] ?? 'PB-FIELD-001');
  const code = String(raw['code'] ?? raw['id'] ?? 'PB-FIELD-001');

  const parcel: FieldParcel = {
    id: fieldId,
    name: String(raw['name'] ?? `Parcel ${code}`),
    code,
    farmerName: String(raw['farmerName'] ?? raw['farmer_name'] ?? 'Registered Producer'),
    farmerNameLocal: String(raw['farmerNameLocal'] ?? raw['farmer_name_local'] ?? ''),
    district: String(raw['district'] ?? 'Ludhiana'),
    state: String(raw['state'] ?? 'Punjab'),
    areaHa,
    areaAcres,
    practice: String(raw['practice'] ?? 'Direct Seeded Rice (DSR)'),
    crop: String(raw['crop'] ?? 'PR-126 Basmati / Paddy'),
    season: String(raw['season'] ?? 'Kharif 2026'),
    coordinates: { lat, lng },
    boundaryPolygon,
    targetEmissionReductionTonnes: targetTonnes,
  };

  const projId = raw['projectId'] ? String(raw['projectId']) : raw['project_id'] ? String(raw['project_id']) : undefined;
  if (projId) parcel.projectId = projId;

  const fpo = raw['fpoName'] ? String(raw['fpoName']) : raw['fpo_name'] ? String(raw['fpo_name']) : undefined;
  if (fpo) parcel.fpoName = fpo;

  if (raw['season']) parcel.cropSeason = String(raw['season']);
  if (typeof raw['evidenceCount'] === 'number') parcel.evidenceCount = raw['evidenceCount'];
  if (assessmentStatus) parcel.assessmentStatus = assessmentStatus;
  if (raw['lastObservationDate']) parcel.lastObservationDate = String(raw['lastObservationDate']);

  return parcel;
}

export function adaptBackendFields(rawList: unknown[]): FieldParcel[] {
  if (!Array.isArray(rawList)) return [];
  return rawList
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map(adaptBackendFieldToParcel);
}
