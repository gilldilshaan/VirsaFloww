import { describe, expect, it } from 'vitest';
import {
  adaptBackendProjectToMarketplaceProject,
  adaptBackendProjects,
  adaptBackendFieldToParcel,
  adaptBackendFields,
  adaptBackendEvidenceToEvidenceItem,
  adaptBackendEvidenceList,
  adaptBackendReviewToReviewQueueItem,
  adaptBackendReviews,
  adaptBackendAssessment,
  adaptBackendAssessments,
} from '../../lib/adapters';

describe('Milestone 3: Domain Type Adapters', () => {
  describe('Project Adapter', () => {
    it('adapts camelCase and snake_case backend project payloads faithfully', () => {
      const rawSnake = {
        id: 'PRJ-PB-DSR-01',
        title: 'Punjab DSR Scaling Project',
        slug: 'punjab-dsr-scaling',
        location: 'Ludhiana, Punjab',
        district: 'Ludhiana',
        practice: 'Direct Seeded Rice',
        methodology: 'VM0042',
        developer: 'Panjdhara Agritech',
        total_hectares: 1250.5,
        enrolled_parcels: 420,
        farmer_count: 380,
        estimated_tons_co2e_per_year: 4500,
        readiness_score_percent: 88,
        assessment_status: 'READY_FOR_VERIFICATION',
        indicative_price_per_ton_usd: 35.0,
        vintage: 'Kharif 2026',
        evidence_depth: {
          satellitePasses: 12,
          groundPhotos: 45,
          waterLogs: 22,
        },
      };

      const adapted = adaptBackendProjectToMarketplaceProject(rawSnake);
      expect(adapted.id).toBe('PRJ-PB-DSR-01');
      expect(adapted.totalHectares).toBe(1250.5);
      expect(adapted.farmerCount).toBe(380);
      expect(adapted.assessmentStatus).toBe('READY_FOR_VERIFICATION');
      expect(adapted.evidenceDepth.satellitePasses).toBe(12);
    });

    it('enforces valid MRV statuses and never defaults to unauthorized status', () => {
      const invalidStatusRaw = {
        id: 'PRJ-02',
        title: 'Test',
        assessment_status: 'VERIFIED', // Invalid status; should normalize to UNVERIFIED
      };
      const adapted = adaptBackendProjectToMarketplaceProject(invalidStatusRaw);
      expect(adapted.assessmentStatus).toBe('UNVERIFIED');
    });

    it('adapts list of projects via adaptBackendProjects', () => {
      const rawList = [
        { id: 'P1', title: 'Project 1', assessmentStatus: 'NEEDS_REVIEW' },
        { id: 'P2', title: 'Project 2', assessmentStatus: 'READY_FOR_VERIFICATION' },
      ];
      const list = adaptBackendProjects(rawList);
      expect(list).toHaveLength(2);
      expect(list[0]?.assessmentStatus).toBe('NEEDS_REVIEW');
      expect(list[1]?.assessmentStatus).toBe('READY_FOR_VERIFICATION');
    });
  });

  describe('Field Adapter', () => {
    it('adapts PostGIS boundary polygon and extracts centroid coordinates', () => {
      const rawField = {
        id: 'PB-FIELD-001',
        code: 'PB-FIELD-001',
        name: 'Gill Farm East',
        farmerName: 'Gurdev Singh Gill',
        district: 'Ludhiana',
        areaHa: 4.5,
        practice: 'Direct Seeded Rice (DSR)',
        crop: 'Basmati Paddy',
        boundaryPolygon: [
          [30.901, 75.857],
          [30.905, 75.857],
          [30.905, 75.862],
          [30.901, 75.862],
          [30.901, 75.857],
        ],
      };

      const parcel = adaptBackendFieldToParcel(rawField);
      expect(parcel.id).toBe('PB-FIELD-001');
      expect(parcel.farmerName).toBe('Gurdev Singh Gill');
      expect(parcel.areaHa).toBe(4.5);
      expect(parcel.areaAcres).toBeCloseTo(11.12, 1);
      expect(parcel.boundaryPolygon).toHaveLength(5);
      expect(parcel.coordinates.lat).toBeGreaterThan(30.9);
      expect(parcel.coordinates.lng).toBeGreaterThan(75.8);
    });

    it('adapts list of fields via adaptBackendFields', () => {
      const rawList = [
        { id: 'F1', code: 'F1', name: 'Field 1', areaHa: 2.0 },
        { id: 'F2', code: 'F2', name: 'Field 2', areaHa: 3.5 },
      ];
      const fields = adaptBackendFields(rawList);
      expect(fields).toHaveLength(2);
      expect(fields[0]?.areaHa).toBe(2.0);
      expect(fields[1]?.areaHa).toBe(3.5);
    });
  });

  describe('Evidence Adapter', () => {
    it('preserves SHA-256 cryptographic provenance and supersession links', () => {
      const rawEvidence = {
        id: 'EV-2026-001',
        title: 'DSR Seed Drill Photographic Record',
        type: 'photo',
        category: 'supporting',
        status: 'hash_recorded',
        description: 'Emergence drill verification',
        capturedAt: '2026-06-15T08:30:00Z',
        submittedAt: '2026-06-15T08:35:00Z',
        provenance: {
          author: 'Harpreet Singh',
          source: 'Mobile Uplink App',
          sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          gpsCoordinates: {
            lat: 30.902,
            lng: 75.858,
            accuracyMeters: 2.1,
          },
          spatialDistanceMeters: 1.8,
          reviewStatus: 'Verified In-Boundary',
        },
        supersedes_evidence_id: 'EV-2026-OLD-000',
        field_id: 'PB-FIELD-001',
      };

      const adapted = adaptBackendEvidenceToEvidenceItem(rawEvidence);
      expect(adapted.id).toBe('EV-2026-001');
      expect(adapted.status).toBe('verified');
      expect(adapted.provenance.sha256).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
      expect(adapted.provenance.gpsCoordinates?.accuracyMeters).toBe(2.1);
      expect(adapted.supersedesId).toBe('EV-2026-OLD-000');
    });

    it('adapts list of evidence via adaptBackendEvidenceList', () => {
      const rawList = [
        { id: 'E1', title: 'Item 1', status: 'received' },
        { id: 'E2', title: 'Item 2', status: 'flagged' },
      ];
      const items = adaptBackendEvidenceList(rawList);
      expect(items).toHaveLength(2);
      expect(items[0]?.status).toBe('verified');
      expect(items[1]?.status).toBe('flagged');
    });
  });

  describe('Review Adapter', () => {
    it('maps review tasks, severity, and auditor actions accurately', () => {
      const rawReview = {
        id: 'REV-2026-001',
        field_id: 'PB-FIELD-001',
        project_id: 'PRJ-PB-DSR-01',
        title: 'Geofence Boundary Discrepancy',
        severity: 'high',
        status: 'in_investigation',
        reportedDate: '2026-06-20T10:00:00Z',
        assignedTo: 'Dr. Evelyn Martinez',
        comment: 'Photo coordinates fall outside enrolled perimeter.',
        evidenceRefId: 'EV-2026-003',
      };

      const adapted = adaptBackendReviewToReviewQueueItem(rawReview);
      expect(adapted.id).toBe('REV-2026-001');
      expect(adapted.status).toBe('in_review');
      expect(adapted.priority).toBe('high');
      expect(adapted.assignedReviewer).toBe('Dr. Evelyn Martinez');
      expect(adapted.reviewNotes).toBe('Photo coordinates fall outside enrolled perimeter.');
    });

    it('adapts list of reviews via adaptBackendReviews', () => {
      const rawList = [
        { id: 'R1', title: 'Task 1', status: 'pending' },
        { id: 'R2', title: 'Task 2', status: 'resolved' },
      ];
      const reviews = adaptBackendReviews(rawList);
      expect(reviews).toHaveLength(2);
      expect(reviews[0]?.status).toBe('pending');
      expect(reviews[1]?.status).toBe('resolved');
    });
  });

  describe('Assessment Adapter', () => {
    it('adapts MRV ruleset evaluation results (R1-R5)', () => {
      const rawAssessment = {
        id: 'ASM-2026-001',
        fieldId: 'PB-FIELD-001',
        seasonId: 'Kharif-2026',
        status: 'READY_FOR_VERIFICATION',
        statusLabel: 'Ready for Independent VVB Verification',
        rulesetVersion: '1.0.0-deterministic',
        ruleResults: [
          { ruleId: 'R1', result: 'pass', explanation: 'Mandatory practices confirmed' },
          { ruleId: 'R2', result: 'pass', explanation: 'All coordinates within parcel boundary' },
          { ruleId: 'R5', result: 'warn', explanation: 'Cloud cover 18% <= 20% threshold' },
        ],
      };

      const summary = adaptBackendAssessment(rawAssessment);
      expect(summary.id).toBe('ASM-2026-001');
      expect(summary.status).toBe('READY_FOR_VERIFICATION');
      expect(summary.ruleResults).toHaveLength(3);
      expect(summary.ruleResults[0]?.status).toBe('pass');
      expect(summary.ruleResults[2]?.status).toBe('warn');
    });

    it('adapts list of assessments via adaptBackendAssessments', () => {
      const rawList = [
        { id: 'A1', fieldId: 'F1', status: 'UNVERIFIED' },
        { id: 'A2', fieldId: 'F2', status: 'READY_FOR_VERIFICATION' },
      ];
      const list = adaptBackendAssessments(rawList);
      expect(list).toHaveLength(2);
      expect(list[0]?.status).toBe('UNVERIFIED');
      expect(list[1]?.status).toBe('READY_FOR_VERIFICATION');
    });
  });
});
