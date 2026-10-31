/**
 * Domain Type Adapter: Projects
 *
 * Maps backend Project schema (camelCase and snake_case variants) to frontend MarketplaceProject.
 * Enforces valid MRV statuses: 'UNVERIFIED' | 'NEEDS_REVIEW' | 'READY_FOR_VERIFICATION'.
 */

import type { MarketplaceProject, AssessmentStatus } from '../terra-ledger/types';

export function adaptBackendProjectToMarketplaceProject(
  raw: Record<string, unknown>
): MarketplaceProject {
  const rawStatus = String(raw['assessmentStatus'] ?? raw['assessment_status'] ?? 'UNVERIFIED');
  const assessmentStatus: AssessmentStatus =
    rawStatus === 'READY_FOR_VERIFICATION' || rawStatus === 'NEEDS_REVIEW' || rawStatus === 'UNVERIFIED'
      ? rawStatus
      : 'UNVERIFIED';

  const depth = (raw['evidenceDepth'] || raw['evidence_depth']) as Record<string, unknown> | undefined;

  const totalHectares =
    typeof raw['totalHectares'] === 'number'
      ? raw['totalHectares']
      : typeof raw['total_hectares'] === 'number'
      ? raw['total_hectares']
      : 0;

  const enrolledParcels =
    typeof raw['enrolledParcels'] === 'number'
      ? raw['enrolledParcels']
      : typeof raw['enrolled_parcels'] === 'number'
      ? raw['enrolled_parcels']
      : 0;

  const farmerCount =
    typeof raw['farmerCount'] === 'number'
      ? raw['farmerCount']
      : typeof raw['farmer_count'] === 'number'
      ? raw['farmer_count']
      : 0;

  const estimatedTons =
    typeof raw['estimatedTonsCo2ePerYear'] === 'number'
      ? raw['estimatedTonsCo2ePerYear']
      : typeof raw['estimated_tons_co2e_per_year'] === 'number'
      ? raw['estimated_tons_co2e_per_year']
      : 0;

  const readinessScore =
    typeof raw['readinessScorePercent'] === 'number'
      ? raw['readinessScorePercent']
      : typeof raw['readiness_score_percent'] === 'number'
      ? raw['readiness_score_percent']
      : 0;

  const indicativePrice =
    typeof raw['indicativePricePerTonUsd'] === 'number'
      ? raw['indicativePricePerTonUsd']
      : typeof raw['indicative_price_per_ton_usd'] === 'number'
      ? raw['indicative_price_per_ton_usd']
      : 0;

  const fieldIds = Array.isArray(raw['fieldIds'])
    ? (raw['fieldIds'] as string[])
    : Array.isArray(raw['field_ids'])
    ? (raw['field_ids'] as string[])
    : [];

  const project: MarketplaceProject = {
    id: String(raw['id'] ?? ''),
    title: String(raw['title'] ?? ''),
    slug: String(raw['slug'] ?? raw['id'] ?? ''),
    location: String(raw['location'] ?? 'Punjab, India'),
    district: String(raw['district'] ?? 'Punjab'),
    practice: String(raw['practice'] ?? 'Direct Seeded Rice (DSR) + AWD'),
    methodology: String(raw['methodology'] ?? 'Verra VM0042'),
    developer: String(raw['developer'] ?? 'Panjdhara Agritech Private Limited'),
    totalHectares,
    enrolledParcels,
    farmerCount,
    estimatedTonsCo2ePerYear: estimatedTons,
    readinessScorePercent: readinessScore,
    assessmentStatus,
    indicativePricePerTonUsd: indicativePrice,
    vintage: String(raw['vintage'] ?? 'Kharif 2026'),
    description: String(raw['description'] ?? ''),
    highlights: Array.isArray(raw['highlights']) ? (raw['highlights'] as string[]) : [],
    evidenceDepth: {
      satellitePasses: typeof depth?.['satellitePasses'] === 'number' ? depth['satellitePasses'] : 0,
      groundPhotos: typeof depth?.['groundPhotos'] === 'number' ? depth['groundPhotos'] : 0,
      waterLogs: typeof depth?.['waterLogs'] === 'number' ? depth['waterLogs'] : 0,
    },
    fieldIds,
  };

  if (raw['owner']) {
    project.owner = String(raw['owner']);
  }

  return project;
}

export function adaptBackendProjects(rawList: unknown[]): MarketplaceProject[] {
  if (!Array.isArray(rawList)) return [];
  return rawList
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map(adaptBackendProjectToMarketplaceProject);
}
