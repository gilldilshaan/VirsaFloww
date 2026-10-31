import { describe, expect, it } from 'vitest';
import {
  PRIMARY_FIELD,
  ALL_FIELDS,
  SATELLITE_OBSERVATIONS,
  INITIAL_EVIDENCE_ITEMS,
  ADDED_IRRIGATION_LOG,
  ADDED_IN_BOUNDARY_PHOTO,
  MARKETPLACE_PROJECTS,
  INITIAL_DUE_DILIGENCE_PIPELINE,
  REVIEW_QUEUE_ITEMS,
  COMMAND_CENTRE_METRICS_MOCK,
  ACTIONABLE_TASKS_MOCK,
} from './mock-data';
import { api } from '../api';

describe('VirsaFlow MRV State Machine & Data Models', () => {
  it('correctly configures Primary Field parcel PB-LUD-042', () => {
    expect(PRIMARY_FIELD.code).toBe('PB-LUD-042');
    expect(PRIMARY_FIELD.district).toBe('Ludhiana');
    expect(PRIMARY_FIELD.areaHa).toBe(4.8);
    expect(PRIMARY_FIELD.boundaryPolygon.length).toBe(4);
    expect(PRIMARY_FIELD.targetEmissionReductionTonnes).toBe(23.04);
  });

  it('State 1 (UNVERIFIED): identifies spatial anomaly (+420m) and missing AWD log', () => {
    const flaggedPhoto = INITIAL_EVIDENCE_ITEMS.find((e) => e.id === 'EV-003');
    const missingLog = INITIAL_EVIDENCE_ITEMS.find((e) => e.id === 'EV-004');

    expect(flaggedPhoto).toBeDefined();
    expect(flaggedPhoto?.category).toBe('contradicting');
    expect(flaggedPhoto?.provenance.spatialDistanceMeters).toBe(420);

    expect(missingLog).toBeDefined();
    expect(missingLog?.status).toBe('missing');
  });

  it('State 2 (NEEDS REVIEW): incorporates verified AWD log while preserving flagged photo', () => {
    // In state 2, EV-004 is replaced by ADDED_IRRIGATION_LOG
    const state2List = INITIAL_EVIDENCE_ITEMS.filter((i) => i.id !== 'EV-004').concat(ADDED_IRRIGATION_LOG);

    const log = state2List.find((e) => e.id === 'EV-004-LOG');
    const photo = state2List.find((e) => e.id === 'EV-003');

    expect(log).toBeDefined();
    expect(log?.category).toBe('supporting');
    expect(log?.provenance.sha256).toBeDefined();

    // Contradiction on photo remains
    expect(photo).toBeDefined();
    expect(photo?.category).toBe('contradicting');
  });

  it('State 3 (READY FOR VERIFICATION): resolves spatial mismatch with in-boundary photo', () => {
    // In state 3, both EV-004 and EV-005 are added
    const state3List = INITIAL_EVIDENCE_ITEMS.filter((i) => i.id !== 'EV-004' && i.id !== 'EV-005')
      .concat(ADDED_IRRIGATION_LOG)
      .concat(ADDED_IN_BOUNDARY_PHOTO);

    const verifiedPhoto = state3List.find((e) => e.id === 'EV-005-PHOTO');
    expect(verifiedPhoto).toBeDefined();
    expect(verifiedPhoto?.category).toBe('supporting');
    expect(verifiedPhoto?.provenance.spatialDistanceMeters).toBe(0);
    expect(verifiedPhoto?.provenance.gpsCoordinates?.accuracyMeters).toBeLessThan(5);
  });

  it('Copernicus Sentinel-2 observations cover seasonal rice phenology', () => {
    expect(SATELLITE_OBSERVATIONS.length).toBeGreaterThanOrEqual(4);

    // Check pre-seeding vs peak vegetative
    const preSeeding = SATELLITE_OBSERVATIONS[0];
    const peakCanopy = SATELLITE_OBSERVATIONS[3];

    expect(preSeeding?.meanNdvi).toBeLessThan(0.25);
    expect(peakCanopy?.meanNdvi).toBeGreaterThan(0.7);
    expect(preSeeding?.resolutionMeters).toBe(10);
  });

  it('Marketplace projects directory supports multi-practice filtering', () => {
    expect(MARKETPLACE_PROJECTS.length).toBe(4);

    const dsrProjects = MARKETPLACE_PROJECTS.filter((p) => p.practice.includes('Direct Seeded'));
    const residueProjects = MARKETPLACE_PROJECTS.filter((p) => p.practice.includes('Residue'));
    const awdProjects = MARKETPLACE_PROJECTS.filter((p) => p.practice.includes('Alternate Wetting'));

    expect(dsrProjects.length).toBe(1);
    expect(residueProjects.length).toBe(1);
    expect(awdProjects.length).toBe(1);
  });

  it('Due diligence pipeline maintains buyer inquiries with required fields', () => {
    expect(INITIAL_DUE_DILIGENCE_PIPELINE.length).toBeGreaterThanOrEqual(3);
    for (const item of INITIAL_DUE_DILIGENCE_PIPELINE) {
      expect(item.buyerName).toBeTruthy();
      expect(item.buyerOrg).toBeTruthy();
      expect(item.volumeRequestedTons).toBeGreaterThan(0);
      expect(item.stage).toMatch(/Inquiry|Data Room Shared|Audit Underway|Term Sheet/);
    }
  });

  // Stage 2 Extensions Tests
  describe('Stage 2: Shared Typed API Client and Multi-Entity Extensions', () => {
    it('API client retrieves projects and supports filtering', async () => {
      const allProjects = await api.getProjects();
      expect(allProjects.length).toBe(4);

      const filtered = await api.getProjects({ district: 'Ludhiana' });
      expect(filtered.length).toBe(1);
      expect(filtered[0]?.district).toBe('Ludhiana');

      const byId = await api.getProjectById('PRJ-PB-DSR-01');
      expect(byId).toBeDefined();
      expect(byId?.id).toBe('PRJ-PB-DSR-01');
    });

    it('API client retrieves multi-field registry records', async () => {
      const fields = await api.getFields();
      expect(fields.length).toBeGreaterThanOrEqual(4);
      expect(ALL_FIELDS.length).toBeGreaterThanOrEqual(4);

      const sangrurField = await api.getFieldById('PB-SNG-018');
      expect(sangrurField).toBeDefined();
      expect(sangrurField?.district).toBe('Sangrur');
      expect(sangrurField?.geometrySource).toBe('Cadastral Revenue Record');
    });

    it('API client retrieves Command Centre fleet operational metrics', async () => {
      const metrics = await api.getCommandCentreMetrics();
      expect(metrics.totalProjects).toBe(4);
      expect(metrics.enrolledFarmers).toBe(601);
      expect(metrics.totalHectares).toBe(5600);
      expect(metrics.pendingReviewQueueCount).toBeGreaterThan(0);
      expect(metrics.actionableTasks.length).toBeGreaterThanOrEqual(3);
    });

    it('API client manages Review Queue and submits timestamped review actions', async () => {
      const queue = await api.getReviewQueue();
      expect(queue.length).toBeGreaterThanOrEqual(3);

      const item = queue[0];
      expect(item).toBeDefined();
      expect(item?.rules.length).toBeGreaterThan(0);

      const actionRes = await api.submitReviewAction({
        reviewQueueItemId: item!.id,
        evidenceId: item!.evidenceId,
        action: 'approve',
        reviewer: 'Mankirat Singh',
        comments: 'Verified against Cadastral baseline and S2 NDVI series.',
      });

      expect(actionRes.success).toBe(true);
      expect(actionRes.updatedItem.status).toBe('resolved');
      expect(actionRes.updatedItem.assignedReviewer).toBe('Mankirat Singh');
    });

    it('API client supports non-destructive correction requests spawning superseding records', async () => {
      const corrRes = await api.requestCorrection({
        reviewQueueItemId: 'REV-2026-001',
        requirement: 'Submit replacement photo inside PB-LUD-042 polygon bounds (accuracy < 5m)',
        reviewer: 'Mankirat Singh',
      });

      expect(corrRes.success).toBe(true);
      expect(corrRes.supersedingEvidenceId).toMatch(/^EV-CORR-/);
    });

    it('Enforces allowed sprint statuses: UNVERIFIED, NEEDS_REVIEW, READY_FOR_VERIFICATION', () => {
      const allowedStatuses = ['UNVERIFIED', 'NEEDS_REVIEW', 'READY_FOR_VERIFICATION'];

      for (const prj of MARKETPLACE_PROJECTS) {
        expect(allowedStatuses).toContain(prj.assessmentStatus);
        expect(prj.assessmentStatus).not.toBe('Verified');
        expect(prj.assessmentStatus).not.toBe('VERIFIED');
      }

      for (const fld of ALL_FIELDS) {
        if (fld.assessmentStatus) {
          expect(allowedStatuses).toContain(fld.assessmentStatus);
          expect(fld.assessmentStatus).not.toBe('Verified');
          expect(fld.assessmentStatus).not.toBe('VERIFIED');
        }
      }
    });

    it('Guarantees zero farmer personal identifiable information (PII) is exposed', () => {
      for (const field of ALL_FIELDS) {
        // Confirm only public identity tokens are present
        expect(field.farmerName).toBeTruthy();
        expect(field.farmerNameLocal).toBeTruthy();
        
        // Assert absence of private personal attributes
        const record = field as unknown as Record<string, unknown>;
        expect(record['phone']).toBeUndefined();
        expect(record['phoneNumber']).toBeUndefined();
        expect(record['bankAccount']).toBeUndefined();
        expect(record['nationalId']).toBeUndefined();
        expect(record['aadhar']).toBeUndefined();
        expect(record['email']).toBeUndefined();
      }
    });

    it('Distinguishes mock mode from live backend mode', () => {
      expect(api.isUsingMockAdapter()).toBe(true);
    });
  });

  describe('VirsaFlow Route search validation and navigation flows', () => {
    it('validates search query parameters for /auth including percent-encoded routes', async () => {
      const { Route: AuthRoute } = await import('../../routes/auth');
      const validate = AuthRoute.options.validateSearch as (s: Record<string, unknown>) => { next: string };

      // Encoded /dashboard as sent from landing page
      expect(validate({ next: '%2Fdashboard' })).toEqual({ next: '/dashboard' });

      // Direct /dashboard
      expect(validate({ next: '/dashboard' })).toEqual({ next: '/dashboard' });

      // Marketplace next target
      expect(validate({ next: '/marketplace' })).toEqual({ next: '/marketplace' });

      // Passport next target
      expect(validate({ next: '/passport' })).toEqual({ next: '/passport' });

      // Default fallback when empty or invalid
      expect(validate({})).toEqual({ next: '/dashboard' });
      expect(validate({ next: '' })).toEqual({ next: '/dashboard' });
      expect(validate({ next: 'https://external-malicious.com' })).toEqual({ next: '/dashboard' });
    });

    it('verifies all critical navigation routes in the VirsaFlow router tree', async () => {
      const { createRouter, createMemoryHistory } = await import('@tanstack/react-router');
      const { routeTree } = await import('../../routeTree.gen');
      const { QueryClient } = await import('@tanstack/react-query');

      const history = createMemoryHistory({ initialEntries: ['/'] });
      const router = createRouter({
        routeTree,
        history,
        context: { queryClient: new QueryClient() },
      });

      // Verify route registration in router tree
      const authLoc = router.buildLocation({ to: '/auth', search: { next: '/dashboard' } });
      expect(authLoc.pathname).toBe('/auth');
      expect(authLoc.search).toEqual({ next: '/dashboard' });
      expect(router.routesByPath['/auth']).toBeDefined();

      const dashLoc = router.buildLocation({ to: '/dashboard' });
      expect(dashLoc.pathname).toBe('/dashboard');
      expect(router.routesByPath['/dashboard']).toBeDefined();

      const marketLoc = router.buildLocation({ to: '/marketplace' });
      expect(marketLoc.pathname).toBe('/marketplace');
      expect(router.routesByPath['/marketplace']).toBeDefined();

      const passLoc = router.buildLocation({ to: '/passport' });
      expect(passLoc.pathname).toBe('/passport');
      expect(router.routesByPath['/passport']).toBeDefined();

      expect(router.routesByPath['/']).toBeDefined();
    }, 15000);
  });
});
