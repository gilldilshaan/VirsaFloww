import { describe, expect, it } from 'vitest';
import {
  PRIMARY_FIELD,
  SATELLITE_OBSERVATIONS,
  INITIAL_EVIDENCE_ITEMS,
  ADDED_IRRIGATION_LOG,
  ADDED_IN_BOUNDARY_PHOTO,
  MARKETPLACE_PROJECTS,
  INITIAL_DUE_DILIGENCE_PIPELINE,
} from './mock-data';

describe('TerraLedger AI MRV State Machine & Data Models', () => {
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
    expect(peakCanopy?.meanNdvi).toBeGreaterThan(0.70);
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
});
