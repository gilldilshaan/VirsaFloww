import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';
import { AUTHENTIC_SATELLITE_OBSERVATIONS } from './authentic-observations';
import { fetchGenuineOlmoEarthEmbedding } from '../olmoearth/foundation-models';
import { INITIAL_EVIDENCE_ITEMS, PRIMARY_FIELD } from '../terra-ledger/mock-data';

describe('Mission 3.1 — Scientific Validation & Production Readiness Audit', () => {
  it('contains exactly 7 genuine Copernicus Sentinel-2 L2A scenes across Kharif 2024', () => {
    expect(AUTHENTIC_SATELLITE_OBSERVATIONS.length).toBe(7);

    for (const obs of AUTHENTIC_SATELLITE_OBSERVATIONS) {
      expect(obs.dataOrigin).toBe('LIVE_OBSERVATION');
      expect(obs.provenanceStatus).toBe('PROCESSED_OBSERVATION');
      expect(obs.isDemo).toBe(false);
      expect(obs.stacCollection).toBe('sentinel-2-l2a');
      expect(obs.resolutionMeters).toBe(10.0);
      expect(['Sentinel-2A', 'Sentinel-2B']).toContain(obs.platform);
      expect(obs.id).toMatch(/^S2[AB]_43REQ_2024\d{4}_\d_L2A$/);
      expect(obs.dataLabel).toBe('Live Copernicus Sentinel-2 L2A');
    }
  });

  it('resolves parcel pixel-count discrepancy: cadastral parcel PB-FIELD-001 has exactly 2,647 pixels (26.48 ha)', () => {
    for (const obs of AUTHENTIC_SATELLITE_OBSERVATIONS) {
      // Cadastral revenue holding is 26.48 ha (264,784 m² in UTM Zone 43N projected CRS)
      // At 10m x 10m (100 m² / pixel), there are exactly 2,647 integer pixels inside the polygon
      expect(obs.coverage.totalPolygonPixels).toBe(2647);
      expect(obs.coverage.cadastralHoldingAreaHa).toBe(26.48);
      expect(obs.coverage.enrolledPlotAreaHa).toBe(4.80);

      expect(obs.coverage.validPixelCount).toBeGreaterThan(0);
      expect(obs.coverage.validPixelCount).toBeLessThanOrEqual(2647);
      expect(obs.coverage.coveragePct).toBeGreaterThan(0);
      expect(obs.coverage.cloudContaminationPct).toBeGreaterThanOrEqual(0);
    }
  });

  it('independently computes distinct spectral indices without conflation (McFeeters NDWI vs Gao NDMI)', () => {
    for (const obs of AUTHENTIC_SATELLITE_OBSERVATIONS) {
      const { ndvi, ndwi, ndmi, evi, ndre } = obs.stats;

      // NDVI (Rouse 1974)
      expect(ndvi.min).toBeLessThanOrEqual(ndvi.mean);
      expect(ndvi.mean).toBeLessThanOrEqual(ndvi.max);
      expect(ndvi.median).toBeGreaterThanOrEqual(ndvi.min);
      expect(ndvi.median).toBeLessThanOrEqual(ndvi.max);

      // McFeeters NDWI (1996) = (B03 - B08)/(B03 + B08) [Surface Water Index]
      expect(ndwi.min).toBeLessThanOrEqual(ndwi.mean);
      expect(ndwi.mean).toBeLessThanOrEqual(ndwi.max);

      // Gao NDMI (1996) = (B08 - B11)/(B08 + B11) [Canopy Liquid Moisture Index]
      expect(ndmi.min).toBeLessThanOrEqual(ndmi.max);

      // Formulas must not be conflated or interchangeable
      expect(ndwi.mean).not.toEqual(ndmi.mean);

      // EVI (Huete 2002) and NDRE (Barnes 2000)
      expect(evi.min).toBeLessThanOrEqual(evi.max);
      expect(ndre.min).toBeLessThanOrEqual(ndre.max);
    }
  });

  it('reflects authentic Kharif 2024 agricultural phenology dynamics for Ludhiana parcel PB-FIELD-001', () => {
    const juneScene = AUTHENTIC_SATELLITE_OBSERVATIONS.find((o) => o.date === '2024-06-15');
    const julyScene = AUTHENTIC_SATELLITE_OBSERVATIONS.find((o) => o.date === '2024-07-15');
    const septPanicleScene = AUTHENTIC_SATELLITE_OBSERVATIONS.find((o) => o.date === '2024-09-23');
    const octGrainScene = AUTHENTIC_SATELLITE_OBSERVATIONS.find((o) => o.date === '2024-10-03');
    const postHarvestScene = AUTHENTIC_SATELLITE_OBSERVATIONS.find((o) => o.date === '2024-10-13');

    // Pre-seeding baseline in dry seedbed
    expect(juneScene).toBeDefined();
    expect(juneScene!.meanNdvi).toBe(0.1994);
    expect(juneScene!.meanNdwi).toBe(-0.2394);
    expect(juneScene!.surfaceWaterDetected).toBe(false);
    expect(juneScene!.phenologyStage).toContain('Direct Seeding');

    // Monsoon cloud masking and AWD flushing: positive McFeeters NDWI indicates surface water
    expect(julyScene).toBeDefined();
    expect(julyScene!.surfaceWaterDetected).toBe(true);
    expect(julyScene!.stats.ndwi.mean).toBeGreaterThan(0); // Surface water detected (+0.0047)
    expect(julyScene!.qualityRating).toBe('Cloud-Affected');
    expect(julyScene!.coverage.cloudContaminationPct).toBe(72.6);

    // Peak vegetative canopy closure
    expect(septPanicleScene).toBeDefined();
    expect(septPanicleScene!.meanNdvi).toBe(0.3065);
    expect(septPanicleScene!.meanNdwi).toBe(-0.3026);
    expect(septPanicleScene!.qualityRating).toBe('High');

    // Peak grain filling
    expect(octGrainScene).toBeDefined();
    expect(octGrainScene!.meanNdvi).toBe(0.3683);
    expect(octGrainScene!.meanNdwi).toBe(-0.3955);

    // Post harvest residue baseline
    expect(postHarvestScene).toBeDefined();
    expect(postHarvestScene!.meanNdvi).toBe(0.3104);
    expect(postHarvestScene!.phenologyStage).toContain('Post-Harvest');
  });

  it('provides genuine georeferenced raster products stored on disk in public/rasters/', () => {
    for (const obs of AUTHENTIC_SATELLITE_OBSERVATIONS) {
      const layers = obs.rasterLayers;
      expect(layers.ndvi).toMatch(/^\/rasters\/S2[AB]_43REQ_2024\d{4}_\d_L2A\/ndvi\.png$/);
      expect(layers.ndwi).toMatch(/^\/rasters\/S2[AB]_43REQ_2024\d{4}_\d_L2A\/ndwi\.png$/);
      expect(layers.ndmi).toMatch(/^\/rasters\/S2[AB]_43REQ_2024\d{4}_\d_L2A\/ndmi\.png$/);
      expect(layers.evi).toMatch(/^\/rasters\/S2[AB]_43REQ_2024\d{4}_\d_L2A\/evi\.png$/);
      expect(layers.ndre).toMatch(/^\/rasters\/S2[AB]_43REQ_2024\d{4}_\d_L2A\/ndre\.png$/);
      expect(layers.rgb).toMatch(/^\/rasters\/S2[AB]_43REQ_2024\d{4}_\d_L2A\/rgb\.png$/);
      expect(layers.false_color).toMatch(/^\/rasters\/S2[AB]_43REQ_2024\d{4}_\d_L2A\/false_color\.png$/);

      // Verify that every raster actually exists on disk in the public folder
      const ndviDiskPath = path.resolve('public', layers.ndvi.replace(/^\//, ''));
      const ndwiDiskPath = path.resolve('public', layers.ndwi.replace(/^\//, ''));
      const ndmiDiskPath = path.resolve('public', layers.ndmi.replace(/^\//, ''));
      const rgbDiskPath = path.resolve('public', layers.rgb.replace(/^\//, ''));

      expect(fs.existsSync(ndviDiskPath)).toBe(true);
      expect(fs.existsSync(ndwiDiskPath)).toBe(true);
      expect(fs.existsSync(ndmiDiskPath)).toBe(true);
      expect(fs.existsSync(rgbDiskPath)).toBe(true);

      // Verify pixel-aligned bounding coordinates
      expect(layers.coordinates.length).toBe(4);
      const [nw, ne, se, sw] = layers.coordinates;
      expect(nw![0]).toBeCloseTo(75.8341, 3);
      expect(nw![1]).toBeCloseTo(30.9146, 3);
      expect(ne![0]).toBeCloseTo(75.8400, 3);
      expect(ne![1]).toBeCloseTo(30.9145, 3);
      expect(se![0]).toBeCloseTo(75.8399, 3);
      expect(se![1]).toBeCloseTo(30.9075, 3);
      expect(sw![0]).toBeCloseTo(75.8340, 3);
      expect(sw![1]).toBeCloseTo(30.9075, 3);
    }
  });

  it('marks uncalibrated Sentinel-1 radar as UNAVAILABLE and refuses to publish unverified literature numbers', () => {
    for (const obs of AUTHENTIC_SATELLITE_OBSERVATIONS) {
      const radar = obs.radarCoObservation;
      expect(radar.sensor).toBe('Sentinel-1 C-SAR GRD');
      expect(radar.sceneId).toMatch(/^S1A_IW_GRDH_/);
      expect(radar.polarizations).toEqual(['VV', 'VH']);

      // Scientific integrity enforcement: literature values must not masquerade as authentic parcel observations
      expect(radar.isAvailable).toBe(false);
      expect(radar.provenanceStatus).toBe('UNAVAILABLE');
      expect(radar.vvMeanDb).toBeNull();
      expect(radar.vhMeanDb).toBeNull();
      expect(radar.crossRatioDb).toBeNull();

      // Mandatory notice documenting that calibration and terrain correction are required
      expect(radar.scientificNotice).toContain('Radar parcel extraction UNAVAILABLE');
      expect(radar.scientificNotice).toContain('Range Doppler Terrain Correction');
      expect(radar.scientificNotice).toContain('retracted to preserve scientific integrity');
    }
  });

  it('strictly enforces OlmoEarth scientific restraint without synthetic vector fabrication', async () => {
    const corners: [number, number][] = [
      [75.8345, 30.9135],
      [75.8388, 30.9142],
      [75.8395, 30.9085],
      [75.8352, 30.9078],
    ];

    const result = await fetchGenuineOlmoEarthEmbedding(corners, 2024);

    expect(result.modelId).toBe('olmoearth-v1.3');
    expect(result.vector).toEqual([]);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Experimental / Unavailable');
    expect(result.provenance).toContain('Under Section 9 Scientific Integrity Rules, embedding vectors are never simulated or fabricated');
  });

  it('enforces auditor review spatial discrepancy gating (+420m)', () => {
    const flaggedPhoto = INITIAL_EVIDENCE_ITEMS.find((e) => e.id === 'EV-003');
    expect(flaggedPhoto).toBeDefined();
    expect(flaggedPhoto?.category).toBe('contradicting');
    expect(flaggedPhoto?.provenance.spatialDistanceMeters).toBe(420);

    expect(PRIMARY_FIELD.areaHa).toBe(4.8);
    expect(PRIMARY_FIELD.boundaryPolygon.length).toBe(4);
  });
});
